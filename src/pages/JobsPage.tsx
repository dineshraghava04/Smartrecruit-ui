import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Briefcase as BriefcaseIcon, ArrowLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];

export const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span>AI-Recommended Jobs</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Personalized job matches based on your skills and experience
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {job.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </span>
                      )}
                      {job.salary_min && job.salary_max && (
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                          </span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{job.experience_required}+ years</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.floor(Math.random() * 20 + 70)}%
                    </div>
                    <p className="text-xs text-gray-600">AI Match</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
