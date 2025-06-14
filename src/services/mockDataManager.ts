import type { DriverOrder } from '@/hooks/useDriverOrders';
import { mockAvailableOrders, mockActiveOrders, mockCompletedOrders } from '@/data/mockDriverOrders';
import { RouteService } from './routeService';

class MockDataManager {
  private availableOrders: DriverOrder[] = [];
  private activeOrders: DriverOrder[] = [];
  private completedOrders: DriverOrder[] = [];
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      this.availableOrders = [...mockAvailableOrders];
      this.activeOrders = [...mockActiveOrders];
      this.completedOrders = [...mockCompletedOrders];
      
      // Calculate real routes for available orders
      await this.updateOrderRoutes();
      
      this.initialized = true;
    }
  }

  private async updateOrderRoutes() {
    console.log('MockDataManager: Updating routes for mock orders...');
    
    // Update available orders with real route calculations
    for (let i = 0; i < this.availableOrders.length; i++) {
      const order = this.availableOrders[i];
      try {
        const routeResult = await RouteService.calculateDeliveryRoute(order.delivery_address);
        
        if (routeResult && routeResult.success) {
          this.availableOrders[i] = {
            ...order,
            distance: routeResult.distance,
            estimated_delivery_time: routeResult.estimatedTime
          };
          console.log(`Updated route for order ${order.id}:`, {
            distance: routeResult.distance,
            time: routeResult.estimatedTime
          });
        }
      } catch (error) {
        console.warn(`Failed to calculate route for order ${order.id}:`, error);
        // Keep the original hardcoded values as fallback
      }
    }

    // Update active orders with real route calculations
    for (let i = 0; i < this.activeOrders.length; i++) {
      const order = this.activeOrders[i];
      try {
        const routeResult = await RouteService.calculateDeliveryRoute(order.delivery_address);
        
        if (routeResult && routeResult.success) {
          this.activeOrders[i] = {
            ...order,
            distance: routeResult.distance,
            estimated_delivery_time: routeResult.estimatedTime
          };
        }
      } catch (error) {
        console.warn(`Failed to calculate route for active order ${order.id}:`, error);
      }
    }
  }

  async getAvailableOrders(): Promise<DriverOrder[]> {
    await this.initialize();
    return [...this.availableOrders];
  }

  async getActiveOrders(): Promise<DriverOrder[]> {
    await this.initialize();
    return [...this.activeOrders, ...this.completedOrders];
  }

  async acceptOrder(orderId: string): Promise<boolean> {
    await this.initialize();
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

  async updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
    await this.initialize();
    
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

  async refuseOrder(orderId: string): Promise<boolean> {
    await this.initialize();
    const orderIndex = this.availableOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      // For demo purposes, just remove the order
      this.availableOrders.splice(orderIndex, 1);
      console.log(`Mock order ${orderId} refused and removed`);
      return true;
    }
    
    return false;
  }

  // Reset to initial state and recalculate routes
  async reset() {
    this.availableOrders = [...mockAvailableOrders];
    this.activeOrders = [...mockActiveOrders];
    this.completedOrders = [...mockCompletedOrders];
    await this.updateOrderRoutes();
    console.log('Mock data manager reset to initial state with updated routes');
  }

  // Manually refresh routes for all orders
  async refreshRoutes() {
    console.log('MockDataManager: Refreshing all order routes...');
    await this.updateOrderRoutes();
  }
}

// Export a singleton instance
export const mockDataManager = new MockDataManager();
