import { useState } from "react";
import { ArrowLeft, Ticket, MapPin, Calendar, Users, CreditCard, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Card } from "./ui/card";
import { busRoutes } from "../data/mockData";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TicketBookingProps {
  onBack: () => void;
}

export function TicketBooking({ onBack }: TicketBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bookingData, setBookingData] = useState({
    route: "",
    from: "",
    to: "",
    date: "",
    passengers: "1",
    passengerType: "adult",
    name: "",
    email: "",
    phone: "",
  });

  const selectedRoute = busRoutes.find((r) => r.number === bookingData.route);

  const calculateFare = () => {
    if (!selectedRoute) return 0;
    const baseFare = parseInt(selectedRoute.fare.replace("₹", ""));
    const passengers = parseInt(bookingData.passengers);
    const multiplier = bookingData.passengerType === "student" ? 0.5 : 1;
    return baseFare * passengers * multiplier;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    try {
      const fare = calculateFare();
      const bookingPayload = {
        ...bookingData,
        routeName: selectedRoute?.name,
        fare: fare,
        paymentMethod: "Card" // You can add payment method selection if needed
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d1a519b5/ticket-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Ticket booked successfully!", {
          description: `Booking ID: ${data.bookingId}`,
        });
        console.log("Booking saved to database:", data.booking);
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to save booking");
      }
    } catch (error) {
      console.error("Error saving ticket booking:", error);
      toast.error("Failed to save booking", {
        description: "Your booking could not be saved. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E3]">
      {/* Header */}
      <div className="bg-[#FBE106] text-black px-6 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-black hover:bg-yellow-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Ticket className="w-6 h-6" />
          <h2 className="text-black">Book Ticket</h2>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= num
                    ? "bg-[#FBE106] text-black"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > num ? <Check className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 transition-colors ${
                    step > num ? "bg-[#FBE106]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto flex justify-between mt-2">
          <span className="text-xs text-gray-600">Route Details</span>
          <span className="text-xs text-gray-600">Passenger Info</span>
          <span className="text-xs text-gray-600">Payment</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Step 1: Route Details */}
        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h3 className="text-black mb-4">Select Route & Journey Details</h3>

            <div className="space-y-2">
              <Label htmlFor="route">Select Route</Label>
              <select
                id="route"
                name="route"
                value={bookingData.route}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBE106]"
                required
              >
                <option value="">Choose a route</option>
                {busRoutes.map((route) => (
                  <option key={route.id} value={route.number}>
                    Route {route.number} - {route.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedRoute && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <select
                    id="from"
                    name="from"
                    value={bookingData.from}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBE106]"
                    required
                  >
                    <option value="">Select boarding point</option>
                    {selectedRoute.stops.map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <select
                    id="to"
                    name="to"
                    value={bookingData.to}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBE106]"
                    required
                  >
                    <option value="">Select destination</option>
                    {selectedRoute.stops.map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">Travel Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={bookingData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="border-gray-300 focus:border-[#FBE106]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <select
                  id="passengers"
                  name="passengers"
                  value={bookingData.passengers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBE106]"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerType">Passenger Type</Label>
                <select
                  id="passengerType"
                  name="passengerType"
                  value={bookingData.passengerType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBE106]"
                >
                  <option value="adult">Adult</option>
                  <option value="student">Student (50% off)</option>
                  <option value="senior">Senior Citizen (50% off)</option>
                </select>
              </div>
            </div>

            {selectedRoute && bookingData.from && bookingData.to && (
              <div className="bg-[#FBE106] bg-opacity-20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Fare:</span>
                  <span className="text-black">₹{calculateFare()}</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              disabled={!bookingData.route || !bookingData.from || !bookingData.to || !bookingData.date}
              className="w-full bg-[#FBE106] hover:bg-yellow-500 text-black"
            >
              Continue to Passenger Info
            </Button>
          </Card>
        )}

        {/* Step 2: Passenger Information */}
        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h3 className="text-black mb-4">Passenger Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter passenger name"
                value={bookingData.name}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-[#FBE106]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email for ticket"
                value={bookingData.email}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-[#FBE106]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter mobile number"
                value={bookingData.phone}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-[#FBE106]"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-1/2"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
                className="w-1/2 bg-[#FBE106] hover:bg-yellow-500 text-black"
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h3 className="text-black mb-4">Payment Details</h3>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="text-black mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="text-black">{bookingData.route} - {selectedRoute?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="text-black">{bookingData.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="text-black">{bookingData.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="text-black">{bookingData.passengers}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="text-black">Total Amount:</span>
                  <span className="text-black">₹{calculateFare()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-[#FBE106] bg-[#FBE106] bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30 transition-colors">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-sm text-black">Card</p>
                </button>
                <button className="border-2 border-gray-300 p-4 rounded-lg hover:border-[#FBE106] hover:bg-[#FBE106] hover:bg-opacity-20 transition-colors">
                  <div className="w-6 h-6 mx-auto mb-2 text-black">💳</div>
                  <p className="text-sm text-black">UPI</p>
                </button>
                <button className="border-2 border-gray-300 p-4 rounded-lg hover:border-[#FBE106] hover:bg-[#FBE106] hover:bg-opacity-20 transition-colors">
                  <div className="w-6 h-6 mx-auto mb-2 text-black">💰</div>
                  <p className="text-sm text-black">Wallet</p>
                </button>
                <button className="border-2 border-gray-300 p-4 rounded-lg hover:border-[#FBE106] hover:bg-[#FBE106] hover:bg-opacity-20 transition-colors">
                  <div className="w-6 h-6 mx-auto mb-2 text-black">🏦</div>
                  <p className="text-sm text-black">Net Banking</p>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="w-1/2"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                className="w-1/2 bg-[#FBE106] hover:bg-yellow-500 text-black"
              >
                Confirm & Pay ₹{calculateFare()}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
