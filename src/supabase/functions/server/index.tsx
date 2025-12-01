import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d1a519b5/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ TICKET BOOKING ENDPOINTS ============

// Save a ticket booking
app.post("/make-server-d1a519b5/ticket-booking", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `AMTS${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();
    
    const booking = {
      ...bookingData,
      bookingId,
      timestamp,
      status: "confirmed"
    };

    await kv.set(`ticket:${bookingId}`, booking);
    
    console.log(`Ticket booking saved: ${bookingId}`);
    return c.json({ 
      success: true, 
      bookingId,
      booking 
    });
  } catch (error) {
    console.error("Error saving ticket booking:", error);
    return c.json({ 
      success: false, 
      error: `Failed to save ticket booking: ${error}` 
    }, 500);
  }
});

// Get all ticket bookings
app.get("/make-server-d1a519b5/ticket-bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("ticket:");
    console.log(`Retrieved ${bookings.length} ticket bookings`);
    return c.json({ 
      success: true, 
      bookings: bookings.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    });
  } catch (error) {
    console.error("Error retrieving ticket bookings:", error);
    return c.json({ 
      success: false, 
      error: `Failed to retrieve ticket bookings: ${error}` 
    }, 500);
  }
});

// Get specific ticket booking by ID
app.get("/make-server-d1a519b5/ticket-booking/:id", async (c) => {
  try {
    const bookingId = c.req.param("id");
    const booking = await kv.get(`ticket:${bookingId}`);
    
    if (!booking) {
      return c.json({ 
        success: false, 
        error: "Booking not found" 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      booking 
    });
  } catch (error) {
    console.error("Error retrieving ticket booking:", error);
    return c.json({ 
      success: false, 
      error: `Failed to retrieve ticket booking: ${error}` 
    }, 500);
  }
});

// ============ COMPLAINT ENDPOINTS ============

// Submit a complaint
app.post("/make-server-d1a519b5/complaint", async (c) => {
  try {
    const complaintData = await c.req.json();
    const complaintId = `AMTS-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();
    
    const complaint = {
      ...complaintData,
      complaintId,
      timestamp,
      status: "submitted",
      statusHistory: [
        {
          status: "submitted",
          timestamp,
          message: "Complaint received and is being reviewed"
        }
      ]
    };

    await kv.set(`complaint:${complaintId}`, complaint);
    
    console.log(`Complaint saved: ${complaintId} - Category: ${complaintData.category}`);
    return c.json({ 
      success: true, 
      complaintId,
      complaint 
    });
  } catch (error) {
    console.error("Error saving complaint:", error);
    return c.json({ 
      success: false, 
      error: `Failed to save complaint: ${error}` 
    }, 500);
  }
});

// Get all complaints
app.get("/make-server-d1a519b5/complaints", async (c) => {
  try {
    const complaints = await kv.getByPrefix("complaint:");
    console.log(`Retrieved ${complaints.length} complaints`);
    return c.json({ 
      success: true, 
      complaints: complaints.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    });
  } catch (error) {
    console.error("Error retrieving complaints:", error);
    return c.json({ 
      success: false, 
      error: `Failed to retrieve complaints: ${error}` 
    }, 500);
  }
});

// Get specific complaint by ID
app.get("/make-server-d1a519b5/complaint/:id", async (c) => {
  try {
    const complaintId = c.req.param("id");
    const complaint = await kv.get(`complaint:${complaintId}`);
    
    if (!complaint) {
      return c.json({ 
        success: false, 
        error: "Complaint not found" 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      complaint 
    });
  } catch (error) {
    console.error("Error retrieving complaint:", error);
    return c.json({ 
      success: false, 
      error: `Failed to retrieve complaint: ${error}` 
    }, 500);
  }
});

// Update complaint status
app.put("/make-server-d1a519b5/complaint/:id/status", async (c) => {
  try {
    const complaintId = c.req.param("id");
    const { status, message } = await c.req.json();
    
    const complaint = await kv.get(`complaint:${complaintId}`);
    if (!complaint) {
      return c.json({ 
        success: false, 
        error: "Complaint not found" 
      }, 404);
    }
    
    const timestamp = new Date().toISOString();
    complaint.status = status;
    complaint.statusHistory = complaint.statusHistory || [];
    complaint.statusHistory.push({
      status,
      timestamp,
      message
    });
    
    await kv.set(`complaint:${complaintId}`, complaint);
    
    console.log(`Complaint ${complaintId} status updated to: ${status}`);
    return c.json({ 
      success: true, 
      complaint 
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return c.json({ 
      success: false, 
      error: `Failed to update complaint status: ${error}` 
    }, 500);
  }
});

// ============ BUS TRACKING ENDPOINTS ============

// Get live bus locations using Google Maps API
app.get("/make-server-d1a519b5/bus-tracking", async (c) => {
  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    
    if (!apiKey) {
      console.error("Google Maps API key not configured");
      return c.json({ 
        success: false, 
        error: "Google Maps API key not configured. Please add your API key." 
      }, 500);
    }

    // Get route parameter if provided
    const routeNumber = c.req.query("route");
    
    // Fetch stored bus locations from KV store
    const buses = await kv.getByPrefix("bus:");
    
    let filteredBuses = buses;
    if (routeNumber) {
      filteredBuses = buses.filter((bus: any) => bus.routeNumber === routeNumber);
    }
    
    console.log(`Retrieved ${filteredBuses.length} bus locations${routeNumber ? ` for route ${routeNumber}` : ''}`);
    
    return c.json({ 
      success: true, 
      buses: filteredBuses,
      count: filteredBuses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching bus tracking data:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch bus tracking data: ${error}` 
    }, 500);
  }
});

// Update bus location (for simulation or real GPS updates)
app.post("/make-server-d1a519b5/bus-location", async (c) => {
  try {
    const busData = await c.req.json();
    const { busId } = busData;
    
    if (!busId) {
      return c.json({ 
        success: false, 
        error: "Bus ID is required" 
      }, 400);
    }
    
    const timestamp = new Date().toISOString();
    const updatedBus = {
      ...busData,
      lastUpdated: timestamp
    };
    
    await kv.set(`bus:${busId}`, updatedBus);
    
    console.log(`Bus location updated: ${busId} - Route ${busData.routeNumber}`);
    return c.json({ 
      success: true, 
      bus: updatedBus 
    });
  } catch (error) {
    console.error("Error updating bus location:", error);
    return c.json({ 
      success: false, 
      error: `Failed to update bus location: ${error}` 
    }, 500);
  }
});

// Batch update multiple bus locations
app.post("/make-server-d1a519b5/bus-locations-batch", async (c) => {
  try {
    const { buses } = await c.req.json();
    
    if (!buses || !Array.isArray(buses)) {
      return c.json({ 
        success: false, 
        error: "Buses array is required" 
      }, 400);
    }
    
    const timestamp = new Date().toISOString();
    const updates: Array<[string, any]> = buses.map((bus: any) => [
      `bus:${bus.busId}`,
      { ...bus, lastUpdated: timestamp }
    ]);
    
    await kv.mset(updates);
    
    console.log(`Batch updated ${buses.length} bus locations`);
    return c.json({ 
      success: true, 
      count: buses.length,
      timestamp 
    });
  } catch (error) {
    console.error("Error batch updating bus locations:", error);
    return c.json({ 
      success: false, 
      error: `Failed to batch update bus locations: ${error}` 
    }, 500);
  }
});

// Get route information with real-time data
app.get("/make-server-d1a519b5/route/:routeNumber", async (c) => {
  try {
    const routeNumber = c.req.param("routeNumber");
    
    // Get buses on this route
    const allBuses = await kv.getByPrefix("bus:");
    const routeBuses = allBuses.filter((bus: any) => bus.routeNumber === routeNumber);
    
    // Get route details from KV store if stored
    const routeDetails = await kv.get(`route:${routeNumber}`);
    
    console.log(`Retrieved route ${routeNumber} with ${routeBuses.length} active buses`);
    
    return c.json({ 
      success: true, 
      routeNumber,
      routeDetails,
      buses: routeBuses,
      activeBusCount: routeBuses.length
    });
  } catch (error) {
    console.error("Error fetching route information:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch route information: ${error}` 
    }, 500);
  }
});

Deno.serve(app.fetch);