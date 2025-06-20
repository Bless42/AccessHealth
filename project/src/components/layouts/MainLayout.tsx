import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex 
      flexDirection="column" 
      minHeight="100vh"
    >
      <Header />
      <Box as="main" flex="1" py={{ base: 4, md: 8 }}>
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default MainLayout;