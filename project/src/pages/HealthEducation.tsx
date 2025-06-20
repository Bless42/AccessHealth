import React from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/layouts/MainLayout';
import HealthEducation from '../components/education/HealthEducation';

const HealthEducationPage: React.FC = () => {
  return (
    <MainLayout>
      <Box py={8}>
        <HealthEducation />
      </Box>
    </MainLayout>
  );
};

export default HealthEducationPage;