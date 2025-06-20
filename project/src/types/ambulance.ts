export interface AmbulanceRequest {
  id: string;
  patient_id: string;
  location_lat: number;
  location_lng: number;
  emergency_type: 'medical' | 'accident' | 'cardiac' | 'respiratory' | 'trauma' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'pending' | 'dispatched' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  ambulance_id?: string;
  estimated_arrival?: string;
  dispatch_time?: string;
  arrival_time?: string;
  completion_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Ambulance {
  id: string;
  vehicle_number: string;
  driver_name: string;
  paramedic_name: string;
  current_lat?: number;
  current_lng?: number;
  status: 'available' | 'dispatched' | 'busy' | 'maintenance';
  equipment_level: 'basic' | 'advanced' | 'critical_care';
  contact_number: string;
  created_at: string;
  updated_at: string;
}

export interface DispatchLog {
  id: string;
  request_id: string;
  ambulance_id: string;
  dispatcher_id: string;
  dispatch_time: string;
  notes?: string;
}