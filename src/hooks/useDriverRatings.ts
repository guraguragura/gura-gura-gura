
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriverRating {
  id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer: {
    first_name?: string;
    last_name?: string;
  };
}

interface RatingStats {
  average_rating: number | null;
  total_ratings: number;
  rating_distribution: { [key: number]: number };
}

export const useDriverRatings = (driverId?: string) => {
  const [ratings, setRatings] = useState<DriverRating[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    average_rating: null,
    total_ratings: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDriverRatings = async () => {
    if (!driverId) return;

    try {
      setLoading(true);

      // Fetch individual ratings with customer info
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('customer_ratings')
        .select(`
          id,
          order_id,
          rating,
          comment,
          created_at,
          customer:customer_id (
            first_name,
            last_name
          )
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (ratingsError) throw ratingsError;

      // Fetch driver profile for average rating and total count
      const { data: driverData, error: driverError } = await supabase
        .from('driver_profiles')
        .select('average_rating, total_ratings')
        .eq('id', driverId)
        .single();

      if (driverError) throw driverError;

      // Calculate rating distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingsData?.forEach(rating => {
        distribution[rating.rating as keyof typeof distribution]++;
      });

      setRatings(ratingsData || []);
      setStats({
        average_rating: driverData?.average_rating || null,
        total_ratings: driverData?.total_ratings || 0,
        rating_distribution: distribution
      });
    } catch (error) {
      console.error('Error fetching driver ratings:', error);
      toast({
        title: "Error",
        description: "Failed to load driver ratings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverRatings();
  }, [driverId]);

  return {
    ratings,
    stats,
    loading,
    refetch: fetchDriverRatings
  };
};
