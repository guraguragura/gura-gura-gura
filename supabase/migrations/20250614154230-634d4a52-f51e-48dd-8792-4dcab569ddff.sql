
-- Add driver assignment and status tracking to orders
ALTER TABLE "order" 
ADD COLUMN IF NOT EXISTS driver_assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS driver_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create order status history table to track all status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  previous_status unified_order_status_enum,
  new_status unified_order_status_enum NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_by_type TEXT DEFAULT 'customer', -- 'customer', 'driver', 'admin', 'system'
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order status history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Create policy for order status history (customers can view their order history, drivers can view orders they're assigned to)
CREATE POLICY "Users can view order status history" ON order_status_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "order" o 
    WHERE o.id = order_status_history.order_id 
    AND (o.customer_id IN (
      SELECT customer_id FROM customer_account_holder cah 
      JOIN account_holder ah ON cah.account_holder_id = ah.id 
      WHERE ah.external_id = auth.uid()::text
    ) OR o.driver_id = auth.uid())
  )
);

-- Create policy for inserting order status history (drivers and system can insert)
CREATE POLICY "Drivers and system can insert status history" ON order_status_history
FOR INSERT WITH CHECK (
  changed_by = auth.uid() OR changed_by_type = 'system'
);

-- Create function to handle driver order acceptance
CREATE OR REPLACE FUNCTION accept_driver_order(
  p_order_id TEXT,
  p_driver_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_record RECORD;
  v_result JSONB;
BEGIN
  -- Check if order exists and is in a state that can be accepted
  SELECT * INTO v_order_record 
  FROM "order" 
  WHERE id = p_order_id 
  AND unified_status = 'ready_for_pickup'
  AND (driver_id IS NULL OR driver_id = p_driver_id);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Order not found or cannot be accepted'
    );
  END IF;
  
  -- Update order with driver assignment
  UPDATE "order" 
  SET 
    driver_id = p_driver_id,
    unified_status = 'assigned_to_driver',
    driver_accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_order_id;
  
  -- Insert status history record
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    changed_by_type,
    notes
  ) VALUES (
    p_order_id,
    v_order_record.unified_status,
    'assigned_to_driver',
    p_driver_id,
    'driver',
    'Order accepted by driver'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Order accepted successfully',
    'order_id', p_order_id
  );
END;
$$;

-- Create function to handle driver order refusal
CREATE OR REPLACE FUNCTION refuse_driver_order(
  p_order_id TEXT,
  p_driver_id UUID,
  p_reason TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_record RECORD;
BEGIN
  -- Check if order exists and can be refused
  SELECT * INTO v_order_record 
  FROM "order" 
  WHERE id = p_order_id 
  AND unified_status = 'ready_for_pickup';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Order not found or cannot be refused'
    );
  END IF;
  
  -- Insert refusal record in status history
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    changed_by_type,
    notes
  ) VALUES (
    p_order_id,
    v_order_record.unified_status,
    v_order_record.unified_status, -- Status stays the same, but we track the refusal
    p_driver_id,
    'driver',
    CONCAT('Order refused by driver', CASE WHEN p_reason IS NOT NULL THEN ': ' || p_reason ELSE '' END)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Order refusal recorded',
    'order_id', p_order_id
  );
END;
$$;
