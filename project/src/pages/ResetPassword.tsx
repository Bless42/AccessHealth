import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const result = await resetPassword(email.trim());
      
      if (result.success) {
        toast({
          title: 'Reset email sent',
          description: 'Check your email for password reset instructions',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email');
        toast({
          title: 'Error',
          description: result.error || 'Failed to send reset email',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Box py={12}>
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl">Reset your password</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Enter your email to receive reset instructions
            </Text>
          </Stack>
          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="lg"
            p={8}
          >
            <Stack spacing={4} as="form" onSubmit={handleSubmit}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <FormControl id="email" isInvalid={!!error}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
              
              <Stack spacing={10}>
                <Button
                  bg="brand.500"
                  color="white"
                  _hover={{
                    bg: 'brand.600',
                  }}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  type="submit"
                  disabled={isSubmitting}
                >
                  Send reset instructions
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default ResetPassword;