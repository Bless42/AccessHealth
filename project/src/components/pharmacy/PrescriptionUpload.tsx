import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  Progress,
} from '@chakra-ui/react';
import { Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PrescriptionUploadProps {
  onUploadComplete: (url: string) => void;
  isUploading: boolean;
  progress: number;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  onUploadComplete,
  isUploading,
  progress,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `prescriptions/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(filePath);

        onUploadComplete(publicUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const activeColor = useColorModeValue('gray.100', 'gray.600');

  return (
    <Box
      {...getRootProps()}
      borderWidth={2}
      borderStyle="dashed"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      bg={isDragActive ? activeColor : bgColor}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ bg: activeColor }}
    >
      <input {...getInputProps()} />
      <VStack spacing={2}>
        <Icon as={Upload} w={8} h={8} color="brand.500" />
        <Text textAlign="center">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag and drop your prescription, or click to select'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Supported formats: PDF, JPEG, PNG
        </Text>
      </VStack>
      {isUploading && (
        <Progress
          value={progress}
          size="sm"
          colorScheme="brand"
          mt={4}
          borderRadius="full"
        />
      )}
    </Box>
  );
};

export default PrescriptionUpload;