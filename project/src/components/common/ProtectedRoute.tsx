import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;