
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, RefreshCw } from 'lucide-react';
import type { DriverProfile } from '@/hooks/useDriverProfile';
import type { RatingStats } from '@/hooks/useDriverRatings';

interface StatsTabProps {
  driverProfile: DriverProfile;
  ratingStats: RatingStats;
  onRefreshStatistics: () => void;
}

const StatsTab = ({ 
  driverProfile, 
  ratingStats, 
  onRefreshStatistics 
}: StatsTabProps) => {
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
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Total Ratings:</span>
            <span className="font-semibold">{ratingStats.total_ratings || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Account Status:</span>
            <span className="font-semibold text-green-600">
              {driverProfile.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Availability:</span>
            <span className="font-semibold">
              {driverProfile.is_available ? 'Available' : 'Not Available'}
            </span>
          </div>
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Payments are processed monthly through payroll
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
