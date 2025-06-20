import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Flex,
} from '@chakra-ui/react';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { MedicalRecord, BloodType } from '../../types/medical';
import { supabase } from '../../lib/supabase';
import EmergencyAccessToggle from './EmergencyAccessToggle';

interface MedicalRecordEditorProps {
  record: MedicalRecord;
  onUpdate: (updatedRecord: MedicalRecord) => void;
}

const MedicalRecordEditor: React.FC<MedicalRecordEditorProps> = ({
  record,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const {
    isOpen: isAllergyModalOpen,
    onOpen: openAllergyModal,
    onClose: closeAllergyModal,
  } = useDisclosure();
  const {
    isOpen: isConditionModalOpen,
    onOpen: openConditionModal,
    onClose: closeConditionModal,
  } = useDisclosure();
  const {
    isOpen: isVaccinationModalOpen,
    onOpen: openVaccinationModal,
    onClose: closeVaccinationModal,
  } = useDisclosure();

  const [newAllergy, setNewAllergy] = useState({
    name: '',
    severity: 'mild' as const,
    notes: '',
  });

  const [newCondition, setNewCondition] = useState({
    name: '',
    diagnosed_date: '',
    status: 'active' as const,
    notes: '',
  });

  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: '',
    provider: '',
    next_due: '',
  });

  const handleBloodTypeChange = async (value: BloodType) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('medical_records')
        .update({ blood_type: value })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, blood_type: value });
      toast({
        title: 'Blood type updated',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to update blood type',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllergy = async () => {
    try {
      setIsLoading(true);
      const updatedAllergies = [...record.allergies, newAllergy];
      const { error } = await supabase
        .from('medical_records')
        .update({ allergies: updatedAllergies })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, allergies: updatedAllergies });
      closeAllergyModal();
      setNewAllergy({ name: '', severity: 'mild', notes: '' });
      toast({
        title: 'Allergy added',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to add allergy',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCondition = async () => {
    try {
      setIsLoading(true);
      const updatedConditions = [...record.chronic_conditions, newCondition];
      const { error } = await supabase
        .from('medical_records')
        .update({ chronic_conditions: updatedConditions })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, chronic_conditions: updatedConditions });
      closeConditionModal();
      setNewCondition({
        name: '',
        diagnosed_date: '',
        status: 'active',
        notes: '',
      });
      toast({
        title: 'Condition added',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to add condition',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVaccination = async () => {
    try {
      setIsLoading(true);
      const updatedVaccinations = [...record.vaccinations, newVaccination];
      const { error } = await supabase
        .from('medical_records')
        .update({ vaccinations: updatedVaccinations })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, vaccinations: updatedVaccinations });
      closeVaccinationModal();
      setNewVaccination({
        name: '',
        date: '',
        provider: '',
        next_due: '',
      });
      toast({
        title: 'Vaccination added',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to add vaccination',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllergy = async (index: number) => {
    try {
      setIsLoading(true);
      const updatedAllergies = record.allergies.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('medical_records')
        .update({ allergies: updatedAllergies })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, allergies: updatedAllergies });
      toast({
        title: 'Allergy removed',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to remove allergy',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCondition = async (index: number) => {
    try {
      setIsLoading(true);
      const updatedConditions = record.chronic_conditions.filter(
        (_, i) => i !== index
      );
      const { error } = await supabase
        .from('medical_records')
        .update({ chronic_conditions: updatedConditions })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, chronic_conditions: updatedConditions });
      toast({
        title: 'Condition removed',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to remove condition',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVaccination = async (index: number) => {
    try {
      setIsLoading(true);
      const updatedVaccinations = record.vaccinations.filter(
        (_, i) => i !== index
      );
      const { error } = await supabase
        .from('medical_records')
        .update({ vaccinations: updatedVaccinations })
        .eq('id', record.id);

      if (error) throw error;

      onUpdate({ ...record, vaccinations: updatedVaccinations });
      toast({
        title: 'Vaccination removed',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Failed to remove vaccination',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={6}>
      <EmergencyAccessToggle
        recordId={record.id}
        isEnabled={record.emergency_access_enabled}
        onToggle={(enabled) =>
          onUpdate({ ...record, emergency_access_enabled: enabled })
        }
      />

      <Card>
        <CardHeader>
          <Heading size="md">Basic Information</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <FormLabel>Blood Type</FormLabel>
            <Select
              value={record.blood_type || ''}
              onChange={(e) => handleBloodTypeChange(e.target.value as BloodType)}
              isDisabled={isLoading}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
          </FormControl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Allergies</Heading>
            <Button
              leftIcon={<Plus size={16} />}
              size="sm"
              onClick={openAllergyModal}
            >
              Add Allergy
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Allergy</Th>
                <Th>Severity</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.allergies.map((allergy, index) => (
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
                  <Td>
                    <IconButton
                      aria-label="Remove allergy"
                      icon={<X size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveAllergy(index)}
                      isLoading={isLoading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Chronic Conditions</Heading>
            <Button
              leftIcon={<Plus size={16} />}
              size="sm"
              onClick={openConditionModal}
            >
              Add Condition
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Condition</Th>
                <Th>Diagnosed</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.chronic_conditions.map((condition, index) => (
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
                  <Td>
                    <IconButton
                      aria-label="Remove condition"
                      icon={<X size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveCondition(index)}
                      isLoading={isLoading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Vaccinations</Heading>
            <Button
              leftIcon={<Plus size={16} />}
              size="sm"
              onClick={openVaccinationModal}
            >
              Add Vaccination
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Vaccine</Th>
                <Th>Date</Th>
                <Th>Provider</Th>
                <Th>Next Due</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {record.vaccinations.map((vaccination, index) => (
                <Tr key={index}>
                  <Td>{vaccination.name}</Td>
                  <Td>{format(new Date(vaccination.date), 'PP')}</Td>
                  <Td>{vaccination.provider || '-'}</Td>
                  <Td>
                    {vaccination.next_due
                      ? format(new Date(vaccination.next_due), 'PP')
                      : '-'}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Remove vaccination"
                      icon={<X size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveVaccination(index)}
                      isLoading={isLoading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Allergy Modal */}
      <Modal isOpen={isAllergyModalOpen} onClose={closeAllergyModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Allergy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Allergy Name</FormLabel>
                <Input
                  value={newAllergy.name}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Severity</FormLabel>
                <Select
                  value={newAllergy.severity}
                  onChange={(e) =>
                    setNewAllergy({
                      ...newAllergy,
                      severity: e.target.value as 'mild' | 'moderate' | 'severe',
                    })
                  }
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={newAllergy.notes}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, notes: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeAllergyModal}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddAllergy}
              isLoading={isLoading}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Condition Modal */}
      <Modal isOpen={isConditionModalOpen} onClose={closeConditionModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Chronic Condition</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Condition Name</FormLabel>
                <Input
                  value={newCondition.name}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Diagnosed Date</FormLabel>
                <Input
                  type="date"
                  value={newCondition.diagnosed_date}
                  onChange={(e) =>
                    setNewCondition({
                      ...newCondition,
                      diagnosed_date: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={newCondition.status}
                  onChange={(e) =>
                    setNewCondition({
                      ...newCondition,
                      status: e.target.value as 'active' | 'managed' | 'resolved',
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="managed">Managed</option>
                  <option value="resolved">Resolved</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={newCondition.notes}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, notes: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeConditionModal}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddCondition}
              isLoading={isLoading}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Vaccination Modal */}
      <Modal isOpen={isVaccinationModalOpen} onClose={closeVaccinationModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Vaccination</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Vaccine Name</FormLabel>
                <Input
                  value={newVaccination.name}
                  onChange={(e) =>
                    setNewVaccination({ ...newVaccination, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Date Administered</FormLabel>
                <Input
                  type="date"
                  value={newVaccination.date}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      date: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Provider</FormLabel>
                <Input
                  value={newVaccination.provider}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      provider: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Next Due Date</FormLabel>
                <Input
                  type="date"
                  value={newVaccination.next_due}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      next_due: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeVaccinationModal}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddVaccination}
              isLoading={isLoading}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default MedicalRecordEditor;