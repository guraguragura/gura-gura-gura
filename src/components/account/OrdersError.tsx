
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface OrdersErrorProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const OrdersError: React.FC<OrdersErrorProps> = ({ 
  message, 
  onRetry, 
  isRetrying = false 
}) => {
  return (
    <div className="border rounded-lg p-6 text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unable to Load Orders
      </h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <Button 
        onClick={onRetry} 
        disabled={isRetrying}
        className="gap-2"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </>
        )}
      </Button>
    </div>
  );
};
