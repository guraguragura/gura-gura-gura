
-- Add RLS policies to the order table to restrict driver access
ALTER TABLE public.order ENABLE ROW LEVEL SECURITY;

-- Policy: Drivers can only see orders assigned to them or unassigned orders ready for pickup
CREATE POLICY "drivers_can_view_their_orders" ON public.order
FOR SELECT 
TO authenticated
USING (
  -- Check if user is a driver and has a driver profile
  EXISTS (
    SELECT 1 FROM public.driver_profiles dp 
    WHERE dp.user_id = auth.uid()
  ) AND (
    -- Driver can see orders assigned to them
    driver_id = (
      SELECT dp.id FROM public.driver_profiles dp 
      WHERE dp.user_id = auth.uid()
    )
    OR 
    -- Driver can see unassigned orders that are ready for pickup
    (driver_id IS NULL AND unified_status = 'ready_for_pickup')
  )
);

-- Policy: Drivers can only update orders assigned to them
CREATE POLICY "drivers_can_update_their_orders" ON public.order
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.driver_profiles dp 
    WHERE dp.user_id = auth.uid() 
    AND dp.id = driver_id
  )
);

-- Add RLS to driver_profiles table
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Drivers can only see their own profile
CREATE POLICY "drivers_can_view_own_profile" ON public.driver_profiles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Policy: Drivers can update their own profile
CREATE POLICY "drivers_can_update_own_profile" ON public.driver_profiles
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());
