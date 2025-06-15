
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopInfoBar from '@/components/layout/TopInfoBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Package, Clock } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { orderProcessingService } from '@/services/orderProcessingService';

interface OrderInfo {
  id: string;
  unified_status: string;
  customer_name: string;
  total_amount: number;
  estimated_delivery_time: string;
}

const PaymentSuccessPage = () => {
  const { clearCart } = useCartContext();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    // Get order ID from session storage
    const orderId = sessionStorage.getItem('lastOrderId');
    if (orderId) {
      loadOrderInfo(orderId);
      // Clean up session storage
      sessionStorage.removeItem('lastOrderId');
    } else {
      setLoading(false);
    }
  }, [clearCart]);

  const loadOrderInfo = async (orderId: string) => {
    try {
      const result = await orderProcessingService.getOrderStatus(orderId);
      if (result.success && result.order) {
        const order = result.order;
        const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
        
        setOrderInfo({
          id: order.id,
          unified_status: order.unified_status,
          customer_name: customer ? `${customer.first_name} ${customer.last_name}`.trim() : 'Customer',
          total_amount: order.metadata?.total_amount || 0,
          estimated_delivery_time: order.metadata?.estimated_delivery_time || '30-45 mins'
        });
      }
    } catch (error) {
      console.error('Error loading order info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'Your order is ready for pickup by our drivers!';
      case 'assigned_to_driver':
        return 'A driver has been assigned to your order.';
      case 'picked_up':
        return 'Your order has been picked up and is on the way.';
      case 'out_for_delivery':
        return 'Your order is out for delivery.';
      case 'delivered':
        return 'Your order has been delivered!';
      default:
        return 'Your order has been confirmed and is being processed.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopInfoBar />
      <Navbar />
      <div className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-lg mx-auto text-center">
          <div className="rounded-full bg-green-100 p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          {loading ? (
            <div className="mb-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : orderInfo ? (
            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <span className="text-sm text-gray-500">#{orderInfo.id.slice(-8)}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{orderInfo.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">RWF {orderInfo.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">{orderInfo.estimated_delivery_time}</span>
                </div>
              </div>
              
              <Alert className="bg-green-50 border-green-200 mt-4">
                <Package className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {getStatusMessage(orderInfo.unified_status)}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Alert className="bg-blue-50 border-blue-200 mb-6">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Your order has been placed successfully and will appear on our driver dashboard shortly.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Button size="lg" asChild>
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/account/orders">
                View Your Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
