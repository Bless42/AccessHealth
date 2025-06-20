import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Stack,
  Input,
  Select,
  Button,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Avatar,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Doctor, DoctorSpecialty, DoctorSearchFilters } from '../../types/consultation';

interface DoctorSearchProps {
  onDoctorSelect: (doctor: Doctor) => void;
  filters?: Partial<DoctorSearchFilters>;
}

const DoctorCard: React.FC<{ doctor: Doctor; onSelect: () => void }> = ({ doctor, onSelect }) => {
  const doctorName = doctor.user?.profiles?.first_name && doctor.user?.profiles?.last_name 
    ? `Dr. ${doctor.user.profiles.first_name} ${doctor.user.profiles.last_name}`
    : doctor.user?.email?.split('@')[0] || 'Dr. Unknown';

  return (
    <Card cursor="pointer" onClick={onSelect} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack spacing={4}>
            <Avatar size="lg" name={doctorName} />
            <VStack align="start" flex={1} spacing={1}>
              <Heading size="md">{doctorName}</Heading>
              <HStack>
                <Star size={16} fill="gold" color="gold" />
                <Text fontSize="sm">{doctor.rating.toFixed(1)} ({doctor.total_reviews} reviews)</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">{doctor.years_experience} years experience</Text>
            </VStack>
          </HStack>

          <Box>
            <Text fontSize="sm" noOfLines={3}>{doctor.bio}</Text>
          </Box>

          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <HStack>
                <DollarSign size={16} />
                <Text fontWeight="medium">${doctor.consultation_fee}</Text>
              </HStack>
              {doctor.address && (
                <HStack>
                  <MapPin size={16} />
                  <Text fontSize="sm" color="gray.500">{doctor.address}</Text>
                </HStack>
              )}
            </VStack>
            <VStack align="end" spacing={1}>
              <Badge colorScheme={doctor.is_available ? 'green' : 'red'}>
                {doctor.is_available ? 'Available' : 'Busy'}
              </Badge>
              {doctor.is_verified && (
                <Badge colorScheme="blue">Verified</Badge>
              )}
            </VStack>
          </HStack>

          <HStack wrap="wrap" spacing={2}>
            {doctor.specialties?.map((specialty) => (
              <Badge key={specialty.id} variant="outline" colorScheme="brand">
                {specialty.name}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const DoctorSearch: React.FC<DoctorSearchProps> = ({ onDoctorSelect, filters = {} }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<DoctorSpecialty[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(filters.specialty || '');
  const [maxFee, setMaxFee] = useState(filters.maxFee || 500);
  const [minRating, setMinRating] = useState(filters.rating || 0);
  const [consultationType, setConsultationType] = useState(filters.consultationType || '');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSpecialties();
    searchDoctors();
  }, []);

  useEffect(() => {
    searchDoctors();
  }, [selectedSpecialty, maxFee, minRating, consultationType]);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const searchDoctors = async () => {
    try {
      setIsLoading(true);
      
      // Get doctors with their user information through the foreign key relationship
      let doctorsQuery = supabase
        .from('doctors')
        .select(`
          *,
          user:user_id(
            email,
            profiles(
              first_name,
              last_name
            )
          )
        `)
        .eq('is_verified', true)
        .lte('consultation_fee', maxFee)
        .gte('rating', minRating);

      const { data: doctorsData, error: doctorsError } = await doctorsQuery.order('rating', { ascending: false });

      if (doctorsError) throw doctorsError;

      // Get specialties for each doctor
      const doctorsWithSpecialties = await Promise.all(
        (doctorsData || []).map(async (doctor) => {
          const { data: specialtiesData } = await supabase
            .from('doctor_specialty_junction')
            .select(`
              doctor_specialties(
                id,
                name,
                description
              )
            `)
            .eq('doctor_id', doctor.id);

          return {
            ...doctor,
            specialties: specialtiesData?.map(s => s.doctor_specialties).filter(Boolean) || []
          };
        })
      );

      // Filter by specialty if selected
      let filteredDoctors = doctorsWithSpecialties;
      if (selectedSpecialty) {
        filteredDoctors = doctorsWithSpecialties.filter(doctor =>
          doctor.specialties?.some((s: any) => s.id === selectedSpecialty)
        );
      }

      // Filter by search query if provided
      if (searchQuery) {
        filteredDoctors = filteredDoctors.filter(doctor => {
          const doctorName = doctor.user?.profiles?.first_name && doctor.user?.profiles?.last_name 
            ? `${doctor.user.profiles.first_name} ${doctor.user.profiles.last_name}`
            : doctor.user?.email || '';
          
          return doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialties?.some((s: any) => 
              s.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
      }

      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error searching doctors:', error);
      toast({
        title: 'Error searching doctors',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    searchDoctors();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Find a Doctor</Heading>
              
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl>
                  <FormLabel>Search</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Search size={20} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by name, specialty, or location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </InputGroup>
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
                  <FormLabel>Consultation Type</FormLabel>
                  <Select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                  >
                    <option value="">Any Type</option>
                    <option value="virtual">Virtual</option>
                    <option value="in_person">In Person</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Maximum Fee: ${maxFee}</FormLabel>
                  <RangeSlider
                    value={[0, maxFee]}
                    onChange={(val) => setMaxFee(val[1])}
                    min={0}
                    max={1000}
                    step={25}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </FormControl>
              </Grid>

              <Button
                colorScheme="brand"
                onClick={handleSearch}
                isLoading={isLoading}
                leftIcon={<Search size={20} />}
              >
                Search Doctors
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Box>
          <Text mb={4} fontWeight="medium">
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
          </Text>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={() => onDoctorSelect(doctor)}
              />
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default DoctorSearch;