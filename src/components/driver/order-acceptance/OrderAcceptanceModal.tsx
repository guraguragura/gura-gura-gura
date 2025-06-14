
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Package, Clock, Navigation, Eye, MessageCircle, CheckCircle } from 'lucide-react';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface OrderAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DriverOrder;
  onStartNavigation: () => void;
  onViewDetails: () => void;
  onContactCustomer: () => void;
}

export const OrderAcceptanceModal: React.FC<OrderAcceptanceModalProps> = ({
  isOpen,
  onClose,
  order,
  onStartNavigation,
  onViewDetails,
  onContactCustomer
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Order Accepted!
            </DialogTitle>
            <Badge className="bg-blue-100 text-blue-800 text-xs">DEMO MODE</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                  <p className="text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{order.total_amount}</p>
                  <p className="text-sm text-gray-500">Estimated earnings</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{order.items_count} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{order.estimated_delivery_time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Route Information</h4>
                  <p className="text-sm text-gray-600">Distance: {order.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Est. Time</p>
                  <p className="text-sm text-gray-600">{order.estimated_delivery_time}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Mode Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This uses real routing data with simulated orders. 
              Click "Start Navigation" to proceed with the delivery workflow.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={onStartNavigation}
              className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9] text-white flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Start Navigation
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={onViewDetails}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
              <Button 
                variant="outline" 
                onClick={onContactCustomer}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Customer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
