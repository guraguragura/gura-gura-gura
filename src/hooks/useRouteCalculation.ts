
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RouteResult {
  distance: string;
  estimatedTime: string;
  distanceMeters: number;
  durationSeconds: number;
  success: boolean;
  error?: string;
}

interface RouteRequest {
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoords?: [number, number];
  deliveryCoords?: [number, number];
}

export const useRouteCalculation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (request: RouteRequest): Promise<RouteResult | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calculating route:', request);

      const { data, error: functionError } = await supabase.functions.invoke('calculate-route', {
        body: request
      });

      if (functionError) {
        console.error('Function error:', functionError);
        setError(functionError.message);
        return null;
      }

      console.log('Route calculation result:', data);
      return data as RouteResult;

    } catch (err) {
      console.error('Route calculation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate route';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateRoute,
    loading,
    error
  };
};
