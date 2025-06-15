
-- Create failed_delivery_reasons lookup table first
CREATE TABLE public.failed_delivery_reasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_attempts table to track each delivery attempt
CREATE TABLE public.delivery_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.order(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.driver_profiles(id),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('successful', 'failed', 'rescheduled')),
  failed_reason_id UUID REFERENCES public.failed_delivery_reasons(id),
  notes TEXT,
  photo_evidence_url TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rescheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert standard failure reasons
INSERT INTO public.failed_delivery_reasons (code, description) VALUES
  ('customer_unavailable', 'Customer not available at delivery location'),
  ('wrong_address', 'Incorrect or incomplete delivery address'),
  ('access_denied', 'Unable to access building or delivery location'),
  ('customer_refused', 'Customer refused to accept the delivery'),
  ('unsafe_location', 'Delivery location deemed unsafe'),
  ('weather_conditions', 'Severe weather preventing safe delivery'),
  ('vehicle_breakdown', 'Driver vehicle malfunction or breakdown'),
  ('other', 'Other reason (see notes for details)');

-- Add Row Level Security
ALTER TABLE public.delivery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_delivery_reasons ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_attempts
CREATE POLICY "Drivers can view delivery attempts for their orders" 
  ON public.delivery_attempts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = delivery_attempts.order_id 
      AND o.driver_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view delivery attempts for their orders" 
  ON public.delivery_attempts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = delivery_attempts.order_id 
      AND o.customer_id = auth.uid()::text
    )
  );

CREATE POLICY "Drivers can insert delivery attempts for their orders" 
  ON public.delivery_attempts 
  FOR INSERT 
  WITH CHECK (
    driver_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_id 
      AND o.driver_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can update delivery attempts for their orders" 
  ON public.delivery_attempts 
  FOR UPDATE 
  USING (
    driver_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = delivery_attempts.order_id 
      AND o.driver_id = auth.uid()
    )
  );

-- Create policies for failed_delivery_reasons (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view failure reasons" 
  ON public.failed_delivery_reasons 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_delivery_attempts_order_id ON public.delivery_attempts(order_id);
CREATE INDEX idx_delivery_attempts_driver_id ON public.delivery_attempts(driver_id);
CREATE INDEX idx_delivery_attempts_attempted_at ON public.delivery_attempts(attempted_at);
CREATE INDEX idx_failed_delivery_reasons_code ON public.failed_delivery_reasons(code);

-- Enable realtime for delivery_attempts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_attempts;
