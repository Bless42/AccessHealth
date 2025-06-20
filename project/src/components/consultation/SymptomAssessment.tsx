import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Progress,
} from '@chakra-ui/react';
import { Symptom } from '../../types/consultation';
import BodyMap from './BodyMap';

interface SymptomAssessmentProps {
  onComplete: (symptoms: Symptom[]) => void;
  language?: string;
}

const SymptomAssessment: React.FC<SymptomAssessmentProps> = ({ 
  onComplete,
  language = 'en'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({});
  const toast = useToast();

  const questions = [
    {
      id: 'name',
      question: language === 'en' 
        ? 'What symptoms are you experiencing?' 
        : language === 'fr'
        ? 'Quels symptômes ressentez-vous ?'
        : 'Wetin dey worry you?',
      type: 'text',
    },
    {
      id: 'severity',
      question: language === 'en'
        ? 'How severe is this symptom?'
        : language === 'fr'
        ? 'Quelle est la gravité de ce symptôme ?'
        : 'How e bad reach?',
      type: 'select',
      options: ['mild', 'moderate', 'severe'],
    },
    {
      id: 'duration',
      question: language === 'en'
        ? 'How long have you had this symptom?'
        : language === 'fr'
        ? 'Depuis combien de temps avez-vous ce symptôme ?'
        : 'How long e don dey worry you?',
      type: 'text',
    },
    {
      id: 'location',
      question: language === 'en'
        ? 'Where on your body is this symptom?'
        : language === 'fr'
        ? 'Où ressentez-vous ce symptôme sur votre corps ?'
        : 'For which part of your body e dey?',
      type: 'body-map',
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const newSymptom: Symptom = {
        id: Date.now().toString(),
        name: currentSymptom.name || '',
        severity: currentSymptom.severity as 'mild' | 'moderate' | 'severe',
        duration: currentSymptom.duration || '',
        location: currentSymptom.location,
      };

      setSymptoms([...symptoms, newSymptom]);
      setCurrentSymptom({});
      setCurrentStep(0);

      toast({
        title: language === 'en' 
          ? 'Symptom added'
          : language === 'fr'
          ? 'Symptôme ajouté'
          : 'Symptom don add',
        status: 'success',
        duration: 2000,
      });
    }
  };

  const handleComplete = () => {
    if (symptoms.length === 0) {
      toast({
        title: language === 'en'
          ? 'Please add at least one symptom'
          : language === 'fr'
          ? 'Veuillez ajouter au moins un symptôme'
          : 'Abeg add at least one symptom',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    onComplete(symptoms);
  };

  const renderQuestion = () => {
    const question = questions[currentStep];

    switch (question.type) {
      case 'select':
        return (
          <Select
            value={currentSymptom[question.id as keyof Symptom] || ''}
            onChange={(e) => 
              setCurrentSymptom({ ...currentSymptom, [question.id]: e.target.value })
            }
          >
            <option value="">Select severity</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
        );

      case 'body-map':
        return (
          <BodyMap
            onLocationSelect={(location) =>
              setCurrentSymptom({ ...currentSymptom, location })
            }
          />
        );

      default:
        return (
          <Input
            value={currentSymptom[question.id as keyof Symptom] || ''}
            onChange={(e) =>
              setCurrentSymptom({ ...currentSymptom, [question.id]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">
          {language === 'en'
            ? 'Symptom Assessment'
            : language === 'fr'
            ? 'Évaluation des Symptômes'
            : 'Symptom Check'}
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={6}>
          <Progress
            value={(currentStep / questions.length) * 100}
            size="sm"
            colorScheme="brand"
          />

          <Box>
            <FormControl>
              <FormLabel>{questions[currentStep].question}</FormLabel>
              {renderQuestion()}
            </FormControl>
          </Box>

          {symptoms.length > 0 && (
            <Box>
              <Text fontWeight="medium" mb={2}>
                {language === 'en'
                  ? 'Reported Symptoms:'
                  : language === 'fr'
                  ? 'Symptômes Signalés :'
                  : 'Symptoms wey you don report:'}
              </Text>
              <Stack spacing={2}>
                {symptoms.map((symptom) => (
                  <Text key={symptom.id}>
                    {symptom.name} - {symptom.severity}
                    {symptom.location && ` (${symptom.location})`}
                  </Text>
                ))}
              </Stack>
            </Box>
          )}

          <Stack direction="row" spacing={4} justify="flex-end">
            <Button
              variant="outline"
              onClick={handleComplete}
              isDisabled={symptoms.length === 0}
            >
              {language === 'en'
                ? 'Complete Assessment'
                : language === 'fr'
                ? 'Terminer l\'Évaluation'
                : 'Finish Check'}
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleNext}
              isDisabled={!currentSymptom[questions[currentStep].id]}
            >
              {language === 'en'
                ? currentStep < questions.length - 1 ? 'Next' : 'Add Symptom'
                : language === 'fr'
                ? currentStep < questions.length - 1 ? 'Suivant' : 'Ajouter'
                : currentStep < questions.length - 1 ? 'Next' : 'Add am'}
            </Button>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default SymptomAssessment;