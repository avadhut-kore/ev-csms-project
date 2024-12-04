import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Layout from '@/components/Layout';

// Customize the container size and the map center/zoom as needed
const containerStyle = {
  width: '100%',
  height: '90vh',
};

const center = {
    lat: 21.7679, // Latitude of San Francisco
    lng: 78.8718, // Longitude of San Francisco
  };

const NetworkMap = () => {
  return (
    <Layout>
<div >
<LoadScript googleMapsApiKey="AIzaSyBersaeDEX1FoAovB3DXTgVzMS3eBC_GLY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {/* You can add more markers or other map features */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
</div>
    </Layout>
  );
};

export default NetworkMap;
