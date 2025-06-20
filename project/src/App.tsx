import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import EmergencyDashboard from './pages/EmergencyDashboard';
import PharmacyLocator from './pages/PharmacyLocator';
import PrescriptionManager from './pages/PrescriptionManager';
import ConsultationChat from './pages/ConsultationChat';
import Consultations from './pages/Consultations';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import MedicalRecords from './pages/MedicalRecords';
import AmbulanceServices from './pages/AmbulanceServices';
import HealthEducationPage from './pages/HealthEducation';
import PreventiveCarePage from './pages/PreventiveCare';
import TherapyServices from './pages/TherapyServices';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AuditLog from './pages/admin/AuditLog';

// Components
import EmergencyButton from './components/emergency/EmergencyButton';

// Role-based route component
const RoleRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { profile, loading } = useAuth();
  
  if (loading) return null;
  
  return profile && allowedRoles.includes(profile.role)
    ? element
    : <Navigate to="/dashboard" replace />;
};

function App() {
  const { profile } = useAuth();

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        {profile?.role === 'patient' && <EmergencyButton />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/pharmacies" element={<PharmacyLocator />} />
            <Route path="/prescriptions" element={<PrescriptionManager />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/consultation/:consultationId" element={<ConsultationChat />} />
            <Route path="/ambulance" element={<AmbulanceServices />} />
            <Route path="/health-education" element={<HealthEducationPage />} />
            <Route path="/preventive-care" element={<PreventiveCarePage />} />
            <Route path="/therapy" element={<TherapyServices />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <RoleRoute 
                  element={<AdminDashboard />} 
                  allowedRoles={['admin']} 
                />
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <RoleRoute 
                  element={<UserManagement />} 
                  allowedRoles={['admin']} 
                />
              } 
            />
            <Route 
              path="/admin/audit" 
              element={
                <RoleRoute 
                  element={<AuditLog />} 
                  allowedRoles={['admin']} 
                />
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path="/doctor/*" 
              element={
                <RoleRoute 
                  element={<EmergencyDashboard />} 
                  allowedRoles={['doctor']} 
                />
              } 
            />

            {/* Emergency Dashboard */}
            <Route
              path="/emergencies"
              element={
                <RoleRoute
                  element={<EmergencyDashboard />}
                  allowedRoles={['doctor']}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App