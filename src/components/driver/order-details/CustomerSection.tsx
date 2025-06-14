
import React from 'react';
import { Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface CustomerSectionProps {
  order: DriverOrder;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({ order }) => {
  const handleCallCustomer = () => {
    window.open(`tel:${order.customer_phone}`, '_self');
  };

  const handleOpenMaps = () => {
    const encodedAddress = encodeURIComponent(order.delivery_address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Customer Name</p>
          <p className="font-semibold">{order.customer_name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Phone Number</p>
          <div className="flex items-center justify-between">
            <p className="font-semibold">{order.customer_phone}</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCallCustomer}
              className="flex items-center gap-1"
            >
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Delivery Address</p>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold flex-1">{order.delivery_address}</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleOpenMaps}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <MapPin className="h-4 w-4" />
              Map
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
