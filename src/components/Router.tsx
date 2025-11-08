import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import PatientDashboard from '../pages/patient/Dashboard';
import AIDiagnosis from '../pages/patient/AIDiagnosis';
import BookAppointment from '../pages/patient/BookAppointment';
import DoctorDashboard from '../pages/doctor/Dashboard';
import CompleteProfile from '../pages/doctor/CompleteProfile';
import AdminDashboard from '../pages/admin/Dashboard';

function ProtectedRoute({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) {
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
    // If user has a role but it's not allowed, redirect to their dashboard
    if (profile.role) {
      return <Navigate to={`/${profile.role}/dashboard`} replace />;
    }
    // If no role, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function Router() {
  const { user, profile } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/';
    if (!profile?.role) return '/login'; // If no profile/role, send back to login
    return `/${profile.role}/dashboard`;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user && profile?.role ? (
          <Navigate to={`/${profile.role}/dashboard`} replace />
        ) : (
          <Landing />
        )} />
        <Route path="/login" element={user && profile?.role ? (
          <Navigate to={getDefaultRoute()} replace />
        ) : (
          <Login />
        )} />
        <Route path="/signup" element={user && profile?.role ? (
          <Navigate to={getDefaultRoute()} replace />
        ) : (
          <Signup />
        )} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/ai-diagnosis" element={
          <ProtectedRoute allowedRoles={['patient']}><AIDiagnosis /></ProtectedRoute>
        } />
        <Route path="/patient/book-appointment" element={
          <ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>
        } />

        {/* Doctor routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor/complete-profile" element={
          <ProtectedRoute allowedRoles={['doctor']}><CompleteProfile /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />

        {/* Fallback route for undefined roles */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <Landing />;
}