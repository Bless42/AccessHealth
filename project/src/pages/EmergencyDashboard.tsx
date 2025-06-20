import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import EmergencyDashboard from '../components/emergency/EmergencyDashboard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const EmergencyDashboardPage: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'doctor') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <EmergencyDashboard />
    </MainLayout>
  );
};

export default EmergencyDashboardPage;