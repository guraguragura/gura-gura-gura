
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface FailedDeliveryReason {
  id: string;
  code: string;
  description: string;
  is_active: boolean;
}

export interface DeliveryAttempt {
  id: string;
  order_id: string;
  driver_id: string;
  attempt_number: number;
  status: 'successful' | 'failed' | 'rescheduled';
  failed_reason_id?: string;
  notes?: string;
  photo_evidence_url?: string;
  attempted_at: string;
  rescheduled_for?: string;
  failed_reason?: FailedDeliveryReason;
}

// Type for the raw data from Supabase
interface RawDeliveryAttempt {
  id: string;
  order_id: string;
  driver_id: string;
  attempt_number: number;
  status: string; // This is the raw string from Supabase
  failed_reason_id?: string;
  notes?: string;
  photo_evidence_url?: string;
  attempted_at: string;
  rescheduled_for?: string;
  failed_reason?: FailedDeliveryReason;
}

// Helper function to safely cast status
const mapDeliveryAttempt = (raw: RawDeliveryAttempt): DeliveryAttempt => {
  const validStatuses = ['successful', 'failed', 'rescheduled'] as const;
  const status = validStatuses.includes(raw.status as any) 
    ? (raw.status as 'successful' | 'failed' | 'rescheduled')
    : 'failed'; // fallback to 'failed' if invalid

  return {
    ...raw,
    status
  };
};

export const useDeliveryAttempts = (orderId: string) => {
  const [attempts, setAttempts] = useState<DeliveryAttempt[]>([]);
  const [failureReasons, setFailureReasons] = useState<FailedDeliveryReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch failure reasons
  const fetchFailureReasons = async () => {
    try {
      const { data, error } = await supabase
        .from('failed_delivery_reasons')
        .select('*')
        .eq('is_active', true)
        .order('description');

      if (error) throw error;
      setFailureReasons(data || []);
    } catch (error) {
      console.error('Error fetching failure reasons:', error);
      toast({
        title: "Error loading failure reasons",
        description: "Could not load delivery failure options",
        variant: "destructive"
      });
    }
  };

  // Fetch delivery attempts for the order
  const fetchDeliveryAttempts = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('delivery_attempts')
        .select(`
          *,
          failed_reason:failed_delivery_reasons(*)
        `)
        .eq('order_id', orderId)
        .order('attempted_at', { ascending: false });

      if (error) throw error;
      
      // Map the raw data to our typed interface
      const mappedAttempts = (data || []).map(mapDeliveryAttempt);
      setAttempts(mappedAttempts);
    } catch (error) {
      console.error('Error fetching delivery attempts:', error);
      toast({
        title: "Error loading delivery attempts",
        description: "Could not load delivery history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Report a failed delivery
  const reportFailedDelivery = async (
    reasonId: string,
    notes?: string,
    photoUrl?: string,
    rescheduleFor?: string
  ) => {
    if (!user || !orderId) return { success: false, message: 'Missing required data' };

    setSubmitting(true);
    try {
      // Get current attempt number
      const currentAttempts = attempts.length;
      const attemptNumber = currentAttempts + 1;

      // Insert delivery attempt record
      const { error: attemptError } = await supabase
        .from('delivery_attempts')
        .insert({
          order_id: orderId,
          driver_id: user.id,
          attempt_number: attemptNumber,
          status: rescheduleFor ? 'rescheduled' : 'failed',
          failed_reason_id: reasonId,
          notes: notes?.trim(),
          photo_evidence_url: photoUrl,
          rescheduled_for: rescheduleFor
        });

      if (attemptError) throw attemptError;

      // Update order status
      const newStatus = rescheduleFor ? 'assigned_to_driver' : 'failed_delivery';
      const { error: orderError } = await supabase
        .from('order')
        .update({
          unified_status: newStatus,
          failed_delivery_at: rescheduleFor ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Send system message to customer
      const reason = failureReasons.find(r => r.id === reasonId);
      const systemMessage = rescheduleFor 
        ? `Delivery rescheduled for ${new Date(rescheduleFor).toLocaleString()}. Reason: ${reason?.description || 'Unknown'}${notes ? `. Notes: ${notes}` : ''}`
        : `Delivery attempt failed. Reason: ${reason?.description || 'Unknown'}${notes ? `. Notes: ${notes}` : ''}. We will contact you to arrange a new delivery.`;

      await supabase
        .from('order_messages')
        .insert({
          order_id: orderId,
          sender_type: 'driver',
          sender_id: user.id,
          message: systemMessage,
          message_type: 'system'
        });

      toast({
        title: rescheduleFor ? "Delivery rescheduled" : "Failed delivery reported",
        description: rescheduleFor 
          ? "The delivery has been rescheduled successfully"
          : "Customer will be notified and a new delivery will be arranged"
      });

      // Refresh attempts
      await fetchDeliveryAttempts();

      return { success: true, message: 'Delivery attempt recorded successfully' };
    } catch (error) {
      console.error('Error reporting failed delivery:', error);
      toast({
        title: "Failed to report delivery failure",
        description: "Could not record the delivery attempt. Please try again.",
        variant: "destructive"
      });
      return { success: false, message: 'Failed to record delivery attempt' };
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchFailureReasons();
    fetchDeliveryAttempts();
  }, [orderId]);

  return {
    attempts,
    failureReasons,
    loading,
    submitting,
    reportFailedDelivery,
    refetchAttempts: fetchDeliveryAttempts
  };
};
