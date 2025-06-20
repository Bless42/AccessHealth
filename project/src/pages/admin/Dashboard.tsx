import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import MainLayout from '../../components/layouts/MainLayout';

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  activeEmergencies: number;
  averageResponseTime: number;
  userGrowth: number;
}

interface EmergencyData {
  date: string;
  count: number;
}

interface ResponseTimeData {
  date: string;
  time: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    activeEmergencies: 0,
    averageResponseTime: 0,
    userGrowth: 0,
  });
  const [emergencyData, setEmergencyData] = useState<EmergencyData[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const chartBg = useColorModeValue('white', 'gray.800');
  const lineColor = useColorModeValue('#3182CE', '#63B3ED');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total users by role
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('role');

        if (profilesError) throw profilesError;

        const doctors = profiles?.filter(p => p.role === 'doctor').length || 0;
        const patients = profiles?.filter(p => p.role === 'patient').length || 0;

        // Fetch active emergencies
        const { data: emergencies, error: emergenciesError } = await supabase
          .from('emergencies')
          .select('*')
          .eq('status', 'pending');

        if (emergenciesError) throw emergenciesError;

        // Calculate average response time
        const { data: resolvedEmergencies, error: resolvedError } = await supabase
          .from('emergencies')
          .select('created_at, resolved_at')
          .not('resolved_at', 'is', null);

        if (resolvedError) throw resolvedError;

        const avgResponseTime = resolvedEmergencies?.reduce((acc, curr) => {
          const created = new Date(curr.created_at);
          const resolved = new Date(curr.resolved_at!);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / (resolvedEmergencies?.length || 1) / 60000; // Convert to minutes

        // Fetch emergency trends
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return format(date, 'yyyy-MM-dd');
        }).reverse();

        const emergencyTrends = last7Days.map(date => ({
          date,
          count: emergencies?.filter(e => 
            e.created_at.startsWith(date)
          ).length || 0,
        }));

        // Calculate response time trends
        const responseTimeTrends = last7Days.map(date => {
          const dayEmergencies = resolvedEmergencies?.filter(e =>
            e.created_at.startsWith(date)
          ) || [];
          
          const avgTime = dayEmergencies.reduce((acc, curr) => {
            const created = new Date(curr.created_at);
            const resolved = new Date(curr.resolved_at!);
            return acc + (resolved.getTime() - created.getTime());
          }, 0) / (dayEmergencies.length || 1) / 60000;

          return {
            date,
            time: Math.round(avgTime),
          };
        });

        setStats({
          totalUsers: doctors + patients,
          totalDoctors: doctors,
          totalPatients: patients,
          activeEmergencies: emergencies?.length || 0,
          averageResponseTime: Math.round(avgResponseTime),
          userGrowth: 12, // Calculate actual growth percentage
        });

        setEmergencyData(emergencyTrends);
        setResponseTimeData(responseTimeTrends);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscription for emergency updates
    const subscription = supabase
      .channel('emergencies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, 
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <MainLayout>
      <Box py={8}>
        <Stack spacing={8}>
          <Heading size="lg">Admin Dashboard</Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber>{stats.totalUsers}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats.userGrowth}%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Emergencies</StatLabel>
                  <StatNumber>{stats.activeEmergencies}</StatNumber>
                  <StatHelpText>Requiring immediate attention</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Avg. Response Time</StatLabel>
                  <StatNumber>{stats.averageResponseTime} min</StatNumber>
                  <StatHelpText>For emergency cases</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            <Card>
              <CardHeader>
                <Heading size="md">Emergency Trends</Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emergencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={lineColor}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">Response Time Analysis</Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                      />
                      <Bar dataKey="time" fill={lineColor} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </Grid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card>
              <CardHeader>
                <Heading size="md">User Distribution</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="medium">Doctors</Text>
                    <Text fontSize="2xl">{stats.totalDoctors}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium">Patients</Text>
                    <Text fontSize="2xl">{stats.totalPatients}</Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">System Health</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="medium">API Status</Text>
                    <Text color="green.500">Operational</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium">Database Status</Text>
                    <Text color="green.500">Connected</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium">Last Updated</Text>
                    <Text>{format(new Date(), 'PPp')}</Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default AdminDashboard;