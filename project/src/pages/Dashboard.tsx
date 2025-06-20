import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  Progress,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { 
  Calendar, 
  Clock, 
  File, 
  Bell, 
  Heart, 
  Activity, 
  Users, 
  Stethoscope,
  FileText,
  Pill,
  Brain,
  MapPin,
  Phone,
  Video,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Mock data for the dashboard
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      date: 'Oct 15, 2025',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'virtual',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: 'Oct 21, 2025',
      time: '2:30 PM',
      status: 'pending',
      type: 'in_person',
    },
  ];

  const recentDocuments = [
    {
      id: 1,
      name: 'Blood Test Results',
      date: 'Sep 30, 2025',
      type: 'Lab Result',
      status: 'new',
    },
    {
      id: 2,
      name: 'Vaccination Record',
      date: 'Aug 15, 2025',
      type: 'Immunization',
      status: 'viewed',
    },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'normal', color: 'green' },
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', color: 'green' },
    { label: 'Weight', value: '70 kg', status: 'stable', color: 'blue' },
    { label: 'BMI', value: '22.5', status: 'healthy', color: 'green' },
  ];

  const quickActions = [
    {
      title: 'Schedule Appointment',
      description: 'Book a consultation with a doctor',
      icon: Calendar,
      color: 'blue',
      link: '/consultations',
    },
    {
      title: 'View Medical Records',
      description: 'Access your complete health history',
      icon: FileText,
      color: 'green',
      link: '/medical-records',
    },
    {
      title: 'Manage Prescriptions',
      description: 'Track and refill your medications',
      icon: Pill,
      color: 'purple',
      link: '/prescriptions',
    },
    {
      title: 'Find Pharmacy',
      description: 'Locate nearby pharmacies',
      icon: MapPin,
      color: 'orange',
      link: '/pharmacies',
    },
    {
      title: 'Mental Health',
      description: 'Access therapy and counseling',
      icon: Brain,
      color: 'pink',
      link: '/therapy',
    },
    {
      title: 'Emergency Services',
      description: 'Request immediate assistance',
      icon: Phone,
      color: 'red',
      link: '/ambulance',
    },
  ];

  return (
    <MainLayout>
      <Box py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
          >
            <Box>
              <Heading size="lg" mb={2}>
                Welcome back, {user?.email?.split('@')[0] || 'User'}
              </Heading>
              <Text color={textColor}>
                Here's a summary of your health information and upcoming appointments.
              </Text>
            </Box>
            <Button
              leftIcon={<Icon as={Bell} />}
              colorScheme="brand"
              variant="outline"
              mt={{ base: 4, md: 0 }}
            >
              Notifications
            </Button>
          </Flex>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Upcoming Appointments</StatLabel>
                  <StatNumber>2</StatNumber>
                  <StatHelpText>Next: Oct 15</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Recent Documents</StatLabel>
                  <StatNumber>2</StatNumber>
                  <StatHelpText>Last updated: Sep 30</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Health Metrics</StatLabel>
                  <StatNumber>4</StatNumber>
                  <StatHelpText>All normal ranges</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} boxShadow="md">
              <CardBody>
                <Stat>
                  <StatLabel>Medication Reminders</StatLabel>
                  <StatNumber>1</StatNumber>
                  <StatHelpText>Next: Today, 8 PM</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Quick Actions */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    as={RouterLink}
                    to={action.link}
                    height="auto"
                    p={4}
                    variant="outline"
                    colorScheme={action.color}
                    justifyContent="flex-start"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                  >
                    <HStack spacing={3} width="100%">
                      <Icon as={action.icon} boxSize={5} />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="bold" fontSize="sm">
                          {action.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {action.description}
                        </Text>
                      </VStack>
                      <Icon as={ArrowRight} boxSize={4} />
                    </HStack>
                  </Button>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Upcoming Appointments */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Upcoming Appointments</Heading>
                  <Icon as={Calendar} color="brand.500" />
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {upcomingAppointments.map((appointment) => (
                    <Box
                      key={appointment.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ boxShadow: 'sm' }}
                      transition="box-shadow 0.2s"
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="sm">{appointment.doctor}</Heading>
                        <HStack>
                          <Badge
                            colorScheme={
                              appointment.status === 'confirmed' ? 'green' : 'yellow'
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Badge variant="outline">
                            {appointment.type === 'virtual' ? 'Virtual' : 'In-Person'}
                          </Badge>
                        </HStack>
                      </Flex>
                      <Text fontSize="sm" color={textColor}>
                        {appointment.specialty}
                      </Text>
                      <Flex mt={2} align="center">
                        <Icon as={Calendar} mr={2} boxSize="4" />
                        <Text fontSize="sm">{appointment.date}</Text>
                        <Icon as={Clock} ml={4} mr={2} boxSize="4" />
                        <Text fontSize="sm">{appointment.time}</Text>
                      </Flex>
                      {appointment.type === 'virtual' && appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          leftIcon={<Video size={16} />}
                          mt={3}
                        >
                          Join Video Call
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Button
                    as={RouterLink}
                    to="/consultations"
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    leftIcon={<Plus size={16} />}
                  >
                    Schedule New Appointment
                  </Button>
                </Stack>
              </CardBody>
            </Card>

            {/* Recent Documents */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Recent Documents</Heading>
                  <Icon as={File} color="brand.500" />
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {recentDocuments.map((document) => (
                    <Box
                      key={document.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ boxShadow: 'sm' }}
                      transition="box-shadow 0.2s"
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="sm">{document.name}</Heading>
                        <HStack>
                          <Badge colorScheme="blue">{document.type}</Badge>
                          {document.status === 'new' && (
                            <Badge colorScheme="red">New</Badge>
                          )}
                        </HStack>
                      </Flex>
                      <Flex align="center">
                        <Icon as={Calendar} mr={2} boxSize="4" />
                        <Text fontSize="sm">{document.date}</Text>
                      </Flex>
                    </Box>
                  ))}
                  <Button
                    as={RouterLink}
                    to="/medical-records"
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    leftIcon={<FileText size={16} />}
                  >
                    View All Documents
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Health Metrics */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Health Metrics</Heading>
                <Icon as={Activity} color="brand.500" />
              </Flex>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {healthMetrics.map((metric) => (
                  <VStack key={metric.label} spacing={2}>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      {metric.label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {metric.value}
                    </Text>
                    <Badge colorScheme={metric.color} variant="subtle">
                      {metric.status}
                    </Badge>
                  </VStack>
                ))}
              </SimpleGrid>
              <Divider my={4} />
              <Button
                as={RouterLink}
                to="/health-metrics"
                variant="ghost"
                colorScheme="brand"
                size="sm"
                leftIcon={<Heart size={16} />}
              >
                View Detailed Health Report
              </Button>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;