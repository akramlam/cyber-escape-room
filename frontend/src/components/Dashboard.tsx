import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ITDashboard from './dashboards/ITDashboard';
import NonITDashboard from './dashboards/NonITDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return user?.role === 'IT' ? <ITDashboard /> : <NonITDashboard />;
};

export default Dashboard;