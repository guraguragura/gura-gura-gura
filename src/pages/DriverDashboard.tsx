
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, MapPin, Phone, Clock } from 'lucide-react';

const DriverDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Deliveries',
      value: '3',
      icon: Package,
      description: 'Currently assigned'
    },
    {
      title: 'Completed Today',
      value: '12',
      icon: Truck,
      description: 'Deliveries completed'
    }
  ];

  const pendingOrders = [
    {
      id: '#1236',
      customer: 'Sarah Uwimana',
      phone: '+250 788 987 654',
      address: 'KG 25 Ave, Remera, Kigali',
      items: 2,
      value: 'RWF 18,500',
      estimatedTime: '20 mins',
      distance: '3.2 km'
    },
    {
      id: '#1237',
      customer: 'David Nkurunziza',
      phone: '+250 788 456 789',
      address: 'KN 30 St, Kicukiro, Kigali',
      items: 1,
      value: 'RWF 12,000',
      estimatedTime: '30 mins',
      distance: '5.1 km'
    }
  ];

  const activeOrders = [
    {
      id: '#1234',
      customer: 'John Mukamana',
      phone: '+250 788 123 456',
      address: 'KN 15 Ave, Kimisagara, Kigali',
      items: 3,
      value: 'RWF 25,000',
      status: 'picked_up',
      estimatedTime: '15 mins',
      distance: '2.5 km'
    },
    {
      id: '#1235',
      customer: 'Alice Uwimana',
      phone: '+250 788 654 321',
      address: 'KG 12 St, Nyamirambo, Kigali',
      items: 1,
      value: 'RWF 8,500',
      status: 'assigned',
      estimatedTime: '25 mins',
      distance: '4.1 km'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || 'Driver'}!
          </h1>
          <p className="text-gray-600 mt-2">Here are your available orders and current deliveries</p>
        </div>

        {/* New Orders to Accept/Refuse */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Orders Available</h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-[#84D1D3]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-gray-600">{order.customer}</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">New Order</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{order.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{order.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.items} items</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{order.estimatedTime}</span>
                        </div>
                        <span className="text-sm text-gray-500">{order.distance}</span>
                      </div>
                      <span className="font-semibold">{order.value}</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="bg-[#84D1D3] hover:bg-[#6bb6b9]">
                        Accept Order
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Refuse
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <CardTitle>Current Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.address}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">Delivered order #1232 at 2:30 PM</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">Picked up order #1233 at 1:45 PM</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#84D1D3] rounded-full"></div>
                  <p className="text-sm">Accepted order #1234 at 1:20 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
