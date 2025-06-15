
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_type: 'customer' | 'driver';
  sender_id: string;
  message: string;
  message_type: 'text' | 'system' | 'template';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Type guard functions to validate and convert data
const isValidSenderType = (type: string): type is 'customer' | 'driver' => {
  return type === 'customer' || type === 'driver';
};

const isValidMessageType = (type: string): type is 'text' | 'system' | 'template' => {
  return type === 'text' || type === 'system' || type === 'template';
};

// Convert Supabase data to our typed interface
const convertToOrderMessage = (data: any): OrderMessage => {
  if (!isValidSenderType(data.sender_type)) {
    console.warn('Invalid sender_type:', data.sender_type, 'defaulting to customer');
    data.sender_type = 'customer';
  }
  
  if (!isValidMessageType(data.message_type)) {
    console.warn('Invalid message_type:', data.message_type, 'defaulting to text');
    data.message_type = 'text';
  }

  return {
    id: data.id,
    order_id: data.order_id,
    sender_type: data.sender_type as 'customer' | 'driver',
    sender_id: data.sender_id,
    message: data.message,
    message_type: data.message_type as 'text' | 'system' | 'template',
    is_read: data.is_read,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const useOrderMessages = (orderId: string) => {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userRole } = useUserRole();

  // Fetch messages for the order
  const fetchMessages = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Convert Supabase data to our typed interface
      const typedMessages = (data || []).map(convertToOrderMessage);
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Could not load chat messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (message: string, messageType: 'text' | 'template' = 'text') => {
    if (!user || !orderId || !message.trim()) return;

    setSending(true);
    try {
      // Determine sender type based on user role
      const senderType = userRole === 'driver' ? 'driver' : 'customer';
      
      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: orderId,
          sender_type: senderType,
          sender_id: user.id,
          message: message.trim(),
          message_type: messageType
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Could not send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Mark messages as read
  const markAsRead = async (messageIds: string[]) => {
    if (!messageIds.length) return;

    try {
      const { error } = await supabase
        .from('order_messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!orderId) return;

    fetchMessages();

    const channel = supabase
      .channel(`order-messages-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Message update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMessage = convertToOrderMessage(payload.new);
            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = convertToOrderMessage(payload.new);
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const unreadCount = messages.filter(msg => !msg.is_read && msg.sender_id !== user?.id).length;

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    unreadCount,
    refetch: fetchMessages
  };
};
