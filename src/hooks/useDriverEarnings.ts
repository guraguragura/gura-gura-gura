
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

export interface PeriodEarnings {
  today: number;
  week: number;
  month: number;
}

export const useDriverEarnings = (driverId?: string) => {
  const [earnings, setEarnings] = useState<PeriodEarnings>({
    today: 0,
    week: 0,
    month: 0
  });
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!driverId) return;

      try {
        setLoading(true);

        const periods = ['today', 'week', 'month'];
        const earningsPromises = periods.map(period =>
          supabase.rpc('calculate_driver_period_earnings', {
            p_driver_id: driverId,
            p_period: period
          })
        );

        const results = await Promise.all(earningsPromises);
        
        setEarnings({
          today: results[0].data || 0,
          week: results[1].data || 0,
          month: results[2].data || 0
        });
      } catch (error) {
        console.error('Error fetching driver earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [driverId]);

  return {
    earnings,
    loading,
    formattedEarnings: {
      today: formatPrice(earnings.today),
      week: formatPrice(earnings.week),
      month: formatPrice(earnings.month)
    }
  };
};
