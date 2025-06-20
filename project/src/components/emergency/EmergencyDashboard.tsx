import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Button,
  useToast,
  Select,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Emergency } from '../../types/emergency';
import { useAuth } from '../../context/AuthContext';

const EmergencyDashboard: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const { data, error } = await supabase
          .from('emergencies')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEmergencies(data || []);
      } catch (err) {
        toast({
          title: 'Error fetching emergencies',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencies();

    // Subscribe to new emergencies
    const subscription = supabase
      .channel('emergencies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setEmergencies(prev => [payload.new as Emergency, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEmergencies(prev => 
              prev.map(emergency => 
                emergency.id === payload.new.id ? payload.new as Emergency : emergency
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStatusChange = async (emergencyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('emergencies')
        .update({ 
          status: newStatus,
          ...(newStatus === 'resolved' ? { 
            resolved_at: new Date().toISOString(),
            resolved_by: user?.id
          } : {})
        })
        .eq('id', emergencyId);

      if (error) throw error;

      toast({
        title: 'Status updated',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'red';
      case 'dispatched':
        return 'yellow';
      case 'resolved':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Heading mb={6}>Emergency Dashboard</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {emergencies.map(emergency => (
          <Card key={emergency.id}>
            <CardHeader>
              <Stack direction="row" justify="space-between" align="center">
                <Badge colorScheme={getStatusColor(emergency.status)}>
                  {emergency.status.toUpperCase()}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {format(new Date(emergency.created_at), 'PPp')}
                </Text>
              </Stack>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="bold">Location</Text>
                  <Text>
                    {emergency.location_lat.toFixed(6)}, {emergency.location_lng.toFixed(6)}
                  </Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Status</Text>
                  <Select
                    value={emergency.status}
                    onChange={(e) => handleStatusChange(emergency.id, e.target.value)}
                    isDisabled={emergency.status === 'resolved'}
                  >
                    <option value="pending">Pending</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="resolved">Resolved</option>
                  </Select>
                </Box>

                {emergency.resolved_at && (
                  <Text fontSize="sm" color="gray.500">
                    Resolved at: {format(new Date(emergency.resolved_at), 'PPp')}
                  </Text>
                )}

                <Button
                  as="a"
                  href={`https://www.google.com/maps?q=${emergency.location_lat},${emergency.location_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="blue"
                  size="sm"
                >
                  Open in Maps
                </Button>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default EmergencyDashboard;