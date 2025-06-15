
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, User, MapPin, Clock, DollarSign } from 'lucide-react';

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

  // Helper function to generate unique IDs
  const generateCustomerId = () => 'cus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const generateAddressId = () => 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const generateOrderId = () => 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

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

  const createTestOrder = async () => {
    const testOrders = [
      {
        customerName: 'Alice Johnson',
        phone: '+250788111111',
        address: 'KN 5 Rd, Gasabo, Kigali',
        items: 'Electronics package',
        amount: 15000
      },
      {
        customerName: 'Bob Wilson',
        phone: '+250788222222',
        address: 'KG 15 Ave, Nyarugenge, Kigali',
        items: 'Food delivery',
        amount: 8500
      },
      {
        customerName: 'Carol Smith',
        phone: '+250788333333',
        address: 'KK 12 St, Kicukiro, Kigali',
        items: 'Medicine package',
        amount: 12000
      }
    ];

    const randomOrder = testOrders[Math.floor(Math.random() * testOrders.length)];
    
    try {
      // Generate unique IDs
      const customerId = generateCustomerId();
      const addressId = generateAddressId();
      const orderId = generateOrderId();

      // Create customer
      const { error: customerError } = await supabase
        .from('customer')
        .insert({
          id: customerId,
          first_name: randomOrder.customerName.split(' ')[0],
          last_name: randomOrder.customerName.split(' ')[1] || '',
          phone: randomOrder.phone,
          has_account: false
        });

      if (customerError) throw customerError;

      // Create address
      const { error: addressError } = await supabase
        .from('order_address')
        .insert({
          id: addressId,
          first_name: randomOrder.customerName.split(' ')[0],
          last_name: randomOrder.customerName.split(' ')[1] || '',
          phone: randomOrder.phone,
          address_1: randomOrder.address,
          customer_id: customerId
        });

      if (addressError) throw addressError;

      // Create order
      const { error: orderError } = await supabase
        .from('order')
        .insert({
          id: orderId,
          customer_id: customerId,
          shipping_address_id: addressId,
          currency_code: 'RWF',
          unified_status: 'ready_for_pickup',
          status: 'pending',
          metadata: {
            items_count: Math.floor(Math.random() * 3) + 1,
            total_amount: randomOrder.amount,
            estimated_delivery_time: '25-30 mins',
            distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
            items_description: randomOrder.items,
            created_via: 'admin_test_order'
          }
        });

      if (orderError) throw orderError;

      toast({
        title: "Test Order Created",
        description: `Order ${orderId.slice(-8)} is now available for drivers`,
      });

      fetchOrders();
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Error",
        description: "Failed to create test order",
        variant: "destructive"
      });
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Manage customer orders and track delivery status</p>
        </div>
        <Button onClick={createTestOrder} className="bg-[#84D1D3] hover:bg-[#6bb6b9]">
          Create Test Order
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders found. Create a test order to see how it appears on the driver dashboard.</p>
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
