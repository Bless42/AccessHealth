import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Stack,
  Button,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Pharmacy } from '../../types/pharmacy';
import { format } from 'date-fns';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onSelect?: () => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onSelect }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getCurrentDayHours = () => {
    const day = format(new Date(), 'EEEE').toLowerCase();
    return pharmacy.hours[day];
  };

  const hours = getCurrentDayHours();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      p={4}
      _hover={{ transform: 'translateY(-2px)', transition: 'transform 0.2s' }}
    >
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" justify="space-between" align="center">
            <Heading size="md">{pharmacy.name}</Heading>
            <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
              <Star size={14} />
              {pharmacy.rating.toFixed(1)}
            </Badge>
          </Stack>
        </Box>

        <Stack spacing={2}>
          <Text display="flex" alignItems="center" gap={2}>
            <MapPin size={16} />
            {pharmacy.address}
          </Text>

          {pharmacy.contact_info.phone && (
            <Text display="flex" alignItems="center" gap={2}>
              <Phone size={16} />
              {pharmacy.contact_info.phone}
            </Text>
          )}

          <Text display="flex" alignItems="center" gap={2}>
            <Clock size={16} />
            {hours ? `${hours.open} - ${hours.close}` : 'Hours not available'}
          </Text>
        </Stack>

        <Stack direction="row" spacing={4} mt={2}>
          <Button
            as={Link}
            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location_lat},${pharmacy.location_lng}`}
            isExternal
            colorScheme="blue"
            variant="outline"
            size="sm"
            flex={1}
          >
            Get Directions
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            flex={1}
            onClick={onSelect}
          >
            Select Pharmacy
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PharmacyCard;