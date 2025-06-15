
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CustomerRatingFormProps {
  orderId: string;
  driverId: string;
  customerId: string;
  driverName: string;
  onRatingSubmitted?: () => void;
}

export const CustomerRatingForm: React.FC<CustomerRatingFormProps> = ({
  orderId,
  driverId,
  customerId,
  driverName,
  onRatingSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose a star rating before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('customer_ratings')
        .insert({
          order_id: orderId,
          driver_id: driverId,
          customer_id: customerId,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Rating Submitted",
        description: "Thank you for rating your delivery experience!",
      });

      // Reset form
      setRating(0);
      setComment('');
      
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Delivery Experience</CardTitle>
        <p className="text-sm text-gray-600">
          How was your experience with {driverName}?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Tap to rate:</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Comments (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this delivery..."
            className="resize-none"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmitRating}
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </CardContent>
    </Card>
  );
};
