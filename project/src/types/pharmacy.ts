export interface Pharmacy {
  id: string;
  name: string;
  location_lat: number;
  location_lng: number;
  address: string;
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  pharmacy_id: string | null;
  medication: string;
  dosage: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  file_url: string | null;
  created_at: string;
  updated_at: string;
}