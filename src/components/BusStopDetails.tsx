import { useState } from "react";
import { MapPinned, ArrowLeft, Search, Bus, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { busStops } from "../data/mockData";
import type { BusStop } from "../data/mockData";

interface BusStopDetailsProps {
  onBack: () => void;
}

export function BusStopDetails({ onBack }: BusStopDetailsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  const filteredStops = busStops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStopClick = (stop: BusStop) => {
    setSelectedStop(selectedStop?.id === stop.id ? null : stop);
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
          <MapPinned className="w-6 h-6" />
          <h2 className="text-red-600">Bus Stop Details</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <label className="block mb-2 text-gray-700">Search Bus Stop</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Stop name, code, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Selected Stop Details */}
        {selectedStop && (
          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl p-5 shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <MapPinned className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">{selectedStop.name}</h3>
                <p className="text-white/90 text-sm">Code: {selectedStop.code}</p>
                <p className="text-white/80 text-sm mt-1">{selectedStop.location}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStop(null)}
                className="text-white hover:bg-white/20"
              >
                Close
              </Button>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-white/90 text-sm mb-2">Coordinates</p>
              <p className="text-white">
                {selectedStop.latitude.toFixed(4)}, {selectedStop.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Stops List */}
        <div className="space-y-3">
          {filteredStops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => handleStopClick(stop)}
              className={`w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-left ${
                selectedStop?.id === stop.id ? "ring-2 ring-red-600" : ""
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-800">{stop.name}</h4>
                  <p className="text-sm text-gray-500">{stop.code}</p>
                  <p className="text-sm text-gray-600 mt-1">{stop.location}</p>
                </div>
              </div>

              {/* Routes */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Routes ({stop.routes.length})</p>
                <div className="flex flex-wrap gap-2">
                  {stop.routes.map((route) => (
                    <Badge key={route} className="bg-red-600 hover:bg-red-700">
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
                  <div className="grid grid-cols-2 gap-2">
                    {stop.facilities.map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}

          {filteredStops.length === 0 && searchQuery && (
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <MapPinned className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No bus stops found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!searchQuery && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-gray-800 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl text-red-600 mb-1">{busStops.length}</p>
                <p className="text-sm text-gray-600">Total Stops</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl text-red-600 mb-1">
                  {busStops.reduce((acc, stop) => acc + stop.routes.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Route Connections</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
