
-- Add delivery verification code field to orders table
ALTER TABLE "order" ADD COLUMN delivery_verification_code text;

-- Add index for faster lookups
CREATE INDEX idx_order_delivery_verification_code ON "order"(delivery_verification_code);
