import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 21.7679, // Latitude of San Francisco
  lng: 78.8718, // Longitude of San Francisco
};

const DashboardMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Example of custom logic to ensure the map is loaded
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: '100%', height: '400px',marginTop: '20px' }}>
    <LoadScript googleMapsApiKey="AIzaSyBersaeDEX1FoAovB3DXTgVzMS3eBC_GLY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
      >
        {/* Add a marker to the map */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
    </div>
  );
};

export default DashboardMap;