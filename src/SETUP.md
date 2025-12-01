# AMTS Connect - Setup Guide

## Google Maps API Integration

This app uses Google Maps API for real-time bus tracking. To enable this feature:

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. (Optional but recommended) Restrict the API key to your domain

### 2. Add API Key to Environment

The app will prompt you to add your Google Maps API key to the `GOOGLE_MAPS_API_KEY` environment variable.

### 3. Features Using the API

- **Live Bus Tracking**: Real-time bus location updates
- **Route Finder**: Find optimal routes between locations
- **Nearby Stop**: Locate bus stops near your current position
- **Where is My Bus**: Track specific buses on routes

## Database Features

The app now saves data to Supabase:

### Ticket Bookings
- All ticket bookings are saved with booking IDs
- View all bookings in the Admin Dashboard
- Includes passenger details, route info, and fare

### Complaints
- Complaints are stored with unique IDs
- Track complaint status and history
- Optional photo evidence is saved
- Notification preferences are stored

### Bus Tracking Data
- Real-time bus locations are persisted
- Bus positions update every 5 seconds
- Historical tracking data is maintained

## Admin Dashboard

Access the Admin Dashboard from the home screen to:
- View all ticket bookings
- Monitor complaints and their status
- Track system usage

## API Endpoints

The backend server provides the following endpoints:

### Ticket Booking
- `POST /ticket-booking` - Create a new booking
- `GET /ticket-bookings` - Get all bookings
- `GET /ticket-booking/:id` - Get specific booking

### Complaints
- `POST /complaint` - Submit a complaint
- `GET /complaints` - Get all complaints
- `GET /complaint/:id` - Get specific complaint
- `PUT /complaint/:id/status` - Update complaint status

### Bus Tracking
- `GET /bus-tracking` - Get all active buses
- `GET /bus-tracking?route=X` - Get buses on specific route
- `POST /bus-location` - Update single bus location
- `POST /bus-locations-batch` - Batch update bus locations
- `GET /route/:routeNumber` - Get route details with active buses

## Important Notes

⚠️ **Privacy Notice**: This app is designed for prototyping and demos. Do not use it to collect sensitive personal information in production environments.

⚠️ **API Costs**: Google Maps API usage may incur costs. Make sure to set up billing alerts and usage limits in the Google Cloud Console.

⚠️ **Data Storage**: All data is stored in Supabase's key-value store. For production use, consider implementing proper data retention and privacy policies.
