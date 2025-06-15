
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, RefreshCw } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import type { DriverProfile } from '@/hooks/useDriverProfile';
import type { RatingStats } from '@/hooks/useDriverRatings';
import type { PeriodEarnings } from '@/hooks/useDriverEarnings';

interface StatsTabProps {
  driverProfile: DriverProfile;
  ratingStats: RatingStats;
  formattedEarnings: {
    today: string;
    week: string;
    month: string;
  };
  onRefreshStatistics: () => void;
}

const StatsTab = ({ 
  driverProfile, 
  ratingStats, 
  formattedEarnings, 
  onRefreshStatistics 
}: StatsTabProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Delivery Statistics</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshStatistics}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Total Deliveries:</span>
            <span className="font-semibold">{driverProfile.total_deliveries || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Rating:</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold">
                {ratingStats.average_rating ? ratingStats.average_rating.toFixed(1) : 'No ratings'}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span>Years Active:</span>
            <span className="font-semibold">{driverProfile.years_active || 0} years</span>
          </div>
          <div className="flex justify-between">
            <span>On-time Delivery:</span>
            <span className="font-semibold">{driverProfile.on_time_percentage || 0}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Total Earnings:</span>
            <span className="font-semibold">{formatPrice(driverProfile.total_earnings || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>This Month:</span>
            <span className="font-semibold">{formattedEarnings.month}</span>
          </div>
          <div className="flex justify-between">
            <span>This Week:</span>
            <span className="font-semibold">{formattedEarnings.week}</span>
          </div>
          <div className="flex justify-between">
            <span>Today:</span>
            <span className="font-semibold">{formattedEarnings.today}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
