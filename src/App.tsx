import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardRouter } from './pages/DashboardRouter';
import { VerificationPage } from './pages/VerificationPage';
import { JobsPage } from './pages/JobsPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verification"
            element={
              <ProtectedRoute requireUserType="candidate">
                <VerificationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute requireUserType="candidate">
                <JobsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute requireUserType="candidate">
                <InterviewPrepPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
