
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, Wifi, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export const OfflineIndicator: React.FC = () => {
  const { 
    isOnline, 
    isSyncing, 
    queuedActions, 
    performSync, 
    getLastSyncTime,
    syncStats
  } = useOfflineSync();

  const lastSync = getLastSyncTime();

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                Offline
              </>
            )}
          </CardTitle>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "Connected" : "No Connection"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Sync Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Last sync: {formatLastSync(lastSync)}
            </div>
            {isOnline && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={performSync}
                disabled={isSyncing}
                className="h-8"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
            )}
          </div>

          {/* Queued Actions */}
          {queuedActions > 0 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                {queuedActions} action{queuedActions > 1 ? 's' : ''} queued for sync
              </span>
            </div>
          )}

          {/* Sync Stats */}
          {(syncStats.success > 0 || syncStats.failed > 0) && (
            <div className="text-xs text-gray-500">
              Last sync: {syncStats.success} successful, {syncStats.failed} failed
            </div>
          )}

          {/* Offline Mode Message */}
          {!isOnline && (
            <div className="p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                You're working offline. Your actions will be synced when connection is restored.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
