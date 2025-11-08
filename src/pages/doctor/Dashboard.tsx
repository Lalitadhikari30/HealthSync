import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Appointment } from '../../lib/supabase';
import { Calendar, Users, FileText, LogOut, Clock, Check, X } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export default function DoctorDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState<(Appointment & { patients: { user_id: string; profiles: { full_name: string } } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      loadDoctorData();
    }
  }, [profile]);

  const loadDoctorData = async () => {
    try {
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (doctor) {
        setDoctorId(doctor.id);

        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*, patients!inner(user_id, profiles!inner(full_name))')
          .eq('doctor_id', doctor.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (appointmentsData) {
          setAppointments(appointmentsData as (Appointment & { patients: { user_id: string; profiles: { full_name: string } } })[]);
        }
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (!error) {
      loadDoctorData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const todayAppointments = appointments.filter(
    a => a.appointment_date === new Date().toISOString().split('T')[0] && a.status === 'scheduled'
  );
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-600 to-teal-500 p-2 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HealthSync</h1>
                <p className="text-sm text-gray-600">Doctor Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                <p className="text-sm text-gray-600">Doctor</p>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Dr. {profile?.full_name?.split(' ').pop()}!</h2>
          <p className="text-gray-600">Manage your appointments and patients</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{todayAppointments.length}</p>
                <p className="text-sm opacity-90">Today's Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-sm opacity-90">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{completedAppointments.length}</p>
                <p className="text-sm opacity-90">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{new Set(appointments.map(a => a.patient_id)).size}</p>
                <p className="text-sm opacity-90">Total Patients</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'appointments'
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                All Appointments
              </button>
              <button
                onClick={() => setActiveTab('today')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'today'
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Today's Schedule
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'appointments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Appointments</h3>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">{appointment.patients.profiles.full_name}</p>
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
                              appointment.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-600'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600 mb-3">Reason: {appointment.reason}</p>
                        )}
                        {appointment.status === 'scheduled' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Mark Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
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
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'today' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border-2 border-cyan-200 rounded-lg p-4 bg-cyan-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">{appointment.patients.profiles.full_name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Clock className="w-4 h-4" />
                              {appointment.appointment_time}
                            </div>
                          </div>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600 mb-3">Reason: {appointment.reason}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Complete
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}