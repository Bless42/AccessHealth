import React from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/layouts/MainLayout';
import PreventiveCare from '../components/education/PreventiveCare';

const PreventiveCarePage: React.FC = () => {
  return (
    <MainLayout>
      <Box py={8}>
        <PreventiveCare />
      </Box>
    </MainLayout>
  );
};

export default PreventiveCarePage;