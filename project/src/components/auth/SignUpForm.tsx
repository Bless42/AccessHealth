import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Link,
  useColorModeValue,
  FormErrorMessage,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type UserRole = 'patient' | 'doctor' | 'admin';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, error: authError } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validate = (): boolean => {
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
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Role validation
    if (!role) {
      newErrors.role = 'Please select a role';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signUp(email.trim(), password, role);
      
      if (result.success) {
        toast({
          title: 'Account created successfully!',
          description: 'You can now sign in with your credentials.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/signin');
      } else {
        toast({
          title: 'Sign Up Failed',
          description: result.error || 'Failed to create account. Please try again.',
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
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {authError && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Enter your password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Confirm your password"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.role}>
            <FormLabel>Role</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </Select>
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            isLoading={isSubmitting}
            loadingText="Creating account..."
            disabled={isSubmitting}
          >
            Sign up
          </Button>

          <Text align="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/signin" color="brand.500">
              Sign in
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUpForm;