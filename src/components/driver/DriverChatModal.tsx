
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, User, Truck } from 'lucide-react';
import { useOrderMessages, OrderMessage } from '@/hooks/useOrderMessages';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface DriverChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName
}) => {
  const [messageText, setMessageText] = useState('');
  const { messages, loading, sending, sendMessage, markAsRead, unreadCount } = useOrderMessages(orderId);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when modal opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const unreadMessageIds = messages
        .filter(msg => !msg.is_read && msg.sender_id !== user?.id)
        .map(msg => msg.id);
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [isOpen, messages, unreadCount, user?.id, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    await sendMessage(messageText);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: OrderMessage) => {
    const isOwnMessage = message.sender_id === user?.id;
    const isSystemMessage = message.message_type === 'system';

    if (isSystemMessage) {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {message.message}
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-center gap-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              {isOwnMessage ? (
                <Truck className="h-4 w-4 text-green-500" />
              ) : (
                <User className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-xs text-gray-500">
                {isOwnMessage ? 'You' : customerName}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className={`
            p-3 rounded-lg text-sm
            ${isOwnMessage 
              ? 'bg-green-500 text-white rounded-br-sm' 
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }
          `}>
            {message.message}
          </div>
        </div>
      </div>
    );
  };

  const quickMessages = [
    "I'm on my way to pick up your order",
    "I've picked up your order and heading to you",
    "I'm 5 minutes away",
    "I'm at your location",
    "Order delivered successfully!"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat with {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation with the customer</p>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick message buttons */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {quickMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setMessageText(msg)}
                  disabled={sending}
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>

          {/* Message input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={sending}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
