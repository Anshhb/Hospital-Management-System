import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [hospitals, setHospitals] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Default location (San Francisco)

  // Set the user's location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error fetching location", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Load the map and perform a nearby search for hospitals
  const handleMapLoad = (map) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
      rankBy: window.google.maps.places.RankBy.DISTANCE, // Sort by proximity
      type: 'hospital' // Only search for hospitals
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setHospitals(results);
      } else {
        console.error("Error fetching nearby hospitals:", status);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyChIFkQKR5V7IJ9VFh4TkmNI0Orwc5UO5k" libraries={['places']}>
      <GoogleMap
        center={currentLocation}
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '400px' }}
        onLoad={handleMapLoad}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            position={{
              lat: hospital.geometry.location.lat(),
              lng: hospital.geometry.location.lng(),
            }}
            title={hospital.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
