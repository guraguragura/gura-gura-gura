
import React from 'react';
import { Check, Clock, Package, Truck, MapPin, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetailedOrderTimelineProps {
  unifiedStatus?: string;
  timestamps?: {
    paid_at?: string;
    assigned_at?: string;
    picked_up_at?: string;
    delivered_at?: string;
  };
  verificationCode?: string;
}

export const DetailedOrderTimeline: React.FC<DetailedOrderTimelineProps> = ({
  unifiedStatus,
  timestamps = {},
  verificationCode
}) => {
  const steps = [
    {
      key: 'paid',
      label: 'Order Confirmed',
      icon: Check,
      description: 'Payment received and order confirmed',
      timestamp: timestamps.paid_at
    },
    {
      key: 'assigned_to_driver',
      label: 'Driver Assigned',
      icon: Clock,
      description: 'A driver has been assigned to your order',
      timestamp: timestamps.assigned_at
    },
    {
      key: 'picked_up',
      label: 'Picked Up',
      icon: Package,
      description: 'Order collected from restaurant',
      timestamp: timestamps.picked_up_at
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: Truck,
      description: 'On the way to your location',
      extraInfo: verificationCode ? (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
            <Shield className="h-4 w-4" />
            Verification Code Required
          </div>
          <p className="text-xs text-blue-600">
            Your driver will ask for a verification code to confirm delivery.
          </p>
        </div>
      ) : undefined
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      description: 'Order delivered successfully',
      timestamp: timestamps.delivered_at
    }
  ];

  const getCurrentStepIndex = () => {
    if (!unifiedStatus) return -1;
    return steps.findIndex(step => step.key === unifiedStatus || 
      (unifiedStatus === 'ready_for_pickup' && step.key === 'paid') ||
      (unifiedStatus === 'processing' && step.key === 'paid'));
  };

  const currentStepIndex = getCurrentStepIndex();

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const IconComponent = step.icon;
            
            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0
                  ${isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                  ${isCurrent ? 'ring-2 ring-blue-200' : ''}
                `}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {step.timestamp && (
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(step.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {isCurrent && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className="h-1 bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  {step.extraInfo && isCurrent && step.extraInfo}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
