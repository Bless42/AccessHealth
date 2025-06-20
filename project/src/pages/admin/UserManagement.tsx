import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Stack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { MoreVertical, Search, UserCog } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import MainLayout from '../../components/layouts/MainLayout';
import { Profile, UserRole } from '../../types/auth';

interface ExtendedProfile extends Profile {
  email?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ExtendedProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user:user_id (
            email
          )
        `);

      if (profilesError) throw profilesError;

      const extendedProfiles: ExtendedProfile[] = profiles.map(profile => ({
        ...profile,
        email: (profile.user as any)?.email,
      }));

      setUsers(extendedProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Role updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error updating role',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'doctor':
        return 'green';
      case 'patient':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <MainLayout>
      <Box py={8}>
        <Stack spacing={6}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
          >
            <Heading size="lg">User Management</Heading>
          </Stack>

          <Card>
            <CardBody>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                mb={6}
              >
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search size={20} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>

                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  maxW={{ base: 'full', md: '200px' }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </Select>
              </Stack>

              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>User</Th>
                      <Th>Role</Th>
                      <Th>Joined</Th>
                      <Th>Last Updated</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUsers.map((user) => (
                      <Tr key={user.id}>
                        <Td>
                          <Stack spacing={1}>
                            <Box fontWeight="medium">
                              {user.first_name} {user.last_name}
                            </Box>
                            <Box fontSize="sm" color="gray.500">
                              {user.email}
                            </Box>
                          </Stack>
                        </Td>
                        <Td>
                          <Badge colorScheme={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </Td>
                        <Td>
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </Td>
                        <Td>
                          {format(new Date(user.updated_at), 'MMM d, yyyy')}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical size={16} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<UserCog size={16} />}
                                onClick={() => handleRoleChange(user.user_id, 'admin')}
                                isDisabled={user.role === 'admin'}
                              >
                                Make Admin
                              </MenuItem>
                              <MenuItem
                                icon={<UserCog size={16} />}
                                onClick={() => handleRoleChange(user.user_id, 'doctor')}
                                isDisabled={user.role === 'doctor'}
                              >
                                Make Doctor
                              </MenuItem>
                              <MenuItem
                                icon={<UserCog size={16} />}
                                onClick={() => handleRoleChange(user.user_id, 'patient')}
                                isDisabled={user.role === 'patient'}
                              >
                                Make Patient
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </Stack>
      </Box>
    </MainLayout>
  );
};

export default UserManagement;