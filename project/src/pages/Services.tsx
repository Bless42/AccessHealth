import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bot, Pill, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

const ServiceCard = ({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ElementType;
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Card
      bg={cardBg}
      boxShadow="lg"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
      transition="all 0.3s ease"
    >
      <CardBody>
        <Stack spacing={4} align="center" textAlign="center">
          <Box
            p={4}
            bg="brand.500"
            color="white"
            rounded="full"
            boxShadow="md"
          >
            <Icon as={icon} boxSize={8} />
          </Box>
          <Heading size="md">{title}</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.300')}>
            {description}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

const Services = () => {
  return (
    <MainLayout>
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        py={20}
      >
        <Container maxW="container.xl">
          <Stack spacing={12} align="center">
            <Stack spacing={4} textAlign="center" maxW="2xl">
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
              >
                Our Services
              </Heading>
              <Text
                fontSize="xl"
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                Empowering Emergency Healthcare Access
              </Text>
            </Stack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              w="full"
            >
              <ServiceCard
                title="AI Health Consultations"
                description="Speak to an AI assistant about your symptoms and get instant advice. Our advanced AI system provides preliminary assessments and guides you to appropriate care."
                icon={Bot}
              />
              <ServiceCard
                title="Emergency SOS System"
                description="One-tap emergency button to alert nearby responders with your GPS location. Get immediate assistance when every second counts."
                icon={AlertCircle}
              />
              <ServiceCard
                title="Pharmacy Locator"
                description="Find nearby pharmacies, upload prescriptions, and check medication availability. Streamline your pharmacy experience with our digital platform."
                icon={Pill}
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default Services;