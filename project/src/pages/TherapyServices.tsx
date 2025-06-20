import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import MainLayout from '../components/layouts/MainLayout';
import TherapistSearch from '../components/therapy/TherapistSearch';
import ProgressTracker from '../components/therapy/ProgressTracker';
import { Therapist } from '../types/therapy';

const TherapyServices: React.FC = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    // Here you would typically navigate to appointment scheduling
    console.log('Selected therapist:', therapist);
  };

  return (
    <MainLayout>
      <Box py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>Mental Health & Therapy Services</Heading>
            <Text color="gray.600" fontSize="lg">
              Professional mental health support for your emotional well-being and personal growth.
            </Text>
          </Box>

          <Tabs>
            <TabList>
              <Tab>Find Therapist</Tab>
              <Tab>Progress Tracker</Tab>
              <Tab>Support Groups</Tab>
              <Tab>Resources</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <TherapistSearch onTherapistSelect={handleTherapistSelect} />
              </TabPanel>

              <TabPanel px={0}>
                <ProgressTracker />
              </TabPanel>

              <TabPanel px={0}>
                <Box>
                  <Heading size="md" mb={4}>Support Groups</Heading>
                  <Text>Support group features will be implemented here</Text>
                </Box>
              </TabPanel>

              <TabPanel px={0}>
                <Box>
                  <Heading size="md" mb={4}>Mental Health Resources</Heading>
                  <Text>Mental health resources and educational content will be displayed here</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </MainLayout>
  );
};

export default TherapyServices;