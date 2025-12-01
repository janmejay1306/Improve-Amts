import { useState } from "react";
import { Bus, MapPin, Route, Navigation, MapPinned, Headphones, Navigation2, Ticket, Shield, User } from "lucide-react";
import { FeatureCard } from "./components/FeatureCard";
import { WhereIsMyBus } from "./components/WhereIsMyBus";
import { RouteFinder } from "./components/RouteFinder";
import { KnowYourRoute } from "./components/KnowYourRoute";
import { NearbyStop } from "./components/NearbyStop";
import { BusStopDetails } from "./components/BusStopDetails";
import { HelpSupport } from "./components/HelpSupport";
import { LiveBusTracking } from "./components/LiveBusTracking";
import { TicketBooking } from "./components/TicketBooking";
import { AdminDashboard } from "./components/AdminDashboard";
import { AIChatbot } from "./components/AIChatbot";
import { Toaster } from "./components/ui/sonner";
import logoImage from "figma:asset/fbcf9760b17182358bd1e40518092025e92318a6.png";

type FeatureType =
  | "home"
  | "whereIsMyBus"
  | "routeFinder"
  | "knowYourRoute"
  | "nearbyStop"
  | "busStopDetails"
  | "helpSupport"
  | "liveTracking"
  | "ticketBooking"
  | "adminDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<FeatureType>("home");

  const features = [
    {
      id: 1,
      title: "Book Ticket",
      icon: Ticket,
      iconBgColor: "bg-red-600",
      view: "ticketBooking" as FeatureType,
    },
    {
      id: 2,
      title: "Where is My Bus",
      icon: Bus,
      iconBgColor: "bg-red-600",
      view: "whereIsMyBus" as FeatureType,
    },
    {
      id: 3,
      title: "Live Bus Tracking",
      icon: Navigation2,
      iconBgColor: "bg-red-600",
      view: "liveTracking" as FeatureType,
    },
    {
      id: 4,
      title: "Route Finder",
      icon: MapPin,
      iconBgColor: "bg-red-600",
      view: "routeFinder" as FeatureType,
    },
    {
      id: 5,
      title: "Know Your Route",
      icon: Route,
      iconBgColor: "bg-red-600",
      view: "knowYourRoute" as FeatureType,
    },
    {
      id: 6,
      title: "Nearby Stop",
      icon: Navigation,
      iconBgColor: "bg-red-600",
      view: "nearbyStop" as FeatureType,
    },
    {
      id: 7,
      title: "Bus Stop Details",
      icon: MapPinned,
      iconBgColor: "bg-red-600",
      view: "busStopDetails" as FeatureType,
    },
    {
      id: 8,
      title: "Help & Support",
      icon: Headphones,
      iconBgColor: "bg-red-600",
      view: "helpSupport" as FeatureType,
    },
  ];

  const handleFeatureClick = (view: FeatureType) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView("home");
  };

  // Render different views based on currentView
  if (currentView === "ticketBooking") {
    return (
      <>
        <TicketBooking onBack={handleBack} />
        <AIChatbot />
        <Toaster />
      </>
    );
  }

  if (currentView === "whereIsMyBus") {
    return (
      <>
        <WhereIsMyBus onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "liveTracking") {
    return (
      <>
        <LiveBusTracking onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "routeFinder") {
    return (
      <>
        <RouteFinder onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "knowYourRoute") {
    return (
      <>
        <KnowYourRoute onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "nearbyStop") {
    return (
      <>
        <NearbyStop onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "busStopDetails") {
    return (
      <>
        <BusStopDetails onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  if (currentView === "helpSupport") {
    return (
      <>
        <HelpSupport onBack={handleBack} />
        <AIChatbot />
        <Toaster />
      </>
    );
  }

  if (currentView === "adminDashboard") {
    return (
      <>
        <AdminDashboard onBack={handleBack} />
        <AIChatbot />
      </>
    );
  }

  // Home view
  return (
    <>
      <div className="min-h-screen bg-[#F5F1E3] flex flex-col">
        {/* Header */}
        <header className="bg-[#FBE106] text-black shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="AMTS Connect" className="h-12" />
                <h1 className="text-black">AMTS Connect</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="hover:underline transition-all">Features</a>
                <a href="#about" className="hover:underline transition-all">About</a>
                <a href="#contact" className="hover:underline transition-all">Contact</a>
              </nav>
              
              {/* Admin Dashboard Profile Button */}
              <button
                onClick={() => handleFeatureClick("adminDashboard")}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#FBE106] to-[#F5F1E3] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-black mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
              Your Complete AMTS Bus Travel Solution
            </h2>
            <p className="text-black/80 max-w-3xl mx-auto mb-8 text-lg md:text-xl lg:text-2xl leading-relaxed">
              Real-time bus tracking, route planning, ticket booking, and more. 
              Experience seamless public transport in Ahmedabad with 150+ active buses 
              across 20 routes and 56 stops.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => handleFeatureClick("ticketBooking")}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Book Ticket Now
              </button>
              <button 
                onClick={() => handleFeatureClick("liveTracking")}
                className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-black"
              >
                Track Buses Live
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20 bg-[#F5F1E3]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-black mb-4">All Features</h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Explore our comprehensive suite of tools designed to make your bus journey easier and more convenient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  icon={feature.icon}
                  iconBgColor={feature.iconBgColor}
                  onClick={() => handleFeatureClick(feature.view)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-black mb-6">About AMTS Connect</h2>
                <p className="text-black/70 mb-4">
                  AMTS Connect is your all-in-one platform for navigating Ahmedabad's public transportation system. 
                  We provide real-time information, seamless ticket booking, and intelligent route planning.
                </p>
                <p className="text-black/70 mb-6">
                  With coverage across all major routes in Ahmedabad, our platform ensures you never miss your bus 
                  and always find the most efficient route to your destination.
                </p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-black mb-2">150+</div>
                    <p className="text-black/60">Active Buses</p>
                  </div>
                  <div>
                    <div className="text-black mb-2">20</div>
                    <p className="text-black/60">Routes</p>
                  </div>
                  <div>
                    <div className="text-black mb-2">56</div>
                    <p className="text-black/60">Bus Stops</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5F1E3] p-8 rounded-2xl">
                <h3 className="text-black mb-6">Key Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FBE106] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black">✓</span>
                    </div>
                    <div>
                      <p className="text-black">Real-time bus tracking with Google Maps integration</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FBE106] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black">✓</span>
                    </div>
                    <div>
                      <p className="text-black">Instant ticket booking with database persistence</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FBE106] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black">✓</span>
                    </div>
                    <div>
                      <p className="text-black">AI-powered chatbot for instant assistance</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FBE106] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black">✓</span>
                    </div>
                    <div>
                      <p className="text-black">Comprehensive route and stop information</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20 bg-[#F5F1E3]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-black mb-4">Get in Touch</h2>
            <p className="text-black/70 mb-8">
              Have questions or need support? Our team is here to help you 24/7.
            </p>
            <button
              onClick={() => handleFeatureClick("helpSupport")}
              className="bg-[#FBE106] text-black px-8 py-3 rounded-full hover:bg-[#e5d105] transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-black"
            >
              Contact Support
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src={logoImage} alt="AMTS Connect" className="h-8 brightness-0 invert" />
                  <span>AMTS Connect</span>
                </div>
                <p className="text-white/70">
                  Your trusted partner for public transportation in Ahmedabad.
                </p>
              </div>
              <div>
                <h4 className="mb-4">Quick Links</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                  <li>
                    <button onClick={() => handleFeatureClick("helpSupport")} className="hover:text-white transition-colors text-left">
                      Help & Support
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4">Services</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <button onClick={() => handleFeatureClick("ticketBooking")} className="hover:text-white transition-colors text-left">
                      Book Tickets
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleFeatureClick("liveTracking")} className="hover:text-white transition-colors text-left">
                      Live Tracking
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleFeatureClick("routeFinder")} className="hover:text-white transition-colors text-left">
                      Route Finder
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleFeatureClick("nearbyStop")} className="hover:text-white transition-colors text-left">
                      Nearby Stops
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-6 text-center text-white/70">
              <p>&copy; 2025 AMTS Connect. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      
      {/* AI Chatbot - Always available */}
      <AIChatbot />
    </>
  );
}
