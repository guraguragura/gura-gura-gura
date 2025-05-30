
import React from 'react';
import { useCartContext } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Card } from '@/components/ui/card';
import { useIsMobile } from "@/hooks/use-mobile";

const CartSummary = () => {
  const { subtotal, total } = useCartContext();
  const { formatPrice } = useCurrency();
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-sm sm:text-base">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-sm sm:text-base">Calculated at checkout</span>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mb-3" 
        size={isMobile ? "default" : "lg"} 
        asChild
      >
        <Link to="/checkout">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      
      {/* Only show this button on larger screens, we already have one below cart items on mobile */}
      <div className="hidden lg:block">
        <Button variant="outline" className="w-full" size="lg" asChild>
          <Link to="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default CartSummary;
