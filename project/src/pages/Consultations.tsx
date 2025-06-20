import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Heading,
  Button,
  Card,
  CardBody,
  Text,
  Badge,
  Grid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Calendar, Video, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import MainLayout from '../components/layouts/MainLayout';
import DoctorSearch from '../components/consultation/DoctorSearch';
import AppointmentScheduler from '../components/consultation/AppointmentScheduler';
import PaymentProcessor from '../components/consultation/PaymentProcessor';
import VideoConsultation from '../components/consultation/VideoConsultation';
import { Doctor, Appointment, Payment } from '../types/consultation';
import { useAuth } from '../context/AuthContext';

const Consultations: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, profile } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      let query;
      
      if (profile?.role === 'doctor') {
        // For doctors, get their doctor record first, then appointments
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (doctorError) throw doctorError;

        query = supabase
          .from('appointments')
          .select(`
            *,
            doctor:doctor_id(
              *,
              user:user_id(
                email,
                profiles(
                  first_name,
                  last_name
                )
              )
            ),
            patient:patient_id(
              email,
              profiles(
                first_name,
                last_name
              )
            )
          `)
          .eq('doctor_id', doctorData.id);
      } else {
        // For patients
        query = supabase
          .from('appointments')
          .select(`
            *,
            doctor:doctor_id(
              *,
              user:user_id(
                email,
                profiles(
                  first_name,
                  last_name
                )
              )
            ),
            patient:patient_id(
              email,
              profiles(
                first_name,
                last_name
              )
            )
          `)
          .eq('patient_id', user?.id);
      }

      const { data, error } = await query.order('appointment_date', { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: 'Error fetching appointments',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setActiveTab(1);
  };

  const handleAppointmentBooked = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPayment(true);
    fetchAppointments();
  };

  const handlePaymentComplete = (payment: Payment) => {
    setShowPayment(false);
    setSelectedAppointment(null);
    setSelectedDoctor(null);
    setActiveTab(2);
    fetchAppointments();
    toast({
      title: 'Appointment confirmed',
      description: 'Your consultation has been scheduled and paid for',
      status: 'success',
      duration: 5000,
    });
  };

  const handleStartVideoCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowVideo(true);
  };

  const handleEndVideoCall = () => {
    setShowVideo(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'yellow';
      case 'confirmed':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getDisplayName = (userObj: any, role: 'doctor' | 'patient') => {
    if (role === 'doctor' && userObj?.user?.profiles) {
      const { first_name, last_name } = userObj.user.profiles;
      if (first_name && last_name) {
        return `Dr. ${first_name} ${last_name}`;
      }
    }
    
    if (userObj?.profiles) {
      const { first_name, last_name } = userObj.profiles;
      if (first_name && last_name) {
        return `${first_name} ${last_name}`;
      }
    }
    
    const email = role === 'doctor' ? userObj?.user?.email : userObj?.email;
    return email?.split('@')[0] || 'Unknown';
  };

  const upcomingAppointments = appointments.filter(apt => 
    ['scheduled', 'confirmed'].includes(apt.status) &&
    new Date(apt.appointment_date) > new Date()
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || 
    (new Date(apt.appointment_date) < new Date() && apt.status !== 'in_progress')
  );

  if (showVideo && selectedAppointment) {
    return (
      <VideoConsultation
        appointment={selectedAppointment}
        onEndCall={handleEndVideoCall}
      />
    );
  }

  return (
    <MainLayout>
      <Box py={8}>
        <VStack spacing={6} align="stretch">
          <Heading>Consultations</Heading>

          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Find Doctor</Tab>
              {selectedDoctor && <Tab>Schedule Appointment</Tab>}
              <Tab>My Appointments</Tab>
              {profile?.role === 'doctor' && <Tab>Patient Appointments</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>
                <DoctorSearch onDoctorSelect={handleDoctorSelect} />
              </TabPanel>

              {selectedDoctor && (
                <TabPanel>
                  <AppointmentScheduler
                    doctor={selectedDoctor}
                    onAppointmentBooked={handleAppointmentBooked}
                    onBack={() => {
                      setSelectedDoctor(null);
                      setActiveTab(0);
                    }}
                  />
                </TabPanel>
              )}

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Upcoming Appointments</Heading>
                        {upcomingAppointments.length === 0 ? (
                          <Text color="gray.500">No upcoming appointments</Text>
                        ) : (
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            {upcomingAppointments.map((appointment) => (
                              <Card key={appointment.id} variant="outline">
                                <CardBody>
                                  <VStack align="stretch" spacing={3}>
                                    <HStack justify="space-between">
                                      <Text fontWeight="bold">
                                        {profile?.role === 'doctor' 
                                          ? getDisplayName(appointment.patient, 'patient')
                                          : getDisplayName(appointment.doctor, 'doctor')
                                        }
                                      </Text>
                                      <Badge colorScheme={getStatusColor(appointment.status)}>
                                        {appointment.status}
                                      </Badge>
                                    </HStack>
                                    
                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Calendar size={16} />
                                        <Text fontSize="sm">
                                          {format(new Date(appointment.appointment_date), 'PPP p')}
                                        </Text>
                                      </HStack>
                                      <HStack>
                                        <Clock size={16} />
                                        <Text fontSize="sm">{appointment.duration_minutes} minutes</Text>
                                      </HStack>
                                      <HStack>
                                        <Video size={16} />
                                        <Text fontSize="sm">{appointment.type}</Text>
                                      </HStack>
                                    </VStack>

                                    {appointment.notes && (
                                      <Text fontSize="sm" color="gray.600">
                                        {appointment.notes}
                                      </Text>
                                    )}

                                    <HStack spacing={2}>
                                      {appointment.status === 'confirmed' && 
                                       appointment.type === 'virtual' && 
                                       new Date(appointment.appointment_date) <= new Date(Date.now() + 15 * 60000) && (
                                        <Button
                                          size="sm"
                                          colorScheme="green"
                                          leftIcon={<Video size={16} />}
                                          onClick={() => handleStartVideoCall(appointment)}
                                        >
                                          Join Call
                                        </Button>
                                      )}
                                      <Button size="sm" variant="outline">
                                        View Details
                                      </Button>
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                          </Grid>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Past Appointments</Heading>
                        {pastAppointments.length === 0 ? (
                          <Text color="gray.500">No past appointments</Text>
                        ) : (
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            {pastAppointments.slice(0, 6).map((appointment) => (
                              <Card key={appointment.id} variant="outline">
                                <CardBody>
                                  <VStack align="stretch" spacing={3}>
                                    <HStack justify="space-between">
                                      <Text fontWeight="bold">
                                        {profile?.role === 'doctor' 
                                          ? getDisplayName(appointment.patient, 'patient')
                                          : getDisplayName(appointment.doctor, 'doctor')
                                        }
                                      </Text>
                                      <Badge colorScheme={getStatusColor(appointment.status)}>
                                        {appointment.status}
                                      </Badge>
                                    </HStack>
                                    
                                    <Text fontSize="sm" color="gray.600">
                                      {format(new Date(appointment.appointment_date), 'PPP')}
                                    </Text>

                                    <Button size="sm" variant="outline">
                                      View Summary
                                    </Button>
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                          </Grid>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {profile?.role === 'doctor' && (
                <TabPanel>
                  <Text>Doctor's patient appointment management will be implemented here</Text>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </VStack>

        {/* Payment Modal */}
        <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Complete Payment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedAppointment && selectedDoctor && (
                <PaymentProcessor
                  appointment={selectedAppointment}
                  doctor={selectedDoctor}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={() => setShowPayment(false)}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
};

export default Consultations;