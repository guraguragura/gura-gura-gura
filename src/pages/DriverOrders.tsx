
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Phone, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DriverOrders = () => {
  const [activeTab, setActiveTab] = useState('active');

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

  const completedOrders = [
    {
      id: '#1232',
      customer: 'Paul Nkurunziza',
      address: 'KK 45 Ave, Gisozi, Kigali',
      items: 2,
      value: 'RWF 15,000',
      completedAt: '2:30 PM',
      rating: 5
    },
    {
      id: '#1231',
      customer: 'Marie Mukamurenzi',
      address: 'KN 8 St, Remera, Kigali',
      items: 4,
      value: 'RWF 32,000',
      completedAt: '1:15 PM',
      rating: 4
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'in_transit':
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-gray-600">{order.customer}</p>
                      </div>
                      {getStatusBadge(order.status)}
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
                        </div>
                        <span className="font-semibold">{order.value}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        {order.status === 'assigned' && (
                          <Button size="sm" className="bg-[#84D1D3] hover:bg-[#6bb6b9]">
                            Accept Order
                          </Button>
                        )}
                        {order.status === 'picked_up' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-gray-600">{order.customer}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{order.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{order.items} items</span>
                          <span className="text-sm">Completed at {order.completedAt}</span>
                        </div>
                        <span className="font-semibold">{order.value}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < order.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverOrders;
