import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Stack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  Badge,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Send, MoreVertical, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ChatMessage } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onAssignDoctor?: () => void;
  status: 'pending' | 'active' | 'completed';
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onAssignDoctor,
  status,
  isLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'active':
        return 'green';
      case 'completed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Card height="full">
      <CardHeader
        borderBottom="1px"
        borderColor={borderColor}
        py={4}
      >
        <Flex justify="space-between" align="center">
          <Stack direction="row" align="center" spacing={4}>
            <Heading size="md">Consultation</Heading>
            <Badge colorScheme={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </Stack>
          
          {profile?.role === 'doctor' && status === 'pending' && (
            <IconButton
              aria-label="Assign doctor"
              icon={<UserPlus size={20} />}
              variant="ghost"
              onClick={onAssignDoctor}
            />
          )}
        </Flex>
      </CardHeader>

      <CardBody p={0}>
        <Stack height="full">
          <Box
            flex={1}
            overflowY="auto"
            px={6}
            py={4}
          >
            <Stack spacing={4}>
              {messages.map((message) => (
                <Flex
                  key={message.id}
                  direction="row"
                  align="start"
                  justify={message.sender.id === user?.id ? 'flex-end' : 'flex-start'}
                >
                  {message.sender.id !== user?.id && (
                    <Avatar
                      size="sm"
                      name={message.sender.name || 'AI'}
                      bg={message.sender.isAI ? 'brand.500' : 'gray.500'}
                      color="white"
                      mr={2}
                    />
                  )}
                  
                  <Stack
                    maxW="70%"
                    bg={message.sender.id === user?.id ? 'brand.500' : bgColor}
                    color={message.sender.id === user?.id ? 'white' : 'inherit'}
                    borderRadius="lg"
                    px={4}
                    py={2}
                    borderWidth={message.sender.id !== user?.id ? '1px' : 0}
                  >
                    {message.sender.id !== user?.id && (
                      <Text fontSize="sm\" fontWeight="medium\" mb={1}>
                        {message.sender.name || 'AI Assistant'}
                        {message.sender.role && (
                          <Badge ml={2} colorScheme="brand" variant="subtle">
                            {message.sender.role}
                          </Badge>
                        )}
                      </Text>
                    )}
                    <Text>{message.content}</Text>
                    <Text fontSize="xs" color={message.sender.id === user?.id ? 'whiteAlpha.700' : 'gray.500'} alignSelf="flex-end">
                      {format(new Date(message.timestamp), 'p')}
                    </Text>
                  </Stack>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          <Box
            p={4}
            borderTop="1px"
            borderColor={borderColor}
          >
            <Stack direction="row" spacing={2}>
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={status === 'completed' || isLoading}
              />
              <Button
                colorScheme="brand"
                onClick={handleSend}
                isDisabled={!newMessage.trim() || status === 'completed' || isLoading}
                isLoading={isLoading}
              >
                <Send size={20} />
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ChatWindow;