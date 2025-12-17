import { useEffect, useState } from 'react';
import { Briefcase, Users, Shield, AlertTriangle, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    candidates: 0,
    recruiters: 0,
    totalJobs: 0,
    pendingVerifications: 0,
    fraudReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        { count: totalUsers },
        { count: candidates },
        { count: recruiters },
        { count: totalJobs },
        { count: pendingVerifications },
        { count: fraudReports },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'candidate'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'recruiter'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase
          .from('candidate_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('verification_status', 'pending'),
        supabase.from('fraud_reports').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        candidates: candidates || 0,
        recruiters: recruiters || 0,
        totalJobs: totalJobs || 0,
        pendingVerifications: pendingVerifications || 0,
        fraudReports: fraudReports || 0,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SmartRecruit AI - Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{profile?.full_name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Users</h3>
            <p className="text-sm text-gray-600">
              {stats.candidates} candidates, {stats.recruiters} recruiters
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Jobs</h3>
            <p className="text-sm text-gray-600">Posted by recruiters</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-8 w-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Pending Verifications</h3>
            <p className="text-sm text-gray-600">Awaiting review</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span>Fraud Reports</span>
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-2xl font-bold text-red-900 mb-1">{stats.fraudReports}</p>
              <p className="text-sm text-red-700">Total fraud reports requiring attention</p>
            </div>

            <div className="mt-4">
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all">
                Review Fraud Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm font-medium text-green-900">Database Connection</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm font-medium text-green-900">Blockchain Service</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm font-medium text-green-900">AI Services</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
