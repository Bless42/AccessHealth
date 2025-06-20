import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Pharmacy } from '../types/pharmacy';
import MainLayout from '../components/layouts/MainLayout';
import PharmacyMap from '../components/pharmacy/PharmacyMap';
import PharmacyCard from '../components/pharmacy/PharmacyCard';

const PharmacyLocator: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | undefined>();
  const toast = useToast();

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const { data, error } = await supabase
          .from('pharmacies')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setPharmacies(data || []);
      } catch (err) {
        toast({
          title: 'Error fetching pharmacies',
          status: 'error',
          duration: 5000,
        });
      }
    };

    fetchPharmacies();
  }, []);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <Box py={8}>
        <Stack spacing={6}>
          <Heading>Find a Pharmacy</Heading>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6}>
            <GridItem>
              <Stack spacing={4} maxH="calc(100vh - 300px)" overflowY="auto">
                {filteredPharmacies.map(pharmacy => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    onSelect={() => setSelectedPharmacy(pharmacy.id)}
                  />
                ))}
              </Stack>
            </GridItem>
            <GridItem>
              <PharmacyMap
                pharmacies={filteredPharmacies}
                selectedPharmacy={selectedPharmacy}
                onPharmacySelect={setSelectedPharmacy}
              />
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default PharmacyLocator;