import { useEffect, useState } from 'react';
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

export default function Router() {
  const [path, setPath] = useState(window.location.pathname);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  if (!user) {
    if (path === '/login') return <Login />;
    if (path === '/signup') return <Signup />;
    return <Landing />;
  }

  if (profile?.role === 'patient') {
    if (path === '/patient/ai-diagnosis') return <AIDiagnosis />;
    if (path === '/patient/book-appointment') return <BookAppointment />;
    return <PatientDashboard />;
  }

  if (profile?.role === 'doctor') {
    if (path === '/doctor/complete-profile') return <CompleteProfile />;
    return <DoctorDashboard />;
  }

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <Landing />;
}