import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1a519b5`;

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// Ticket Booking API
export const ticketBookingAPI = {
  create: async (bookingData: any) => {
    return apiCall('/ticket-booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  
  getAll: async () => {
    return apiCall('/ticket-bookings');
  },
  
  getById: async (bookingId: string) => {
    return apiCall(`/ticket-booking/${bookingId}`);
  },
};

// Complaint API
export const complaintAPI = {
  create: async (complaintData: any) => {
    return apiCall('/complaint', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },
  
  getAll: async () => {
    return apiCall('/complaints');
  },
  
  getById: async (complaintId: string) => {
    return apiCall(`/complaint/${complaintId}`);
  },
  
  updateStatus: async (complaintId: string, status: string, message: string) => {
    return apiCall(`/complaint/${complaintId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    });
  },
};

// Bus Tracking API
export const busTrackingAPI = {
  getAll: async (routeNumber?: string) => {
    const query = routeNumber ? `?route=${routeNumber}` : '';
    return apiCall(`/bus-tracking${query}`);
  },
  
  updateLocation: async (busData: any) => {
    return apiCall('/bus-location', {
      method: 'POST',
      body: JSON.stringify(busData),
    });
  },
  
  batchUpdateLocations: async (buses: any[]) => {
    return apiCall('/bus-locations-batch', {
      method: 'POST',
      body: JSON.stringify({ buses }),
    });
  },
  
  getRoute: async (routeNumber: string) => {
    return apiCall(`/route/${routeNumber}`);
  },
};
