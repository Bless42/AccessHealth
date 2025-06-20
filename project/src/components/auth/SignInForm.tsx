import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  magicLinkEmail?: string;
}

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSubmitting, setIsMagicLinkSubmitting] = useState(false);
  const { signIn, signInWithMagicLink, error: authError } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password form validation
  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Magic link form validation
  const validateMagicLinkForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!magicLinkEmail.trim()) {
      newErrors.magicLinkEmail = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(magicLinkEmail.trim())) {
      newErrors.magicLinkEmail = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signIn(email.trim(), password);
      
      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } else {
        toast({
          title: 'Sign In Failed',
          description: result.error || 'Invalid email or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMagicLinkForm()) {
      return;
    }

    setIsMagicLinkSubmitting(true);
    setErrors({});

    try {
      const result = await signInWithMagicLink(magicLinkEmail.trim());
      
      if (result.success) {
        toast({
          title: 'Magic link sent!',
          description: 'Please check your email for the login link.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setMagicLinkEmail('');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send magic link',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsMagicLinkSubmitting(false);
    }
  };

  return (
    <Box
      rounded="lg"
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow="lg"
      p={8}
      width="100%"
      maxW="md"
      mx="auto"
    >
      <Stack spacing={6}>
        {authError && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        {/* Password Sign In Form */}
        <form onSubmit={handlePasswordSubmit}>
          <Stack spacing={4}>
            <FormControl id="signin-email" isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            
            <FormControl id="signin-password" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            
            <Stack spacing={5}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align="start"
                justify="space-between"
              >
                <Link as={RouterLink} to="/reset-password" color="brand.500">
                  Forgot password?
                </Link>
              </Stack>
              
              <Button
                bg="brand.500"
                color="white"
                _hover={{
                  bg: 'brand.600',
                }}
                type="submit"
                isLoading={isSubmitting}
                loadingText="Signing in..."
                disabled={isSubmitting}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </form>

        <Divider my={6} />

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLinkSubmit}>
          <Stack spacing={4}>
            <Text align="center" fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              Or sign in with a magic link
            </Text>
            
            <FormControl id="magic-link-email" isInvalid={!!errors.magicLinkEmail}>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email"
                name="magic-link-email"
                autoComplete="email"
                value={magicLinkEmail}
                onChange={(e) => setMagicLinkEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.magicLinkEmail}</FormErrorMessage>
            </FormControl>

            <Button
              variant="outline"
              colorScheme="brand"
              type="submit"
              isLoading={isMagicLinkSubmitting}
              loadingText="Sending link..."
              disabled={isMagicLinkSubmitting}
            >
              Send Magic Link
            </Button>
          </Stack>
        </form>
        
        <Stack pt={6}>
          <Text align="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="brand.500">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignInForm;