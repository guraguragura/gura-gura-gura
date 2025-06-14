
-- Create a function to map unified_status to customer-facing status
CREATE OR REPLACE FUNCTION map_unified_status_to_customer_status(unified_status_val unified_order_status_enum)
RETURNS order_status_enum
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE unified_status_val
    WHEN 'pending_payment' THEN RETURN 'pending';
    WHEN 'paid' THEN RETURN 'pending';
    WHEN 'processing' THEN RETURN 'processing';
    WHEN 'ready_for_pickup' THEN RETURN 'processing';
    WHEN 'assigned_to_driver' THEN RETURN 'processing';
    WHEN 'picked_up' THEN RETURN 'processing';
    WHEN 'out_for_delivery' THEN RETURN 'shipped';
    WHEN 'delivered' THEN RETURN 'delivered';
    WHEN 'failed_delivery' THEN RETURN 'shipped';
    WHEN 'cancelled' THEN RETURN 'canceled';
    WHEN 'refunded' THEN RETURN 'canceled';
    ELSE RETURN 'pending';
  END CASE;
END;
$$;

-- Update the existing trigger to also sync the customer-facing status
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Define allowed transitions (keeping existing logic)
  IF OLD.unified_status IS NOT NULL AND NEW.unified_status != OLD.unified_status THEN
    -- Check if transition is valid
    IF NOT (
      (OLD.unified_status = 'pending_payment' AND NEW.unified_status IN ('paid', 'cancelled')) OR
      (OLD.unified_status = 'paid' AND NEW.unified_status IN ('processing', 'cancelled', 'refunded')) OR
      (OLD.unified_status = 'processing' AND NEW.unified_status IN ('ready_for_pickup', 'cancelled')) OR
      (OLD.unified_status = 'ready_for_pickup' AND NEW.unified_status IN ('assigned_to_driver', 'cancelled')) OR
      (OLD.unified_status = 'assigned_to_driver' AND NEW.unified_status IN ('picked_up', 'cancelled')) OR
      (OLD.unified_status = 'picked_up' AND NEW.unified_status IN ('out_for_delivery', 'failed_delivery', 'cancelled')) OR
      (OLD.unified_status = 'out_for_delivery' AND NEW.unified_status IN ('delivered', 'failed_delivery', 'cancelled')) OR
      (OLD.unified_status = 'failed_delivery' AND NEW.unified_status IN ('assigned_to_driver', 'cancelled', 'refunded')) OR
      (OLD.unified_status = 'delivered' AND NEW.unified_status = 'refunded') OR
      (OLD.unified_status = 'cancelled' AND NEW.unified_status = 'refunded')
    ) THEN
      RAISE EXCEPTION 'Invalid status transition from % to %', OLD.unified_status, NEW.unified_status;
    END IF;
  END IF;
  
  -- Auto-sync customer-facing status based on unified_status
  IF NEW.unified_status IS NOT NULL THEN
    NEW.status = map_unified_status_to_customer_status(NEW.unified_status);
  END IF;
  
  -- Auto-set timestamps based on status (keeping existing logic)
  IF NEW.unified_status != OLD.unified_status THEN
    CASE NEW.unified_status
      WHEN 'paid' THEN NEW.paid_at = COALESCE(NEW.paid_at, NOW());
      WHEN 'processing' THEN NEW.processing_started_at = COALESCE(NEW.processing_started_at, NOW());
      WHEN 'ready_for_pickup' THEN NEW.ready_for_pickup_at = COALESCE(NEW.ready_for_pickup_at, NOW());
      WHEN 'assigned_to_driver' THEN NEW.assigned_at = COALESCE(NEW.assigned_at, NOW());
      WHEN 'picked_up' THEN NEW.picked_up_at = COALESCE(NEW.picked_up_at, NOW());
      WHEN 'delivered' THEN NEW.delivered_at = COALESCE(NEW.delivered_at, NOW());
      WHEN 'failed_delivery' THEN NEW.failed_delivery_at = COALESCE(NEW.failed_delivery_at, NOW());
      WHEN 'cancelled' THEN NEW.cancelled_at = COALESCE(NEW.cancelled_at, NOW());
      WHEN 'refunded' THEN NEW.refunded_at = COALESCE(NEW.refunded_at, NOW());
      ELSE NULL;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Enable realtime for the order table
ALTER PUBLICATION supabase_realtime ADD TABLE "order";

-- Ensure we capture all row data for realtime updates
ALTER TABLE "order" REPLICA IDENTITY FULL;

-- Update existing orders to have synchronized statuses
UPDATE "order" 
SET status = map_unified_status_to_customer_status(unified_status)
WHERE unified_status IS NOT NULL;
