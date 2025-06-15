
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DriverProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_available: boolean;
}

export const useDriverProfile = () => {
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            // No driver profile found
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

  return {
    driverProfile,
    loading,
    error,
    isDriver: !!driverProfile
  };
};
