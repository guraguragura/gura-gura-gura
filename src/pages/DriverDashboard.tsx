
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, MapPin, Phone, Clock, RefreshCw } from 'lucide-react';
import { useDriverOrders } from '@/hooks/useDriverOrders';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { 
    availableOrders, 
    activeOrders, 
    loading, 
    acceptOrder, 
    refuseOrder, 
    updateOrderStatus,
    refreshOrders 
  } = useDriverOrders();

  const stats = [
    {
      title: 'Available Orders',
      value: availableOrders.length.toString(),
      icon: Package,
      description: 'Ready for pickup'
    },
    {
      title: 'Active Deliveries',
      value: activeOrders.length.toString(),
      icon: Truck,
      description: 'Currently assigned'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">Out for Delivery</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrder(orderId);
  };

  const handleRefuseOrder = async (orderId: string) => {
    await refuseOrder(orderId, "Driver declined");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.first_name || 'Driver'}!
            </h1>
            <p className="text-gray-600 mt-2">Here are your available orders and current deliveries</p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshOrders}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* New Orders to Accept/Refuse */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            New Orders Available ({availableOrders.length})
          </h2>
          {availableOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No new orders available at the moment
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-[#84D1D3]">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                        <p className="text-gray-600">{order.customer_name}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">New Order</Badge>
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
                          <span className="text-sm text-gray-500">{order.distance}</span>
                        </div>
                        <span className="font-semibold">{order.total_amount}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          Accept Order
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRefuseOrder(order.id)}
                        >
                          Refuse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-[#84D1D3]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Deliveries ({activeOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {activeOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active deliveries</p>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">{order.customer_name}</p>
                          <p className="text-sm text-gray-600">{order.delivery_address}</p>
                        </div>
                        {getStatusBadge(order.unified_status)}
                      </div>
                      <div className="flex space-x-2">
                        {order.unified_status === 'assigned_to_driver' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark Picked Up
                          </Button>
                        )}
                        {order.unified_status === 'picked_up' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Out for Delivery
                          </Button>
                        )}
                        {order.unified_status === 'out_for_delivery' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#84D1D3] rounded-full"></div>
                    <p className="text-sm">
                      {order.unified_status === 'assigned_to_driver' && `Accepted order #${order.id.slice(-6)}`}
                      {order.unified_status === 'picked_up' && `Picked up order #${order.id.slice(-6)}`}
                      {order.unified_status === 'out_for_delivery' && `Out for delivery #${order.id.slice(-6)}`}
                    </p>
                  </div>
                ))}
                {activeOrders.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
