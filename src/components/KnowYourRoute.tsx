import { useState } from "react";
import { Route, ArrowLeft, Clock, MapPin, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { busRoutes } from "../data/mockData";
import type { BusRoute } from "../data/mockData";

interface KnowYourRouteProps {
  onBack: () => void;
}

export function KnowYourRoute({ onBack }: KnowYourRouteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [expandedStops, setExpandedStops] = useState(false);

  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRouteClick = (route: BusRoute) => {
    setSelectedRoute(selectedRoute?.id === route.id ? null : route);
    setExpandedStops(false);
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
          <Route className="w-6 h-6" />
          <h2 className="text-red-600">Know Your Route</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <label className="block mb-2 text-gray-700">Search Route</label>
          <Input
            type="text"
            placeholder="Route number, name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Routes List */}
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Route Header */}
              <button
                onClick={() => handleRouteClick(route)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-md">
                      {route.number}
                    </div>
                    <div>
                      <p className="text-gray-800">{route.name}</p>
                      <p className="text-sm text-gray-500">{route.distance}</p>
                    </div>
                  </div>
                  {selectedRoute?.id === route.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{route.from}</span>
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{route.to}</span>
                </div>
              </button>

              {/* Route Details */}
              {selectedRoute?.id === route.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="text-gray-800">{route.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Fare</p>
                        <p className="text-gray-800">{route.fare}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <h4 className="text-gray-700 mb-2">Timings</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">First Bus</p>
                        <p className="text-gray-800">{route.firstBus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Bus</p>
                        <p className="text-gray-800">{route.lastBus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Frequency</p>
                        <p className="text-gray-800">{route.frequency}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stops */}
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gray-700">
                        Bus Stops ({route.stops.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedStops(!expandedStops)}
                      >
                        {expandedStops ? "Show Less" : "Show All"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {route.stops
                        .slice(0, expandedStops ? route.stops.length : 3)
                        .map((stop, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === route.stops.length - 1
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                                }`}
                              />
                              {index < route.stops.length - 1 && (
                                <div className="w-0.5 h-8 bg-gray-300 my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-2">
                              <p className="text-gray-800">{stop}</p>
                              <p className="text-xs text-gray-500">
                                {index === 0
                                  ? "Starting point"
                                  : index === route.stops.length - 1
                                  ? "Final destination"
                                  : `Stop ${index}`}
                              </p>
                            </div>
                          </div>
                        ))}

                      {!expandedStops && route.stops.length > 3 && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="w-3 h-3" />
                          <p>+ {route.stops.length - 3} more stops</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredRoutes.length === 0 && searchQuery && (
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <Route className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No routes found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
