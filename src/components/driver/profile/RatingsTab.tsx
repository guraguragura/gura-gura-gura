
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { RatingStats } from '@/components/driver/RatingStats';
import type { RatingStats as RatingStatsType, Rating } from '@/hooks/useDriverRatings';

interface RatingsTabProps {
  ratingStats: RatingStatsType;
  ratings: Rating[];
  ratingsLoading: boolean;
}

const RatingsTab = ({ ratingStats, ratings, ratingsLoading }: RatingsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RatingStats
        averageRating={ratingStats.average_rating}
        totalRatings={ratingStats.total_ratings}
        ratingDistribution={ratingStats.rating_distribution}
        showDetailed
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingsLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : ratings.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ratings.slice(0, 10).map((rating) => (
                <div key={rating.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= rating.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-700 mb-1">{rating.comment}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {rating.customer?.first_name} {rating.customer?.last_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingsTab;
