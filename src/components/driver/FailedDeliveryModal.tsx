
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Camera, Calendar, Clock } from 'lucide-react';
import { useDeliveryAttempts } from '@/hooks/useDeliveryAttempts';

interface FailedDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  deliveryAddress: string;
}

export const FailedDeliveryModal: React.FC<FailedDeliveryModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName,
  deliveryAddress
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [enableReschedule, setEnableReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const { failureReasons, submitting, reportFailedDelivery } = useDeliveryAttempts(orderId);

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }

    let photoUrl: string | undefined;
    
    // Handle photo upload if present (simplified for now)
    if (photoFile) {
      // In a real implementation, you would upload to Supabase Storage here
      console.log('Photo file selected:', photoFile.name);
      // photoUrl = await uploadPhotoToStorage(photoFile);
    }

    // Combine date and time for rescheduling
    let rescheduleDateTime: string | undefined;
    if (enableReschedule && rescheduleDate && rescheduleTime) {
      rescheduleDateTime = `${rescheduleDate}T${rescheduleTime}:00`;
    }

    const result = await reportFailedDelivery(
      selectedReason,
      notes,
      photoUrl,
      rescheduleDateTime
    );

    if (result.success) {
      // Reset form
      setSelectedReason('');
      setNotes('');
      setPhotoFile(null);
      setEnableReschedule(false);
      setRescheduleDate('');
      setRescheduleTime('');
      onClose();
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  // Get tomorrow's date as minimum for rescheduling
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Report Failed Delivery</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Customer:</strong> {customerName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> {deliveryAddress}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Failed Delivery *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {failureReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide additional details about the failed delivery attempt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo Evidence (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {photoFile ? photoFile.name : 'Take Photo'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="reschedule"
                checked={enableReschedule}
                onCheckedChange={setEnableReschedule}
              />
              <Label htmlFor="reschedule">Reschedule for later delivery</Label>
            </div>

            {enableReschedule && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="reschedule-date">Date</Label>
                  <div className="relative">
                    <Input
                      id="reschedule-date"
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      min={getTomorrowDate()}
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reschedule-time">Time</Label>
                  <div className="relative">
                    <Input
                      id="reschedule-time"
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                    />
                    <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedReason || submitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Reporting...' : enableReschedule ? 'Reschedule' : 'Report Failed'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
