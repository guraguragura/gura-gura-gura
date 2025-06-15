
-- Create table for order messages
CREATE TABLE public.order_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.order(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'driver')),
  sender_id TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'template')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for customers to view messages for their orders
CREATE POLICY "Customers can view messages for their orders" 
  ON public.order_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_messages.order_id 
      AND o.customer_id = auth.uid()::text
    )
  );

-- Create policy for drivers to view messages for their assigned orders
CREATE POLICY "Drivers can view messages for their assigned orders" 
  ON public.order_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_messages.order_id 
      AND o.driver_id = auth.uid()
    )
  );

-- Create policy for customers to insert messages for their orders
CREATE POLICY "Customers can send messages for their orders" 
  ON public.order_messages 
  FOR INSERT 
  WITH CHECK (
    sender_type = 'customer' 
    AND sender_id = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_id 
      AND o.customer_id = auth.uid()::text
    )
  );

-- Create policy for drivers to insert messages for their assigned orders
CREATE POLICY "Drivers can send messages for their assigned orders" 
  ON public.order_messages 
  FOR INSERT 
  WITH CHECK (
    sender_type = 'driver' 
    AND sender_id = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_id 
      AND o.driver_id = auth.uid()
    )
  );

-- Create policy for updating read status
CREATE POLICY "Users can update read status for their messages" 
  ON public.order_messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.order o 
      WHERE o.id = order_messages.order_id 
      AND (
        (o.customer_id = auth.uid()::text) OR 
        (o.driver_id = auth.uid())
      )
    )
  );

-- Enable realtime for order_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;

-- Create index for better performance
CREATE INDEX idx_order_messages_order_id ON public.order_messages(order_id);
CREATE INDEX idx_order_messages_created_at ON public.order_messages(created_at);
