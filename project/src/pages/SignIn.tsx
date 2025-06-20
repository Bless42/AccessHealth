import React from 'react';
import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import SignInForm from '../components/auth/SignInForm';
import MainLayout from '../components/layouts/MainLayout';

const SignIn: React.FC = () => {
  return (
    <MainLayout>
      <Box py={12}>
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl">Sign in to your account</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <SignInForm />
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default SignIn;