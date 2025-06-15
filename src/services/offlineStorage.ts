
import type { DriverOrder } from '@/hooks/useDriverOrders';

export interface OfflineAction {
  id: string;
  type: 'accept_order' | 'refuse_order' | 'update_status';
  orderId: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

export interface CachedOrderData {
  orders: DriverOrder[];
  timestamp: number;
  type: 'available' | 'active';
}

class OfflineStorageService {
  private readonly CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_RETRY_COUNT = 3;

  // Cache management
  async cacheOrders(orders: DriverOrder[], type: 'available' | 'active'): Promise<void> {
    const cacheData: CachedOrderData = {
      orders,
      timestamp: Date.now(),
      type
    };
    
    localStorage.setItem(`driver_orders_${type}`, JSON.stringify(cacheData));
  }

  async getCachedOrders(type: 'available' | 'active'): Promise<DriverOrder[] | null> {
    try {
      const cached = localStorage.getItem(`driver_orders_${type}`);
      if (!cached) return null;

      const cacheData: CachedOrderData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > this.CACHE_EXPIRY) {
        localStorage.removeItem(`driver_orders_${type}`);
        return null;
      }

      return cacheData.orders;
    } catch (error) {
      console.error('Error reading cached orders:', error);
      return null;
    }
  }

  // Offline action queue
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const offlineAction: OfflineAction = {
      ...action,
      id: `${action.type}_${action.orderId}_${Date.now()}`,
      timestamp: Date.now(),
      retryCount: 0
    };

    const queue = await this.getActionQueue();
    queue.push(offlineAction);
    localStorage.setItem('offline_action_queue', JSON.stringify(queue));
  }

  async getActionQueue(): Promise<OfflineAction[]> {
    try {
      const queue = localStorage.getItem('offline_action_queue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error reading action queue:', error);
      return [];
    }
  }

  async removeActionFromQueue(actionId: string): Promise<void> {
    const queue = await this.getActionQueue();
    const filteredQueue = queue.filter(action => action.id !== actionId);
    localStorage.setItem('offline_action_queue', JSON.stringify(filteredQueue));
  }

  async incrementRetryCount(actionId: string): Promise<void> {
    const queue = await this.getActionQueue();
    const updatedQueue = queue.map(action => 
      action.id === actionId 
        ? { ...action, retryCount: action.retryCount + 1 }
        : action
    );
    localStorage.setItem('offline_action_queue', JSON.stringify(updatedQueue));
  }

  async getFailedActions(): Promise<OfflineAction[]> {
    const queue = await this.getActionQueue();
    return queue.filter(action => action.retryCount >= this.MAX_RETRY_COUNT);
  }

  async clearCache(): Promise<void> {
    localStorage.removeItem('driver_orders_available');
    localStorage.removeItem('driver_orders_active');
    localStorage.removeItem('offline_action_queue');
  }

  // Network status
  setLastSyncTime(): void {
    localStorage.setItem('last_sync_time', Date.now().toString());
  }

  getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem('last_sync_time');
    return lastSync ? new Date(parseInt(lastSync)) : null;
  }
}

export const offlineStorage = new OfflineStorageService();
