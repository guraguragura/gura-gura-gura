
import { useState, useEffect, useCallback } from 'react';
import { useOfflineDataService } from './useOfflineDataService';
import { useNetworkStatus } from './useNetworkStatus';
import { offlineStorage } from '@/services/offlineStorage';
import { useToast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const { dataService, isOnline } = useOfflineDataService();
  const { isOnline: networkOnline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState({ success: 0, failed: 0 });
  const [queuedActions, setQueuedActions] = useState(0);
  const { toast } = useToast();

  // Update queued actions count
  const updateQueuedActions = useCallback(async () => {
    const queue = await offlineStorage.getActionQueue();
    setQueuedActions(queue.length);
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (networkOnline && !isSyncing) {
      // Wait a bit to ensure stable connection
      timeoutId = setTimeout(async () => {
        await performSync();
      }, 2000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [networkOnline]);

  // Update queued actions count periodically
  useEffect(() => {
    updateQueuedActions();
    const interval = setInterval(updateQueuedActions, 5000);
    return () => clearInterval(interval);
  }, [updateQueuedActions]);

  const performSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await dataService.syncQueuedActions();
      setSyncStats(result);
      
      if (result.success > 0) {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${result.success} action${result.success > 1 ? 's' : ''}`,
        });
      }
      
      if (result.failed > 0) {
        toast({
          title: "Sync Partially Failed",
          description: `${result.failed} action${result.failed > 1 ? 's' : ''} failed to sync`,
          variant: "destructive",
        });
      }

      await updateQueuedActions();
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync offline actions",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, dataService, toast, updateQueuedActions]);

  const getLastSyncTime = useCallback(() => {
    return offlineStorage.getLastSyncTime();
  }, []);

  const clearOfflineData = useCallback(async () => {
    await offlineStorage.clearCache();
    await updateQueuedActions();
    toast({
      title: "Cache Cleared",
      description: "All offline data has been cleared",
    });
  }, [updateQueuedActions, toast]);

  return {
    isSyncing,
    syncStats,
    queuedActions,
    performSync,
    getLastSyncTime,
    clearOfflineData,
    isOnline: networkOnline
  };
};
