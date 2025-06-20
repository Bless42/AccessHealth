import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Appointment, VideoSession } from '../../types/consultation';
import { useAuth } from '../../context/AuthContext';

interface VideoConsultationProps {
  appointment: Appointment;
  onEndCall: () => void;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({
  appointment,
  onEndCall,
}) => {
  const [videoSession, setVideoSession] = useState<VideoSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const { user, profile } = useAuth();
  const toast = useToast();

  useEffect(() => {
    initializeVideoSession();
    
    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeVideoSession = async () => {
    try {
      // Check if video session already exists
      const { data: existingSession } = await supabase
        .from('video_sessions')
        .select('*')
        .eq('appointment_id', appointment.id)
        .single();

      if (existingSession) {
        setVideoSession(existingSession);
        setCallStatus('connected');
      } else {
        // Create new video session
        const sessionData = {
          appointment_id: appointment.id,
          session_id: `session_${Date.now()}`,
          room_url: `https://meet.accesshealth.app/room/${appointment.id}`,
          status: 'active',
          started_at: new Date().toISOString(),
          participants: [
            { user_id: appointment.patient_id, role: 'patient', joined_at: new Date().toISOString() },
            { user_id: appointment.doctor?.user_id, role: 'doctor', joined_at: null }
          ]
        };

        const { data, error } = await supabase
          .from('video_sessions')
          .insert(sessionData)
          .select()
          .single();

        if (error) throw error;

        setVideoSession(data);
        setCallStatus('connected');

        // Update appointment status
        await supabase
          .from('appointments')
          .update({ status: 'in_progress' })
          .eq('id', appointment.id);
      }
    } catch (error) {
      console.error('Error initializing video session:', error);
      toast({
        title: 'Failed to start video session',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? 'Camera turned off' : 'Camera turned on',
      status: 'info',
      duration: 2000,
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? 'Microphone muted' : 'Microphone unmuted',
      status: 'info',
      duration: 2000,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started',
      status: 'info',
      duration: 2000,
    });
  };

  const endCall = async () => {
    try {
      if (videoSession) {
        await supabase
          .from('video_sessions')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString(),
            duration_seconds: callDuration,
          })
          .eq('id', videoSession.id);

        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', appointment.id);
      }

      setCallStatus('ended');
      onEndCall();
    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: 'Error ending call',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callStatus === 'ended') {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <Heading size="md">Call Ended</Heading>
            <Text>Thank you for using AccessHealth video consultation.</Text>
            <Text>Call duration: {formatDuration(callDuration)}</Text>
            <Button colorScheme="brand" onClick={onEndCall}>
              Return to Dashboard
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box height="100vh" bg="black" position="relative">
      {/* Video Container */}
      <Box position="relative" height="100%" width="100%">
        {/* Main Video Area */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {callStatus === 'connecting' ? (
            <VStack spacing={4} color="white">
              <Text fontSize="xl">Connecting to video call...</Text>
              <Text>Please wait while we establish the connection.</Text>
            </VStack>
          ) : (
            <VStack spacing={4} color="white">
              <Text fontSize="xl">Video Call Active</Text>
              <Text>Duration: {formatDuration(callDuration)}</Text>
              {!isVideoEnabled && (
                <Alert status="warning">
                  <AlertIcon />
                  <AlertDescription>Your camera is turned off</AlertDescription>
                </Alert>
              )}
            </VStack>
          )}
        </Box>

        {/* Self Video (Picture-in-Picture) */}
        <Box
          position="absolute"
          top={4}
          right={4}
          width="200px"
          height="150px"
          bg="gray.800"
          borderRadius="md"
          border="2px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontSize="sm">
            {isVideoEnabled ? 'Your Video' : 'Camera Off'}
          </Text>
        </Box>

        {/* Call Info */}
        <Box
          position="absolute"
          top={4}
          left={4}
          bg="blackAlpha.700"
          color="white"
          p={3}
          borderRadius="md"
        >
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              {profile?.role === 'doctor' ? 'Patient' : 'Doctor'}: {
                profile?.role === 'doctor' 
                  ? appointment.patient?.email?.split('@')[0]
                  : appointment.doctor?.user?.email?.split('@')[0]
              }
            </Text>
            <HStack>
              <Badge colorScheme="green">Connected</Badge>
              <Text fontSize="sm">{formatDuration(callDuration)}</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Controls */}
        <Box
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          bg="blackAlpha.700"
          p={4}
          borderRadius="full"
        >
          <HStack spacing={4}>
            <Tooltip label={isAudioEnabled ? 'Mute' : 'Unmute'}>
              <IconButton
                aria-label="Toggle audio"
                icon={isAudioEnabled ? <Mic /> : <MicOff />}
                colorScheme={isAudioEnabled ? 'gray' : 'red'}
                variant="solid"
                size="lg"
                borderRadius="full"
                onClick={toggleAudio}
              />
            </Tooltip>

            <Tooltip label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
              <IconButton
                aria-label="Toggle video"
                icon={isVideoEnabled ? <Video /> : <VideoOff />}
                colorScheme={isVideoEnabled ? 'gray' : 'red'}
                variant="solid"
                size="lg"
                borderRadius="full"
                onClick={toggleVideo}
              />
            </Tooltip>

            <Tooltip label={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
              <IconButton
                aria-label="Toggle screen share"
                icon={<Monitor />}
                colorScheme={isScreenSharing ? 'blue' : 'gray'}
                variant="solid"
                size="lg"
                borderRadius="full"
                onClick={toggleScreenShare}
              />
            </Tooltip>

            <Tooltip label="Open chat">
              <IconButton
                aria-label="Open chat"
                icon={<MessageCircle />}
                colorScheme="gray"
                variant="solid"
                size="lg"
                borderRadius="full"
              />
            </Tooltip>

            <Tooltip label="End call">
              <IconButton
                aria-label="End call"
                icon={<PhoneOff />}
                colorScheme="red"
                variant="solid"
                size="lg"
                borderRadius="full"
                onClick={endCall}
              />
            </Tooltip>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoConsultation;