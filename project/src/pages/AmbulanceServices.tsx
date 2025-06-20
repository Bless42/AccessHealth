import React, { useState } from 'react';
import {
  Box,
  Grid,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Truck, MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '../components/layouts/MainLayout';
import AmbulanceRequest from '../components/ambulance/AmbulanceRequest';
import { AmbulanceRequest as AmbulanceRequestType } from '../types/ambulance';

const AmbulanceServices: React.FC = () => {
  const [requests, setRequests] = useState<AmbulanceRequestType[]>([]);
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleRequestSubmitted = (request: AmbulanceRequestType) => {
    setRequests([request, ...requests]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'dispatched': return 'blue';
      case 'en_route': return 'orange';
      case 'arrived': return 'green';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
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
    <MainLayout>
      <Box py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>Emergency Ambulance Services</Heading>
            <Text color="gray.600" fontSize="lg">
              Fast, reliable emergency medical transportation when you need it most.
            </Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Request Ambulance */}
            <AmbulanceRequest onRequestSubmitted={handleRequestSubmitted} />

            {/* Service Information */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">How It Works</Heading>
                  
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Box
                        w={8}
                        h={8}
                        bg="brand.500"
                        color="white"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                      >
                        1
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Request Ambulance</Text>
                        <Text fontSize="sm" color="gray.600">
                          Provide your location and emergency details
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack>
                      <Box
                        w={8}
                        h={8}
                        bg="brand.500"
                        color="white"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                      >
                        2
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Dispatch & Route</Text>
                        <Text fontSize="sm" color="gray.600">
                          Nearest ambulance is dispatched to your location
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack>
                      <Box
                        w={8}
                        h={8}
                        bg="brand.500"
                        color="white"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                      >
                        3
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Medical Care</Text>
                        <Text fontSize="sm" color="gray.600">
                          Paramedics provide immediate medical attention
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack>
                      <Box
                        w={8}
                        h={8}
                        bg="brand.500"
                        color="white"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                      >
                        4
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Hospital Transport</Text>
                        <Text fontSize="sm" color="gray.600">
                          Safe transport to the nearest appropriate facility
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                    <HStack>
                      <Phone size={20} color="blue" />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" color="blue.700">
                          Emergency Hotline: 911
                        </Text>
                        <Text fontSize="sm" color="blue.600">
                          For life-threatening emergencies, call 911 immediately
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Request History */}
          {requests.length > 0 && (
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Your Emergency Requests</Heading>
                  
                  <VStack spacing={3} align="stretch">
                    {requests.map((request) => (
                      <Box
                        key={request.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ boxShadow: 'md' }}
                      >
                        <HStack justify="space-between" mb={3}>
                          <HStack>
                            <AlertTriangle size={20} />
                            <Text fontWeight="bold">{request.emergency_type.replace('_', ' ')}</Text>
                          </HStack>
                          <HStack>
                            <Badge colorScheme={getStatusColor(request.status)}>
                              {request.status.replace('_', ' ')}
                            </Badge>
                            <Badge colorScheme={getSeverityColor(request.severity)}>
                              {request.severity}
                            </Badge>
                          </HStack>
                        </HStack>

                        <Text fontSize="sm" color="gray.600" mb={3}>
                          {request.description}
                        </Text>

                        <HStack justify="space-between" fontSize="sm" color="gray.500">
                          <HStack>
                            <MapPin size={14} />
                            <Text>
                              {request.location_lat.toFixed(4)}, {request.location_lng.toFixed(4)}
                            </Text>
                          </HStack>
                          <HStack>
                            <Clock size={14} />
                            <Text>
                              {format(new Date(request.created_at), 'PPp')}
                            </Text>
                          </HStack>
                        </HStack>

                        {request.estimated_arrival && (
                          <Box mt={3} p={2} bg="green.50" borderRadius="md">
                            <Text fontSize="sm" color="green.700">
                              Estimated arrival: {request.estimated_arrival}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </MainLayout>
  );
};

export default AmbulanceServices;