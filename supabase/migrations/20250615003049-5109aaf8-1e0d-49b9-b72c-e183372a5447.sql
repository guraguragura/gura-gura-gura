
-- Step 1: Add vehicle information and statistics columns to driver_profiles table
ALTER TABLE public.driver_profiles 
ADD COLUMN IF NOT EXISTS vehicle_make text,
ADD COLUMN IF NOT EXISTS vehicle_model text,
ADD COLUMN IF NOT EXISTS vehicle_year integer,
ADD COLUMN IF NOT EXISTS plate_number text,
ADD COLUMN IF NOT EXISTS vehicle_color text,
ADD COLUMN IF NOT EXISTS total_deliveries integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS years_active numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS on_time_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS emergency_contact text;

-- Step 2: Create function to calculate real delivery statistics
CREATE OR REPLACE FUNCTION public.calculate_driver_statistics(p_driver_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_deliveries integer := 0;
  v_total_earnings numeric := 0;
  v_years_active numeric := 0;
  v_on_time_percentage numeric := 0;
  v_profile_created_at timestamp with time zone;
  v_on_time_count integer := 0;
  v_total_completed integer := 0;
BEGIN
  -- Get profile creation date
  SELECT created_at INTO v_profile_created_at
  FROM public.driver_profiles
  WHERE id = p_driver_id;
  
  -- Calculate years active
  v_years_active := EXTRACT(EPOCH FROM (NOW() - v_profile_created_at)) / (365.25 * 24 * 3600);
  
  -- Calculate total deliveries and earnings from completed orders
  SELECT 
    COUNT(*),
    COALESCE(SUM((metadata->>'total')::numeric), 0)
  INTO v_total_deliveries, v_total_earnings
  FROM public.order
  WHERE driver_id = p_driver_id 
    AND unified_status = 'delivered';
  
  -- Calculate on-time delivery percentage
  -- Assuming orders delivered within expected timeframe are "on-time"
  SELECT 
    COUNT(*) as total_completed,
    COUNT(CASE WHEN delivered_at <= (assigned_at + INTERVAL '2 hours') THEN 1 END) as on_time_count
  INTO v_total_completed, v_on_time_count
  FROM public.order
  WHERE driver_id = p_driver_id 
    AND unified_status = 'delivered'
    AND assigned_at IS NOT NULL
    AND delivered_at IS NOT NULL;
  
  -- Calculate percentage
  IF v_total_completed > 0 THEN
    v_on_time_percentage := (v_on_time_count::numeric / v_total_completed::numeric) * 100;
  END IF;
  
  -- Update driver profile with calculated statistics
  UPDATE public.driver_profiles
  SET 
    total_deliveries = v_total_deliveries,
    total_earnings = v_total_earnings,
    years_active = ROUND(v_years_active, 1),
    on_time_percentage = ROUND(v_on_time_percentage, 0),
    updated_at = NOW()
  WHERE id = p_driver_id;
  
  RETURN jsonb_build_object(
    'total_deliveries', v_total_deliveries,
    'total_earnings', v_total_earnings,
    'years_active', ROUND(v_years_active, 1),
    'on_time_percentage', ROUND(v_on_time_percentage, 0)
  );
END;
$$;

-- Step 3: Create function to calculate current period earnings
CREATE OR REPLACE FUNCTION public.calculate_driver_period_earnings(p_driver_id uuid, p_period text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date timestamp with time zone;
  v_earnings numeric := 0;
BEGIN
  -- Determine start date based on period
  CASE p_period
    WHEN 'today' THEN
      v_start_date := DATE_TRUNC('day', NOW());
    WHEN 'week' THEN
      v_start_date := DATE_TRUNC('week', NOW());
    WHEN 'month' THEN
      v_start_date := DATE_TRUNC('month', NOW());
    ELSE
      v_start_date := DATE_TRUNC('day', NOW());
  END CASE;
  
  -- Calculate earnings for the period
  SELECT COALESCE(SUM((metadata->>'total')::numeric), 0)
  INTO v_earnings
  FROM public.order
  WHERE driver_id = p_driver_id 
    AND unified_status = 'delivered'
    AND delivered_at >= v_start_date;
  
  RETURN v_earnings;
END;
$$;

-- Step 4: Create trigger to update statistics when orders are completed
CREATE OR REPLACE FUNCTION public.update_driver_stats_on_delivery()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update when order status changes to delivered
  IF NEW.unified_status = 'delivered' AND (OLD.unified_status IS NULL OR OLD.unified_status != 'delivered') THEN
    -- Update driver statistics
    PERFORM public.calculate_driver_statistics(NEW.driver_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS update_driver_stats_on_delivery_trigger ON public.order;
CREATE TRIGGER update_driver_stats_on_delivery_trigger
  AFTER UPDATE ON public.order
  FOR EACH ROW
  EXECUTE FUNCTION public.update_driver_stats_on_delivery();
