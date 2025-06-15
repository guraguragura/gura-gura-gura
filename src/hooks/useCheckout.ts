
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { orderProcessingService, OrderCreationData } from '@/services/orderProcessingService';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  paymentMethod: string;
}

export function useCheckout() {
  const { items, total, clearCart } = useCartContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processCheckout = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data from form and cart
      const orderData: OrderCreationData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        itemsDescription: items.map(item => `${item.title} (x${item.quantity})`).join(', '),
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: total,
        urgency: 'normal',
        paymentMethod: formData.paymentMethod
      };

      console.log("Creating order with data:", orderData);

      // Create the order
      const orderResult = await orderProcessingService.createOrder(orderData);
      
      if (!orderResult.success || !orderResult.orderId) {
        throw new Error(orderResult.message);
      }

      // Simulate payment processing with 80% success rate
      const simulatePaymentSuccess = Math.random() < 0.8;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!simulatePaymentSuccess) {
        throw new Error("Payment processing failed. Please try again.");
      }

      // Process payment and update order status
      const paymentResult = await orderProcessingService.processPayment({
        orderId: orderResult.orderId,
        paymentSessionId: `pay_${Date.now()}`,
        paymentMethod: formData.paymentMethod,
        paymentAmount: total
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      // Store order ID for success page
      sessionStorage.setItem('lastOrderId', orderResult.orderId);
      
      // Clear cart and redirect to success page
      clearCart();
      toast.success("Order placed successfully!");
      navigate('/payment-success');
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("There was a problem processing your order. Please try again.");
      navigate('/payment-error');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCheckout,
    isProcessing
  };
}
