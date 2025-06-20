import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

const ContactInfo = ({ icon, title, content }: {
  icon: React.ElementType;
  title: string;
  content: string;
}) => {
  return (
    <Stack
      direction="row"
      spacing={4}
      align="center"
      p={4}
      rounded="lg"
      bg={useColorModeValue('white', 'gray.800')}
      shadow="md"
    >
      <Box
        p={2}
        bg="brand.500"
        color="white"
        rounded="lg"
      >
        <Icon as={icon} boxSize={6} />
      </Box>
      <Stack spacing={1}>
        <Text fontWeight="bold">{title}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>
          {content}
        </Text>
      </Stack>
    </Stack>
  );
};

const Contact = () => {
  const formBg = useColorModeValue('white', 'gray.800');
  
  return (
    <MainLayout>
      <Box py={20}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} textAlign="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
              >
                Contact Us
              </Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue('gray.600', 'gray.300')}
                maxW="2xl"
                mx="auto"
              >
                Have questions about AccessHealth? We're here to help. Reach out to
                our team through any of the channels below.
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <Stack spacing={8}>
                <Box
                  bg={formBg}
                  p={8}
                  rounded="lg"
                  shadow="lg"
                >
                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Your name" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" placeholder="your@email.com" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        placeholder="How can we help?"
                        rows={6}
                      />
                    </FormControl>
                    <Tooltip
                      label="This is a prototype. Form submission is not implemented."
                      placement="top"
                    >
                      <Button
                        colorScheme="brand"
                        size="lg"
                        isDisabled
                      >
                        Send Message
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>
              </Stack>

              <Stack spacing={8}>
                <Stack spacing={4}>
                  <ContactInfo
                    icon={Mail}
                    title="Email"
                    content="support@accesshealth.app"
                  />
                  <ContactInfo
                    icon={Phone}
                    title="Phone"
                    content="+234-800-HEALTH"
                  />
                  <ContactInfo
                    icon={MapPin}
                    title="Address"
                    content="Plot 7, HealthTech Drive, Abuja"
                  />
                </Stack>

                <Box
                  h="300px"
                  bg="gray.100"
                  rounded="lg"
                  shadow="md"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    <Stack spacing={2} align="center">
                      <Icon as={MapPin} boxSize={8} color="gray.400" />
                      <Text color="gray.500">Map placeholder</Text>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default Contact;