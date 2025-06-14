
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteRequest {
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoords?: [number, number]; // [lng, lat]
  deliveryCoords?: [number, number]; // [lng, lat]
}

interface RouteResponse {
  distance: string;
  estimatedTime: string;
  distanceMeters: number;
  durationSeconds: number;
  success: boolean;
  error?: string;
}

// Geocode address using Nominatim (OpenStreetMap)
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const encodedAddress = encodeURIComponent(`${address}, Rwanda`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=rw`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return [lon, lat]; // OSRM expects [longitude, latitude]
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Calculate route using OSRM
async function calculateRoute(pickup: [number, number], delivery: [number, number]): Promise<{ distance: number; duration: number } | null> {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${pickup[0]},${pickup[1]};${delivery[0]},${delivery[1]}?overview=false&steps=false`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance, // meters
        duration: route.duration  // seconds
      };
    }
    
    return null;
  } catch (error) {
    console.error('OSRM routing error:', error);
    return null;
  }
}

// Format distance for display
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Format time for display
function formatTime(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Fallback estimates based on Rwanda delivery zones
function getFallbackEstimate(address: string): { distance: string; estimatedTime: string } {
  const lowerAddress = address.toLowerCase();
  
  // Kigali city center - close
  if (lowerAddress.includes('nyarugenge') || lowerAddress.includes('muhima') || lowerAddress.includes('kimisagara')) {
    return { distance: '1.5 km', estimatedTime: '15-20 mins' };
  }
  
  // Gasabo district - medium distance
  if (lowerAddress.includes('gasabo') || lowerAddress.includes('kacyiru') || lowerAddress.includes('remera')) {
    return { distance: '2.5 km', estimatedTime: '20-25 mins' };
  }
  
  // Kicukiro district - medium distance
  if (lowerAddress.includes('kicukiro') || lowerAddress.includes('nyamirambo')) {
    return { distance: '3.0 km', estimatedTime: '25-30 mins' };
  }
  
  // Default fallback
  return { distance: '2.5 km', estimatedTime: '20-25 mins' };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pickupAddress, deliveryAddress, pickupCoords, deliveryCoords }: RouteRequest = await req.json();
    
    console.log('Route calculation request:', { pickupAddress, deliveryAddress });
    
    // Use provided coordinates or geocode addresses
    let pickup = pickupCoords;
    let delivery = deliveryCoords;
    
    if (!pickup) {
      pickup = await geocodeAddress(pickupAddress);
      if (!pickup) {
        console.warn('Failed to geocode pickup address:', pickupAddress);
        const fallback = getFallbackEstimate(deliveryAddress);
        return new Response(JSON.stringify({
          ...fallback,
          distanceMeters: 2500,
          durationSeconds: 1350,
          success: true,
          error: 'Used fallback estimate'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    if (!delivery) {
      delivery = await geocodeAddress(deliveryAddress);
      if (!delivery) {
        console.warn('Failed to geocode delivery address:', deliveryAddress);
        const fallback = getFallbackEstimate(deliveryAddress);
        return new Response(JSON.stringify({
          ...fallback,
          distanceMeters: 2500,
          durationSeconds: 1350,
          success: true,
          error: 'Used fallback estimate'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Calculate route using OSRM
    const route = await calculateRoute(pickup, delivery);
    
    if (!route) {
      console.warn('OSRM route calculation failed, using fallback');
      const fallback = getFallbackEstimate(deliveryAddress);
      return new Response(JSON.stringify({
        ...fallback,
        distanceMeters: 2500,
        durationSeconds: 1350,
        success: true,
        error: 'Used fallback estimate'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Add buffer time for delivery (5-10 minutes for finding location, handover, etc.)
    const bufferTime = 300; // 5 minutes in seconds
    const totalDuration = route.duration + bufferTime;
    
    const result: RouteResponse = {
      distance: formatDistance(route.distance),
      estimatedTime: formatTime(totalDuration),
      distanceMeters: route.distance,
      durationSeconds: totalDuration,
      success: true
    };
    
    console.log('Route calculation result:', result);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in calculate-route function:', error);
    
    // Return fallback estimate on error
    const fallback = getFallbackEstimate('default');
    return new Response(JSON.stringify({
      ...fallback,
      distanceMeters: 2500,
      durationSeconds: 1350,
      success: false,
      error: error.message
    }), {
      status: 200, // Return 200 to provide fallback data
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
