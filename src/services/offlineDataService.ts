
import { DataService } from './dataService';
import { offlineStorage, type OfflineAction } from './offlineStorage';
import type { DriverOrder, UnifiedOrderStatus } from '@/hooks/useDriverOrders';

interface OfflineDataServiceConfig {
  useMockData: boolean;
  driverProfile: any;
  isOnline: boolean;
}

export class OfflineDataService extends DataService {
  private isOnline: boolean;

  constructor(config: OfflineDataServiceConfig) {
    super({ useMockData: config.useMockData, driverProfile: config.driverProfile });
    this.isOnline = config.isOnline;
  }

  async fetchAvailableOrders(): Promise<DriverOrder[]> {
    if (this.isOnline) {
      try {
        const orders = await super.fetchAvailableOrders();
        // Cache the fresh data
        await offlineStorage.cacheOrders(orders, 'available');
        offlineStorage.setLastSyncTime();
        return orders;
      } catch (error) {
        console.warn('Failed to fetch fresh orders, falling back to cache:', error);
        const cached = await offlineStorage.getCachedOrders('available');
        if (cached) return cached;
        throw error;
      }
    } else {
      // Offline mode - return cached data
      const cached = await offlineStorage.getCachedOrders('available');
      if (cached) {
        console.log('Returning cached available orders (offline mode)');
        return cached;
      }
      throw new Error('No cached data available for offline mode');
    }
  }

  async fetchActiveOrders(): Promise<DriverOrder[]> {
    if (this.isOnline) {
      try {
        const orders = await super.fetchActiveOrders();
        // Cache the fresh data
        await offlineStorage.cacheOrders(orders, 'active');
        offlineStorage.setLastSyncTime();
        return orders;
      } catch (error) {
        console.warn('Failed to fetch fresh orders, falling back to cache:', error);
        const cached = await offlineStorage.getCachedOrders('active');
        if (cached) return cached;
        throw error;
      }
    } else {
      // Offline mode - return cached data
      const cached = await offlineStorage.getCachedOrders('active');
      if (cached) {
        console.log('Returning cached active orders (offline mode)');
        return cached;
      }
      throw new Error('No cached data available for offline mode');
    }
  }

  async acceptOrder(orderId: string): Promise<void> {
    if (this.isOnline) {
      try {
        await super.acceptOrder(orderId);
        console.log('Order accepted online');
      } catch (error) {
        console.warn('Failed to accept order online, queuing for later:', error);
        await offlineStorage.queueAction({
          type: 'accept_order',
          orderId,
          payload: {}
        });
        throw error;
      }
    } else {
      // Queue the action for when we're back online
      await offlineStorage.queueAction({
        type: 'accept_order',
        orderId,
        payload: {}
      });
      console.log('Order acceptance queued for sync');
    }
  }

  async refuseOrder(orderId: string, reason: string): Promise<void> {
    if (this.isOnline) {
      try {
        await super.refuseOrder(orderId, reason);
        console.log('Order refused online');
      } catch (error) {
        console.warn('Failed to refuse order online, queuing for later:', error);
        await offlineStorage.queueAction({
          type: 'refuse_order',
          orderId,
          payload: { reason }
        });
        throw error;
      }
    } else {
      // Queue the action for when we're back online
      await offlineStorage.queueAction({
        type: 'refuse_order',
        orderId,
        payload: { reason }
      });
      console.log('Order refusal queued for sync');
    }
  }

  async updateOrderStatus(orderId: string, newStatus: UnifiedOrderStatus): Promise<void> {
    if (this.isOnline) {
      try {
        await super.updateOrderStatus(orderId, newStatus);
        console.log('Order status updated online');
      } catch (error) {
        console.warn('Failed to update order status online, queuing for later:', error);
        await offlineStorage.queueAction({
          type: 'update_status',
          orderId,
          payload: { newStatus }
        });
        throw error;
      }
    } else {
      // Queue the action for when we're back online
      await offlineStorage.queueAction({
        type: 'update_status',
        orderId,
        payload: { newStatus }
      });
      console.log('Order status update queued for sync');
    }
  }

  // Sync queued actions when back online
  async syncQueuedActions(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline) {
      console.log('Cannot sync - still offline');
      return { success: 0, failed: 0 };
    }

    const queue = await offlineStorage.getActionQueue();
    let successCount = 0;
    let failedCount = 0;

    console.log(`Syncing ${queue.length} queued actions...`);

    for (const action of queue) {
      try {
        await this.executeQueuedAction(action);
        await offlineStorage.removeActionFromQueue(action.id);
        successCount++;
        console.log(`Successfully synced action: ${action.type} for order ${action.orderId}`);
      } catch (error) {
        await offlineStorage.incrementRetryCount(action.id);
        failedCount++;
        console.error(`Failed to sync action: ${action.type} for order ${action.orderId}`, error);
      }
    }

    if (successCount > 0) {
      offlineStorage.setLastSyncTime();
    }

    return { success: successCount, failed: failedCount };
  }

  private async executeQueuedAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'accept_order':
        await super.acceptOrder(action.orderId);
        break;
      case 'refuse_order':
        await super.refuseOrder(action.orderId, action.payload.reason);
        break;
      case 'update_status':
        await super.updateOrderStatus(action.orderId, action.payload.newStatus);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }
}
