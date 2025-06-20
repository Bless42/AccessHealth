export interface Emergency {
  id: string;
  patient_id: string;
  location_lat: number;
  location_lng: number;
  status: 'pending' | 'dispatched' | 'resolved';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string | null;
}

export interface EmergencyLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}