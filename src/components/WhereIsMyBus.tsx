import { useState, useEffect } from "react";
import { Bus, MapPin, Clock, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { activeBuses, busRoutes } from "../data/mockData";
import type { Bus as BusType } from "../data/mockData";

interface WhereIsMyBusProps {
  onBack: () => void;
}

export function WhereIsMyBus({ onBack }: WhereIsMyBusProps) {
  const [routeNumber, setRouteNumber] = useState("");
  const [selectedBuses, setSelectedBuses] = useState<BusType[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setSelectedBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          eta: Math.max(0, bus.eta - 1),
          latitude: bus.latitude + (Math.random() - 0.5) * 0.001,
          longitude: bus.longitude + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const handleSearch = () => {
    const buses = activeBuses.filter((bus) => bus.routeNumber === routeNumber);
    setSelectedBuses(buses);
    setIsTracking(true);
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const routeInfo = busRoutes.find((r) => r.number === routeNumber);

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
          <Bus className="w-6 h-6" />
          <h2 className="text-red-600">Where is My Bus</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <label className="block mb-2 text-gray-700">Enter Route Number</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., 1, 42, 105"
              value={routeNumber}
              onChange={(e) => setRouteNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
              Track
            </Button>
          </div>
        </div>

        {/* Route Info */}
        {routeInfo && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-gray-800 mb-2">Route {routeInfo.number}</h3>
            <p className="text-gray-600 mb-2">{routeInfo.name}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">
                <span className="text-gray-500">From:</span> {routeInfo.from}
              </div>
              <div className="text-gray-600">
                <span className="text-gray-500">To:</span> {routeInfo.to}
              </div>
              <div className="text-gray-600">
                <span className="text-gray-500">Frequency:</span> {routeInfo.frequency}
              </div>
              <div className="text-gray-600">
                <span className="text-gray-500">Fare:</span> {routeInfo.fare}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {selectedBuses.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800">Active Buses ({selectedBuses.length})</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Tracking
              </div>
            </div>

            {selectedBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Bus className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-800">Bus {bus.id}</p>
                      <p className="text-sm text-gray-500">Route {bus.routeNumber}</p>
                    </div>
                  </div>
                  {bus.isDelayed && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Delayed
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Current Stop</p>
                      <p className="text-gray-800">{bus.currentStop}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Next Stop</p>
                      <p className="text-gray-800">{bus.nextStop}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-800">
                        {bus.eta === 0 ? "Arriving now" : `${bus.eta} min away`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getOccupancyColor(bus.occupancy)}`} />
                        <span className="text-sm text-gray-600 capitalize">
                          {bus.occupancy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : routeNumber && isTracking ? (
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <Bus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No active buses found on this route</p>
            <p className="text-sm text-gray-500 mt-1">
              Please check the route number or try again later
            </p>
          </div>
        ) : null}

        {/* Available Routes */}
        {!isTracking && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-gray-800 mb-3">Popular Routes</h3>
            <div className="flex flex-wrap gap-2">
              {busRoutes.slice(0, 5).map((route) => (
                <Button
                  key={route.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRouteNumber(route.number);
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Route {route.number}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
