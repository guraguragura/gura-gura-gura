
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { RealTimeOrderStatus } from '@/components/order-tracking/RealTimeOrderStatus';
import { useAllOrdersRealtime } from '@/hooks/useAllOrdersRealtime';
import { useOrders } from '@/hooks/useOrders';
import { OrdersSkeleton } from './OrdersSkeleton';
import { OrdersError } from './OrdersError';
import { RatingIndicator } from './RatingIndicator';
import { useAuth } from '@/contexts/AuthContext';

// Define the possible order statuses
export type OrderStatus = 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'canceled';

// Define the order interface
interface Order {
  id: string;
  display_id: number;
  status: OrderStatus;
  date: string;
  total: number;
  thumbnail?: string; // Optional thumbnail image
  unified_status?: string; // Optional unified status
}

// Status configuration with icons and colors
const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { 
    icon: <Clock className="h-5 w-5" />, 
    color: 'text-yellow-500', 
    label: 'Pending' 
  },
  processing: { 
    icon: <Package className="h-5 w-5" />, 
    color: 'text-blue-500', 
    label: 'Processing' 
  },
  out_for_delivery: { 
    icon: <Truck className="h-5 w-5" />, 
    color: 'text-indigo-500', 
    label: 'Out for Delivery' 
  },
  delivered: { 
    icon: <CheckCircle className="h-5 w-5" />, 
    color: 'text-green-500', 
    label: 'Delivered' 
  },
  canceled: { 
    icon: <XCircle className="h-5 w-5" />, 
    color: 'text-red-500', 
    label: 'Canceled' 
  }
};

// Mock orders data for development
const mockOrders: Order[] = [
  {
    id: 'ord_1234',
    display_id: 1234,
    status: 'pending',
    date: '2023-11-01',
    total: 124.99,
    thumbnail: '/lovable-uploads/4bed48db-95ec-4822-b3dd-a6c0d4c214ba.png',
    unified_status: 'assigned_to_driver'
  },
  {
    id: 'ord_2345',
    display_id: 2345,
    status: 'processing',
    date: '2023-10-27',
    total: 79.95,
    thumbnail: '/lovable-uploads/189d5b38-0cf3-4a56-9606-2caba74233ca.png',
    unified_status: 'picked_up'
  },
  {
    id: 'ord_3456',
    display_id: 3456,
    status: 'out_for_delivery',
    date: '2023-10-20',
    total: 249.50,
    thumbnail: '/lovable-uploads/2b4f1e1c-8388-4e0a-a05c-1efa3ecbb777.png',
    unified_status: 'out_for_delivery'
  },
  {
    id: 'ord_4567',
    display_id: 4567,
    status: 'delivered',
    date: '2023-10-15',
    total: 54.99,
    thumbnail: '/lovable-uploads/9f9f6f6c-f423-47c6-8964-326b064c2fd8.png',
    unified_status: 'delivered'
  },
  {
    id: 'ord_5678',
    display_id: 5678,
    status: 'canceled',
    date: '2023-10-10',
    total: 199.99,
    thumbnail: '/lovable-uploads/5bc8b271-aa7d-4103-8681-58b3e69bf415.png',
    unified_status: 'cancelled'
  }
];

export const Orders = () => {
  const { user } = useAuth();
  const { orders, loading, error, retryFetch, refetch } = useOrders();
  const { formatPrice, isLoading: currencyLoading } = useCurrency();
  const [isRetrying, setIsRetrying] = useState(false);

  // Set up real-time updates for all orders
  useAllOrdersRealtime(user?.id, () => {
    console.log('Orders updated, refreshing from database');
    refetch();
  });

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryFetch();
    setIsRetrying(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-gray-500 mt-1">View and track your orders</p>
        </div>
        <OrdersSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-gray-500 mt-1">View and track your orders</p>
        </div>
        <OrdersError 
          message={error}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-gray-500 mt-1">View and track your orders</p>
        </div>
        
        <div className="border rounded-lg p-6 text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-gray-500 mt-1">View and track your orders</p>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.display_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.thumbnail && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={order.thumbnail} 
                          alt={`Order #${order.display_id} thumbnail`} 
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RealTimeOrderStatus 
                      orderId={order.id}
                      initialStatus={order.status}
                      initialUnifiedStatus={order.unified_status}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {currencyLoading ? '...' : formatPrice(order.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RatingIndicator
                      isDelivered={order.status === 'delivered'}
                      hasDriver={!!(order as any).driver_id}
                      hasRating={(order as any).has_rating}
                      onRateClick={() => window.location.href = `/account/orders/${order.id}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/account/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
