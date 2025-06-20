import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { CreditCard, Shield, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Payment, Appointment, Doctor } from '../../types/consultation';
import { useAuth } from '../../context/AuthContext';

interface PaymentProcessorProps {
  appointment: Appointment;
  doctor: Doctor;
  onPaymentComplete: (payment: Payment) => void;
  onCancel: () => void;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  paymentMethod: 'card' | 'bank_transfer' | 'wallet' | 'insurance';
  insuranceProvider?: string;
  policyNumber?: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  appointment,
  doctor,
  onPaymentComplete,
  onCancel,
}) => {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentMethod: 'card',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePaymentForm = (): boolean => {
    if (paymentForm.paymentMethod === 'card') {
      return !!(
        paymentForm.cardNumber.replace(/\s/g, '').length >= 13 &&
        paymentForm.expiryDate.length === 5 &&
        paymentForm.cvv.length >= 3 &&
        paymentForm.cardholderName.trim()
      );
    } else if (paymentForm.paymentMethod === 'insurance') {
      return !!(paymentForm.insuranceProvider && paymentForm.policyNumber);
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentForm()) {
      toast({
        title: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const paymentData = {
        patient_id: user?.id,
        doctor_id: doctor.id,
        appointment_id: appointment.id,
        amount: doctor.consultation_fee,
        currency: 'USD',
        payment_method: paymentForm.paymentMethod,
        payment_status: 'completed',
        transaction_id: `txn_${Date.now()}`,
        payment_provider: paymentForm.paymentMethod === 'card' ? 'stripe' : paymentForm.paymentMethod,
        metadata: {
          card_last_four: paymentForm.paymentMethod === 'card' 
            ? paymentForm.cardNumber.slice(-4) 
            : null,
          insurance_provider: paymentForm.insuranceProvider,
          policy_number: paymentForm.policyNumber,
        },
      };

      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) throw error;

      // Update appointment status to confirmed
      await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointment.id);

      toast({
        title: 'Payment successful',
        description: 'Your appointment has been confirmed',
        status: 'success',
        duration: 5000,
      });

      onPaymentComplete(data);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: 'Please try again or contact support',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = () => {
    switch (paymentForm.paymentMethod) {
      case 'card':
        return <CreditCard size={20} />;
      case 'insurance':
        return <Shield size={20} />;
      default:
        return <DollarSign size={20} />;
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="md">Payment Details</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text>Consultation Fee</Text>
                <Text fontWeight="bold">${doctor.consultation_fee}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Platform Fee</Text>
                <Text>$5.00</Text>
              </HStack>
              <Divider />
              <HStack justify="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold" fontSize="lg">
                  ${(doctor.consultation_fee + 5).toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Payment Method</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </Select>
              </FormControl>

              {paymentForm.paymentMethod === 'card' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input
                      value={paymentForm.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Card Number</FormLabel>
                    <Input
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </FormControl>

                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Expiry Date</FormLabel>
                      <Input
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>CVV</FormLabel>
                      <Input
                        value={paymentForm.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                      />
                    </FormControl>
                  </HStack>
                </>
              )}

              {paymentForm.paymentMethod === 'insurance' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Insurance Provider</FormLabel>
                    <Select
                      value={paymentForm.insuranceProvider || ''}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    >
                      <option value="">Select Provider</option>
                      <option value="blue_cross">Blue Cross Blue Shield</option>
                      <option value="aetna">Aetna</option>
                      <option value="cigna">Cigna</option>
                      <option value="united">United Healthcare</option>
                      <option value="humana">Humana</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Policy Number</FormLabel>
                    <Input
                      value={paymentForm.policyNumber || ''}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      placeholder="Enter your policy number"
                    />
                  </FormControl>

                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>
                      Insurance claims may take 3-5 business days to process. You may be responsible for copays or deductibles.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {paymentForm.paymentMethod === 'wallet' && (
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    You will be redirected to your digital wallet to complete the payment.
                  </AlertDescription>
                </Alert>
              )}

              {paymentForm.paymentMethod === 'bank_transfer' && (
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    Bank transfer payments may take 1-3 business days to process. Your appointment will be confirmed once payment is received.
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Alert status="success">
          <AlertIcon />
          <AlertDescription>
            Your payment information is encrypted and secure. We never store your full card details.
          </AlertDescription>
        </Alert>

        <HStack spacing={4}>
          <Button variant="outline" onClick={onCancel} flex={1}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={onOpen}
            isDisabled={!validatePaymentForm()}
            leftIcon={getPaymentMethodIcon()}
            flex={1}
          >
            Pay ${(doctor.consultation_fee + 5).toFixed(2)}
          </Button>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>Please confirm your payment details:</Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text>Amount:</Text>
                    <Text fontWeight="bold">${(doctor.consultation_fee + 5).toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Payment Method:</Text>
                    <Badge colorScheme="brand">
                      {paymentForm.paymentMethod === 'card' ? 'Credit Card' : 
                       paymentForm.paymentMethod === 'insurance' ? 'Insurance' :
                       paymentForm.paymentMethod === 'wallet' ? 'Digital Wallet' : 'Bank Transfer'}
                    </Badge>
                  </HStack>
                  {paymentForm.paymentMethod === 'card' && (
                    <HStack justify="space-between">
                      <Text>Card:</Text>
                      <Text>****{paymentForm.cardNumber.slice(-4)}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={processPayment}
              isLoading={isProcessing}
              loadingText="Processing..."
            >
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PaymentProcessor;