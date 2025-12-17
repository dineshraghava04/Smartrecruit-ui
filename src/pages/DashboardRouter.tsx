import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CandidateDashboard } from './CandidateDashboard';
import { RecruiterDashboard } from './RecruiterDashboard';
import { AdminDashboard } from './AdminDashboard';

export const DashboardRouter = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  switch (profile.user_type) {
    case 'candidate':
      return <CandidateDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};
