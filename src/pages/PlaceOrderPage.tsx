
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { orderProcessingService } from '@/services/orderProcessingService';
import { MapPin, Phone, Package, CreditCard } from 'lucide-react';

const PlaceOrderPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    itemsDescription: '',
    itemsCount: 1,
    totalAmount: 5000,
    specialInstructions: '',
    urgency: 'normal' as 'normal' | 'urgent'
  });

  const handleInputChange = (field: string, value: string | number) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!orderData.customerName || !orderData.customerPhone || !orderData.deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await orderProcessingService.createOrder({
        ...orderData,
        paymentMethod: 'admin_created'
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // For admin orders, automatically progress to ready_for_pickup
      if (result.orderId) {
        await orderProcessingService.processPayment({
          orderId: result.orderId,
          paymentMethod: 'admin_created',
          paymentAmount: orderData.totalAmount
        });
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Order ${result.orderId?.slice(-8)} has been created and is ready for pickup by a driver.`,
      });

      // Reset form
      setOrderData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        itemsDescription: '',
        itemsCount: 1,
        totalAmount: 5000,
        specialInstructions: '',
        urgency: 'normal'
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Place New Order</h1>
          <p className="text-gray-600 mt-2">Create a new delivery order that will appear on the driver dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Customer Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={orderData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={orderData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+250788123456"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Email (Optional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={orderData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Delivery Information</span>
              </h3>
              
              <div>
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={orderData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="KN 3 Ave, Nyarugenge, Kigali"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={orderData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Ring the bell twice, building entrance is on the left..."
                  rows={2}
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Order Details</span>
              </h3>
              
              <div>
                <Label htmlFor="itemsDescription">Items Description</Label>
                <Input
                  id="itemsDescription"
                  value={orderData.itemsDescription}
                  onChange={(e) => handleInputChange('itemsDescription', e.target.value)}
                  placeholder="Electronics, clothes, food items..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="itemsCount">Number of Items</Label>
                  <Input
                    id="itemsCount"
                    type="number"
                    min="1"
                    value={orderData.itemsCount}
                    onChange={(e) => handleInputChange('itemsCount', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalAmount">Total Amount (RWF)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    value={orderData.totalAmount}
                    onChange={(e) => handleInputChange('totalAmount', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={orderData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePlaceOrder} 
              disabled={loading}
              className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9]"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
