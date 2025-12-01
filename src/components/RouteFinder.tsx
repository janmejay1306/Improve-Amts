import { useState } from "react";
import { MapPin, ArrowRight, Clock, DollarSign, ArrowLeft, Navigation2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { busRoutes, busStops } from "../data/mockData";

interface RouteFinderProps {
  onBack: () => void;
}

export function RouteFinder({ onBack }: RouteFinderProps) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchResults, setSearchResults] = useState<typeof busRoutes>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    
    // Find routes that contain both locations
    const results = busRoutes.filter((route) => {
      const fromMatch = route.stops.some((stop) =>
        stop.toLowerCase().includes(fromLocation.toLowerCase())
      );
      const toMatch = route.stops.some((stop) =>
        stop.toLowerCase().includes(toLocation.toLowerCase())
      );
      
      // Check if from comes before to in the route
      if (fromMatch && toMatch) {
        const fromIndex = route.stops.findIndex((stop) =>
          stop.toLowerCase().includes(fromLocation.toLowerCase())
        );
        const toIndex = route.stops.findIndex((stop) =>
          stop.toLowerCase().includes(toLocation.toLowerCase())
        );
        return fromIndex < toIndex;
      }
      return false;
    });

    setSearchResults(results);
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
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
          <Navigation2 className="w-6 h-6" />
          <h2 className="text-red-600">Route Finder</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Search Form */}
        <div className="bg-white rounded-xl p-4 shadow-md space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">From</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <Input
                type="text"
                placeholder="Enter starting location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLocations}
              className="rounded-full"
            >
              <ArrowRight className="w-5 h-5 rotate-90" />
            </Button>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">To</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <Input
                type="text"
                placeholder="Enter destination"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={!fromLocation || !toLocation}
          >
            Find Routes
          </Button>
        </div>

        {/* Popular Locations */}
        {!hasSearched && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-gray-800 mb-3">Popular Locations</h3>
            <div className="grid grid-cols-2 gap-2">
              {busStops.slice(0, 6).map((stop) => (
                <Button
                  key={stop.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!fromLocation) {
                      setFromLocation(stop.name);
                    } else if (!toLocation) {
                      setToLocation(stop.name);
                    }
                  }}
                  className="justify-start text-sm"
                >
                  <MapPin className="w-3 h-3 mr-2" />
                  {stop.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-800">
                    Available Routes ({searchResults.length})
                  </h3>
                </div>

                {searchResults.map((route) => {
                  const fromIndex = route.stops.findIndex((stop) =>
                    stop.toLowerCase().includes(fromLocation.toLowerCase())
                  );
                  const toIndex = route.stops.findIndex((stop) =>
                    stop.toLowerCase().includes(toLocation.toLowerCase())
                  );
                  const stopsCount = toIndex - fromIndex;

                  return (
                    <div
                      key={route.id}
                      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="bg-red-600 text-white px-3 py-1 rounded-md">
                              Route {route.number}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{route.name}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-gray-800">{route.stops[fromIndex]}</span>
                        </div>
                        <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-8" />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-gray-800">{route.stops[toIndex]}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{stopsCount} stops</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{route.fare}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <Navigation2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No direct routes found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try different locations or check nearby stops
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
