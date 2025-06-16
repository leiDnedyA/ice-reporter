import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';

// Define the Sighting interface
interface Sighting {
  id: number;
  description: string;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

// Define MapComponent props interface
interface MapComponentProps {
  sightings: Sighting[];
  onMarkerClick: (sighting: Sighting) => void;
}

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic<MapComponentProps>(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => <div className="leaflet-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>Loading map...</div>
});

// Sample data for demonstration
const sampleSightings: Sighting[] = [
  {
    id: 1,
    description: "ICE vehicle spotted near Kennedy Plaza",
    location: "Kennedy Plaza, Providence, RI",
    coordinates: [41.8236, -71.4222],
    timestamp: "2024-01-15T10:30:00Z",
    imageUrl: "https://via.placeholder.com/300x200?text=ICE+Activity",
    videoUrl: null
  },
  {
    id: 2,
    description: "ICE agents conducting operations near Federal Hill",
    location: "Federal Hill, Providence, RI",
    coordinates: [41.8189, -71.4128],
    timestamp: "2024-01-14T14:15:00Z",
    imageUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: 3,
    description: "ICE checkpoint reported on Broad Street",
    location: "Broad Street, Providence, RI",
    coordinates: [41.8167, -71.4000],
    timestamp: "2024-01-13T08:45:00Z",
    imageUrl: "https://via.placeholder.com/300x200?text=Checkpoint",
    videoUrl: null
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'report'>('map');
  const [sightings, setSightings] = useState<Sighting[]>(sampleSightings);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);

  return (
    <>
      <Head>
        <title>ICE Reporter - Providence, RI</title>
        <meta name="description" content="Report and track ICE activity in Providence, Rhode Island" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">ICE Reporter - Providence</div>
          <div className="nav-links">
            <button 
              className={`nav-link ${activeTab === 'map' ? 'text-white' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              View Map
            </button>
            <button 
              className={`nav-link ${activeTab === 'report' ? 'text-white' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              Report Activity
            </button>
          </div>
        </div>
      </nav>

      <main className="main-container">
        {activeTab === 'map' ? (
          <div className="map-view">
            <MapComponent 
              sightings={sightings}
              onMarkerClick={setSelectedSighting}
            />
            
            {selectedSighting && (
              <div className="card" style={{ 
                position: 'absolute', 
                top: '100px', 
                right: '20px', 
                width: '350px', 
                zIndex: 1000,
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto'
              }}>
                <div className="card-header">
                  <h3 className="card-title">Sighting Details</h3>
                </div>
                <div className="card-body">
                  <p><strong>Description:</strong> {selectedSighting.description}</p>
                  <p><strong>Location:</strong> {selectedSighting.location}</p>
                  <p><strong>Reported:</strong> {new Date(selectedSighting.timestamp).toLocaleString()}</p>
                  {selectedSighting.imageUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Image:</strong>
                      <Image 
                        src={selectedSighting.imageUrl} 
                        alt="Sighting" 
                        width={300}
                        height={200}
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '0.5rem', borderRadius: '4px' }}
                      />
                    </div>
                  )}
                  {selectedSighting.videoUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Video:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <iframe
                          width="100%"
                          height="200"
                          src={selectedSighting.videoUrl.replace('watch?v=', 'embed/')}
                          title="Sighting Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedSighting(null)}
                    style={{ marginTop: '1rem' }}
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="report-view">
            <div className="card">
              <div className="card-header">
                <h1 className="card-title">Report ICE Activity</h1>
              </div>
              <div className="card-body">
                <ReportForm onReportSubmit={(newSighting: Sighting) => {
                  setSightings([...sightings, { ...newSighting, id: sightings.length + 1 }]);
                  setActiveTab('map');
                }} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function ReportForm({ onReportSubmit }: { onReportSubmit: (sighting: Sighting) => void }) {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    imageUrl: '',
    videoUrl: '',
    useCurrentLocation: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode to get address (simplified - in real app, use a geocoding service)
        setFormData(prev => ({
          ...prev,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          useCurrentLocation: true
        }));
        setLocationError('');
        setIsSubmitting(false);
      },
      () => {
        setLocationError('Unable to retrieve your location. Please enter address manually.');
        setIsSubmitting(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      alert('Please provide a description of the activity.');
      return;
    }

    if (!formData.location.trim()) {
      alert('Please provide a location.');
      return;
    }

    const newSighting: Sighting = {
      description: formData.description,
      location: formData.location,
      coordinates: formData.useCurrentLocation ? 
        formData.location.split(',').map(coord => parseFloat(coord.trim())) as [number, number] : 
        [41.8236, -71.4222], // Default to Providence center
      timestamp: new Date().toISOString(),
      imageUrl: formData.imageUrl || null,
      videoUrl: formData.videoUrl || null,
      id: 0 // Will be set by parent component
    };

    onReportSubmit(newSighting);
    
    // Reset form
    setFormData({
      description: '',
      location: '',
      imageUrl: '',
      videoUrl: '',
      useCurrentLocation: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="alert alert-info">
        <strong>Important:</strong> Please provide accurate information. This helps our community stay informed and safe.
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description of Activity *</label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe what you observed (e.g., ICE vehicles, agents, checkpoints, etc.)"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">Location *</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            id="location"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter address or location"
            required
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={getCurrentLocation}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Getting Location...' : 'Use My Location'}
          </button>
        </div>
        {locationError && <div className="alert alert-error">{locationError}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl" className="form-label">Image URL (Optional)</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          className="form-input"
          value={formData.imageUrl}
          onChange={handleInputChange}
          placeholder="https://imgur.com/example.jpg"
        />
        <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          You can upload images to Imgur and paste the direct link here
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="videoUrl" className="form-label">YouTube Video URL (Optional)</label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          className="form-input"
          value={formData.videoUrl}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=example"
        />
        <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Paste a YouTube video link if you have video evidence
        </small>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => {
          setFormData({
            description: '',
            location: '',
            imageUrl: '',
            videoUrl: '',
            useCurrentLocation: false
          });
        }}>
          Clear Form
        </button>
      </div>
    </form>
  );
}
