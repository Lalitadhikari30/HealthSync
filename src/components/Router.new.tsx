import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard';
import AIDiagnosis from '../pages/patient/AIDiagnosis';
import BookAppointment from '../pages/patient/BookAppointment';
import MedicalRecords from '../pages/patient/MedicalRecords';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import CompleteProfile from '../pages/doctor/CompleteProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    if (profile.role) {
      return <Navigate to={`/${profile.role}/dashboard`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const Router = () => {
  const { user, profile } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/';
    if (!profile?.role) return '/login';
    return `/${profile.role}/dashboard`;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={user && profile?.role ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user && profile?.role ? <Navigate to={getDefaultRoute()} replace /> : <Signup />}
        />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/ai-diagnosis"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AIDiagnosis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book-appointment"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/medical-records"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/complete-profile"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
