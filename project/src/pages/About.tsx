import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Heart, Shield, Clock, Users } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

const Feature = ({ title, text, icon }: {
  title: string;
  text: string;
  icon: React.ElementType;
}) => {
  return (
    <Stack spacing={4}>
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="brand.500"
        mb={1}
      >
        <Icon as={icon} boxSize={8} />
      </Flex>
      <Stack spacing={2}>
        <Text fontWeight={600} fontSize="lg">{title}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>
          {text}
        </Text>
      </Stack>
    </Stack>
  );
};

const About = () => {
  return (
    <MainLayout>
      <Box>
        {/* Hero Section */}
        <Box
          position="relative"
          height={{ base: '400px', lg: '500px' }}
          overflow="hidden"
        >
          <Image
            src="https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg"
            alt="Healthcare professionals"
            objectFit="cover"
            w="full"
            h="full"
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Stack spacing={6} textAlign="center" color="white" maxW="3xl" p={4}>
              <Heading size="2xl">About AccessHealth</Heading>
              <Text fontSize="xl">
                Revolutionizing emergency healthcare access through technology
              </Text>
            </Stack>
          </Box>
        </Box>

        {/* Mission Section */}
        <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
          <Container maxW="container.xl">
            <Stack spacing={12}>
              <Stack spacing={4} textAlign="center">
                <Heading size="xl">Our Mission</Heading>
                <Text
                  fontSize="xl"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  maxW="3xl"
                  mx="auto"
                >
                  To provide fast, intelligent emergency healthcare access to everyone,
                  especially in underserved areas. We believe that quality healthcare
                  should be accessible to all, regardless of location or circumstances.
                </Text>
              </Stack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                <Feature
                  icon={Clock}
                  title="24/7 Availability"
                  text="Round-the-clock access to emergency healthcare services and AI consultations."
                />
                <Feature
                  icon={Shield}
                  title="Secure Platform"
                  text="Advanced encryption and security measures to protect your medical data."
                />
                <Feature
                  icon={Users}
                  title="Community Focus"
                  text="Building a network of healthcare providers and emergency responders."
                />
                <Feature
                  icon={Heart}
                  title="Quality Care"
                  text="Commitment to delivering high-quality healthcare services and support."
                />
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
          <Container maxW="container.xl">
            <Stack spacing={12}>
              <Stack spacing={4} textAlign="center">
                <Heading size="xl">How It Works</Heading>
                <Text
                  fontSize="lg"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  maxW="2xl"
                  mx="auto"
                >
                  AccessHealth connects patients with AI and human responders, tracks
                  emergencies, and keeps your medical data secure. Our platform
                  integrates multiple services to provide comprehensive healthcare
                  solutions.
                </Text>
              </Stack>

              <Box
                borderRadius="lg"
                overflow="hidden"
                boxShadow="xl"
                bg={useColorModeValue('white', 'gray.800')}
              >
                <Image
                  src="https://images.pexels.com/photos/3846035/pexels-photo-3846035.jpeg"
                  alt="Healthcare technology"
                  w="full"
                  h="400px"
                  objectFit="cover"
                />
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default About;