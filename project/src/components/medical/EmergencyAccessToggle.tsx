import React, { useState } from 'react';
import {
  Box,
  Button,
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
  VStack,
  HStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmergencyAccessToggleProps {
  recordId: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const EmergencyAccessToggle: React.FC<EmergencyAccessToggleProps> = ({
  recordId,
  isEnabled,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleToggle = async (confirmed: boolean) => {
    if (!confirmed) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('medical_records')
        .update({ emergency_access_enabled: !isEnabled })
        .eq('id', recordId);

      if (error) throw error;

      onToggle(!isEnabled);
      onClose();
      toast({
        title: `Emergency access ${!isEnabled ? 'enabled' : 'disabled'}`,
        status: !isEnabled ? 'warning' : 'success',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Failed to update emergency access',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Emergency Access</Heading>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="medium">Emergency Access Status</Text>
                <Text fontSize="sm" color="gray.500">
                  When enabled, emergency responders can access your medical records
                  in critical situations
                </Text>
              </Box>
              <Switch
                size="lg"
                isChecked={isEnabled}
                onChange={() => onOpen()}
                colorScheme={isEnabled ? 'red' : 'green'}
              />
            </HStack>
            <Box>
              <Badge
                colorScheme={isEnabled ? 'red' : 'green'}
                variant="subtle"
                px={2}
                py={1}
                rounded="md"
              >
                {isEnabled ? 'Emergency Access Enabled' : 'Standard Access Mode'}
              </Badge>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEnabled ? 'Disable' : 'Enable'} Emergency Access
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack color="orange.500">
                <AlertTriangle />
                <Text fontWeight="medium">Important Notice</Text>
              </HStack>
              <Text>
                {isEnabled
                  ? 'Disabling emergency access will restrict access to your medical records in emergency situations. Are you sure you want to proceed?'
                  : 'Enabling emergency access will allow emergency responders to access your medical records in critical situations. This should only be used when necessary.'}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={isEnabled ? 'green' : 'red'}
              onClick={() => handleToggle(true)}
              isLoading={isLoading}
            >
              {isEnabled ? 'Disable Access' : 'Enable Emergency Access'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmergencyAccessToggle;