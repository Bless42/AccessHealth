import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Switch,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MedicalRecord } from '../../types/medical';
import { supabase } from '../../lib/supabase';

interface ConsentManagerProps {
  record: MedicalRecord;
  onUpdate: (record: MedicalRecord) => void;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ record, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleConsentChange = async (key: keyof MedicalRecord['consent_status']) => {
    try {
      setIsLoading(true);
      const newStatus = {
        ...record.consent_status,
        [key]: !record.consent_status[key],
      };

      const { error } = await supabase
        .from('medical_records')
        .update({ consent_status: newStatus })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({
        ...record,
        consent_status: newStatus,
      });

      toast({
        title: 'Consent updated',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to update consent',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Consent Management</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Stack
              direction="row"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="medium">Emergency Access</Text>
                <Text fontSize="sm" color="gray.500">
                  Allow emergency responders to access your medical records
                </Text>
              </Box>
              <Switch
                isChecked={record.consent_status.emergency_access}
                onChange={() => handleConsentChange('emergency_access')}
                isDisabled={isLoading}
              />
            </Stack>

            <Stack
              direction="row"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="medium">Data Sharing</Text>
                <Text fontSize="sm" color="gray.500">
                  Share your medical data with healthcare providers
                </Text>
              </Box>
              <Switch
                isChecked={record.consent_status.data_sharing}
                onChange={() => handleConsentChange('data_sharing')}
                isDisabled={isLoading}
              />
            </Stack>

            <Stack
              direction="row"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="medium">Research Use</Text>
                <Text fontSize="sm" color="gray.500">
                  Allow anonymized data to be used for research
                </Text>
              </Box>
              <Switch
                isChecked={record.consent_status.research_use}
                onChange={() => handleConsentChange('research_use')}
                isDisabled={isLoading}
              />
            </Stack>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpen}
              alignSelf="flex-start"
            >
              View Consent History
            </Button>
          </Stack>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Consent History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Changes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {record.consent_history.map((entry, index) => (
                  <Tr key={index}>
                    <Td>
                      {format(new Date(entry.timestamp * 1000), 'PPp')}
                    </Td>
                    <Td>
                      <Stack spacing={1}>
                        {Object.entries(entry.new_status).map(([key, value]) => {
                          if (entry.old_status[key] !== value) {
                            return (
                              <Text key={key} fontSize="sm">
                                {key.replace(/_/g, ' ')} set to {value.toString()}
                              </Text>
                            );
                          }
                          return null;
                        })}
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConsentManager;