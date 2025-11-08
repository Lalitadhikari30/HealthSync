// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Landing from '../pages/Landing';
// import Login from '../pages/Login';
// import Signup from '../pages/Signup';
// import PatientDashboard from '../pages/patient/Dashboard';
// import AIDiagnosis from '../pages/patient/AIDiagnosis';
// import BookAppointment from '../pages/patient/BookAppointment';
// import DoctorDashboard from '../pages/doctor/Dashboard';
// import CompleteProfile from '../pages/doctor/CompleteProfile';
// import AdminDashboard from '../pages/admin/Dashboard';

// function ProtectedRoute({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) {
//   const { user, profile, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !profile) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
//     if (profile.role) return <Navigate to={`/${profile.role}/dashboard`} replace />;
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

// export default function Router() {
//   const { user, profile } = useAuth();

//   const getDefaultRoute = () => {
//     if (!user) return '/';
//     if (!profile?.role) return '/login';
//     return `/${profile.role}/dashboard`;
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Landing />} />
//         <Route
//           path="/login"
//           element={user && profile?.role ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
//         />
//         <Route
//           path="/signup"
//           element={user && profile?.role ? <Navigate to={getDefaultRoute()} replace /> : <Signup />}
//         />

//         {/* Patient routes */}
//         <Route
//           path="/patient/dashboard"
//           element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>}
//         />
//         <Route
//           path="/patient/ai-diagnosis"
//           element={<ProtectedRoute allowedRoles={['patient']}><AIDiagnosis /></ProtectedRoute>}
//         />
//         <Route
//           path="/patient/book-appointment"
//           element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>}
//         />

//         {/* Doctor routes */}
//         <Route
//           path="/doctor/dashboard"
//           element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>}
//         />
//         <Route
//           path="/doctor/complete-profile"
//           element={<ProtectedRoute allowedRoles={['doctor']}><CompleteProfile /></ProtectedRoute>}
//         />

//         {/* Admin routes */}
//         <Route
//           path="/admin/dashboard"
//           element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 🔹 Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// 🔹 Patient Pages
import PatientDashboard from '../pages/patient/Dashboard';
import AIDiagnosis from '../pages/patient/AIDiagnosis';
import BookAppointment from '../pages/patient/BookAppointment';

// 🔹 Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import CompleteProfile from '../pages/doctor/CompleteProfile';

// 🔹 Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

/* ------------------------------------------------------------
   ProtectedRoute — guards access based on authentication + role
------------------------------------------------------------ */
function ProtectedRoute({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, profile, loading } = useAuth();

  // 🕒 Wait for Firebase Auth + Firestore profile to load
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // 🚫 If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 If user logged in but no profile (shouldn’t happen normally)
  if (!profile) {
    console.warn("⚠️ No profile found, redirecting to signup...");
    return <Navigate to="/signup" replace />;
  }

  // 🚫 If role is not allowed → redirect to their dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    console.warn(`Access denied for role: ${profile.role}`);
    return <Navigate to={`/${profile.role}/dashboard`} replace />;
  }

  // ✅ All good → render the protected content
  return <>{children}</>;
}

/* ------------------------------------------------------------
   Router — Main Application Routing
------------------------------------------------------------ */
export default function Router() {
  const { user, profile } = useAuth();

  // 🔹 Helper to decide where to send authenticated users
  const getDefaultRoute = () => {
    if (!user) return '/';
    if (!profile?.role) return '/login';
    return `/${profile.role}/dashboard`;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            user && profile?.role ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user && profile?.role ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* ---------- PATIENT ROUTES ---------- */}
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

        {/* ---------- DOCTOR ROUTES ---------- */}
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

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
