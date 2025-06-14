
import type { DriverOrder } from '@/hooks/useDriverOrders';
import { mockAvailableOrders, mockActiveOrders, mockCompletedOrders } from '@/data/mockDriverOrders';

class MockDataManager {
  private availableOrders: DriverOrder[] = [];
  private activeOrders: DriverOrder[] = [];
  private completedOrders: DriverOrder[] = [];
  private initialized = false;

  initialize() {
    if (!this.initialized) {
      this.availableOrders = [...mockAvailableOrders];
      this.activeOrders = [...mockActiveOrders];
      this.completedOrders = [...mockCompletedOrders];
      this.initialized = true;
    }
  }

  getAvailableOrders(): DriverOrder[] {
    this.initialize();
    return [...this.availableOrders];
  }

  getActiveOrders(): DriverOrder[] {
    this.initialize();
    return [...this.activeOrders, ...this.completedOrders];
  }

  acceptOrder(orderId: string): boolean {
    this.initialize();
    const orderIndex = this.availableOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = this.availableOrders[orderIndex];
      
      // Remove from available orders
      this.availableOrders.splice(orderIndex, 1);
      
      // Update status and add to active orders
      const updatedOrder: DriverOrder = {
        ...order,
        unified_status: 'assigned_to_driver'
      };
      
      this.activeOrders.push(updatedOrder);
      console.log(`Mock order ${orderId} accepted and moved to active orders`);
      return true;
    }
    
    return false;
  }

  updateOrderStatus(orderId: string, newStatus: string): boolean {
    this.initialize();
    
    // Find order in active orders
    const orderIndex = this.activeOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = this.activeOrders[orderIndex];
      
      // Update the status
      this.activeOrders[orderIndex] = {
        ...order,
        unified_status: newStatus
      };
      
      // If delivered, move to completed
      if (newStatus === 'delivered') {
        const completedOrder = this.activeOrders.splice(orderIndex, 1)[0];
        this.completedOrders.push(completedOrder);
      }
      
      console.log(`Mock order ${orderId} status updated to ${newStatus}`);
      return true;
    }
    
    // Also check completed orders
    const completedIndex = this.completedOrders.findIndex(order => order.id === orderId);
    if (completedIndex !== -1) {
      this.completedOrders[completedIndex] = {
        ...this.completedOrders[completedIndex],
        unified_status: newStatus
      };
      return true;
    }
    
    return false;
  }

  refuseOrder(orderId: string): boolean {
    this.initialize();
    const orderIndex = this.availableOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      // For demo purposes, just remove the order
      this.availableOrders.splice(orderIndex, 1);
      console.log(`Mock order ${orderId} refused and removed`);
      return true;
    }
    
    return false;
  }

  // Reset to initial state (useful for testing)
  reset() {
    this.availableOrders = [...mockAvailableOrders];
    this.activeOrders = [...mockActiveOrders];
    this.completedOrders = [...mockCompletedOrders];
    console.log('Mock data manager reset to initial state');
  }
}

// Export a singleton instance
export const mockDataManager = new MockDataManager();
