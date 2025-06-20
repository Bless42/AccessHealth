import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Box, Text, Link, Badge } from '@chakra-ui/react';
import { Pharmacy } from '../../types/pharmacy';

import 'leaflet/dist/leaflet.css';

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacy?: string;
  onPharmacySelect?: (pharmacyId: string) => void;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  selectedPharmacy,
  onPharmacySelect,
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const pharmacyIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const center: [number, number] = userLocation || [0, 0];

  return (
    <Box height="500px" width="100%" position="relative">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={[pharmacy.location_lat, pharmacy.location_lng]}
            icon={pharmacyIcon}
            eventHandlers={{
              click: () => onPharmacySelect?.(pharmacy.id),
            }}
          >
            <Popup>
              <Box>
                <Text fontWeight="bold">{pharmacy.name}</Text>
                <Text fontSize="sm">{pharmacy.address}</Text>
                <Badge colorScheme="green" mt={2}>
                  Rating: {pharmacy.rating.toFixed(1)}
                </Badge>
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location_lat},${pharmacy.location_lng}`}
                  isExternal
                  color="blue.500"
                  display="block"
                  mt={2}
                  fontSize="sm"
                >
                  Get Directions
                </Link>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default PharmacyMap;