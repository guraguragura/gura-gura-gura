
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Car, CheckCircle, AlertCircle } from 'lucide-react';

interface VehicleSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupVehicle: () => void;
  completionPercentage: number;
  missingFields: string[];
  isFirstTimeUser: boolean;
}

const VehicleSetupModal = ({
  isOpen,
  onClose,
  onSetupVehicle,
  completionPercentage,
  missingFields,
  isFirstTimeUser
}: VehicleSetupModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#84D1D3] rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle>
                {isFirstTimeUser ? 'Welcome to Gura!' : 'Complete Your Vehicle Setup'}
              </DialogTitle>
              <DialogDescription>
                {isFirstTimeUser 
                  ? 'Let\'s set up your vehicle information to get you started.'
                  : 'Please complete your vehicle information to start accepting orders.'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>

          {missingFields.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                <AlertCircle className="h-4 w-4" />
                Missing Information
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                {missingFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {completionPercentage === 100 && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Vehicle setup complete!
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onSetupVehicle}
              className="flex-1 bg-[#84D1D3] hover:bg-[#6bb6b9]"
            >
              {isFirstTimeUser ? 'Set Up Vehicle' : 'Complete Setup'}
            </Button>
            {!isFirstTimeUser && (
              <Button variant="outline" onClick={onClose}>
                Later
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSetupModal;
