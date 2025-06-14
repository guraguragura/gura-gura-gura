
import { supabase } from '@/integrations/supabase/client';

interface RouteCalculationRequest {
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoords?: [number, number];
  deliveryCoords?: [number, number];
}

interface RouteResult {
  distance: string;
  estimatedTime: string;
  distanceMeters: number;
  durationSeconds: number;
  success: boolean;
  error?: string;
}

// Default pickup location (you can configure this for your business)
const DEFAULT_PICKUP_LOCATION = {
  address: "KN 3 Ave, Kigali City Market, Nyarugenge", // Example warehouse/store location
  coords: [30.0588, -1.9441] as [number, number] // Kigali coordinates [lng, lat]
};

export class RouteService {
  static async calculateDeliveryRoute(
    deliveryAddress: string, 
    pickupAddress?: string,
    pickupCoords?: [number, number]
  ): Promise<RouteResult | null> {
    try {
      const request: RouteCalculationRequest = {
        pickupAddress: pickupAddress || DEFAULT_PICKUP_LOCATION.address,
        deliveryAddress,
        pickupCoords: pickupCoords || DEFAULT_PICKUP_LOCATION.coords
      };

      console.log('RouteService: Calculating route for delivery:', request);

      const { data, error } = await supabase.functions.invoke('calculate-route', {
        body: request
      });

      if (error) {
        console.error('RouteService: Function error:', error);
        return null;
      }

      return data as RouteResult;
    } catch (error) {
      console.error('RouteService: Error calculating route:', error);
      return null;
    }
  }

  static async calculateDriverRoute(
    driverCoords: [number, number],
    deliveryAddress: string
  ): Promise<RouteResult | null> {
    try {
      const request: RouteCalculationRequest = {
        pickupAddress: "Driver Current Location",
        deliveryAddress,
        pickupCoords: driverCoords
      };

      console.log('RouteService: Calculating driver route:', request);

      const { data, error } = await supabase.functions.invoke('calculate-route', {
        body: request
      });

      if (error) {
        console.error('RouteService: Function error:', error);
        return null;
      }

      return data as RouteResult;
    } catch (error) {
      console.error('RouteService: Error calculating driver route:', error);
      return null;
    }
  }

  // Update order metadata with calculated route information
  static async updateOrderRouteData(
    orderId: string, 
    routeResult: RouteResult
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('order')
        .update({
          metadata: {
            distance: routeResult.distance,
            estimated_delivery_time: routeResult.estimatedTime,
            distance_meters: routeResult.distanceMeters,
            duration_seconds: routeResult.durationSeconds,
            route_calculated_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('RouteService: Error updating order route data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('RouteService: Error updating order:', error);
      return false;
    }
  }
}
