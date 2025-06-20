import React from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  SimpleGrid, 
  Text, 
  Link, 
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container as={Stack} maxW="container.xl" py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Stack direction="row" align="center" spacing={2}>
                <Activity size={24} color={useColorModeValue('#3182CE', '#4EA2E4')} />
                <Text fontSize="lg" fontWeight="bold">
                  AccessHealth
                </Text>
              </Stack>
            </Box>
            <Text fontSize="sm">
              Making healthcare accessible for everyone, everywhere.
            </Text>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="semibold" fontSize="md" mb={2}>Company</Text>
            <Link as={RouterLink} to="/about">About</Link>
            <Link as={RouterLink} to="/services">Services</Link>
            <Link as={RouterLink} to="/contact">Contact</Link>
            <Link as={RouterLink} to="/careers">Careers</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="semibold" fontSize="md" mb={2}>Support</Text>
            <Link as={RouterLink} to="/help">Help Center</Link>
            <Link as={RouterLink} to="/terms">Terms of Service</Link>
            <Link as={RouterLink} to="/privacy">Privacy Policy</Link>
            <Link as={RouterLink} to="/faq">FAQ</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="semibold" fontSize="md" mb={2}>Connect</Text>
            <Link href="https://twitter.com" isExternal>Twitter</Link>
            <Link href="https://facebook.com" isExternal>Facebook</Link>
            <Link href="https://instagram.com" isExternal>Instagram</Link>
            <Link href="https://linkedin.com" isExternal>LinkedIn</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      
      <Divider borderColor={useColorModeValue('gray.200', 'gray.700')} />
      
      <Box py={4}>
        <Container maxW="container.xl">
          <Text textAlign="center" fontSize="sm">
            © {new Date().getFullYear()} AccessHealth. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;