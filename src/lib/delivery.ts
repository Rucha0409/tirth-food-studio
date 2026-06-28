/**
 * Delivery Charge Calculator for तीर्थ – The Food Studio
 * 
 * Base address: Tarangan Residency, Dhayari, Pune 411041
 * Within 7 km: ₹20 delivery charge
 * Beyond 7 km: ₹50 delivery charge
 */

// Tarangan Residency, Dhayari, Pune coordinates
const STORE_LAT = 18.4505;
const STORE_LNG = 73.8085;

/**
 * Calculate distance between two coordinates using the Haversine formula
 * Returns distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Get delivery charge based on distance from Tarangan Residency, Dhayari
 * @param customerLat Customer's latitude
 * @param customerLng Customer's longitude
 * @returns { charge: number, distanceKm: number, zone: string }
 */
export function getDeliveryCharge(customerLat: number, customerLng: number): {
  charge: number;
  distanceKm: number;
  zone: string;
} {
  const distanceKm = haversineDistance(
    STORE_LAT,
    STORE_LNG,
    customerLat,
    customerLng
  );
  const rounded = Math.round(distanceKm * 10) / 10;

  if (rounded <= 7) {
    return { charge: 20, distanceKm: rounded, zone: '0 to 7 km' };
  } else if (rounded <= 10) {
    return { charge: 50, distanceKm: rounded, zone: '7 to 10 km' };
  } else {
    return { charge: 100, distanceKm: rounded, zone: 'Beyond 10 km' };
  }
}

/**
 * Geocode an address string using the browser's Geocoding API via Nominatim (free)
 * Falls back to a fixed default if geocoding fails
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(address + ', Pune, Maharashtra, India');
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'TirthFoodStudio/1.0',
        },
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get the store's base coordinates for displaying on a map
 */
export function getStoreCoordinates() {
  return { lat: STORE_LAT, lng: STORE_LNG };
}

/**
 * Default delivery charge when geolocation is not available
 * (uses distance-based fallback: assume within 7 km)
 */
export const DEFAULT_DELIVERY_CHARGE = 20;
export const MID_DELIVERY_CHARGE = 50;
export const MAX_DELIVERY_CHARGE = 100;
export const DELIVERY_THRESHOLD_KM = 7;
export const DELIVERY_MAX_THRESHOLD_KM = 10;
