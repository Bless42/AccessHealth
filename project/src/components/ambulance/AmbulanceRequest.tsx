import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import { Truck, MapPin, Clock, Phone } from 'lucide-react';
import { AmbulanceRequest as AmbulanceRequestType } from '../../types/ambulance';
import { useAuth } from '../../context/AuthContext';

interface AmbulanceRequestProps {
  onRequestSubmitted: (request: AmbulanceRequestType) => void;
}

const AmbulanceRequest: React.FC<AmbulanceRequestProps> = ({ onRequestSubmitted }) => {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      toast({
        title: 'Location obtained',
        description: 'Your current location has been captured',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Location error',
        description: 'Unable to get your location. Please ensure location services are enabled.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!emergencyType || !severity || !description || !location) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields and enable location',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call - in real app, this would call your backend
      const newRequest: AmbulanceRequestType = {
        id: `amb_${Date.now()}`,
        patient_id: user?.id || '',
        location_lat: location.lat,
        location_lng: location.lng,
        emergency_type: emergencyType as any,
        severity: severity as any,
        description,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onRequestSubmitted(newRequest);
      onClose();
      
      toast({
        title: 'Ambulance requested',
        description: 'Emergency services have been notified. Help is on the way.',
        status: 'success',
        duration: 5000,
      });

      // Reset form
      setEmergencyType('');
      setSeverity('');
      setDescription('');
      setLocation(null);
    } catch (error) {
      toast({
        title: 'Request failed',
        description: 'Unable to submit ambulance request. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <HStack>
            <Truck size={24} color="red" />
            <Heading size="md">Emergency Ambulance</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text>
              Request an ambulance for emergency medical situations. Our dispatch system
              will send the nearest available ambulance to your location.
            </Text>
            
            <Alert status="warning">
              <AlertIcon />
              <AlertDescription>
                Only use this service for genuine medical emergencies. For non-urgent
                medical needs, please use our consultation services.
              </AlertDescription>
            </Alert>

            <Button
              colorScheme="red"
              size="lg"
              onClick={onOpen}
              leftIcon={<Truck size={20} />}
            >
              Request Ambulance
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Emergency Ambulance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>
                  This is for EMERGENCY situations only. If this is not a life-threatening
                  emergency, please use our consultation services instead.
                </AlertDescription>
              </Alert>

              <FormControl isRequired>
                <FormLabel>Emergency Type</FormLabel>
                <Select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  placeholder="Select emergency type"
                >
                  <option value="medical">General Medical Emergency</option>
                  <option value="accident">Accident/Injury</option>
                  <option value="cardiac">Cardiac Emergency</option>
                  <option value="respiratory">Breathing Problems</option>
                  <option value="trauma">Trauma/Severe Injury</option>
                  <option value="other">Other Emergency</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Severity Level</FormLabel>
                <Select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  placeholder="Select severity"
                >
                  <option value="low">Low - Stable but needs medical attention</option>
                  <option value="medium">Medium - Concerning symptoms</option>
                  <option value="high">High - Serious condition</option>
                  <option value="critical">Critical - Life threatening</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the emergency situation, symptoms, and any relevant medical history..."
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <HStack>
                  <Button
                    onClick={getLocation}
                    isLoading={isGettingLocation}
                    loadingText="Getting location..."
                    leftIcon={<MapPin size={16} />}
                    variant="outline"
                    flex={1}
                  >
                    {location ? 'Location Captured' : 'Get Current Location'}
                  </Button>
                  {location && (
                    <Badge colorScheme="green" p={2}>
                      <MapPin size={12} style={{ marginRight: '4px' }} />
                      Located
                    </Badge>
                  )}
                </HStack>
                {location && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </Text>
                )}
              </FormControl>

              {severity && (
                <Alert status={getSeverityColor(severity) === 'red' ? 'error' : 'warning'}>
                  <AlertIcon />
                  <AlertDescription>
                    Severity: <Badge colorScheme={getSeverityColor(severity)}>{severity.toUpperCase()}</Badge>
                    {severity === 'critical' && ' - Highest priority dispatch'}
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Requesting..."
              isDisabled={!emergencyType || !severity || !description || !location}
            >
              Request Ambulance
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AmbulanceRequest;