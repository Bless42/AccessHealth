export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_consultations_per_month: number;
  max_therapy_sessions_per_month: number;
  includes_emergency_services: boolean;
  includes_prescription_delivery: boolean;
  includes_health_monitoring: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  provider: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';
  last_four: string;
  brand?: string; // visa, mastercard, etc.
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  description: string;
  invoice_date: string;
  due_date: string;
  paid_at?: string;
  payment_method_id?: string;
  line_items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  created_at: string;
  updated_at: string;
}