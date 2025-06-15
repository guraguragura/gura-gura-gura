
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { OrderChatModal } from './OrderChatModal';
import { useOrderMessages } from '@/hooks/useOrderMessages';

interface ChatWithDriverButtonProps {
  orderId: string;
  driverName?: string;
  orderStatus?: string;
  isDriverAssigned: boolean;
}

export const ChatWithDriverButton: React.FC<ChatWithDriverButtonProps> = ({
  orderId,
  driverName,
  orderStatus,
  isDriverAssigned
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { unreadCount } = useOrderMessages(orderId);

  // Only show chat button when driver is assigned or order is in delivery
  if (!isDriverAssigned || !['assigned_to_driver', 'picked_up', 'out_for_delivery'].includes(orderStatus || '')) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setIsChatOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Chat with Driver
        </Button>
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </div>

      <OrderChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        orderId={orderId}
        driverName={driverName}
      />
    </>
  );
};
