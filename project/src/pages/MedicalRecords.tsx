import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { 
  FileText, 
  Heart, 
  Shield, 
  Calendar, 
  Download, 
  Eye, 
  Plus,
  Activity,
  Pill,
  Stethoscope,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

interface MedicalRecord {
  id: string;
  type: 'lab_result' | 'prescription' | 'visit_summary' | 'imaging' | 'vaccination';
  title: string;
  date: string;
  provider: string;
  status: 'normal' | 'abnormal' | 'pending' | 'completed';
  summary: string;
}

interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Mock data - in real app, this would come from your backend
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        type: 'lab_result',
        title: 'Complete Blood Count (CBC)',
        date: '2024-10-15',
        provider: 'Dr. Sarah Johnson',
        status: 'normal',
        summary: 'All blood parameters within normal range. Hemoglobin: 14.2 g/dL, WBC: 6,800/μL',
      },
      {
        id: '2',
        type: 'prescription',
        title: 'Lisinopril 10mg',
        date: '2024-10-10',
        provider: 'Dr. Michael Chen',
        status: 'completed',
        summary: 'Blood pressure medication. Take once daily in the morning.',
      },
      {
        id: '3',
        type: 'visit_summary',
        title: 'Annual Physical Examination',
        date: '2024-09-28',
        provider: 'Dr. Sarah Johnson',
        status: 'completed',
        summary: 'Comprehensive physical exam. Overall health excellent. Continue current lifestyle.',
      },
      {
        id: '4',
        type: 'vaccination',
        title: 'Influenza Vaccine',
        date: '2024-09-15',
        provider: 'AccessHealth Clinic',
        status: 'completed',
        summary: 'Annual flu vaccination administered. No adverse reactions observed.',
      },
      {
        id: '5',
        type: 'imaging',
        title: 'Chest X-Ray',
        date: '2024-08-20',
        provider: 'Radiology Associates',
        status: 'normal',
        summary: 'Clear lung fields. No acute cardiopulmonary abnormalities detected.',
      },
    ];

    const mockMetrics: HealthMetric[] = [
      {
        name: 'Blood Pressure',
        value: '120/80',
        unit: 'mmHg',
        status: 'normal',
        lastUpdated: '2024-10-15',
        trend: 'stable',
      },
      {
        name: 'Heart Rate',
        value: '72',
        unit: 'bpm',
        status: 'normal',
        lastUpdated: '2024-10-15',
        trend: 'stable',
      },
      {
        name: 'Weight',
        value: '70',
        unit: 'kg',
        status: 'normal',
        lastUpdated: '2024-10-10',
        trend: 'down',
      },
      {
        name: 'BMI',
        value: '22.5',
        unit: '',
        status: 'normal',
        lastUpdated: '2024-10-10',
        trend: 'stable',
      },
      {
        name: 'Cholesterol',
        value: '180',
        unit: 'mg/dL',
        status: 'normal',
        lastUpdated: '2024-09-28',
        trend: 'down',
      },
      {
        name: 'Blood Sugar',
        value: '95',
        unit: 'mg/dL',
        status: 'normal',
        lastUpdated: '2024-09-28',
        trend: 'stable',
      },
    ];

    setRecords(mockRecords);
    setHealthMetrics(mockMetrics);
  }, []);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return Activity;
      case 'prescription': return Pill;
      case 'visit_summary': return Stethoscope;
      case 'vaccination': return Shield;
      case 'imaging': return Eye;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'green';
      case 'completed': return 'blue';
      case 'abnormal': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'green';
      case 'high': return 'red';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <MainLayout>
      <Box py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" mb={2}>Medical Records</Heading>
            <Text color="gray.600" fontSize="lg">
              Access and manage your complete health information in one secure place.
            </Text>
          </Box>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Records</StatLabel>
                  <StatNumber>{records.length}</StatNumber>
                  <StatHelpText>Last updated today</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Lab Results</StatLabel>
                  <StatNumber>{records.filter(r => r.type === 'lab_result').length}</StatNumber>
                  <StatHelpText>All within normal range</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Prescriptions</StatLabel>
                  <StatNumber>{records.filter(r => r.type === 'prescription').length}</StatNumber>
                  <StatHelpText>No interactions found</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Vaccinations</StatLabel>
                  <StatNumber>{records.filter(r => r.type === 'vaccination').length}</StatNumber>
                  <StatHelpText>Up to date</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content */}
          <Tabs>
            <TabList>
              <Tab>All Records</Tab>
              <Tab>Health Metrics</Tab>
              <Tab>Lab Results</Tab>
              <Tab>Prescriptions</Tab>
              <Tab>Vaccinations</Tab>
            </TabList>

            <TabPanels>
              {/* All Records */}
              <TabPanel px={0}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Recent Medical Records</Heading>
                      <Button
                        leftIcon={<Plus size={16} />}
                        colorScheme="brand"
                        size="sm"
                      >
                        Request Records
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {records.map((record) => (
                        <Box
                          key={record.id}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          _hover={{ boxShadow: 'md' }}
                        >
                          <HStack justify="space-between" mb={3}>
                            <HStack>
                              <Icon as={getRecordIcon(record.type)} boxSize={5} color="brand.500" />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">{record.title}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {record.provider} • {format(new Date(record.date), 'PPP')}
                                </Text>
                              </VStack>
                            </HStack>
                            <HStack>
                              <Badge colorScheme={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                              <Button size="sm" variant="outline" leftIcon={<Eye size={14} />}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" leftIcon={<Download size={14} />}>
                                Download
                              </Button>
                            </HStack>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {record.summary}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Health Metrics */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>
                      Your health metrics are automatically updated from connected devices and lab results.
                    </AlertDescription>
                  </Alert>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {healthMetrics.map((metric) => (
                      <Card key={metric.name} bg={cardBg}>
                        <CardBody>
                          <VStack spacing={3}>
                            <Text fontWeight="bold" textAlign="center">
                              {metric.name}
                            </Text>
                            <HStack>
                              <Text fontSize="2xl" fontWeight="bold">
                                {metric.value}
                              </Text>
                              <Text color="gray.500">{metric.unit}</Text>
                              <Text>{getTrendIcon(metric.trend)}</Text>
                            </HStack>
                            <Badge colorScheme={getMetricStatusColor(metric.status)}>
                              {metric.status}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              Updated: {format(new Date(metric.lastUpdated), 'PP')}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              {/* Lab Results */}
              <TabPanel px={0}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Laboratory Results</Heading>
                  </CardHeader>
                  <CardBody>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Test Name</Th>
                          <Th>Date</Th>
                          <Th>Provider</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {records.filter(r => r.type === 'lab_result').map((record) => (
                          <Tr key={record.id}>
                            <Td>{record.title}</Td>
                            <Td>{format(new Date(record.date), 'PP')}</Td>
                            <Td>{record.provider}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack>
                                <Button size="sm" variant="outline">View</Button>
                                <Button size="sm" variant="ghost">Download</Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Prescriptions */}
              <TabPanel px={0}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Prescription History</Heading>
                      <Button
                        as={RouterLink}
                        to="/prescriptions"
                        colorScheme="brand"
                        size="sm"
                      >
                        Manage Prescriptions
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {records.filter(r => r.type === 'prescription').map((record) => (
                        <Box
                          key={record.id}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold">{record.title}</Text>
                              <Text fontSize="sm" color="gray.500">
                                Prescribed by {record.provider} on {format(new Date(record.date), 'PP')}
                              </Text>
                              <Text fontSize="sm">{record.summary}</Text>
                            </VStack>
                            <VStack>
                              <Badge colorScheme={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                              <Button size="sm" colorScheme="brand">
                                Refill
                              </Button>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Vaccinations */}
              <TabPanel px={0}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Vaccination Records</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {records.filter(r => r.type === 'vaccination').map((record) => (
                        <Box
                          key={record.id}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={Shield} color="green.500" />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">{record.title}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {format(new Date(record.date), 'PP')} at {record.provider}
                                </Text>
                              </VStack>
                            </HStack>
                            <Badge colorScheme="green">Completed</Badge>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </MainLayout>
  );
};

export default MedicalRecords;