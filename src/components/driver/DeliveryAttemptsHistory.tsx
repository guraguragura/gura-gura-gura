
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Calendar, FileText } from 'lucide-react';
import { useDeliveryAttempts } from '@/hooks/useDeliveryAttempts';

interface DeliveryAttemptsHistoryProps {
  orderId: string;
}

export const DeliveryAttemptsHistory: React.FC<DeliveryAttemptsHistoryProps> = ({ orderId }) => {
  const { attempts, loading } = useDeliveryAttempts(orderId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading delivery attempts...</p>
        </CardContent>
      </Card>
    );
  }

  if (attempts.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'successful':
        return <Badge className="bg-green-100 text-green-800">Successful</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'rescheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'rescheduled':
        return <Calendar className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Attempts ({attempts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(attempt.status)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Attempt #{attempt.attempt_number}</span>
                    {getStatusBadge(attempt.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(attempt.attempted_at).toLocaleString()}
                  </span>
                </div>
                
                {attempt.failed_reason && (
                  <p className="text-sm text-gray-700">
                    <strong>Reason:</strong> {attempt.failed_reason.description}
                  </p>
                )}
                
                {attempt.notes && (
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {attempt.notes}
                  </p>
                )}
                
                {attempt.rescheduled_for && (
                  <p className="text-sm text-gray-600">
                    <strong>Rescheduled for:</strong> {new Date(attempt.rescheduled_for).toLocaleString()}
                  </p>
                )}
                
                {attempt.photo_evidence_url && (
                  <div className="text-sm text-gray-600">
                    <strong>Photo Evidence:</strong>{' '}
                    <a 
                      href={attempt.photo_evidence_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Photo
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
