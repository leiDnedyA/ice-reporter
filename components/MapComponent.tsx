import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';

interface Sighting {
  id: number;
  description: string;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

interface MapComponentProps {
  sightings: Sighting[];
  onMarkerClick: (sighting: Sighting) => void;
}

// Providence County boundary coordinates (simplified)
const providenceCountyBoundary = {
  "type": "Feature",
  "properties": {
    "name": "Providence County, RI"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-71.9, 41.7],
      [-71.9, 42.0],
      [-71.3, 42.0],
      [-71.3, 41.7],
      [-71.9, 41.7]
    ]]
  }
};

const MapComponent = ({ sightings, onMarkerClick }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const boundaryRef = useRef<L.GeoJSON | null>(null);

  // Memoize the marker click handler to prevent unnecessary re-renders
  const handleMarkerClick = useCallback((event: CustomEvent) => {
    onMarkerClick(event.detail);
  }, [onMarkerClick]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Providence, RI
    const map = L.map(mapRef.current).setView([41.8236, -71.4222], 10);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add Providence County boundary
    const boundaryLayer = L.geoJSON(providenceCountyBoundary as any, {
      style: {
        color: '#dc2626',
        weight: 3,
        fillColor: '#dc2626',
        fillOpacity: 0.1
      }
    }).addTo(map);
    boundaryRef.current = boundaryLayer;

    // Add markers for each sighting
    sightings.forEach(sighting => {
      const marker = L.marker(sighting.coordinates)
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #dc2626;">ICE Activity Report</h4>
            <p style="margin: 0 0 4px 0;"><strong>Location:</strong> ${sighting.location}</p>
            <p style="margin: 0 0 4px 0;"><strong>Reported:</strong> ${new Date(sighting.timestamp).toLocaleDateString()}</p>
            <p style="margin: 0 0 8px 0;">${sighting.description}</p>
            <button onclick="window.dispatchEvent(new CustomEvent('markerClick', {detail: ${JSON.stringify(sighting)}}))" 
                    style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              View Details
            </button>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Listen for marker clicks
    window.addEventListener('markerClick', handleMarkerClick as EventListener);

    return () => {
      // Cleanup
      window.removeEventListener('markerClick', handleMarkerClick as EventListener);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (boundaryRef.current) {
        boundaryRef.current.remove();
        boundaryRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sightings, handleMarkerClick]);

  // Update markers when sightings change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    sightings.forEach(sighting => {
      const marker = L.marker(sighting.coordinates)
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #dc2626;">ICE Activity Report</h4>
            <p style="margin: 0 0 4px 0;"><strong>Location:</strong> ${sighting.location}</p>
            <p style="margin: 0 0 4px 0;"><strong>Reported:</strong> ${new Date(sighting.timestamp).toLocaleDateString()}</p>
            <p style="margin: 0 0 8px 0;">${sighting.description}</p>
            <button onclick="window.dispatchEvent(new CustomEvent('markerClick', {detail: ${JSON.stringify(sighting)}}))" 
                    style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              View Details
            </button>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, [sightings, handleMarkerClick]);

  return <div ref={mapRef} className="leaflet-container" />;
};

export default MapComponent; 