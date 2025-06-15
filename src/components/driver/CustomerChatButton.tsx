
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { useOrderMessages } from '@/hooks/useOrderMessages';

interface CustomerChatButtonProps {
  orderId: string;
  customerName: string;
  onOpenChat: () => void;
}

export const CustomerChatButton: React.FC<CustomerChatButtonProps> = ({
  orderId,
  customerName,
  onOpenChat
}) => {
  const { unreadCount } = useOrderMessages(orderId);

  return (
    <div className="relative">
      <Button
        onClick={onOpenChat}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat with Customer
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
  );
};
