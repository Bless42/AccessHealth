import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { BodyLocation } from '../../types/consultation';

interface BodyMapProps {
  onLocationSelect: (location: string) => void;
}

const BodyMap: React.FC<BodyMapProps> = ({ onLocationSelect }) => {
  const [selectedPoint, setSelectedPoint] = useState<BodyLocation | null>(null);
  const bgColor = useColorModeValue('white', 'gray.800');

  const bodyParts = [
    { name: 'Head', y: 5 },
    { name: 'Neck', y: 10 },
    { name: 'Chest', y: 20 },
    { name: 'Abdomen', y: 35 },
    { name: 'Arms', y: 25 },
    { name: 'Legs', y: 60 },
    { name: 'Back', y: 30 },
  ];

  const handleClick = (part: string) => {
    onLocationSelect(part);
  };

  return (
    <Stack spacing={4}>
      <Box
        position="relative"
        width="100%"
        maxW="300px"
        mx="auto"
        bg={bgColor}
        borderRadius="lg"
        p={4}
      >
        <Image
          src="https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg"
          alt="Body Map"
          width="100%"
          height="auto"
        />
        {bodyParts.map((part) => (
          <Button
            key={part.name}
            size="sm"
            position="absolute"
            left="50%"
            top={`${part.y}%`}
            transform="translate(-50%, -50%)"
            onClick={() => handleClick(part.name)}
            variant="ghost"
            _hover={{ bg: 'brand.100' }}
          >
            {part.name}
          </Button>
        ))}
      </Box>
      
      <Text fontSize="sm" color="gray.500" textAlign="center">
        Click on a body part to select the location of your symptom
      </Text>
    </Stack>
  );
};

export default BodyMap;