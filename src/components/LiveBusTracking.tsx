import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bus,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Filter,
  Navigation2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import {
  activeBuses,
  busRoutes,
  busStops,
  Bus as BusType,
} from "../data/mockData";
import { ComplaintForm } from "./ComplaintForm";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface LiveBusTrackingProps {
  onBack: () => void;
}

/**
 * LiveBusTracking (REAL GPS VERSION)
 *
 * - No more random/simulated movement.
 * - Periodically reads live data from Supabase "buses" table via REST.
 * - Assumes your backend / mobile app is updating that table with real GPS.
 */
export function LiveBusTracking({ onBack }: LiveBusTrackingProps) {
  // Start with mock data so UI isn't empty before first fetch
  const [buses, setBuses] = useState<BusType[]>(activeBuses);
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 POLL Supabase "buses" table for live positions
  useEffect(() => {
    let isMounted = true;
    let interval: number | undefined;

    const fetchBusesFromSupabase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = `https://${projectId}.supabase.co/rest/v1/buses?select=*`;

        const response = await fetch(url, {
          headers: {
            apikey: publicAnonKey,
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Supabase error (${response.status}): ${text || "Unknown error"}`
          );
        }

        const data = (await response.json()) as BusType[];

        if (!isMounted) return;

        // Only update if data looks valid
        if (Array.isArray(data) && data.length > 0) {
          setBuses(data);
          setLastUpdated(new Date());
        }
      } catch (err: any) {
        console.error("Error fetching live buses:", err);
        if (isMounted) {
          setError("Unable to fetch live bus data right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchBusesFromSupabase();

    // Poll every 5 seconds
    interval = window.setInterval(fetchBusesFromSupabase, 5000);

    return () => {
      isMounted = false;
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const filteredBuses =
    selectedRoute === "all"
      ? buses
      : buses.filter((bus) => bus.routeNumber === selectedRoute);

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

  const getOccupancyText = (occupancy: string) => {
    switch (occupancy) {
      case "low":
        return "Available Seats";
      case "medium":
        return "Moderate Crowd";
      case "high":
        return "Crowded";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E3] flex flex-col">
      {/* Header */}
      <header className="bg-[#FBE106] text-red-600 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="hover:bg-yellow-500 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Navigation2 className="w-6 h-6" />
            <h1 className="text-red-600">Live Bus Tracking</h1>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>
              Live tracking • {filteredBuses.length} buses active
              {isLoading && " • Refreshing..."}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span>
                Last update:{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertCircle className="w-4 h-4" />
                {error}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Routes</SelectItem>
              {busRoutes.map((route) => (
                <SelectItem key={route.id} value={route.number}>
                  Route {route.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRoute !== "all" && (
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              {filteredBuses.length} buses
            </Badge>
          )}
        </div>
      </div>

      {/* Map View with Streets */}
      <div className="relative bg-gray-100 h-96 border-b border-gray-300">
        {/* Street Map Background */}
        <div className="absolute inset-0 bg-[#f0ebe3]">
          {/* Major Streets and Roads SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Sabarmati River */}
            <path
              d="M 5 20 Q 10 35, 8 50 Q 6 65, 10 80 Q 12 90, 15 95"
              stroke="#a8d8ea"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
            />

            {/* Major Highways - Horizontal */}
            <line
              x1="0"
              y1="25"
              x2="100"
              y2="25"
              stroke="#ffa500"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <line
              x1="0"
              y1="35"
              x2="100"
              y2="35"
              stroke="#ffa500"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="#ffa500"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <line
              x1="0"
              y1="65"
              x2="100"
              y2="65"
              stroke="#ffa500"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="0"
              y1="80"
              x2="100"
              y2="80"
              stroke="#ffa500"
              strokeWidth="0.5"
              opacity="0.5"
            />

            {/* Major Highways - Vertical */}
            <line
              x1="20"
              y1="0"
              x2="20"
              y2="100"
              stroke="#ffa500"
              strokeWidth="0.7"
              opacity="0.7"
            />
            <line
              x1="35"
              y1="0"
              x2="35"
              y2="100"
              stroke="#ffa500"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#ffa500"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <line
              x1="65"
              y1="0"
              x2="65"
              y2="100"
              stroke="#ffa500"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="80"
              y1="0"
              x2="80"
              y2="100"
              stroke="#ffa500"
              strokeWidth="0.5"
              opacity="0.5"
            />

            {/* Secondary Streets - Horizontal */}
            <line
              x1="0"
              y1="15"
              x2="100"
              y2="15"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="30"
              x2="100"
              y2="30"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="40"
              x2="100"
              y2="40"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="45"
              x2="100"
              y2="45"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="55"
              x2="100"
              y2="55"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="60"
              x2="100"
              y2="60"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="70"
              x2="100"
              y2="70"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="75"
              x2="100"
              y2="75"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="85"
              x2="100"
              y2="85"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="90"
              x2="100"
              y2="90"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />

            {/* Secondary Streets - Vertical */}
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="15"
              y1="0"
              x2="15"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="25"
              y1="0"
              x2="25"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="30"
              y1="0"
              x2="30"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="45"
              y1="0"
              x2="45"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="55"
              y1="0"
              x2="55"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="60"
              y1="0"
              x2="60"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="70"
              y1="0"
              x2="70"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="75"
              y1="0"
              x2="75"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="85"
              y1="0"
              x2="85"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="90"
              y1="0"
              x2="90"
              y2="100"
              stroke="#d4d4d4"
              strokeWidth="0.3"
              opacity="0.5"
            />

            {/* Green Spaces/Parks */}
            <rect
              x="22"
              y="27"
              width="8"
              height="6"
              fill="#a8d5a3"
              opacity="0.4"
              rx="0.5"
            />
            <rect
              x="52"
              y="42"
              width="10"
              height="8"
              fill="#a8d5a3"
              opacity="0.4"
              rx="0.5"
            />
            <rect
              x="68"
              y="58"
              width="12"
              height="10"
              fill="#a8d5a3"
              opacity="0.4"
              rx="0.5"
            />
            <rect
              x="38"
              y="72"
              width="9"
              height="7"
              fill="#a8d5a3"
              opacity="0.4"
              rx="0.5"
            />
          </svg>

          {/* Landmark Labels */}
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md z-10">
            <p className="text-sm text-gray-600">Ahmedabad Street Map</p>
          </div>

          {/* Major Landmarks */}
          <div className="absolute" style={{ top: "26%", left: "22%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Law Garden
            </div>
          </div>
          <div className="absolute" style={{ top: "34%", left: "50%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Ellis Bridge
            </div>
          </div>
          <div className="absolute" style={{ top: "50%", left: "35%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Ashram Road
            </div>
          </div>
          <div className="absolute" style={{ top: "48%", left: "68%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Maninagar
            </div>
          </div>
          <div className="absolute" style={{ top: "64%", left: "52%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Paldi
            </div>
          </div>
          <div className="absolute" style={{ top: "78%", left: "38%" }}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-700 shadow-sm">
              Satellite
            </div>
          </div>

          {/* Route paths */}
          {busRoutes
            .filter(
              (route) => selectedRoute === "all" || route.number === selectedRoute
            )
            .map((route) => {
              const routeStops = route.stops
                .map((stopName) => busStops.find((s) => s.name === stopName))
                .filter(Boolean);

              return (
                <svg
                  key={route.id}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <marker
                      id={`arrow-${route.id}`}
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                  </defs>

                  {routeStops.map((stop, index) => {
                    if (index === routeStops.length - 1) return null;
                    const nextStop = routeStops[index + 1];
                    if (!stop || !nextStop) return null;

                    const x1 = ((stop.longitude - 72.5) / 0.15) * 100;
                    const y1 = ((23.08 - stop.latitude) / 0.08) * 100;
                    const x2 = ((nextStop.longitude - 72.5) / 0.15) * 100;
                    const y2 = ((23.08 - nextStop.latitude) / 0.08) * 100;

                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    return (
                      <g key={`${route.id}-${index}`}>
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          opacity="0.6"
                          markerMid={`url(#arrow-${route.id})`}
                        />
                        <line
                          x1={`${midX}%`}
                          y1={`${midY}%`}
                          x2={`${midX + 0.001}%`}
                          y2={`${midY + 0.001}%`}
                          stroke="#ef4444"
                          strokeWidth="3"
                          markerEnd={`url(#arrow-${route.id})`}
                          opacity="0.9"
                        />
                      </g>
                    );
                  })}

                  {routeStops.map((stop, index) => {
                    if (!stop) return null;
                    const x = ((stop.longitude - 72.5) / 0.15) * 100;
                    const y = ((23.08 - stop.latitude) / 0.08) * 100;
                    const isTerminal =
                      index === 0 || index === routeStops.length - 1;

                    return (
                      <g key={`stop-${stop.id}`}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r={isTerminal ? "8" : "5"}
                          fill={isTerminal ? "#dc2626" : "#ffffff"}
                          stroke="#dc2626"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              );
            })}

          {/* Bus markers on map */}
          {filteredBuses.map((bus) => {
            const x = ((bus.longitude - 72.5) / 0.15) * 100;
            const y = ((23.08 - bus.latitude) / 0.08) * 100;

            return (
              <button
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-10"
                style={{
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`,
                }}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      selectedBus?.id === bus.id ? "bg-red-600" : "bg-red-500"
                    } shadow-lg flex items-center justify-center text-white`}
                  >
                    <Bus className="w-5 h-5" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {bus.routeNumber}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white px-4 py-3 rounded-lg shadow-md">
          <p className="text-xs text-gray-500 mb-2">Occupancy Levels</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Available Seats</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Crowded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Bus Details */}
      {selectedBus && (
        <div className="bg-white border-b border-gray-200 p-6">
          <Card className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white p-3 rounded-xl">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900">Bus {selectedBus.id}</h3>
                  <p className="text-sm text-gray-500">
                    Route {selectedBus.routeNumber}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBus(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>Current Stop</span>
                </div>
                <p className="text-gray-900">{selectedBus.currentStop}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Navigation2 className="w-4 h-4" />
                  <span>Next Stop</span>
                </div>
                <p className="text-gray-900">{selectedBus.nextStop}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>ETA</span>
                </div>
                <p className="text-gray-900">{selectedBus.eta} minutes</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Occupancy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getOccupancyColor(
                      selectedBus.occupancy
                    )}`}
                  />
                  <p className="text-gray-900">
                    {getOccupancyText(selectedBus.occupancy)}
                  </p>
                </div>
              </div>
            </div>

            {selectedBus.isDelayed && (
              <div className="mt-4 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>This bus is currently delayed</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <p className="text-xs text-gray-500">
                Location: {selectedBus.latitude.toFixed(4)}°N,{" "}
                {selectedBus.longitude.toFixed(4)}°E
              </p>
              <Button
                onClick={() => setShowComplaintForm(true)}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue with this Bus
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bus List */}
      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Active Buses</h2>
          <Badge variant="outline">{filteredBuses.length} total</Badge>
        </div>

        <div className="grid gap-4">
          {filteredBuses.map((bus) => (
            <Card
              key={bus.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedBus?.id === bus.id ? "ring-2 ring-red-600" : ""
              }`}
              onClick={() => setSelectedBus(bus)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-red-600 text-white p-2 rounded-lg">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900">{bus.id}</p>
                      <Badge variant="secondary" className="text-xs">
                        Route {bus.routeNumber}
                      </Badge>
                      {bus.isDelayed && (
                        <Badge variant="destructive" className="text-xs">
                          Delayed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{bus.currentStop}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{bus.eta} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getOccupancyColor(
                      bus.occupancy
                    )}`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && selectedBus && (
        <ComplaintForm
          busId={selectedBus.id}
          routeNumber={selectedBus.routeNumber}
          isOpen={showComplaintForm}
          onClose={() => setShowComplaintForm(false)}
        />
      )}
    </div>
  );
}
