import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Shield,
  LogOut,
  User,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];
type JobWithApplications = Job & { application_count: number };

export const RecruiterDashboard = () => {
  const { profile, signOut } = useAuth();
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', profile!.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        const jobsWithCounts = await Promise.all(
          jobsData.map(async (job) => {
            const { count } = await supabase
              .from('job_applications')
              .select('*', { count: 'exact', head: true })
              .eq('job_id', job.id);

            return { ...job, application_count: count || 0 };
          })
        );

        setJobs(jobsWithCounts);

        const totalApplications = jobsWithCounts.reduce(
          (sum, job) => sum + job.application_count,
          0
        );

        setStats({
          totalJobs: jobsData.length,
          activeJobs: jobsData.filter((j) => j.status === 'active').length,
          totalApplications,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SmartRecruit AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name}!
          </h1>
          <p className="mt-1 text-gray-600">
            {profile?.company_name} - Recruiter Dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Jobs</h3>
            <p className="text-sm text-gray-600">{stats.activeJobs} active positions</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalApplications}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Applications</h3>
            <p className="text-sm text-gray-600">Candidates interested</p>
          </div>

          <Link
            to="/candidates"
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Search className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Search Candidates</h3>
            <p className="text-sm text-blue-100">Find verified talent</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Job Postings</h2>
            <Link
              to="/post-job"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Post New Job</span>
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        {job.salary_min && job.salary_max && (
                          <span className="text-sm text-gray-700">
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm text-gray-700">
                          {job.experience_required}+ years exp
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{job.application_count} applications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/job/${job.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/job/${job.id}/applicants`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Applicants
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No job postings yet</p>
              <Link
                to="/post-job"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span>Post Your First Job</span>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>AI-Powered Features</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Candidate Matching</h3>
              <p className="text-sm text-gray-600">
                Get AI-powered candidate recommendations with match scores for each job posting
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Credential Verification</h3>
              <p className="text-sm text-gray-600">
                All candidates have blockchain-verified credentials with fraud detection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
