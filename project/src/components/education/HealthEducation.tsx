import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  Stack,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { Search, Clock, Eye, Heart, Play, BookOpen, TrendingUp } from 'lucide-react';
import { HealthContent } from '../../types/education';

const HealthEducation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [healthContent, setHealthContent] = useState<HealthContent[]>([]);
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    const mockContent: HealthContent[] = [
      {
        id: '1',
        title: 'Understanding Heart Health: Prevention and Care',
        content: 'Learn about maintaining cardiovascular health through diet, exercise, and lifestyle changes...',
        content_type: 'article',
        category: 'preventive_care',
        tags: ['heart', 'prevention', 'lifestyle'],
        featured_image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
        reading_time: 8,
        difficulty_level: 'beginner',
        is_published: true,
        views_count: 1250,
        likes_count: 89,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Mental Health: Managing Stress and Anxiety',
        content: 'Practical techniques for managing daily stress and anxiety...',
        content_type: 'video',
        category: 'mental_health',
        tags: ['stress', 'anxiety', 'mental health'],
        featured_image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
        video_url: 'https://example.com/video',
        reading_time: 15,
        difficulty_level: 'intermediate',
        is_published: true,
        views_count: 2100,
        likes_count: 156,
        created_at: '2024-01-10T14:30:00Z',
        updated_at: '2024-01-10T14:30:00Z',
      },
      {
        id: '3',
        title: 'Nutrition Basics: Building a Healthy Diet',
        content: 'Essential nutrition principles for optimal health...',
        content_type: 'article',
        category: 'nutrition',
        tags: ['nutrition', 'diet', 'healthy eating'],
        featured_image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        reading_time: 12,
        difficulty_level: 'beginner',
        is_published: true,
        views_count: 1800,
        likes_count: 134,
        created_at: '2024-01-08T09:15:00Z',
        updated_at: '2024-01-08T09:15:00Z',
      },
      {
        id: '4',
        title: 'Exercise for Beginners: Getting Started Safely',
        content: 'A comprehensive guide to starting your fitness journey...',
        content_type: 'infographic',
        category: 'exercise',
        tags: ['exercise', 'fitness', 'beginners'],
        featured_image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
        reading_time: 5,
        difficulty_level: 'beginner',
        is_published: true,
        views_count: 950,
        likes_count: 67,
        created_at: '2024-01-05T16:45:00Z',
        updated_at: '2024-01-05T16:45:00Z',
      },
    ];
    setHealthContent(mockContent);
  }, []);

  const filteredContent = healthContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesType = selectedType === 'all' || content.content_type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'article': return BookOpen;
      case 'infographic': return TrendingUp;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'green';
      case 'exercise': return 'blue';
      case 'mental_health': return 'purple';
      case 'preventive_care': return 'orange';
      case 'chronic_disease': return 'red';
      case 'emergency_care': return 'red';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Health Education Center</Heading>
          <Text color="gray.600">
            Explore our comprehensive library of health education content to stay informed and healthy.
          </Text>
        </Box>

        {/* Search and Filters */}
        <Card bg={cardBg}>
          <CardBody>
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <Search size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Search health topics, articles, videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <HStack spacing={4}>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  maxW="200px"
                >
                  <option value="all">All Categories</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="exercise">Exercise</option>
                  <option value="mental_health">Mental Health</option>
                  <option value="preventive_care">Preventive Care</option>
                  <option value="chronic_disease">Chronic Disease</option>
                  <option value="emergency_care">Emergency Care</option>
                </Select>

                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  maxW="200px"
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="video">Videos</option>
                  <option value="infographic">Infographics</option>
                  <option value="tip">Tips</option>
                </Select>
              </HStack>
            </Stack>
          </CardBody>
        </Card>

        {/* Content Tabs */}
        <Tabs>
          <TabList>
            <Tab>All Content</Tab>
            <Tab>Featured</Tab>
            <Tab>Most Popular</Tab>
            <Tab>Recent</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {filteredContent.map((content) => (
                  <Card key={content.id} bg={cardBg} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
                    <Box position="relative">
                      <Image
                        src={content.featured_image}
                        alt={content.title}
                        height="200px"
                        width="100%"
                        objectFit="cover"
                        borderTopRadius="md"
                      />
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme={getCategoryColor(content.category)}
                      >
                        {content.category.replace('_', ' ')}
                      </Badge>
                      <HStack position="absolute" bottom={2} left={2} spacing={1}>
                        <Icon as={getContentIcon(content.content_type)} size={16} color="white" />
                        <Badge colorScheme="blackAlpha" variant="solid">
                          {content.content_type}
                        </Badge>
                      </HStack>
                    </Box>
                    
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Heading size="sm" noOfLines={2}>
                          {content.title}
                        </Heading>
                        
                        <Text fontSize="sm" color="gray.600" noOfLines={3}>
                          {content.content}
                        </Text>

                        <HStack justify="space-between" fontSize="sm">
                          <HStack>
                            <Clock size={14} />
                            <Text>{content.reading_time} min</Text>
                          </HStack>
                          <HStack>
                            <Eye size={14} />
                            <Text>{content.views_count}</Text>
                          </HStack>
                          <HStack>
                            <Heart size={14} />
                            <Text>{content.likes_count}</Text>
                          </HStack>
                        </HStack>

                        <HStack justify="space-between">
                          <Badge colorScheme={getDifficultyColor(content.difficulty_level)}>
                            {content.difficulty_level}
                          </Badge>
                          <Button size="sm" colorScheme="brand">
                            {content.content_type === 'video' ? 'Watch' : 'Read'}
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel px={0}>
              <Text>Featured content will be displayed here</Text>
            </TabPanel>

            <TabPanel px={0}>
              <Text>Most popular content will be displayed here</Text>
            </TabPanel>

            <TabPanel px={0}>
              <Text>Recent content will be displayed here</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default HealthEducation;