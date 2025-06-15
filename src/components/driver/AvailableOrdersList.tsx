import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Package, Clock, RefreshCw } from 'lucide-react';
import { OrderAcceptanceModal } from './order-acceptance/OrderAcceptanceModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { NoAvailableOrders } from './EmptyStates';
import { OrderListContainer } from './orders/OrderListContainer';
import { useToast } from '@/hooks/use-toast';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface AvailableOrdersListProps {
  orders: DriverOrder[];
  onAcceptOrder: (orderId: string) => Promise<void>;
  onRefuseOrder: (orderId: string) => Promise<void>;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const AvailableOrdersList = ({ 
  orders, 
  onAcceptOrder, 
  onRefuseOrder, 
  loading = false,
  onRefresh,
  refreshing = false
}: AvailableOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<DriverOrder | null>(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [showRefuseDialog, setShowRefuseDialog] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAcceptOrder = async (order: DriverOrder) => {
    setProcessingOrderId(order.id);
    try {
      await onAcceptOrder(order.id);
      setSelectedOrder(order);
      setShowAcceptanceModal(true);
      toast({
        title: "Order Accepted",
        description: `You've successfully accepted order #${order.id.slice(-6)}`,
      });
    } catch (error) {
      console.error('Failed to accept order:', error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleRefuseOrder = async () => {
    if (!selectedOrder) return;
    
    setProcessingOrderId(selectedOrder.id);
    try {
      await onRefuseOrder(selectedOrder.id);
      setShowRefuseDialog(false);
      setSelectedOrder(null);
      toast({
        title: "Order Refused",
        description: `Order #${selectedOrder.id.slice(-6)} has been refused`,
      });
    } catch (error) {
      console.error('Failed to refuse order:', error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleStartNavigation = () => {
    if (selectedOrder) {
      setShowAcceptanceModal(false);
      navigate(`/orders/${selectedOrder.id}`);
      toast({
        title: "Navigation Started",
        description: "Proceeding to order details for pickup instructions.",
      });
    }
  };

  const handleViewDetails = () => {
    if (selectedOrder) {
      setShowAcceptanceModal(false);
      navigate(`/orders/${selectedOrder.id}`);
    }
  };

  const handleContactCustomer = () => {
    if (selectedOrder) {
      toast({
        title: "Demo Mode",
        description: `In a real app, this would call ${selectedOrder.customer_phone}`,
      });
    }
  };

  const handleCloseModal = () => {
    setShowAcceptanceModal(false);
    setSelectedOrder(null);
  };

  const handleRefuseClick = (order: DriverOrder) => {
    setSelectedOrder(order);
    setShowRefuseDialog(true);
  };

  return (
    <OrderListContainer 
      loading={loading} 
      title={`New Orders Available (${orders.length})`}
      onRetry={onRefresh}
    >
      <div className="flex justify-between items-center mb-4">
        <div /> {/* Spacer for layout */}
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <NoAvailableOrders onRefresh={onRefresh} refreshing={refreshing} />
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
                      onClick={() => handleAcceptOrder(order)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Accepting...' : 'Accept Order'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRefuseClick(order)}
                      disabled={processingOrderId === order.id}
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

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderAcceptanceModal
            isOpen={showAcceptanceModal}
            onClose={() => setShowAcceptanceModal(false)}
            order={selectedOrder}
            onStartNavigation={() => navigate(`/orders/${selectedOrder.id}`)}
            onViewDetails={() => navigate(`/orders/${selectedOrder.id}`)}
            onContactCustomer={() => toast({
              title: "Demo Mode",
              description: `In a real app, this would call ${selectedOrder.customer_phone}`,
            })}
          />

          <ConfirmationDialog
            isOpen={showRefuseDialog}
            onClose={() => setShowRefuseDialog(false)}
            onConfirm={handleRefuseOrder}
            title="Refuse Order"
            description={`Are you sure you want to refuse order #${selectedOrder.id.slice(-6)}? This action cannot be undone.`}
            confirmText="Refuse Order"
            variant="destructive"
            loading={processingOrderId === selectedOrder.id}
          />
        </>
      )}
    </OrderListContainer>
  );
};

export default AvailableOrdersList;
