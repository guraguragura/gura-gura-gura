
import type { Database } from '@/integrations/supabase/types';

// Import the proper enum type from Supabase
export type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

export interface DriverOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items_count: number;
  total_amount: string;
  estimated_delivery_time: string;
  distance: string;
  unified_status: UnifiedOrderStatus;
  created_at: string;
}

// Type for RPC function returns
export interface RpcResult {
  success: boolean;
  message: string;
  order_id?: string;
}
