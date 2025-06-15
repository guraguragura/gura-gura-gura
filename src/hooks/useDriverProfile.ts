
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DriverProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_available: boolean;
  average_rating?: number;
  total_ratings?: number;
  // Vehicle information
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  plate_number?: string;
  vehicle_color?: string;
  vehicle_type?: string;
  // Statistics
  total_deliveries?: number;
  total_earnings?: number;
  years_active?: number;
  on_time_percentage?: number;
  // Personal details
  address?: string;
  emergency_contact?: string;
}

export interface PeriodEarnings {
  today: number;
  week: number;
  month: number;
}

export const useDriverProfile = () => {
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDriverProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Driver profile not found. Please contact support.');
          } else {
            throw fetchError;
          }
        } else {
          setDriverProfile(data);
        }
      } catch (err) {
        console.error('Error fetching driver profile:', err);
        setError('Failed to load driver profile');
        toast({
          title: "Error",
          description: "Failed to load driver profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDriverProfile();
  }, [user, toast]);

  const updateDriverProfile = async (updates: Partial<DriverProfile>) => {
    if (!driverProfile) return false;

    try {
      setUpdating(true);
      
      const { error: updateError } = await supabase
        .from('driver_profiles')
        .update(updates)
        .eq('id', driverProfile.id);

      if (updateError) throw updateError;

      setDriverProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (err) {
      console.error('Error updating driver profile:', err);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const refreshStatistics = async () => {
    if (!driverProfile) return;

    try {
      const { data, error } = await supabase.rpc('calculate_driver_statistics', {
        p_driver_id: driverProfile.id
      });

      if (error) throw error;

      // Refetch the updated profile
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', driverProfile.id)
        .single();

      if (fetchError) throw fetchError;

      setDriverProfile(updatedProfile);
    } catch (err) {
      console.error('Error refreshing statistics:', err);
      toast({
        title: "Error",
        description: "Failed to refresh statistics",
        variant: "destructive",
      });
    }
  };

  return {
    driverProfile,
    loading,
    error,
    updating,
    isDriver: !!driverProfile,
    updateDriverProfile,
    refreshStatistics
  };
};
