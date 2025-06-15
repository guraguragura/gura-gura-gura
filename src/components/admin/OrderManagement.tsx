
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, User, MapPin, DollarSign } from 'lucide-react';

interface AdminOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  unified_status: string;
  total_amount: number;
  items_count: number;
  created_at: string;
  driver_id?: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          unified_status,
          created_at,
          metadata,
          driver_id,
          customer:customer_id (
            first_name,
            last_name,
            phone
          ),
          shipping_address:shipping_address_id (
            address_1,
            address_2
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      const formattedOrders: AdminOrder[] = data?.map(order => {
        const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
        const address = Array.isArray(order.shipping_address) ? order.shipping_address[0] : order.shipping_address;
        const metadata = order.metadata as Record<string, any> || {};
        
        return {
          id: order.id,
          customer_name: customer ? `${customer.first_name} ${customer.last_name}`.trim() : 'Unknown',
          customer_phone: customer?.phone || 'No phone',
          delivery_address: address ? `${address.address_1} ${address.address_2 || ''}`.trim() : 'No address',
          unified_status: order.unified_status,
          total_amount: metadata.total_amount || 0,
          items_count: metadata.items_count || 0,
          created_at: order.created_at,
          driver_id: order.driver_id
        };
      }) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return <Badge className="bg-orange-100 text-orange-800">Ready for Pickup</Badge>;
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="text-gray-600">Manage customer orders and track delivery status</p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  {getStatusBadge(order.unified_status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-gray-600">{order.customer_phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{order.delivery_address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{order.items_count} items</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium">RWF {order.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
