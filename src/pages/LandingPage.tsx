import { Link } from 'react-router-dom';
import { Briefcase, Shield, Brain, TrendingUp, Users, Award } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SmartRecruit AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Recruitment
              <span className="block text-blue-600 mt-2">Meets Blockchain Security</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your hiring process with intelligent candidate matching, verified credentials,
              and career guidance powered by artificial intelligence and blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup?type=candidate"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started as Candidate
              </Link>
              <Link
                to="/signup?type=recruiter"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all text-lg font-semibold shadow-lg border-2 border-blue-600 hover:shadow-xl hover:-translate-y-0.5"
              >
                Post Jobs as Recruiter
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              Why Choose SmartRecruit AI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure, tamper-proof credential verification using blockchain technology. Every
                  certificate and resume is cryptographically verified to prevent fraud.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced AI algorithms analyze skills, experience, and job requirements to provide
                  intelligent candidate-job matching with accuracy scores.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Career Guidance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized skill gap analysis, course recommendations, and interview
                  preparation to accelerate your career growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">For Candidates</h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Award className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Verified Credentials</p>
                      <p className="text-blue-100">Upload and verify your resume and certificates on the blockchain</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">AI Job Recommendations</p>
                      <p className="text-blue-100">Get personalized job matches based on your skills and experience</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Skill Gap Analysis</p>
                      <p className="text-blue-100">Identify areas for improvement and get course recommendations</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">For Recruiters</h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Users className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Verified Talent Pool</p>
                      <p className="text-blue-100">Access candidates with blockchain-verified credentials</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">AI Candidate Matching</p>
                      <p className="text-blue-100">Get intelligent candidate suggestions with match scores</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Fraud Detection</p>
                      <p className="text-blue-100">Automated alerts for suspicious credentials and profiles</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of candidates and recruiters using SmartRecruit AI to make better hiring decisions.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">SmartRecruit AI</span>
            </div>
            <p className="text-sm">
              AI & Blockchain Powered Smart Recruitment and Career Guidance Platform
            </p>
            <p className="text-sm mt-2 text-gray-400">
              &copy; 2025 SmartRecruit AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
