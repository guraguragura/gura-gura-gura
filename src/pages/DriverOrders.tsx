import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Phone, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import type { Database } from '@/integrations/supabase/types';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

const DriverOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { 
    activeOrders, 
    loading, 
    updateOrderStatus 
  } = useDriverOrders();

  const completedOrders = activeOrders.filter(order => order.unified_status === 'delivered');
  const currentOrders = activeOrders.filter(order => order.unified_status !== 'delivered');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as UnifiedOrderStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders ({currentOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {currentOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No active orders at the moment
                  </CardContent>
                </Card>
              ) : (
                currentOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                          <p className="text-gray-600">{order.customer_name}</p>
                        </div>
                        {getStatusBadge(order.unified_status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.customer_phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{order.items_count} items</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{order.estimated_delivery_time}</span>
                            </div>
                          </div>
                          <span className="font-semibold">{order.total_amount}</span>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          {order.unified_status === 'assigned_to_driver' && (
                            <Button 
                              size="sm" 
                              className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                              onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                            >
                              Mark Picked Up
                            </Button>
                          )}
                          {order.unified_status === 'picked_up' && (
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')}
                            >
                              Out for Delivery
                            </Button>
                          )}
                          {order.unified_status === 'out_for_delivery' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No completed orders yet
                  </CardContent>
                </Card>
              ) : (
                completedOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                          <p className="text-gray-600">{order.customer_name}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm">{order.items_count} items</span>
                            <span className="text-sm">Delivered</span>
                          </div>
                          <span className="font-semibold">{order.total_amount}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className="text-sm text-yellow-400"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverOrders;
