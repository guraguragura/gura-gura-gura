
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Clock, Shield } from 'lucide-react';

interface DeliveryConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string, notes?: string) => Promise<void>;
  customerName: string;
  deliveryAddress: string;
}

export const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  deliveryAddress
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 2 || !/^\d{2}$/.test(verificationCode)) {
      setError('Verification code must be exactly 2 digits');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onConfirm(verificationCode, notes.trim() || undefined);
      onClose();
      setVerificationCode('');
      setNotes('');
    } catch (err) {
      setError('Invalid verification code. Please check with the customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setVerificationCode('');
      setNotes('');
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Confirm Delivery
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">{customerName}</p>
                <p className="text-sm text-blue-700">{deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">
              Customer Verification Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                setVerificationCode(value);
                setError('');
              }}
              placeholder="Enter 2-digit code"
              className="text-center text-lg font-mono"
              maxLength={2}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Ask the customer for their 2-digit delivery verification code
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery-notes">
              Delivery Notes (Optional)
            </Label>
            <Textarea
              id="delivery-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the delivery..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !verificationCode.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Delivery'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
