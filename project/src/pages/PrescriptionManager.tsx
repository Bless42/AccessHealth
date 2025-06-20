import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Text,
  Badge,
  Link,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Prescription, Pharmacy } from '../types/pharmacy';
import MainLayout from '../components/layouts/MainLayout';
import PrescriptionUpload from '../components/pharmacy/PrescriptionUpload';
import { useAuth } from '../context/AuthContext';

const PrescriptionManager: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    pharmacy_id: '',
    file_url: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionsRes, pharmaciesRes] = await Promise.all([
          supabase
            .from('prescriptions')
            .select('*')
            .eq('patient_id', user?.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('pharmacies')
            .select('*')
            .order('name')
        ]);

        if (prescriptionsRes.error) throw prescriptionsRes.error;
        if (pharmaciesRes.error) throw pharmaciesRes.error;

        setPrescriptions(prescriptionsRes.data || []);
        setPharmacies(pharmaciesRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          title: 'Error fetching data',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
        });
      }
    };

    if (user) fetchData();
  }, [user, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'ready':
        return 'green';
      case 'completed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          ...newPrescription,
          patient_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Prescription submitted',
        status: 'success',
        duration: 5000,
      });

      onClose();
      setNewPrescription({
        medication: '',
        dosage: '',
        pharmacy_id: '',
        file_url: '',
      });

      // Refresh prescriptions list
      const { data } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false });
      
      setPrescriptions(data || []);
    } catch (err) {
      console.error('Error submitting prescription:', err);
      toast({
        title: 'Error submitting prescription',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <MainLayout>
      <Box py={8}>
        <Stack spacing={6}>
          <Grid templateColumns="1fr auto" gap={4} alignItems="center">
            <Heading>My Prescriptions</Heading>
            <Button
              leftIcon={<Plus size={20} />}
              colorScheme="brand"
              onClick={onOpen}
            >
              New Prescription
            </Button>
          </Grid>

          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {prescriptions.map(prescription => (
              <Box
                key={prescription.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
              >
                <Stack spacing={3}>
                  <Heading size="md">{prescription.medication}</Heading>
                  <Text>Dosage: {prescription.dosage}</Text>
                  <Badge colorScheme={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                  {prescription.file_url && (
                    <Link href={prescription.file_url} isExternal>
                      View Prescription
                    </Link>
                  )}
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Prescription</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Medication</FormLabel>
                  <Input
                    value={newPrescription.medication}
                    onChange={(e) =>
                      setNewPrescription({
                        ...newPrescription,
                        medication: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Dosage</FormLabel>
                  <Input
                    value={newPrescription.dosage}
                    onChange={(e) =>
                      setNewPrescription({
                        ...newPrescription,
                        dosage: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Pharmacy</FormLabel>
                  <Select
                    value={newPrescription.pharmacy_id}
                    onChange={(e) =>
                      setNewPrescription({
                        ...newPrescription,
                        pharmacy_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a pharmacy</option>
                    {pharmacies.map(pharmacy => (
                      <option key={pharmacy.id} value={pharmacy.id}>
                        {pharmacy.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Upload Prescription</FormLabel>
                  <PrescriptionUpload
                    onUploadComplete={(url) =>
                      setNewPrescription({
                        ...newPrescription,
                        file_url: url,
                      })
                    }
                    isUploading={isUploading}
                    progress={uploadProgress}
                  />
                </FormControl>

                <Button
                  colorScheme="brand"
                  onClick={handleSubmit}
                  isDisabled={!newPrescription.medication || !newPrescription.dosage || !newPrescription.pharmacy_id}
                >
                  Submit Prescription
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
};

export default PrescriptionManager;