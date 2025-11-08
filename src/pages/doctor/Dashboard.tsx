
// import { useState, useEffect } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { db } from "../../lib/firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   Calendar,
//   Users,
//   FileText,
//   LogOut,
//   Clock,
//   Check,
//   X,
// } from "lucide-react";
// import { useNavigate } from "../../hooks/useNavigate";
// import DashboardLayout from "../../components/layout/DashboardLayout";

// interface Appointment {
//   id: string;
//   patient_name: string;
//   appointment_date: string;
//   appointment_time: string;
//   reason?: string;
//   status: "scheduled" | "completed" | "cancelled";
//   patient_id: string;
// }

// export default function DoctorDashboard() {
//   const { user, profile, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("appointments");
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [doctorId, setDoctorId] = useState<string | null>(null);

//   useEffect(() => {
//     if (user) loadDoctorData();
//   }, [user]);

//   const loadDoctorData = async () => {
//     try {
//       // 1️⃣ Fetch the doctor document by Firebase UID
//       const doctorsRef = collection(db, "doctors");
//       const q = query(doctorsRef, where("user_id", "==", user?.uid));
//       const doctorSnap = await getDocs(q);

//       if (!doctorSnap.empty) {
//         const doctorDoc = doctorSnap.docs[0];
//         setDoctorId(doctorDoc.id);

//         // 2️⃣ Fetch appointments for this doctor
//         const appointmentsRef = collection(db, "appointments");
//         const appointmentsQuery = query(
//           appointmentsRef,
//           where("doctor_id", "==", doctorDoc.id)
//         );
//         const appointmentsSnap = await getDocs(appointmentsQuery);

//         const appointmentsData = appointmentsSnap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Appointment[];

//         setAppointments(appointmentsData);
//       }
//     } catch (error) {
//       console.error("Error loading doctor data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAppointmentStatus = async (
//     appointmentId: string,
//     status: "completed" | "cancelled"
//   ) => {
//     try {
//       const appointmentRef = doc(db, "appointments", appointmentId);
//       await updateDoc(appointmentRef, { status });
//       loadDoctorData(); // refresh UI
//     } catch (err) {
//       console.error("Error updating appointment:", err);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate("/");
//   };

//   const today = new Date().toISOString().split("T")[0];
//   const todayAppointments = appointments.filter(
//     (a) => a.appointment_date === today && a.status === "scheduled"
//   );
//   const upcomingAppointments = appointments.filter(
//     (a) => a.status === "scheduled"
//   );
//   const completedAppointments = appointments.filter(
//     (a) => a.status === "completed"
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div>
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">
//             Welcome, Dr. {profile?.full_name?.split(" ").pop()}!
//           </h2>
//           <p className="text-gray-600">Manage your appointments and patients</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <DashboardCard
//             color="from-blue-500 to-blue-600"
//             icon={Calendar}
//             value={todayAppointments.length}
//             label="Today's Appointments"
//           />
//           <DashboardCard
//             color="from-cyan-500 to-cyan-600"
//             icon={Clock}
//             value={upcomingAppointments.length}
//             label="Upcoming"
//           />
//           <DashboardCard
//             color="from-teal-500 to-teal-600"
//             icon={Check}
//             value={completedAppointments.length}
//             label="Completed"
//           />
//           <DashboardCard
//             color="from-purple-500 to-purple-600"
//             icon={Users}
//             value={new Set(appointments.map((a) => a.patient_id)).size}
//             label="Total Patients"
//           />
//         </div>

//         {/* Tabs Section */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="border-b border-gray-200">
//             <div className="flex gap-8 px-6">
//               <TabButton
//                 label="All Appointments"
//                 active={activeTab === "appointments"}
//                 onClick={() => setActiveTab("appointments")}
//               />
//               <TabButton
//                 label="Today's Schedule"
//                 active={activeTab === "today"}
//                 onClick={() => setActiveTab("today")}
//               />
//             </div>
//           </div>

//           {/* Appointments List */}
//           <div className="p-6">
//             {activeTab === "appointments" && (
//               <AppointmentsList
//                 appointments={appointments}
//                 onStatusChange={updateAppointmentStatus}
//               />
//             )}
//             {activeTab === "today" && (
//               <AppointmentsList
//                 appointments={todayAppointments}
//                 onStatusChange={updateAppointmentStatus}
//                 highlight
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// /* ---------------- Subcomponents ---------------- */

// function DashboardCard({ color, icon: Icon, value, label }: any) {
//   return (
//     <div
//       className={`bg-gradient-to-br ${color} rounded-xl shadow-sm p-6 text-white`}
//     >
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
//           <Icon className="w-6 h-6" />
//         </div>
//         <div>
//           <p className="text-3xl font-bold">{value}</p>
//           <p className="text-sm opacity-90">{label}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function TabButton({
//   label,
//   active,
//   onClick,
// }: {
//   label: string;
//   active: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`py-4 border-b-2 font-medium transition-colors ${
//         active
//           ? "border-cyan-600 text-cyan-600"
//           : "border-transparent text-gray-600 hover:text-gray-800"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// function AppointmentsList({
//   appointments,
//   onStatusChange,
//   highlight = false,
// }: {
//   appointments: Appointment[];
//   onStatusChange: (id: string, status: "completed" | "cancelled") => void;
//   highlight?: boolean;
// }) {
//   if (appointments.length === 0) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
//         <p>No appointments found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {appointments.map((appointment) => (
//         <div
//           key={appointment.id}
//           className={`border ${
//             highlight ? "border-cyan-200 bg-cyan-50" : "border-gray-200"
//           } rounded-lg p-4 hover:border-cyan-300 transition-colors`}
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <p className="font-semibold text-gray-800">
//                 {appointment.patient_name}
//               </p>
//               <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
//                 <span className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   {new Date(appointment.appointment_date).toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Clock className="w-4 h-4" />
//                   {appointment.appointment_time}
//                 </span>
//               </div>
//             </div>
//             <span
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 appointment.status === "scheduled"
//                   ? "bg-blue-100 text-blue-600"
//                   : appointment.status === "completed"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-red-100 text-red-600"
//               }`}
//             >
//               {appointment.status.charAt(0).toUpperCase() +
//                 appointment.status.slice(1)}
//             </span>
//           </div>

//           {appointment.reason && (
//             <p className="text-sm text-gray-600 mb-3">
//               Reason: {appointment.reason}
//             </p>
//           )}

//           {appointment.status === "scheduled" && (
//             <div className="flex gap-2">
//               <button
//                 onClick={() => onStatusChange(appointment.id, "completed")}
//                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
//               >
//                 <Check className="w-4 h-4" />
//                 Complete
//               </button>
//               <button
//                 onClick={() => onStatusChange(appointment.id, "cancelled")}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
//               >
//                 <X className="w-4 h-4" />
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "../../hooks/useNavigate";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: "scheduled" | "completed" | "cancelled";
  patient_id: string;
}

export default function DoctorDashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadDoctorData();
  }, [user]);

  const loadDoctorData = async () => {
    try {
      // 1️⃣ Fetch the doctor document by Firebase UID
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where("user_id", "==", user?.uid));
      const doctorSnap = await getDocs(q);

      if (!doctorSnap.empty) {
        const doctorDoc = doctorSnap.docs[0];
        setDoctorId(doctorDoc.id);

        // 2️⃣ Fetch appointments for this doctor
        const appointmentsRef = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsRef,
          where("doctor_id", "==", doctorDoc.id)
        );
        const appointmentsSnap = await getDocs(appointmentsQuery);

        const appointmentsData = appointmentsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];

        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "completed" | "cancelled"
  ) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status });
      loadDoctorData(); // refresh UI
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === today && a.status === "scheduled"
  );
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, Dr. {profile?.full_name?.split(" ").pop()}!
          </h2>
          <p className="text-gray-600">Manage your appointments and patients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            color="from-blue-500 to-blue-600"
            icon={Calendar}
            value={todayAppointments.length}
            label="Today's Appointments"
          />
          <DashboardCard
            color="from-cyan-500 to-cyan-600"
            icon={Clock}
            value={upcomingAppointments.length}
            label="Upcoming"
          />
          <DashboardCard
            color="from-teal-500 to-teal-600"
            icon={Check}
            value={completedAppointments.length}
            label="Completed"
          />
          <DashboardCard
            color="from-purple-500 to-purple-600"
            icon={Users}
            value={new Set(appointments.map((a) => a.patient_id)).size}
            label="Total Patients"
          />
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <TabButton
                label="All Appointments"
                active={activeTab === "appointments"}
                onClick={() => setActiveTab("appointments")}
              />
              <TabButton
                label="Today's Schedule"
                active={activeTab === "today"}
                onClick={() => setActiveTab("today")}
              />
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-6">
            {activeTab === "appointments" && (
              <AppointmentsList
                appointments={appointments}
                onStatusChange={updateAppointmentStatus}
              />
            )}
            {activeTab === "today" && (
              <AppointmentsList
                appointments={todayAppointments}
                onStatusChange={updateAppointmentStatus}
                highlight
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------------- Subcomponents ---------------- */

function DashboardCard({ color, icon: Icon, value, label }: any) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl shadow-sm p-6 text-white`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 font-medium transition-colors ${
        active
          ? "border-cyan-600 text-cyan-600"
          : "border-transparent text-gray-600 hover:text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

function AppointmentsList({
  appointments,
  onStatusChange,
  highlight = false,
}: {
  appointments: Appointment[];
  onStatusChange: (id: string, status: "completed" | "cancelled") => void;
  highlight?: boolean;
}) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No appointments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={`border ${
            highlight ? "border-cyan-200 bg-cyan-50" : "border-gray-200"
          } rounded-lg p-4 hover:border-cyan-300 transition-colors`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-800">
                {appointment.patient_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {appointment.appointment_time}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                appointment.status === "scheduled"
                  ? "bg-blue-100 text-blue-600"
                  : appointment.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
          </div>

          {appointment.reason && (
            <p className="text-sm text-gray-600 mb-3">
              Reason: {appointment.reason}
            </p>
          )}

          {appointment.status === "scheduled" && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusChange(appointment.id, "completed")}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Complete
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, "cancelled")}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
