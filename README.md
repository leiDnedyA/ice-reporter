# ICE Reporter

A community-driven application for reporting and tracking ICE (Immigration and Customs Enforcement) activity in any location. This application allows users to view reported ICE activity on an interactive map and submit new reports with location, descriptions, images, and videos.

## Features

### 🗺️ Interactive Map View
- **Leaflet.js Map**: Interactive map with configurable center location and zoom level
- **Activity Markers**: Red markers indicate reported ICE activity locations
- **Detailed Popups**: Click markers to view detailed information about each sighting
- **Real-time Updates**: New reports appear on the map immediately
- **Optional County Boundaries**: Configurable county/region boundaries with custom styling

### 📝 Report Submission
- **Description Field**: Detailed text description of observed activity
- **Location Input**: Manual address entry or automatic GPS location detection
- **Image Support**: Upload images via URL (e.g., Imgur links)
- **Video Support**: Embed YouTube videos for additional evidence
- **Form Validation**: Ensures required fields are completed

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean Interface**: Modern, accessible design with clear navigation
- **Alert System**: Informational messages and error handling
- **Loading States**: Visual feedback during location detection
- **Full-Screen Map**: Immersive mapping experience

## Technology Stack

- **Frontend Framework**: Next.js 15.3.3 with React 19
- **TypeScript**: Full type safety and better development experience
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Styling**: Custom CSS with modern design principles
- **Geolocation**: Browser's native geolocation API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ice-reporter
```

2. Install dependencies:
```bash
npm install
```

3. Configure the application for your location (see Configuration section below)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Configuration

The application is designed to be location-agnostic and can be easily configured for any city or region. Edit the `APP_CONFIG` object in `pages/index.tsx`:

```typescript
const APP_CONFIG = {
  title: "ICE Reporter", // Your app title
  description: "Report and track ICE activity in your community", // App description
  defaultCenter: [41.8236, -71.4222] as [number, number], // [latitude, longitude] for your location
  defaultZoom: 13, // Initial zoom level (1-18)
  showCountyBoundary: false, // Set to true to show county/region boundaries
  countyBoundary: null // Add GeoJSON data for boundaries if needed
};
```

### Example Configurations

**For Los Angeles, CA:**
```typescript
const APP_CONFIG = {
  title: "ICE Reporter - Los Angeles",
  description: "Report and track ICE activity in Los Angeles County",
  defaultCenter: [34.0522, -118.2437],
  defaultZoom: 10,
  showCountyBoundary: true,
  countyBoundary: losAngelesCountyGeoJSON // Add your GeoJSON data
};
```

**For New York City:**
```typescript
const APP_CONFIG = {
  title: "ICE Reporter - NYC",
  description: "Report and track ICE activity in New York City",
  defaultCenter: [40.7128, -74.0060],
  defaultZoom: 11,
  showCountyBoundary: false,
  countyBoundary: null
};
```

## Usage

### Viewing ICE Activity
1. Navigate to the "View Map" tab
2. The map shows your configured location with red markers indicating reported activity
3. Click on any marker to view detailed information including:
   - Description of the activity
   - Location details
   - Timestamp of the report
   - Associated images or videos

### Reporting ICE Activity
1. Navigate to the "Report Activity" tab
2. Fill out the form with the following information:
   - **Description**: Detailed description of what you observed
   - **Location**: Either enter an address manually or click "Use My Location" for GPS coordinates
   - **Image URL** (optional): Paste a direct link to an image (e.g., from Imgur)
   - **Video URL** (optional): Paste a YouTube video link
3. Click "Submit Report" to add the sighting to the map

### Location Services
- **Manual Entry**: Type in the address or location description
- **GPS Location**: Click "Use My Location" to automatically detect your current position
- **Fallback**: If GPS fails, you can still manually enter location information

## Project Structure

```
ice-reporter/
├── components/
│   └── MapComponent.tsx      # Configurable Leaflet.js map component
├── pages/
│   ├── index.tsx             # Main application page with APP_CONFIG
│   ├── _app.tsx              # App wrapper
│   └── _document.tsx         # Document wrapper
├── styles/
│   └── globals.css           # Global styles and component styles
├── public/                   # Static assets
└── package.json              # Dependencies and scripts
```

## Data Structure

Each ICE activity report contains:
```typescript
interface Sighting {
  id: number;                    // Unique identifier
  description: string;           // Description of the activity
  location: string;              // Human-readable location
  coordinates: [number, number]; // GPS coordinates [lat, lng]
  timestamp: string;             // ISO timestamp
  imageUrl: string | null;       // Optional image URL
  videoUrl: string | null;       // Optional YouTube video URL
}
```

## Important Notes

### Community Guidelines
- **Accuracy**: Please provide accurate and truthful information
- **Verification**: All reports are community-sourced and should be verified independently
- **Privacy**: Be mindful of privacy concerns when reporting activity
- **Safety**: Do not put yourself in danger to gather information

### Technical Limitations
- **Client-side Storage**: Reports are stored in browser memory and will be lost on page refresh
- **No Backend**: This is a frontend-only template; production use would require a backend database
- **Geolocation**: Requires user permission and HTTPS in production
- **Image/Video Hosting**: Users must host media on external services (Imgur, YouTube, etc.)

## Customization Options

### Adding County Boundaries
To add county or regional boundaries:

1. Obtain GeoJSON data for your region
2. Set `showCountyBoundary: true` in APP_CONFIG
3. Add your GeoJSON data to the `countyBoundary` property

### Customizing Map Style
The map uses OpenStreetMap tiles by default. You can customize the map style by modifying the tile layer URL in `MapComponent.tsx`.

### Adding Custom Features
The modular design makes it easy to add:
- Custom marker icons
- Different map layers
- Additional form fields
- Filtering and search functionality

## Future Enhancements

- **Backend Integration**: Database storage for persistent reports
- **User Authentication**: User accounts and report management
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: Filter reports by date, location, or type
- **Mobile App**: Native mobile application
- **API Integration**: Integration with external mapping and geocoding services
- **Moderation System**: Report verification and moderation tools
- **Multi-language Support**: Internationalization for different communities

## Contributing

This is a template application designed to be easily adapted for different communities. For production use, consider:
- Adding a backend API for data persistence
- Implementing user authentication and authorization
- Adding data validation and moderation features
- Integrating with external services for geocoding and media hosting
- Adding analytics and reporting features
- Customizing the interface for your specific community needs

## License

This project is provided as a template for educational and community use. Please ensure compliance with local laws and regulations when deploying this application.

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.
