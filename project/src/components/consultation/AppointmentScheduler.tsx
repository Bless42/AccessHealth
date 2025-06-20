import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Avatar,
} from '@chakra-ui/react';
import { Calendar, Clock, DollarSign, Video, MapPin } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO, isAfter, isBefore } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Doctor, DoctorAvailability, Appointment } from '../../types/consultation';
import { useAuth } from '../../context/AuthContext';

interface AppointmentSchedulerProps {
  doctor: Doctor;
  onAppointmentBooked: (appointment: Appointment) => void;
  onBack: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  doctor,
  onAppointmentBooked,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [appointmentType, setAppointmentType] = useState<'virtual' | 'in_person'>('virtual');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchDoctorAvailability();
    fetchExistingAppointments();
  }, [doctor.id, selectedDate]);

  const fetchDoctorAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctor.id)
        .eq('is_available', true);

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchExistingAppointments = async () => {
    try {
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const endDate = format(addDays(selectedDate, 1), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctor.id)
        .gte('appointment_date', startDate)
        .lt('appointment_date', endDate)
        .in('status', ['scheduled', 'confirmed', 'in_progress']);

      if (error) throw error;
      setExistingAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!dayAvailability) return [];

    const slots: TimeSlot[] = [];
    const startTime = parseISO(`2000-01-01T${dayAvailability.start_time}`);
    const endTime = parseISO(`2000-01-01T${dayAvailability.end_time}`);
    
    let currentTime = startTime;
    while (isBefore(currentTime, endTime)) {
      const timeString = format(currentTime, 'HH:mm');
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
      
      // Check if this time slot is already booked
      const existingAppointment = existingAppointments.find(apt => {
        const aptTime = new Date(apt.appointment_date);
        return aptTime.getHours() === currentTime.getHours() && 
               aptTime.getMinutes() === currentTime.getMinutes();
      });

      // Check if the time slot is in the past
      const isPast = isBefore(appointmentDateTime, new Date());

      slots.push({
        time: timeString,
        available: !existingAppointment && !isPast,
        appointment: existingAppointment,
      });

      // Add 30 minutes for next slot
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return slots;
  };

  const handleBookAppointment = async () => {
    if (!selectedTime || !user) return;

    try {
      setIsLoading(true);
      
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: doctor.id,
          appointment_date: appointmentDateTime.toISOString(),
          type: appointmentType,
          notes: notes || null,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Appointment booked successfully',
        description: `Your ${appointmentType} appointment is scheduled for ${format(appointmentDateTime, 'PPP p')}`,
        status: 'success',
        duration: 5000,
      });

      onAppointmentBooked(data);
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Error booking appointment',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = generateTimeSlots();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(selectedDate), i);
    return date;
  });

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button variant="ghost" onClick={onBack}>
            ← Back to Search
          </Button>
        </HStack>

        <Card>
          <CardHeader>
            <HStack spacing={4}>
              <React.Fragment>
                <Avatar size="lg" name={doctor.user?.email} />
                <VStack align="start" spacing={1}>
                  <Heading size="md">{doctor.user?.email?.split('@')[0] || 'Dr. Unknown'}</Heading>
                  <HStack>
                    <DollarSign size={16} />
                    <Text>${doctor.consultation_fee} per session</Text>
                  </HStack>
                  <HStack wrap="wrap" spacing={2}>
                    {doctor.specialties?.map((specialty) => (
                      <Badge key={specialty.id} colorScheme="brand">
                        {specialty.name}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </React.Fragment>
            </HStack>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Select Date & Time</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="medium" mb={3}>Select Date</Text>
                <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                  {weekDays.map((date) => (
                    <Button
                      key={date.toISOString()}
                      variant={isSameDay(date, selectedDate) ? 'solid' : 'outline'}
                      colorScheme={isSameDay(date, selectedDate) ? 'brand' : 'gray'}
                      onClick={() => setSelectedDate(date)}
                      size="sm"
                      isDisabled={isBefore(date, new Date())}
                    >
                      <VStack spacing={1}>
                        <Text fontSize="xs">{format(date, 'EEE')}</Text>
                        <Text fontSize="sm">{format(date, 'd')}</Text>
                      </VStack>
                    </Button>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={3}>Available Times</Text>
                {timeSlots.length === 0 ? (
                  <Text color="gray.500">No availability for this date</Text>
                ) : (
                  <Grid templateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={2}>
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? 'solid' : 'outline'}
                        colorScheme={selectedTime === slot.time ? 'brand' : 'gray'}
                        onClick={() => setSelectedTime(slot.time)}
                        isDisabled={!slot.available}
                        size="sm"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </Grid>
                )}
              </Box>

              <Button
                colorScheme="brand"
                onClick={onOpen}
                isDisabled={!selectedTime}
                leftIcon={<Calendar size={20} />}
              >
                Book Appointment
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="medium">Appointment Details</Text>
                <Text>Date: {format(selectedDate, 'PPP')}</Text>
                <Text>Time: {selectedTime}</Text>
                <Text>Doctor: {doctor.user?.email?.split('@')[0]}</Text>
                <Text>Fee: ${doctor.consultation_fee}</Text>
              </Box>

              <FormControl>
                <FormLabel>Appointment Type</FormLabel>
                <Select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as 'virtual' | 'in_person')}
                >
                  <option value="virtual">Virtual Consultation</option>
                  <option value="in_person">In-Person Visit</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Notes (Optional)</FormLabel>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </FormControl>

              <Box p={4} bg="blue.50" borderRadius="md">
                <HStack>
                  {appointmentType === 'virtual' ? <Video size={20} /> : <MapPin size={20} />}
                  <Text fontSize="sm">
                    {appointmentType === 'virtual'
                      ? 'You will receive a video call link before your appointment'
                      : 'Please arrive 15 minutes early for your in-person visit'}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleBookAppointment}
              isLoading={isLoading}
            >
              Confirm Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AppointmentScheduler;