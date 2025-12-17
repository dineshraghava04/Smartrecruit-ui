import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Upload, Shield, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

export const VerificationPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setTimeout(() => {
      alert('Resume uploaded successfully! Verification pending.');
      setUploading(false);
    }, 2000);
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <span>Document Verification</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Upload and verify your credentials using blockchain technology
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resume Upload</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">Upload your resume</p>
            <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (max 5MB)</p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-all"
            >
              Choose File
            </label>

            {resumeFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Selected: {resumeFile.name}</p>
                <button
                  onClick={handleResumeUpload}
                  disabled={uploading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Certificates</h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">AWS Certified Solutions Architect</p>
                    <p className="text-sm text-gray-600">Amazon Web Services • 2024</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Verified
                </span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Google Cloud Professional</p>
                    <p className="text-sm text-gray-600">Google Cloud • 2024</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all">
            + Add New Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
