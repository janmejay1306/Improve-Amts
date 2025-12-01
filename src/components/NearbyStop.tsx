import { useState, useEffect } from "react";
import { Navigation, ArrowLeft, MapPin, Loader2, Bus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { busStops } from "../data/mockData";
import type { BusStop } from "../data/mockData";

interface NearbyStopProps {
  onBack: () => void;
}

interface StopWithDistance extends BusStop {
  distance: number;
}

export function NearbyStop({ onBack }: NearbyStopProps) {
  const [loading, setLoading] = useState(false);
  const [nearbyStops, setNearbyStops] = useState<StopWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string>("");

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearbyStops = () => {
    setLoading(true);
    setError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Calculate distance for each stop
          const stopsWithDistance = busStops
            .map((stop) => ({
              ...stop,
              distance: calculateDistance(latitude, longitude, stop.latitude, stop.longitude),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10); // Get top 10 nearest stops

          setNearbyStops(stopsWithDistance);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            setError("Location permission denied. Please enable location access.");
          } else {
            setError("Unable to get your location. Please try again.");
          }
          
          // Fallback: Show stops with mock location (center of Ahmedabad)
          const mockLat = 23.0225;
          const mockLon = 72.5714;
          const stopsWithDistance = busStops
            .map((stop) => ({
              ...stop,
              distance: calculateDistance(mockLat, mockLon, stop.latitude, stop.longitude),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);
          
          setNearbyStops(stopsWithDistance);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by your browser.");
      
      // Fallback with mock location
      const mockLat = 23.0225;
      const mockLon = 72.5714;
      const stopsWithDistance = busStops
        .map((stop) => ({
          ...stop,
          distance: calculateDistance(mockLat, mockLon, stop.latitude, stop.longitude),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
      
      setNearbyStops(stopsWithDistance);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E3]">
      {/* Header */}
      <div className="bg-[#FBE106] text-red-600 px-6 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-red-600 hover:bg-yellow-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Navigation className="w-6 h-6" />
          <h2 className="text-red-600">Nearby Stops</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Find Location Button */}
        {nearbyStops.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md text-center space-y-4">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Navigation className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-gray-800 mb-2">Find Nearby Bus Stops</h3>
              <p className="text-gray-600 text-sm">
                Allow location access to find bus stops near you
              </p>
            </div>
            <Button
              onClick={findNearbyStops}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Find Nearby Stops
                </>
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Nearby Stops List */}
        {nearbyStops.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800">Nearby Stops ({nearbyStops.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={findNearbyStops}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                {error} Showing approximate results.
              </div>
            )}

            {nearbyStops.map((stop, index) => (
              <div
                key={stop.id}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg mt-1">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-gray-800">{stop.name}</h4>
                      <p className="text-sm text-gray-500">{stop.code}</p>
                      <p className="text-sm text-gray-600 mt-1">{stop.location}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {stop.distance < 1
                      ? `${Math.round(stop.distance * 1000)}m`
                      : `${stop.distance.toFixed(1)}km`}
                  </Badge>
                </div>

                {/* Routes */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Available Routes</p>
                  <div className="flex flex-wrap gap-2">
                    {stop.routes.map((route) => (
                      <Badge
                        key={route}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Bus className="w-3 h-3 mr-1" />
                        {route}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                {stop.facilities.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {stop.facilities.map((facility, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
