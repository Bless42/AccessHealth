import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
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
} from '@chakra-ui/react';
import { Search, Star, MapPin, DollarSign, Calendar, Video, MessageCircle } from 'lucide-react';
import { Therapist, TherapySpecialty } from '../../types/therapy';

interface TherapistSearchProps {
  onTherapistSelect: (therapist: Therapist) => void;
}

const TherapistSearch: React.FC<TherapistSearchProps> = ({ onTherapistSelect }) => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [specialties, setSpecialties] = useState<TherapySpecialty[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxFee, setMaxFee] = useState(200);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    const mockSpecialties: TherapySpecialty[] = [
      { id: '1', name: 'Addiction Counseling', description: 'Substance abuse and behavioral addictions', category: 'addiction', created_at: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Relationship Therapy', description: 'Couples and relationship counseling', category: 'relationships', created_at: '2024-01-01T00:00:00Z' },
      { id: '3', name: 'Depression Treatment', description: 'Clinical depression and mood disorders', category: 'depression', created_at: '2024-01-01T00:00:00Z' },
      { id: '4', name: 'Anxiety Management', description: 'Anxiety disorders and panic attacks', category: 'anxiety', created_at: '2024-01-01T00:00:00Z' },
      { id: '5', name: 'Trauma Therapy', description: 'PTSD and trauma recovery', category: 'trauma', created_at: '2024-01-01T00:00:00Z' },
      { id: '6', name: 'Family Counseling', description: 'Family dynamics and communication', category: 'family', created_at: '2024-01-01T00:00:00Z' },
    ];

    const mockTherapists: Therapist[] = [
      {
        id: '1',
        user_id: 'therapist_1',
        license_number: 'LPC-12345',
        years_experience: 8,
        education: 'PhD in Clinical Psychology, University of California',
        bio: 'Specializing in cognitive behavioral therapy and mindfulness-based interventions for anxiety and depression.',
        session_fee: 120,
        rating: 4.8,
        total_reviews: 156,
        is_verified: true,
        is_available: true,
        therapy_types: ['individual', 'group'],
        languages: ['English', 'Spanish'],
        specialties: [mockSpecialties[2], mockSpecialties[3]],
        user: { email: 'Dr. Sarah Johnson' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        user_id: 'therapist_2',
        license_number: 'LMFT-67890',
        years_experience: 12,
        education: 'MA in Marriage and Family Therapy, Stanford University',
        bio: 'Expert in couples therapy and relationship counseling with a focus on communication and conflict resolution.',
        session_fee: 150,
        rating: 4.9,
        total_reviews: 203,
        is_verified: true,
        is_available: true,
        therapy_types: ['couples', 'individual'],
        languages: ['English'],
        specialties: [mockSpecialties[1], mockSpecialties[5]],
        user: { email: 'Dr. Michael Chen' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        user_id: 'therapist_3',
        license_number: 'LCDC-11111',
        years_experience: 15,
        education: 'MS in Addiction Counseling, Johns Hopkins University',
        bio: 'Specialized addiction counselor with extensive experience in substance abuse recovery and behavioral addictions.',
        session_fee: 100,
        rating: 4.7,
        total_reviews: 89,
        is_verified: true,
        is_available: true,
        therapy_types: ['individual', 'group'],
        languages: ['English', 'French'],
        specialties: [mockSpecialties[0], mockSpecialties[4]],
        user: { email: 'Dr. Emily Rodriguez' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    setSpecialties(mockSpecialties);
    setTherapists(mockTherapists);
  }, []);

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || 
                            therapist.specialties?.some(s => s.id === selectedSpecialty);
    
    const matchesCategory = !selectedCategory || 
                           therapist.specialties?.some(s => s.category === selectedCategory);
    
    const matchesFee = therapist.session_fee <= maxFee;
    
    return matchesSearch && matchesSpecialty && matchesCategory && matchesFee;
  });

  const handleBookConsultation = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    onOpen();
  };

  const handleScheduleSession = () => {
    if (selectedTherapist) {
      onTherapistSelect(selectedTherapist);
      onClose();
      toast({
        title: 'Therapist selected',
        description: 'Proceed to schedule your therapy session',
        status: 'success',
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Find a Therapist</Heading>
          <Text color="gray.600">
            Connect with licensed mental health professionals who can help you on your journey.
          </Text>
        </Box>

        {/* Search and Filters */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement>
                  <Search size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, specialty, or approach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="addiction">Addiction</option>
                    <option value="relationships">Relationships</option>
                    <option value="depression">Depression</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="trauma">Trauma</option>
                    <option value="family">Family</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Specialty</FormLabel>
                  <Select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Max Session Fee: ${maxFee}</FormLabel>
                  <Input
                    type="range"
                    min="50"
                    max="300"
                    value={maxFee}
                    onChange={(e) => setMaxFee(Number(e.target.value))}
                  />
                </FormControl>
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Therapist Results */}
        <Box>
          <Text mb={4} fontWeight="medium">
            {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} found
          </Text>
          
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            {filteredTherapists.map((therapist) => (
              <Card key={therapist.id} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack spacing={4}>
                      <Avatar size="lg" name={therapist.user?.email} />
                      <VStack align="start" flex={1} spacing={1}>
                        <Heading size="md">{therapist.user?.email}</Heading>
                        <HStack>
                          <Star size={16} fill="gold" color="gold" />
                          <Text fontSize="sm">{therapist.rating.toFixed(1)} ({therapist.total_reviews} reviews)</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">{therapist.years_experience} years experience</Text>
                        <HStack>
                          <Badge colorScheme={therapist.is_available ? 'green' : 'red'}>
                            {therapist.is_available ? 'Available' : 'Busy'}
                          </Badge>
                          {therapist.is_verified && (
                            <Badge colorScheme="blue">Verified</Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>

                    <Text fontSize="sm" noOfLines={3}>{therapist.bio}</Text>

                    <VStack align="start" spacing={2}>
                      <HStack>
                        <DollarSign size={16} />
                        <Text fontWeight="medium">${therapist.session_fee} per session</Text>
                      </HStack>
                      
                      <HStack wrap="wrap" spacing={2}>
                        {therapist.specialties?.map((specialty) => (
                          <Badge key={specialty.id} variant="outline" colorScheme="brand">
                            {specialty.name}
                          </Badge>
                        ))}
                      </HStack>

                      <HStack wrap="wrap" spacing={2}>
                        {therapist.therapy_types.map((type) => (
                          <Badge key={type} variant="solid" colorScheme="purple" size="sm">
                            {type}
                          </Badge>
                        ))}
                      </HStack>

                      <HStack wrap="wrap" spacing={2}>
                        {therapist.languages.map((language) => (
                          <Badge key={language} variant="outline" colorScheme="gray" size="sm">
                            {language}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>

                    <HStack spacing={2}>
                      <Button
                        flex={1}
                        colorScheme="brand"
                        leftIcon={<Calendar size={16} />}
                        onClick={() => handleBookConsultation(therapist)}
                      >
                        Book Session
                      </Button>
                      <Button
                        variant="outline"
                        leftIcon={<MessageCircle size={16} />}
                      >
                        Message
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>
      </VStack>

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Therapy Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTherapist && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Avatar size="md" name={selectedTherapist.user?.email} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{selectedTherapist.user?.email}</Text>
                    <Text fontSize="sm" color="gray.600">
                      ${selectedTherapist.session_fee} per session
                    </Text>
                  </VStack>
                </HStack>

                <FormControl>
                  <FormLabel>Session Type</FormLabel>
                  <Select defaultValue="individual">
                    {selectedTherapist.therapy_types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Therapy
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Session Format</FormLabel>
                  <Select defaultValue="virtual">
                    <option value="virtual">Virtual Session</option>
                    <option value="in_person">In-Person Session</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>What would you like to work on?</FormLabel>
                  <Textarea
                    placeholder="Briefly describe what you'd like to focus on in your therapy sessions..."
                    rows={4}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleScheduleSession}>
              Schedule Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TherapistSearch;