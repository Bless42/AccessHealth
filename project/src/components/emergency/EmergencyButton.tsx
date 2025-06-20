import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EmergencyLocation } from '../../types/emergency';
import { useAuth } from '../../context/AuthContext';

const EmergencyButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const getLocation = (): Promise<EmergencyLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        () => {
          reject(new Error('Unable to get your location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const handleEmergency = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setLocationError(null);

      const location = await getLocation();

      const { error } = await supabase.from('emergencies').insert({
        patient_id: user.id,
        location_lat: location.latitude,
        location_lng: location.longitude,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Emergency alert sent',
        description: 'Help is on the way. Stay calm and wait for assistance.',
        status: 'success',
        duration: null,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send emergency alert';
      setLocationError(message);
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box position="fixed" bottom="4" right="4" zIndex="overlay">
        <Button
          size="lg"
          colorScheme="red"
          onClick={onOpen}
          leftIcon={<AlertCircle />}
          className="emergency-button"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            bottom: '-4px',
            left: '-4px',
            border: '2px solid',
            borderColor: 'red.500',
            borderRadius: 'lg',
            animation: 'pulse 2s infinite',
          }}
        >
          SOS
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Emergency Assistance</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {locationError && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <VStack spacing={4} py={4}>
                  <Spinner size="xl" color="red.500" />
                  <Text>Sending emergency alert...</Text>
                </VStack>
              ) : (
                <Text>
                  This will alert emergency responders and share your current location.
                  Only use this in genuine emergencies.
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleEmergency}
              isLoading={isLoading}
              loadingText="Sending Alert"
            >
              Send Emergency Alert
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .emergency-button {
          transition: transform 0.2s;
        }

        .emergency-button:hover {
          transform: scale(1.05);
        }

        .emergency-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default EmergencyButton;