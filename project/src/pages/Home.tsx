import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Stack, 
  Container, 
  SimpleGrid, 
  Icon, 
  Flex, 
  Image, 
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  VStack,
  Badge,
  Grid,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Users, 
  Shield, 
  Stethoscope, 
  Brain, 
  Truck, 
  MapPin, 
  Pill, 
  BookOpen, 
  Target,
  Phone,
  Video,
  MessageCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';

// Landing page components for non-authenticated users
const Hero = () => {
  return (
    <Box 
      position="relative"
      bg={useColorModeValue('gray.50', 'gray.900')}
      overflow="hidden"
    >
      <Container maxW="container.xl" py={{ base: 12, md: 20 }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 8, md: 12 }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 8 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
            >
              <Text as="span" position="relative">
                Healthcare
              </Text>
              <br />
              <Text as="span" color="brand.500">
                Made Accessible
              </Text>
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              AccessHealth connects you with quality healthcare services, simplifies appointment booking, 
              and helps you manage your health records all in one place. Experience healthcare the way it should be.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                as={RouterLink}
                to="/signup"
                rounded="md"
                size="lg"
                fontWeight="normal"
                px={6}
                colorScheme="brand"
                bg="brand.500"
                _hover={{ bg: 'brand.600' }}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/services"
                rounded="md"
                size="lg"
                fontWeight="normal"
                px={6}
                variant="outline"
              >
                Learn more
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height={{ base: '300px', md: '400px' }}
              width="full"
              overflow="hidden"
              rounded="lg"
            >
              <Image
                alt="Hero Image"
                fit="cover"
                align="center"
                w="100%"
                h="100%"
                src="https://images.pexels.com/photos/6303652/pexels-photo-6303652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

const Feature = ({ title, text, icon }: { title: string; text: string; icon: React.ReactElement }) => {
  return (
    <Stack 
      bg={useColorModeValue('white', 'gray.800')} 
      boxShadow="md" 
      p={6} 
      rounded="lg"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="brand.500"
        mb={4}
      >
        {icon}
      </Flex>
      <Heading as="h3" size="md" mb={3}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </Stack>
  );
};

const Features = () => {
  return (
    <Box py={12} bg={useColorModeValue('white', 'gray.800')}>
      <Container maxW="container.xl">
        <Stack textAlign="center" mb={12}>
          <Heading as="h2" size="xl" mb={2}>
            Why Choose AccessHealth
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.300')} maxW="600px" mx="auto">
            We provide comprehensive healthcare solutions designed to make quality care accessible to everyone.
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <Feature
            icon={<Icon as={Calendar} w={10} h={10} />}
            title="Easy Scheduling"
            text="Book appointments with top healthcare providers quickly and conveniently. No more waiting on hold."
          />
          <Feature
            icon={<Icon as={Heart} w={10} h={10} />}
            title="Personalized Care"
            text="Receive tailored healthcare recommendations based on your unique health profile and needs."
          />
          <Feature
            icon={<Icon as={Shield} w={10} h={10} />}
            title="Secure Records"
            text="Keep all your health information safe, private, and easily accessible whenever you need it."
          />
          <Feature
            icon={<Icon as={Users} w={10} h={10} />}
            title="Expert Providers"
            text="Access a network of qualified healthcare professionals across various specialties."
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const CallToAction = () => {
  return (
    <Box bg="brand.500">
      <Container maxW="container.xl" py={16}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          align="center"
          justify="space-between"
        >
          <Stack flex={1} spacing={4} textAlign={{ base: 'center', md: 'left' }}>
            <Heading color="white" size="lg">
              Ready to take control of your health?
            </Heading>
            <Text color="white" opacity={0.8}>
              Join thousands of people who trust AccessHealth for their healthcare needs.
            </Text>
          </Stack>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <Button
              as={RouterLink}
              to="/signup"
              bg="white"
              color="brand.500"
              _hover={{ bg: 'gray.100' }}
              size="lg"
              rounded="md"
            >
              Get Started
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              variant="outline"
              colorScheme="white"
              size="lg"
              rounded="md"
              color="white"
              _hover={{ bg: 'brand.600', borderColor: 'white' }}
            >
              Contact Us
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

// Interactive home page for authenticated users
const AuthenticatedHome = () => {
  const { user, profile } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.800');

  const quickActions = [
    {
      title: 'Book Consultation',
      description: 'Schedule an appointment with a doctor',
      icon: Stethoscope,
      color: 'blue',
      link: '/consultations',
    },
    {
      title: 'Emergency SOS',
      description: 'Request immediate emergency assistance',
      icon: Phone,
      color: 'red',
      link: '/ambulance',
    },
    {
      title: 'Find Therapist',
      description: 'Connect with mental health professionals',
      icon: Brain,
      color: 'purple',
      link: '/therapy',
    },
    {
      title: 'Locate Pharmacy',
      description: 'Find nearby pharmacies and manage prescriptions',
      icon: Pill,
      color: 'green',
      link: '/pharmacies',
    },
  ];

  const healthServices = [
    {
      title: 'Doctor Consultations',
      description: 'Virtual and in-person consultations with certified doctors',
      icon: Video,
      features: ['24/7 Availability', 'Specialist Access', 'Prescription Management'],
      link: '/consultations',
    },
    {
      title: 'Mental Health Support',
      description: 'Professional therapy and counseling services',
      icon: Brain,
      features: ['Licensed Therapists', 'Progress Tracking', 'Support Groups'],
      link: '/therapy',
    },
    {
      title: 'Emergency Services',
      description: 'Immediate medical assistance when you need it most',
      icon: Truck,
      features: ['GPS Tracking', 'Rapid Response', 'Medical Transport'],
      link: '/ambulance',
    },
    {
      title: 'Health Education',
      description: 'Learn about health topics and preventive care',
      icon: BookOpen,
      features: ['Expert Articles', 'Video Content', 'Health Tips'],
      link: '/health-education',
    },
  ];

  return (
    <MainLayout>
      <Box py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Welcome Section */}
            <Box>
              <Heading size="xl" mb={2}>
                Welcome back, {user?.email?.split('@')[0] || 'User'}!
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Your health dashboard is ready. What would you like to do today?
              </Text>
            </Box>

            {/* Quick Actions */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Quick Actions</Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                    {quickActions.map((action) => (
                      <Button
                        key={action.title}
                        as={RouterLink}
                        to={action.link}
                        height="auto"
                        p={6}
                        variant="outline"
                        colorScheme={action.color}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      >
                        <VStack spacing={3}>
                          <Icon as={action.icon} boxSize={8} />
                          <VStack spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">
                              {action.title}
                            </Text>
                            <Text fontSize="xs" color="gray.500" textAlign="center">
                              {action.description}
                            </Text>
                          </VStack>
                        </VStack>
                      </Button>
                    ))}
                  </Grid>
                </VStack>
              </CardBody>
            </Card>

            {/* Health Services Overview */}
            <Box>
              <Heading size="lg" mb={6}>Our Health Services</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {healthServices.map((service) => (
                  <Card key={service.title} bg={cardBg} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Box
                            p={3}
                            bg="brand.500"
                            color="white"
                            borderRadius="lg"
                          >
                            <Icon as={service.icon} boxSize={6} />
                          </Box>
                          <VStack align="start" spacing={1}>
                            <Heading size="md">{service.title}</Heading>
                            <Text fontSize="sm" color="gray.600">
                              {service.description}
                            </Text>
                          </VStack>
                        </HStack>

                        <VStack align="stretch" spacing={2}>
                          {service.features.map((feature) => (
                            <HStack key={feature}>
                              <Icon as={Activity} size={16} color="green.500" />
                              <Text fontSize="sm">{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>

                        <Button
                          as={RouterLink}
                          to={service.link}
                          colorScheme="brand"
                          variant="outline"
                          size="sm"
                        >
                          Learn More
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </Box>

            {/* Health Tips */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Today's Health Tip</Heading>
                    <Badge colorScheme="green">New</Badge>
                  </HStack>
                  <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="green.500">
                    <HStack>
                      <Icon as={Target} color="green.500" />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color="green.700">
                          Stay Hydrated
                        </Text>
                        <Text fontSize="sm" color="green.600">
                          Drink at least 8 glasses of water daily to maintain optimal health and energy levels.
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                  <Button
                    as={RouterLink}
                    to="/health-education"
                    variant="ghost"
                    colorScheme="green"
                    size="sm"
                    alignSelf="flex-start"
                  >
                    View More Health Tips →
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Emergency Contact */}
            <Card bg="red.50" borderColor="red.200" borderWidth="1px">
              <CardBody>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={Phone} color="red.500" boxSize={6} />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" color="red.700">
                        Emergency Hotline: 911
                      </Text>
                      <Text fontSize="sm" color="red.600">
                        For life-threatening emergencies, call 911 immediately
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    as={RouterLink}
                    to="/ambulance"
                    colorScheme="red"
                    leftIcon={<Truck size={16} />}
                  >
                    Request Ambulance
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  );
};

const Home: React.FC = () => {
  const { user } = useAuth();

  // Show interactive home page for authenticated users
  if (user) {
    return <AuthenticatedHome />;
  }

  // Show landing page for non-authenticated users
  return (
    <Box>
      <Hero />
      <Features />
      <CallToAction />
    </Box>
  );
};

export default Home;
