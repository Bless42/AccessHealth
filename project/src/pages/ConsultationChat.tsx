import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MainLayout from '../components/layouts/MainLayout';
import ChatWindow from '../components/chat/ChatWindow';
import SymptomAssessment from '../components/consultation/SymptomAssessment';
import HealthFAQ from '../components/consultation/HealthFAQ';
import { Consultation, ConsultationMessage, ChatMessage } from '../types/chat';
import { useAuth } from '../context/AuthContext';

const ConsultationChat: React.FC = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (consultationId) {
      fetchConsultation();
      fetchMessages();
      subscribeToMessages();
    }
  }, [consultationId]);

  const fetchConsultation = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patient:patient_id(*),
          doctor:doctor_id(*)
        `)
        .eq('id', consultationId)
        .single();

      if (error) throw error;
      setConsultation(data);
    } catch (error) {
      console.error('Error fetching consultation:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_messages')
        .select(`
          *,
          sender:sender_id(*)
        `)
        .eq('consultation_id', consultationId)
        .order('timestamp');

      if (error) throw error;

      const formattedMessages: ChatMessage[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: {
          id: msg.sender.id,
          name: msg.sender.email?.split('@')[0],
          role: msg.is_ai ? 'AI Assistant' : undefined,
          isAI: msg.is_ai,
        },
        timestamp: msg.timestamp,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`consultation_${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          const newMessage = payload.new as ConsultationMessage;
          addMessage(newMessage);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const addMessage = async (message: ConsultationMessage) => {
    try {
      const { data: sender } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', message.sender_id)
        .single();

      const newMessage: ChatMessage = {
        id: message.id,
        content: message.content,
        sender: {
          id: message.sender_id,
          name: sender?.first_name || message.sender_id,
          role: message.is_ai ? 'AI Assistant' : sender?.role,
          isAI: message.is_ai,
        },
        timestamp: message.timestamp,
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error processing new message:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('consultation_messages')
        .insert({
          consultation_id: consultationId,
          sender_id: user?.id,
          content,
          is_ai: false,
        });

      if (error) throw error;

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        const aiResponse = "I understand your concern. Could you please provide more details about your symptoms?";
        
        await supabase
          .from('consultation_messages')
          .insert({
            consultation_id: consultationId,
            sender_id: 'ai-assistant',
            content: aiResponse,
            is_ai: true,
          });
        
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  const handleAssignDoctor = async () => {
    if (!user || profile?.role !== 'doctor') return;

    try {
      const { error } = await supabase
        .from('consultations')
        .update({
          doctor_id: user.id,
          status: 'active',
        })
        .eq('id', consultationId);

      if (error) throw error;

      toast({
        title: 'Successfully assigned to consultation',
        status: 'success',
        duration: 3000,
      });

      fetchConsultation();
    } catch (error) {
      console.error('Error assigning doctor:', error);
      toast({
        title: 'Error assigning doctor',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <MainLayout>
      <Box py={8}>
        <Grid
          templateColumns={{ base: '1fr', lg: '3fr 1fr' }}
          gap={6}
          height="calc(100vh - 200px)"
        >
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onAssignDoctor={handleAssignDoctor}
            status={consultation?.status || 'pending'}
            isLoading={isLoading}
          />
          
          <Stack spacing={6}>
            <SymptomAssessment
              onComplete={() => {}}
              language="en"
            />
            <HealthFAQ
              language="en"
            />
          </Stack>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default ConsultationChat;