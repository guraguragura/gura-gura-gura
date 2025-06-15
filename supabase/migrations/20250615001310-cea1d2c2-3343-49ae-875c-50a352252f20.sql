
-- Create customer ratings table
CREATE TABLE public.customer_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.order(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, customer_id) -- Prevent duplicate ratings for same order
);

-- Enable RLS on customer ratings
ALTER TABLE public.customer_ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can only see and create their own ratings (fixed type casting)
CREATE POLICY "customers_can_manage_own_ratings" ON public.customer_ratings
FOR ALL 
TO authenticated
USING (
  customer_id = (
    SELECT c.id FROM public.customer c 
    WHERE c.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  customer_id = (
    SELECT c.id FROM public.customer c 
    WHERE c.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Policy: Drivers can view ratings given to them
CREATE POLICY "drivers_can_view_their_ratings" ON public.customer_ratings
FOR SELECT 
TO authenticated
USING (
  driver_id = (
    SELECT dp.id FROM public.driver_profiles dp 
    WHERE dp.user_id = auth.uid()
  )
);

-- Add average rating column to driver_profiles table
ALTER TABLE public.driver_profiles 
ADD COLUMN average_rating NUMERIC(3,2) DEFAULT NULL,
ADD COLUMN total_ratings INTEGER DEFAULT 0;

-- Function to calculate and update driver ratings
CREATE OR REPLACE FUNCTION public.update_driver_rating(p_driver_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_avg_rating NUMERIC(3,2);
  v_total_ratings INTEGER;
BEGIN
  -- Calculate average rating and total count
  SELECT 
    ROUND(AVG(rating)::NUMERIC, 2),
    COUNT(*)
  INTO v_avg_rating, v_total_ratings
  FROM public.customer_ratings 
  WHERE driver_id = p_driver_id;
  
  -- Update driver profile
  UPDATE public.driver_profiles 
  SET 
    average_rating = v_avg_rating,
    total_ratings = v_total_ratings,
    updated_at = NOW()
  WHERE id = p_driver_id;
END;
$$;

-- Trigger to automatically update driver rating when a new rating is added
CREATE OR REPLACE FUNCTION public.handle_rating_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update driver rating when rating is inserted, updated, or deleted
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_driver_rating(OLD.driver_id);
    RETURN OLD;
  ELSE
    PERFORM public.update_driver_rating(NEW.driver_id);
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers for rating updates
CREATE TRIGGER trigger_update_driver_rating_on_insert
  AFTER INSERT ON public.customer_ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_rating_update();

CREATE TRIGGER trigger_update_driver_rating_on_update
  AFTER UPDATE ON public.customer_ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_rating_update();

CREATE TRIGGER trigger_update_driver_rating_on_delete
  AFTER DELETE ON public.customer_ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_rating_update();

-- Add indexes for better performance
CREATE INDEX idx_customer_ratings_driver_id ON public.customer_ratings(driver_id);
CREATE INDEX idx_customer_ratings_order_id ON public.customer_ratings(order_id);
CREATE INDEX idx_customer_ratings_customer_id ON public.customer_ratings(customer_id);
