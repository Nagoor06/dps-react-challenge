// src/components/CityMap.tsx
import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  highlight?: boolean;
  lat: number;
  lng: number;
}

interface CityMapProps {
  users: User[];
}

const CityMap: React.FC<CityMapProps> = ({ users }) => {
  const center = { lat: 37.7749, lng: -122.4194 }; // Center the map around San Francisco
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);

  const cityData = users.reduce((acc: any, user) => {
    if (acc[user.city]) {
      acc[user.city].count += 1;
    } else {
      acc[user.city] = {
        lat: user.lat,
        lng: user.lng,
        count: 1
      };
    }
    return acc;
  }, {});

  const handleMarkerClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleMapClick = () => {
    setSelectedCity(null);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAaHrVutOy8uTHaBlweL5TmWxyT0bmLHVI">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={center}
        zoom={4}
        onClick={handleMapClick}
      >
        {Object.entries(cityData).map(([city, data]: any) => (
          <Marker
            key={city}
            position={{ lat: data.lat, lng: data.lng }}
            label={{ text: data.count.toString(), color: 'white' }}
            onClick={() => handleMarkerClick(city)}
          >
            {selectedCity === city && (
              <InfoWindow onCloseClick={handleMapClick}>
                <div>
                  <h2>{city}</h2>
                  <p>Users: {data.count}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default CityMap;
