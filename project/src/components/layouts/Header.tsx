import React from 'react';
import { 
  Box, 
  Flex, 
  IconButton, 
  Button, 
  Stack, 
  Collapse, 
  Link, 
  useColorModeValue, 
  useDisclosure, 
  useColorMode,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu as MenuIcon, X, Sun, Moon, Activity, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, profile, signOut } = useAuth();
  
  return (
    <Box 
      as="header"
      borderBottom="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      bg={useColorModeValue('white', 'gray.800')}
      position="sticky"
      top="0"
      zIndex="sticky"
      transition="background-color 0.2s ease-in-out"
      boxShadow="sm"
    >
      <Flex
        minH="60px"
        py={2}
        px={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <RouterLink to="/">
            <HStack spacing={2}>
              <Activity size={28} color={useColorModeValue('#3182CE', '#4EA2E4')} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                color={useColorModeValue('gray.800', 'white')}
              >
                AccessHealth
              </Text>
            </HStack>
          </RouterLink>
          
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        
        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={4}
          align="center"
        >
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
            color={useColorModeValue('gray.600', 'gray.300')}
            _hover={{
              color: useColorModeValue('gray.800', 'white'),
              bg: useColorModeValue('gray.100', 'gray.700')
            }}
          />
          
          {user ? (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={16} />}
                  variant="ghost"
                  fontSize="sm"
                  fontWeight={600}
                >
                  Services
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/consultations">
                    Doctor Consultations
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/therapy">
                    Therapy Services
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/ambulance">
                    Emergency Ambulance
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/pharmacies">
                    Pharmacy Locator
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/prescriptions">
                    Prescriptions
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem as={RouterLink} to="/health-education">
                    Health Education
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/preventive-care">
                    Preventive Care
                  </MenuItem>
                </MenuList>
              </Menu>
              
              <Button 
                as={RouterLink} 
                to="/dashboard"
                fontSize="sm"
                fontWeight={600}
                variant="ghost"
              >
                Dashboard
              </Button>
              
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={16} />}
                  variant="outline"
                  fontSize="sm"
                  fontWeight={600}
                >
                  {user.email?.split('@')[0] || 'User'}
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/dashboard">
                    Dashboard
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile Settings
                  </MenuItem>
                  {profile?.role === 'admin' && (
                    <>
                      <MenuDivider />
                      <MenuItem as={RouterLink} to="/admin">
                        Admin Dashboard
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/signin"
                fontSize="sm"
                fontWeight={600}
                variant="ghost"
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                fontSize="sm"
                fontWeight={600}
                variant="solid"
                bg="brand.500"
                color="white"
                _hover={{
                  bg: 'brand.600'
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>
      
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            as={RouterLink}
            to={navItem.href ?? '#'}
            p={2}
            fontSize="sm"
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Link
        as={RouterLink}
        to={href ?? '#'}
        py={2}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Link>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Services',
    href: '/services',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export default Header;