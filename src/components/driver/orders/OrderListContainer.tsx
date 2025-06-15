
import React from 'react';
import { OrderListSkeleton } from '../LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface OrderListContainerProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  title?: string;
  onRetry?: () => void;
}

export const OrderListContainer: React.FC<OrderListContainerProps> = ({
  loading,
  error,
  children,
  title,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
        <OrderListSkeleton />
      </div>
    );
  }

  if (error && onRetry) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load orders: {error.message}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-[#84D1D3] text-white rounded hover:bg-[#6bb6b9]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
        {children}
      </div>
    </ErrorBoundary>
  );
};
