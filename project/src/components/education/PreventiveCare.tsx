import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Progress,
  Grid,
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
  Input,
  Select,
  Textarea,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Calendar, Clock, CheckCircle, Plus, Bell, Target } from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { PreventiveCareReminder } from '../../types/education';
import { useAuth } from '../../context/AuthContext';

const PreventiveCare: React.FC = () => {
  const [reminders, setReminders] = useState<PreventiveCareReminder[]>([]);
  const [newReminder, setNewReminder] = useState({
    reminder_type: '',
    title: '',
    description: '',
    due_date: '',
    frequency: 'once',
    priority: 'medium',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    const mockReminders: PreventiveCareReminder[] = [
      {
        id: '1',
        user_id: user?.id || '',
        reminder_type: 'vaccination',
        title: 'Annual Flu Shot',
        description: 'Get your yearly influenza vaccination',
        due_date: '2024-10-15',
        frequency: 'yearly',
        is_completed: false,
        priority: 'high',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        user_id: user?.id || '',
        reminder_type: 'checkup',
        title: 'Annual Physical Exam',
        description: 'Comprehensive health checkup with your primary care physician',
        due_date: '2024-12-01',
        frequency: 'yearly',
        is_completed: false,
        priority: 'high',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        user_id: user?.id || '',
        reminder_type: 'screening',
        title: 'Blood Pressure Check',
        description: 'Monitor blood pressure levels',
        due_date: '2024-11-01',
        frequency: 'monthly',
        is_completed: true,
        completed_at: '2024-10-15T10:00:00Z',
        next_due_date: '2024-11-15',
        priority: 'medium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-10-15T10:00:00Z',
      },
      {
        id: '4',
        user_id: user?.id || '',
        reminder_type: 'exercise',
        title: 'Weekly Exercise Goal',
        description: '150 minutes of moderate aerobic activity',
        due_date: '2024-10-20',
        frequency: 'weekly',
        is_completed: false,
        priority: 'medium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    setReminders(mockReminders);
  }, [user]);

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.due_date) {
      toast({
        title: 'Missing information',
        description: 'Please fill in the title and due date',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const reminder: PreventiveCareReminder = {
      id: `reminder_${Date.now()}`,
      user_id: user?.id || '',
      reminder_type: newReminder.reminder_type as any,
      title: newReminder.title,
      description: newReminder.description,
      due_date: newReminder.due_date,
      frequency: newReminder.frequency as any,
      is_completed: false,
      priority: newReminder.priority as any,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setReminders([...reminders, reminder]);
    setNewReminder({
      reminder_type: '',
      title: '',
      description: '',
      due_date: '',
      frequency: 'once',
      priority: 'medium',
    });
    onClose();

    toast({
      title: 'Reminder added',
      description: 'Your preventive care reminder has been created',
      status: 'success',
      duration: 3000,
    });
  };

  const handleCompleteReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { 
            ...reminder, 
            is_completed: true, 
            completed_at: new Date().toISOString(),
            next_due_date: reminder.frequency !== 'once' ? 
              addDays(new Date(reminder.due_date), getFrequencyDays(reminder.frequency)).toISOString().split('T')[0] : 
              undefined
          }
        : reminder
    ));

    toast({
      title: 'Reminder completed',
      description: 'Great job staying on top of your health!',
      status: 'success',
      duration: 3000,
    });
  };

  const getFrequencyDays = (frequency: string): number => {
    switch (frequency) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'yearly': return 365;
      default: return 0;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return '💉';
      case 'checkup': return '🩺';
      case 'screening': return '🔍';
      case 'medication': return '💊';
      case 'exercise': return '🏃';
      case 'diet': return '🥗';
      default: return '📋';
    }
  };

  const upcomingReminders = reminders.filter(r => !r.is_completed && isAfter(new Date(r.due_date), new Date()));
  const overdueReminders = reminders.filter(r => !r.is_completed && isBefore(new Date(r.due_date), new Date()));
  const completedReminders = reminders.filter(r => r.is_completed);

  const completionRate = reminders.length > 0 ? (completedReminders.length / reminders.length) * 100 : 0;

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Preventive Care</Heading>
            <Text color="gray.600">Stay on top of your health with personalized reminders</Text>
          </Box>
          <Button leftIcon={<Plus size={20} />} colorScheme="brand" onClick={onOpen}>
            Add Reminder
          </Button>
        </HStack>

        {/* Health Progress Overview */}
        <Card>
          <CardHeader>
            <Heading size="md">Your Health Progress</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {Math.round(completionRate)}%
                </Text>
                <Text fontSize="sm" color="gray.600">Completion Rate</Text>
                <Progress value={completionRate} colorScheme="brand" width="100%" />
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {completedReminders.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Completed</Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {upcomingReminders.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Upcoming</Text>
              </VStack>
            </Grid>
          </CardBody>
        </Card>

        {/* Overdue Reminders */}
        {overdueReminders.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <Bell size={20} color="red" />
                <Heading size="md" color="red.500">Overdue Reminders</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {overdueReminders.map((reminder) => (
                  <Alert key={reminder.id} status="error">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertDescription>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{reminder.title}</Text>
                            <Text fontSize="sm">Due: {format(new Date(reminder.due_date), 'PPP')}</Text>
                          </VStack>
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleCompleteReminder(reminder.id)}
                          >
                            Mark Complete
                          </Button>
                        </HStack>
                      </AlertDescription>
                    </Box>
                  </Alert>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <HStack>
              <Calendar size={20} />
              <Heading size="md">Upcoming Reminders</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {upcomingReminders.map((reminder) => (
                <Box
                  key={reminder.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ boxShadow: 'md' }}
                >
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Text fontSize="2xl">{getTypeIcon(reminder.reminder_type)}</Text>
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <Text fontWeight="bold">{reminder.title}</Text>
                          <Badge colorScheme={getPriorityColor(reminder.priority)}>
                            {reminder.priority}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">{reminder.description}</Text>
                        <HStack fontSize="sm" color="gray.500">
                          <Calendar size={14} />
                          <Text>Due: {format(new Date(reminder.due_date), 'PPP')}</Text>
                          <Clock size={14} />
                          <Text>{reminder.frequency}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme="green"
                      leftIcon={<CheckCircle size={16} />}
                      onClick={() => handleCompleteReminder(reminder.id)}
                    >
                      Complete
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <CheckCircle size={20} color="green" />
                <Heading size="md">Recently Completed</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {completedReminders.slice(0, 5).map((reminder) => (
                  <HStack key={reminder.id} justify="space-between" p={3} bg="green.50" borderRadius="md">
                    <HStack>
                      <Text fontSize="lg">{getTypeIcon(reminder.reminder_type)}</Text>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{reminder.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Completed: {reminder.completed_at && format(new Date(reminder.completed_at), 'PPP')}
                        </Text>
                      </VStack>
                    </HStack>
                    <CheckCircle size={20} color="green" />
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Add Reminder Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Preventive Care Reminder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Reminder Type</FormLabel>
                <Select
                  value={newReminder.reminder_type}
                  onChange={(e) => setNewReminder({ ...newReminder, reminder_type: e.target.value })}
                  placeholder="Select type"
                >
                  <option value="vaccination">Vaccination</option>
                  <option value="checkup">Health Checkup</option>
                  <option value="screening">Health Screening</option>
                  <option value="medication">Medication</option>
                  <option value="exercise">Exercise</option>
                  <option value="diet">Diet/Nutrition</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="e.g., Annual Physical Exam"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  placeholder="Additional details about this reminder..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={newReminder.due_date}
                  onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Frequency</FormLabel>
                <Select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                >
                  <option value="once">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={newReminder.priority}
                  onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PreventiveCare;