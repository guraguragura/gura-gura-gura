
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Package, Clock } from 'lucide-react';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface AvailableOrdersListProps {
  orders: DriverOrder[];
  onAcceptOrder: (orderId: string) => Promise<void>;
  onRefuseOrder: (orderId: string) => Promise<void>;
}

const AvailableOrdersList = ({ orders, onAcceptOrder, onRefuseOrder }: AvailableOrdersListProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        New Orders Available ({orders.length})
      </h2>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No new orders available at the moment
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                      onClick={() => onAcceptOrder(order.id)}
                    >
                      Accept Order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onRefuseOrder(order.id)}
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
  );
};

export default AvailableOrdersList;
