import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Upload,
  Shield,
  TrendingUp,
  BookOpen,
  MessageSquare,
  LogOut,
  User,
  FileText,
  Award,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type CandidateProfile = Database['public']['Tables']['candidate_profiles']['Row'];
type Certificate = Database['public']['Tables']['certificates']['Row'];
type JobApplication = Database['public']['Tables']['job_applications']['Row'] & {
  jobs: Database['public']['Tables']['jobs']['Row'];
};
type LearningRecommendation = Database['public']['Tables']['learning_recommendations']['Row'];

export const CandidateDashboard = () => {
  const { profile, signOut } = useAuth();
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      const { data: cpData } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', profile!.id)
        .maybeSingle();

      if (cpData) {
        setCandidateProfile(cpData);

        const { data: certsData } = await supabase
          .from('certificates')
          .select('*')
          .eq('candidate_id', cpData.id)
          .order('created_at', { ascending: false });

        const { data: appsData } = await supabase
          .from('job_applications')
          .select('*, jobs(*)')
          .eq('candidate_id', cpData.id)
          .order('applied_at', { ascending: false })
          .limit(5);

        const { data: recData } = await supabase
          .from('learning_recommendations')
          .select('*')
          .eq('candidate_id', cpData.id)
          .order('priority', { ascending: true })
          .limit(5);

        setCertificates(certsData || []);
        setApplications(appsData || []);
        setRecommendations(recData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'fraudulent':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'fraudulent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Fraudulent
          </span>
        );
      default:
        return null;
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
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="mt-1 text-gray-600">
            Your personalized career dashboard powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/verification"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              {candidateProfile && getVerificationIcon(candidateProfile.verification_status)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Verification</h3>
            <p className="text-sm text-gray-600">
              {candidateProfile?.verification_status === 'verified'
                ? 'Profile verified'
                : 'Upload documents'}
            </p>
          </Link>

          <Link
            to="/jobs"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{applications.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Job Matches</h3>
            <p className="text-sm text-gray-600">Find your perfect role</p>
          </Link>

          <Link
            to="/interview-prep"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <MessageSquare className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Interview Prep</h3>
            <p className="text-sm text-gray-600">Practice with AI</p>
          </Link>

          <Link
            to="/learning"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{recommendations.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Learning Path</h3>
            <p className="text-sm text-gray-600">Skill recommendations</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Profile Status</span>
              </h2>
              {candidateProfile && getVerificationBadge(candidateProfile.verification_status)}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="text-gray-900 font-medium">
                    {candidateProfile?.resume_url ? '75%' : '25%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: candidateProfile?.resume_url ? '75%' : '25%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Resume Uploaded</span>
                  {candidateProfile?.resume_url ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Skills Added</span>
                  {candidateProfile?.skills && candidateProfile.skills.length > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Certificates Verified</span>
                  {certificates.some((c) => c.verification_status === 'verified') ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {!candidateProfile?.resume_url && (
                <Link
                  to="/verification"
                  className="block w-full mt-4 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload Resume
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Skill Gap Analysis</span>
            </h2>

            {candidateProfile?.skill_gap_analysis &&
            Object.keys(candidateProfile.skill_gap_analysis).length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Based on your profile and target roles, here are the skills to focus on:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Cloud Computing</p>
                    <p className="text-xs text-yellow-700 mt-1">High demand in your target roles</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Data Analysis</p>
                    <p className="text-xs text-yellow-700 mt-1">Enhance your competitiveness</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Complete your profile to get personalized skill recommendations
                </p>
                <Link
                  to="/verification"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>Learning Recommendations</span>
            </h2>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">{rec.course_name}</p>
                        {rec.platform && (
                          <p className="text-xs text-blue-700 mt-1">{rec.platform}</p>
                        )}
                        {rec.skill_target && (
                          <p className="text-xs text-blue-600 mt-1">Target: {rec.skill_target}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No recommendations yet</p>
                <p className="text-sm text-gray-500 mt-1">Complete your profile to get started</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="h-6 w-6 text-blue-600" />
              <span>Recent Applications</span>
            </h2>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-900">{app.jobs.title}</p>
                      <span className="text-xs text-blue-600 font-medium">
                        {app.ai_match_score}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{app.jobs.location}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        app.status === 'hired'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : app.status === 'shortlisted'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No applications yet</p>
                <Link
                  to="/jobs"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
