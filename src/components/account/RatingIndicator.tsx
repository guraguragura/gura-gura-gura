
import React from 'react';
import { Star, StarOff } from 'lucide-react';

interface RatingIndicatorProps {
  isDelivered: boolean;
  hasDriver: boolean;
  hasRating?: boolean;
  onRateClick?: () => void;
}

export const RatingIndicator: React.FC<RatingIndicatorProps> = ({
  isDelivered,
  hasDriver,
  hasRating,
  onRateClick
}) => {
  if (!isDelivered || !hasDriver) {
    return null;
  }

  if (hasRating) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <Star className="h-4 w-4 fill-current" />
        <span className="text-xs">Rated</span>
      </div>
    );
  }

  return (
    <button
      onClick={onRateClick}
      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
    >
      <StarOff className="h-4 w-4" />
      <span className="text-xs">Rate Driver</span>
    </button>
  );
};
