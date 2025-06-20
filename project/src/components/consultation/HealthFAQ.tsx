import React, { useState, useEffect } from 'react';
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Select,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FAQ } from '../../types/consultation';

interface HealthFAQProps {
  language?: string;
}

const HealthFAQ: React.FC<HealthFAQProps> = ({ language = 'en' }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, [language]);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('language', language)
        .order('category');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(
    new Set(faqs.map((faq) => faq.category))
  );

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <Heading size="md">
          {language === 'en'
            ? 'Health Information'
            : language === 'fr'
            ? 'Informations sur la Santé'
            : 'Health Information'}
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={6}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search size={20} />
              </InputLeftElement>
              <Input
                placeholder={
                  language === 'en'
                    ? 'Search health topics...'
                    : language === 'fr'
                    ? 'Rechercher des sujets de santé...'
                    : 'Search health topics...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              maxW={{ base: 'full', md: '200px' }}
            >
              <option value="all">
                {language === 'en'
                  ? 'All Categories'
                  : language === 'fr'
                  ? 'Toutes les Catégories'
                  : 'All Categories'}
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Stack>

          {filteredFaqs.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              {language === 'en'
                ? 'No results found'
                : language === 'fr'
                ? 'Aucun résultat trouvé'
                : 'No results found'}
            </Text>
          ) : (
            <Accordion allowMultiple>
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {faq.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default HealthFAQ;