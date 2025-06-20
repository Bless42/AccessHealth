import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MedicalRecord } from '../../types/medical';

interface MedicalRecordViewerProps {
  record: MedicalRecord;
}

const MedicalRecordViewer: React.FC<MedicalRecordViewerProps> = ({ record }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader>
          <Heading size="md">Basic Information</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold">Blood Type</Text>
              <Text>{record.blood_type || 'Not specified'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Last Updated</Text>
              <Text>{format(new Date(record.last_updated), 'PPP')}</Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Allergies</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple" borderWidth="1px" borderColor={borderColor}>
            <Thead>
              <Tr>
                <Th>Allergy</Th>
                <Th>Severity</Th>
                <Th>Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.allergies.length === 0 ? (
                <Tr>
                  <Td colSpan={3}>No known allergies</Td>
                </Tr>
              ) : (
                record.allergies.map((allergy, index) => (
                  <Tr key={index}>
                    <Td>{allergy.name}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          allergy.severity === 'severe'
                            ? 'red'
                            : allergy.severity === 'moderate'
                            ? 'yellow'
                            : 'green'
                        }
                      >
                        {allergy.severity}
                      </Badge>
                    </Td>
                    <Td>{allergy.notes || '-'}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Chronic Conditions</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple" borderWidth="1px" borderColor={borderColor}>
            <Thead>
              <Tr>
                <Th>Condition</Th>
                <Th>Diagnosed</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.chronic_conditions.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>No chronic conditions recorded</Td>
                </Tr>
              ) : (
                record.chronic_conditions.map((condition, index) => (
                  <Tr key={index}>
                    <Td>{condition.name}</Td>
                    <Td>{format(new Date(condition.diagnosed_date), 'PP')}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          condition.status === 'active'
                            ? 'red'
                            : condition.status === 'managed'
                            ? 'yellow'
                            : 'green'
                        }
                      >
                        {condition.status}
                      </Badge>
                    </Td>
                    <Td>{condition.notes || '-'}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Vaccinations</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple" borderWidth="1px" borderColor={borderColor}>
            <Thead>
              <Tr>
                <Th>Vaccine</Th>
                <Th>Date</Th>
                <Th>Provider</Th>
                <Th>Next Due</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.vaccinations.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>No vaccination records found</Td>
                </Tr>
              ) : (
                record.vaccinations.map((vaccination, index) => (
                  <Tr key={index}>
                    <Td>{vaccination.name}</Td>
                    <Td>{format(new Date(vaccination.date), 'PP')}</Td>
                    <Td>{vaccination.provider || '-'}</Td>
                    <Td>
                      {vaccination.next_due
                        ? format(new Date(vaccination.next_due), 'PP')
                        : '-'}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
};

export default MedicalRecordViewer;