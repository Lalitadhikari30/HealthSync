import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useNavigate } from "../../hooks/useNavigate";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  createdAt?: any;
}

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
  });
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [profilesSnap, doctorsSnap, patientsSnap, appointmentsSnap] =
        await Promise.all([
          getDocs(collection(db, "profiles")),
          getDocs(collection(db, "doctors")),
          getDocs(collection(db, "patients")),
          getDocs(collection(db, "appointments")),
        ]);

      const profilesData = profilesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Profile[];

      const doctorsData = doctorsSnap.docs.map((doc) => doc.data());
      const patientsData = patientsSnap.docs.map((doc) => doc.data());
      const appointmentsData = appointmentsSnap.docs.map(
        (doc) => doc.data() as any
      );

      const scheduled = appointmentsData.filter(
        (a) => a.status === "scheduled"
      ).length;
      const completed = appointmentsData.filter(
        (a) => a.status === "completed"
      ).length;

      setStats({
        totalUsers: profilesData.length,
        totalDoctors: doctorsData.length,
        totalPatients: patientsData.length,
        totalAppointments: appointmentsData.length,
        scheduledAppointments: scheduled,
        completedAppointments: completed,
      });

      setUsers(profilesData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
            System Overview
          </h2>
          <p className="text-gray-600">
            Monitor and manage the HealthSync platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Registered Doctors",
              value: stats.totalDoctors,
              icon: Stethoscope,
              color: "from-cyan-500 to-cyan-600",
            },
            {
              title: "Active Patients",
              value: stats.totalPatients,
              icon: Heart,
              color: "from-teal-500 to-teal-600",
            },
            {
              title: "Total Appointments",
              value: stats.totalAppointments,
              icon: Calendar,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Scheduled",
              value: stats.scheduledAppointments,
              icon: Calendar,
              color: "from-orange-500 to-orange-600",
            },
            {
              title: "Completed",
              value: stats.completedAppointments,
              icon: Calendar,
              color: "from-green-500 to-green-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <card.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-3xl font-bold mb-1">{card.value}</p>
              <p className="text-sm opacity-90">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {["overview", "users"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "overview" ? "Overview" : "User Management"}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Stats
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <StatCard
                    value={
                      stats.totalAppointments > 0
                        ? (
                            (stats.completedAppointments /
                              stats.totalAppointments) *
                            100
                          ).toFixed(1)
                        : "0"
                    }
                    suffix="%"
                    label="Completion Rate"
                    color="text-blue-600"
                  />
                  <StatCard
                    value={
                      stats.totalPatients > 0
                        ? (
                            stats.totalAppointments / stats.totalPatients
                          ).toFixed(1)
                        : "0"
                    }
                    label="Avg Appointments/Patient"
                    color="text-cyan-600"
                  />
                  <StatCard
                    value={
                      stats.totalDoctors > 0
                        ? (
                            stats.totalAppointments / stats.totalDoctors
                          ).toFixed(1)
                        : "0"
                    }
                    label="Avg Appointments/Doctor"
                    color="text-teal-600"
                  />
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  All Users
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {user.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-600"
                                  : user.role === "doctor"
                                  ? "bg-cyan-100 text-cyan-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                            {user.createdAt
                              ? new Date(
                                  user.createdAt.seconds * 1000
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- Subcomponent ---------- */
function StatCard({
  value,
  label,
  color,
  suffix,
}: {
  value: string;
  label: string;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>
        {value}
        {suffix && (
          <span className="text-base text-gray-500 ml-1">{suffix}</span>
        )}
      </p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
