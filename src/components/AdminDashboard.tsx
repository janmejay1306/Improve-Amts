import { useState, useEffect } from "react";
import { ArrowLeft, Ticket, AlertTriangle, RefreshCw, Calendar, User, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ticketBookingAPI, complaintAPI } from "../utils/api";

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, complaintsData] = await Promise.all([
        ticketBookingAPI.getAll(),
        complaintAPI.getAll(),
      ]);
      
      setBookings(bookingsData.bookings || []);
      setComplaints(complaintsData.complaints || []);
      console.log(`Loaded ${bookingsData.bookings?.length || 0} bookings and ${complaintsData.complaints?.length || 0} complaints`);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "submitted":
        return "bg-blue-500";
      case "under review":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E3]">
      {/* Header */}
      <div className="bg-[#FBE106] text-black px-6 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-black hover:bg-yellow-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-black">Admin Dashboard</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            disabled={loading}
            className="text-black hover:bg-yellow-500"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="bookings">
              <Ticket className="w-4 h-4 mr-2" />
              Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="complaints">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Complaints ({complaints.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                No bookings found
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.bookingId} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-black">Booking #{booking.bookingId}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-black">₹{booking.fare}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Route</p>
                      <p className="text-black">{booking.route} - {booking.routeName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Travel Date</p>
                      <p className="text-black">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">From - To</p>
                      <p className="text-black">{booking.from} → {booking.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passengers</p>
                      <p className="text-black">{booking.passengers} ({booking.passengerType})</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{booking.phone}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                No complaints found
              </Card>
            ) : (
              complaints.map((complaint) => (
                <Card key={complaint.complaintId} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-black">Complaint #{complaint.complaintId}</h3>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(complaint.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Bus ID</p>
                        <p className="text-black">{complaint.busId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Route</p>
                        <p className="text-black">{complaint.routeNumber}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="text-black">{complaint.category}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Description</p>
                      <p className="text-gray-700">{complaint.description}</p>
                    </div>

                    {complaint.hasImage && (
                      <div>
                        <p className="text-gray-600 mb-1">Attached Evidence</p>
                        <Badge variant="outline">Photo Attached</Badge>
                      </div>
                    )}
                  </div>

                  {(complaint.contactName || complaint.contactEmail || complaint.contactPhone) && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-600 mb-2">Contact Information</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {complaint.contactName && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{complaint.contactName}</span>
                          </div>
                        )}
                        {complaint.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{complaint.contactEmail}</span>
                          </div>
                        )}
                        {complaint.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{complaint.contactPhone}</span>
                          </div>
                        )}
                      </div>
                      
                      {(complaint.notifySMS || complaint.notifyEmail) && (
                        <div className="mt-2 flex gap-2">
                          {complaint.notifySMS && (
                            <Badge variant="outline" className="text-xs">SMS Enabled</Badge>
                          )}
                          {complaint.notifyEmail && (
                            <Badge variant="outline" className="text-xs">Email Enabled</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
