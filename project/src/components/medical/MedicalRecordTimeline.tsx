import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Circle,
  Divider,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MedicalRecordAudit } from '../../types/medical';

interface TimelineEventProps {
  date: string;
  title: string;
  description: string;
  isLast?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  date,
  title,
  description,
  isLast,
}) => {
  const lineColor = useColorModeValue('gray.200', 'gray.700');
  const dotColor = useColorModeValue('brand.500', 'brand.400');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <HStack align="stretch\" spacing={4}>
      <VStack spacing={0} align="center">
        <Circle size={4} bg={dotColor} />
        {!isLast && <Divider orientation="vertical\" borderColor={lineColor} />}
      </VStack>
      <Box flex={1} pb={!isLast ? 8 : 0}>
        <Card bg={bgColor} boxShadow="sm">
          <CardHeader pb={2}>
            <Text fontSize="sm" color="gray.500">
              {format(new Date(date), 'PPP p')}
            </Text>
            <Heading size="sm">{title}</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text>{description}</Text>
          </CardBody>
        </Card>
      </Box>
    </HStack>
  );
};

interface MedicalRecordTimelineProps {
  auditTrail: MedicalRecordAudit[];
}

const MedicalRecordTimeline: React.FC<MedicalRecordTimelineProps> = ({
  auditTrail,
}) => {
  const generateChangeDescription = (audit: MedicalRecordAudit): string => {
    const changes: string[] = [];

    // Compare old and new data to generate meaningful descriptions
    if (audit.old_data.blood_type !== audit.new_data.blood_type) {
      changes.push(
        `Blood type updated from ${audit.old_data.blood_type || 'unset'} to ${
          audit.new_data.blood_type
        }`
      );
    }

    if (
      JSON.stringify(audit.old_data.allergies) !==
      JSON.stringify(audit.new_data.allergies)
    ) {
      const oldLength = audit.old_data.allergies?.length || 0;
      const newLength = audit.new_data.allergies?.length || 0;
      if (newLength > oldLength) {
        changes.push('New allergy added');
      } else if (newLength < oldLength) {
        changes.push('Allergy removed');
      } else {
        changes.push('Allergy information updated');
      }
    }

    if (
      JSON.stringify(audit.old_data.chronic_conditions) !==
      JSON.stringify(audit.new_data.chronic_conditions)
    ) {
      const oldLength = audit.old_data.chronic_conditions?.length || 0;
      const newLength = audit.new_data.chronic_conditions?.length || 0;
      if (newLength > oldLength) {
        changes.push('New chronic condition added');
      } else if (newLength < oldLength) {
        changes.push('Chronic condition removed');
      } else {
        changes.push('Chronic condition information updated');
      }
    }

    if (
      JSON.stringify(audit.old_data.vaccinations) !==
      JSON.stringify(audit.new_data.vaccinations)
    ) {
      const oldLength = audit.old_data.vaccinations?.length || 0;
      const newLength = audit.new_data.vaccinations?.length || 0;
      if (newLength > oldLength) {
        changes.push('New vaccination recorded');
      } else if (newLength < oldLength) {
        changes.push('Vaccination record removed');
      } else {
        changes.push('Vaccination information updated');
      }
    }

    return changes.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Medical Record Timeline</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={0} align="stretch">
          {auditTrail.map((audit, index) => (
            <TimelineEvent
              key={audit.id}
              date={audit.changed_at}
              title="Record Updated"
              description={generateChangeDescription(audit)}
              isLast={index === auditTrail.length - 1}
            />
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default MedicalRecordTimeline;