import React from 'react';
import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import SignUpForm from '../components/auth/SignUpForm';
import MainLayout from '../components/layouts/MainLayout';

const SignUp: React.FC = () => {
  return (
    <MainLayout>
      <Box py={12}>
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl" textAlign="center">
              Sign up for AccessHealth
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
              to start your healthcare journey with us ✨
            </Text>
          </Stack>
          <SignUpForm />
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default SignUp;