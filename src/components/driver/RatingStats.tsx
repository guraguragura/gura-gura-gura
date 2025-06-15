
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RatingStatsProps {
  averageRating: number | null;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
  showDetailed?: boolean;
}

export const RatingStats: React.FC<RatingStatsProps> = ({
  averageRating,
  totalRatings,
  ratingDistribution,
  showDetailed = false
}) => {
  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= ratingValue
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (totalRatings === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="flex justify-center mb-2">
              {renderStars(0)}
            </div>
            <p className="text-gray-500">No ratings yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            {renderStars(averageRating)}
            <span className="text-2xl font-bold">
              {averageRating ? averageRating.toFixed(1) : '0.0'}
            </span>
          </div>
          <p className="text-gray-600">
            Based on {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
          </p>
        </div>

        {showDetailed && totalRatings > 0 && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-right">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
