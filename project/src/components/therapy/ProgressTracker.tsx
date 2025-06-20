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
  Progress,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { Plus, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { format, subDays } from 'date-fns';
import { TherapyProgress } from '../../types/therapy';
import { useAuth } from '../../context/AuthContext';

const ProgressTracker: React.FC = () => {
  const [progressEntries, setProgressEntries] = useState<TherapyProgress[]>([]);
  const [newEntry, setNewEntry] = useState({
    mood_rating: 5,
    anxiety_level: 5,
    depression_level: 5,
    sleep_quality: 5,
    energy_level: 5,
    social_interaction: 5,
    achievements: '',
    challenges: '',
    goals_progress: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    const mockProgress: TherapyProgress[] = [
      {
        id: '1',
        patient_id: user?.id || '',
        therapist_id: 'therapist_1',
        session_id: 'session_1',
        progress_date: subDays(new Date(), 7).toISOString(),
        mood_rating: 6,
        anxiety_level: 7,
        depression_level: 6,
        sleep_quality: 5,
        energy_level: 4,
        social_interaction: 5,
        goal_progress: [
          { goal: 'Practice mindfulness daily', progress_percentage: 70, notes: 'Doing well with morning meditation' },
          { goal: 'Improve sleep schedule', progress_percentage: 50, notes: 'Still struggling with late nights' },
        ],
        challenges_faced: ['Work stress', 'Sleep issues'],
        achievements: ['Completed 5 meditation sessions', 'Had a good conversation with friend'],
        created_at: subDays(new Date(), 7).toISOString(),
      },
      {
        id: '2',
        patient_id: user?.id || '',
        therapist_id: 'therapist_1',
        session_id: 'session_2',
        progress_date: subDays(new Date(), 3).toISOString(),
        mood_rating: 7,
        anxiety_level: 6,
        depression_level: 5,
        sleep_quality: 6,
        energy_level: 6,
        social_interaction: 7,
        goal_progress: [
          { goal: 'Practice mindfulness daily', progress_percentage: 85, notes: 'Great progress this week' },
          { goal: 'Improve sleep schedule', progress_percentage: 65, notes: 'Better bedtime routine' },
        ],
        challenges_faced: ['Minor work deadline stress'],
        achievements: ['Maintained sleep schedule for 4 days', 'Reached out to family'],
        created_at: subDays(new Date(), 3).toISOString(),
      },
    ];
    setProgressEntries(mockProgress);
  }, [user]);

  const handleAddEntry = () => {
    const entry: TherapyProgress = {
      id: `progress_${Date.now()}`,
      patient_id: user?.id || '',
      therapist_id: 'therapist_1',
      session_id: 'session_current',
      progress_date: new Date().toISOString(),
      mood_rating: newEntry.mood_rating,
      anxiety_level: newEntry.anxiety_level,
      depression_level: newEntry.depression_level,
      sleep_quality: newEntry.sleep_quality,
      energy_level: newEntry.energy_level,
      social_interaction: newEntry.social_interaction,
      goal_progress: newEntry.goals_progress ? [
        { goal: 'Current goals', progress_percentage: 50, notes: newEntry.goals_progress }
      ] : [],
      challenges_faced: newEntry.challenges ? newEntry.challenges.split(',').map(c => c.trim()) : [],
      achievements: newEntry.achievements ? newEntry.achievements.split(',').map(a => a.trim()) : [],
      created_at: new Date().toISOString(),
    };

    setProgressEntries([...progressEntries, entry]);
    setNewEntry({
      mood_rating: 5,
      anxiety_level: 5,
      depression_level: 5,
      sleep_quality: 5,
      energy_level: 5,
      social_interaction: 5,
      achievements: '',
      challenges: '',
      goals_progress: '',
    });
    onClose();

    toast({
      title: 'Progress recorded',
      description: 'Your therapy progress has been saved',
      status: 'success',
      duration: 3000,
    });
  };

  // Prepare chart data
  const chartData = progressEntries.map(entry => ({
    date: format(new Date(entry.progress_date), 'MMM dd'),
    mood: entry.mood_rating,
    anxiety: 10 - entry.anxiety_level, // Invert so higher is better
    depression: 10 - entry.depression_level, // Invert so higher is better
    sleep: entry.sleep_quality,
    energy: entry.energy_level,
    social: entry.social_interaction,
  }));

  const latestEntry = progressEntries[progressEntries.length - 1];
  const previousEntry = progressEntries[progressEntries.length - 2];

  const radarData = latestEntry ? [
    { subject: 'Mood', A: latestEntry.mood_rating, fullMark: 10 },
    { subject: 'Sleep', A: latestEntry.sleep_quality, fullMark: 10 },
    { subject: 'Energy', A: latestEntry.energy_level, fullMark: 10 },
    { subject: 'Social', A: latestEntry.social_interaction, fullMark: 10 },
    { subject: 'Low Anxiety', A: 10 - latestEntry.anxiety_level, fullMark: 10 },
    { subject: 'Low Depression', A: 10 - latestEntry.depression_level, fullMark: 10 },
  ] : [];

  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return null;
    const change = current - previous;
    return change > 0 ? 'increase' : change < 0 ? 'decrease' : null;
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Therapy Progress Tracker</Heading>
            <Text color="gray.600">Track your mental health journey and celebrate your progress</Text>
          </Box>
          <Button leftIcon={<Plus size={20} />} colorScheme="brand" onClick={onOpen}>
            Record Progress
          </Button>
        </HStack>

        {/* Progress Overview */}
        {latestEntry && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Overall Mood</StatLabel>
                  <StatNumber>{latestEntry.mood_rating}/10</StatNumber>
                  {previousEntry && (
                    <StatHelpText>
                      <StatArrow type={getChangeIndicator(latestEntry.mood_rating, previousEntry.mood_rating) || 'increase'} />
                      {Math.abs(latestEntry.mood_rating - previousEntry.mood_rating)} from last entry
                    </StatHelpText>
                  )}
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Sleep Quality</StatLabel>
                  <StatNumber>{latestEntry.sleep_quality}/10</StatNumber>
                  {previousEntry && (
                    <StatHelpText>
                      <StatArrow type={getChangeIndicator(latestEntry.sleep_quality, previousEntry.sleep_quality) || 'increase'} />
                      {Math.abs(latestEntry.sleep_quality - previousEntry.sleep_quality)} from last entry
                    </StatHelpText>
                  )}
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Energy Level</StatLabel>
                  <StatNumber>{latestEntry.energy_level}/10</StatNumber>
                  {previousEntry && (
                    <StatHelpText>
                      <StatArrow type={getChangeIndicator(latestEntry.energy_level, previousEntry.energy_level) || 'increase'} />
                      {Math.abs(latestEntry.energy_level - previousEntry.energy_level)} from last entry
                    </StatHelpText>
                  )}
                </Stat>
              </CardBody>
            </Card>
          </Grid>
        )}

        {/* Progress Charts */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Progress Over Time</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#3182CE" strokeWidth={2} name="Mood" />
                    <Line type="monotone" dataKey="sleep" stroke="#38A169" strokeWidth={2} name="Sleep" />
                    <Line type="monotone" dataKey="energy" stroke="#D69E2E" strokeWidth={2} name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Current Wellness Snapshot</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar name="Current" dataKey="A" stroke="#3182CE" fill="#3182CE" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </Grid>

        {/* Goals Progress */}
        {latestEntry?.goal_progress && latestEntry.goal_progress.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <Target size={20} />
                <Heading size="md">Goal Progress</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {latestEntry.goal_progress.map((goal, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">{goal.goal}</Text>
                      <Badge colorScheme="brand">{goal.progress_percentage}%</Badge>
                    </HStack>
                    <Progress value={goal.progress_percentage} colorScheme="brand" mb={2} />
                    {goal.notes && (
                      <Text fontSize="sm" color="gray.600">{goal.notes}</Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Recent Achievements */}
        {latestEntry?.achievements && latestEntry.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <Award size={20} />
                <Heading size="md">Recent Achievements</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                {latestEntry.achievements.map((achievement, index) => (
                  <HStack key={index}>
                    <Award size={16} color="gold" />
                    <Text>{achievement}</Text>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Add Progress Entry Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Your Progress</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Text color="gray.600">
                Rate each area on a scale of 1-10, where 10 is the best you've felt.
              </Text>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <FormControl>
                  <FormLabel>Mood Rating: {newEntry.mood_rating}</FormLabel>
                  <Slider
                    value={newEntry.mood_rating}
                    onChange={(val) => setNewEntry({ ...newEntry, mood_rating: val })}
                    min={1}
                    max={10}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2" fontSize="sm">1</SliderMark>
                    <SliderMark value={5} mt="2" ml="-2" fontSize="sm">5</SliderMark>
                    <SliderMark value={10} mt="2" ml="-3" fontSize="sm">10</SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Anxiety Level: {newEntry.anxiety_level}</FormLabel>
                  <Slider
                    value={newEntry.anxiety_level}
                    onChange={(val) => setNewEntry({ ...newEntry, anxiety_level: val })}
                    min={1}
                    max={10}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2" fontSize="sm">1</SliderMark>
                    <SliderMark value={5} mt="2" ml="-2" fontSize="sm">5</SliderMark>
                    <SliderMark value={10} mt="2" ml="-3" fontSize="sm">10</SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Sleep Quality: {newEntry.sleep_quality}</FormLabel>
                  <Slider
                    value={newEntry.sleep_quality}
                    onChange={(val) => setNewEntry({ ...newEntry, sleep_quality: val })}
                    min={1}
                    max={10}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2" fontSize="sm">1</SliderMark>
                    <SliderMark value={5} mt="2" ml="-2" fontSize="sm">5</SliderMark>
                    <SliderMark value={10} mt="2" ml="-3" fontSize="sm">10</SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Energy Level: {newEntry.energy_level}</FormLabel>
                  <Slider
                    value={newEntry.energy_level}
                    onChange={(val) => setNewEntry({ ...newEntry, energy_level: val })}
                    min={1}
                    max={10}
                    step={1}
                  >
                    <SliderMark value={1} mt="2" ml="-2" fontSize="sm">1</SliderMark>
                    <SliderMark value={5} mt="2" ml="-2" fontSize="sm">5</SliderMark>
                    <SliderMark value={10} mt="2" ml="-3" fontSize="sm">10</SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>Achievements (comma-separated)</FormLabel>
                <Textarea
                  value={newEntry.achievements}
                  onChange={(e) => setNewEntry({ ...newEntry, achievements: e.target.value })}
                  placeholder="What did you accomplish this week? e.g., Exercised 3 times, Had a good conversation with friend"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Challenges (comma-separated)</FormLabel>
                <Textarea
                  value={newEntry.challenges}
                  onChange={(e) => setNewEntry({ ...newEntry, challenges: e.target.value })}
                  placeholder="What challenges did you face? e.g., Work stress, Sleep issues"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Goal Progress Notes</FormLabel>
                <Textarea
                  value={newEntry.goals_progress}
                  onChange={(e) => setNewEntry({ ...newEntry, goals_progress: e.target.value })}
                  placeholder="How are you progressing toward your therapy goals?"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleAddEntry}>
              Save Progress
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProgressTracker;