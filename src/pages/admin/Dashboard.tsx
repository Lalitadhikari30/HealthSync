import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Profile } from '../../lib/supabase';
import { Users, Stethoscope, Heart, Activity, LogOut, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
}

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
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
      const [profilesData, doctorsData, patientsData, appointmentsData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('doctors').select('id'),
        supabase.from('patients').select('id'),
        supabase.from('appointments').select('status'),
      ]);

      const scheduled = appointmentsData.data?.filter(a => a.status === 'scheduled').length || 0;
      const completed = appointmentsData.data?.filter(a => a.status === 'completed').length || 0;

      setStats({
        totalUsers: profilesData.data?.length || 0,
        totalDoctors: doctorsData.data?.length || 0,
        totalPatients: patientsData.data?.length || 0,
        totalAppointments: appointmentsData.data?.length || 0,
        scheduledAppointments: scheduled,
        completedAppointments: completed,
      });

      setUsers(profilesData.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-600 to-blue-500 p-2 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HealthSync</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">System Overview</h2>
          <p className="text-gray-600">Monitor and manage the HealthSync platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalUsers}</p>
            <p className="text-sm opacity-90">Total Users</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalDoctors}</p>
            <p className="text-sm opacity-90">Registered Doctors</p>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalPatients}</p>
            <p className="text-sm opacity-90">Active Patients</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalAppointments}</p>
            <p className="text-sm opacity-90">Total Appointments</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.scheduledAppointments}</p>
            <p className="text-sm opacity-90">Scheduled</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.completedAppointments}</p>
            <p className="text-sm opacity-90">Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                User Management
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Statistics</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">User Distribution</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Doctors</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-cyan-600 h-2 rounded-full"
                                style={{ width: `${(stats.totalDoctors / stats.totalUsers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-12 text-right">
                              {stats.totalDoctors}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Patients</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full"
                                style={{ width: `${(stats.totalPatients / stats.totalUsers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-12 text-right">
                              {stats.totalPatients}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Appointment Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Scheduled</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{
                                  width: `${(stats.scheduledAppointments / stats.totalAppointments) * 100 || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-12 text-right">
                              {stats.scheduledAppointments}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Completed</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${(stats.completedAppointments / stats.totalAppointments) * 100 || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-12 text-right">
                              {stats.completedAppointments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalAppointments > 0
                          ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-cyan-600">
                        {stats.totalPatients > 0 ? (stats.totalAppointments / stats.totalPatients).toFixed(1) : 0}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Avg Appointments/Patient</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-teal-600">
                        {stats.totalDoctors > 0 ? (stats.totalAppointments / stats.totalDoctors).toFixed(1) : 0}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Avg Appointments/Doctor</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Users</h3>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-800">{user.full_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-600'
                                  : user.role === 'doctor'
                                  ? 'bg-cyan-100 text-cyan-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
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
    </div>
  );
}