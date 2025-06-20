import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Text,
  Select,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import MainLayout from '../../components/layouts/MainLayout';
import { MedicalRecordAudit } from '../../types/medical';

const AuditLog: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<MedicalRecordAudit[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const bgDiff = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('medical_records_audit')
        .select('*')
        .order('changed_at', { ascending: false });

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeDescription = (log: MedicalRecordAudit) => {
    const changes: string[] = [];

    if (log.old_data.blood_type !== log.new_data.blood_type) {
      changes.push(`Blood type changed from ${log.old_data.blood_type || 'unset'} to ${log.new_data.blood_type}`);
    }

    if (JSON.stringify(log.old_data.allergies) !== JSON.stringify(log.new_data.allergies)) {
      changes.push('Allergies information updated');
    }

    if (JSON.stringify(log.old_data.chronic_conditions) !== JSON.stringify(log.new_data.chronic_conditions)) {
      changes.push('Chronic conditions updated');
    }

    if (JSON.stringify(log.old_data.vaccinations) !== JSON.stringify(log.new_data.vaccinations)) {
      changes.push('Vaccination records updated');
    }

    if (log.old_data.emergency_access_enabled !== log.new_data.emergency_access_enabled) {
      changes.push(`Emergency access ${log.new_data.emergency_access_enabled ? 'enabled' : 'disabled'}`);
    }

    return changes.join(', ');
  };

  return (
    <MainLayout>
      <Box py={8}>
        <Stack spacing={6}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
          >
            <Heading size="lg">Audit Log</Heading>
            <HStack spacing={4}>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                w={{ base: 'full', md: '200px' }}
              >
                <option value="all">All Changes</option>
                <option value="medical">Medical Records</option>
                <option value="emergency">Emergency Access</option>
                <option value="system">System Changes</option>
              </Select>
              <Button
                onClick={fetchAuditLogs}
                isLoading={isLoading}
              >
                Refresh
              </Button>
            </HStack>
          </Stack>

          <Card>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Timestamp</Th>
                      <Th>Record ID</Th>
                      <Th>Changed By</Th>
                      <Th>Changes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {auditLogs.map((log) => (
                      <Tr key={log.id}>
                        <Td>
                          {format(new Date(log.changed_at), 'PPp')}
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontFamily="mono">
                            {log.record_id}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontFamily="mono">
                            {log.changed_by}
                          </Text>
                        </Td>
                        <Td>
                          <Stack spacing={2}>
                            <Text>{getChangeDescription(log)}</Text>
                            <Box
                              p={2}
                              bg={bgDiff}
                              borderRadius="md"
                              fontSize="sm"
                              fontFamily="mono"
                            >
                              <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(
                                  {
                                    old: log.old_data,
                                    new: log.new_data,
                                  },
                                  null,
                                  2
                                )}
                              </pre>
                            </Box>
                          </Stack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default AuditLog;