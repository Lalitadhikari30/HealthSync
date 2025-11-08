import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Appointment, MedicalRecord, Diagnosis } from '../../lib/supabase';
import { Calendar, FileText, Activity, Heart, LogOut, Upload, Stethoscope, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export default function PatientDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      loadPatientData();
    }
  }, [profile]);

  const loadPatientData = async () => {
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (patient) {
        setPatientId(patient.id);

        const [appointmentsData, recordsData, diagnosesData] = await Promise.all([
          supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patient.id)
            .order('appointment_date', { ascending: false })
            .limit(5),
          supabase
            .from('medical_records')
            .select('*')
            .eq('patient_id', patient.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('diagnoses')
            .select('*')
            .eq('patient_id', patient.id)
            .order('created_at', { ascending: false })
            .limit(3),
        ]);

        setAppointments(appointmentsData.data || []);
        setMedicalRecords(recordsData.data || []);
        setDiagnoses(diagnosesData.data || []);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HealthSync</h1>
                <p className="text-sm text-gray-600">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                <p className="text-sm text-gray-600">{profile?.email}</p>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {profile?.full_name?.split(' ')[0]}!</h2>
          <p className="text-gray-600">Here's your health overview</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
                <p className="text-sm text-gray-600">Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{medicalRecords.length}</p>
                <p className="text-sm text-gray-600">Records</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{diagnoses.length}</p>
                <p className="text-sm text-gray-600">Diagnoses</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/patient/ai-diagnosis')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Stethoscope className="w-8 h-8 mb-2" />
            <p className="font-semibold">AI Diagnosis</p>
            <p className="text-sm opacity-90">Check symptoms</p>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'appointments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'records'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Medical Records
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
                  {appointments.filter(a => a.status === 'scheduled').length > 0 ? (
                    <div className="space-y-3">
                      {appointments
                        .filter(a => a.status === 'scheduled')
                        .slice(0, 3)
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{appointment.reason || 'Consultation'}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              Scheduled
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No upcoming appointments</p>
                      <button
                        onClick={() => navigate('/patient/book-appointment')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Appointment
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Diagnoses</h3>
                  {diagnoses.length > 0 ? (
                    <div className="space-y-3">
                      {diagnoses.slice(0, 2).map((diagnosis) => (
                        <div
                          key={diagnosis.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Activity className="w-5 h-5 text-teal-600" />
                              <span className="font-semibold text-gray-800">
                                {new Date(diagnosis.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-7">
                            <p className="text-sm text-gray-600 mb-2">
                              Symptoms: {diagnosis.symptoms.join(', ')}
                            </p>
                            {diagnosis.ai_prediction && (
                              <div className="text-sm">
                                <p className="font-medium text-gray-700">AI Prediction:</p>
                                {(diagnosis.ai_prediction as { disease: string; confidence: number }[]).slice(0, 2).map((pred, idx) => (
                                  <p key={idx} className="text-gray-600">
                                    • {pred.disease} ({(pred.confidence * 100).toFixed(1)}%)
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No diagnoses yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Appointments</h3>
                  <button
                    onClick={() => navigate('/patient/book-appointment')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book New
                  </button>
                </div>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{appointment.reason || 'Consultation'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              <span>{appointment.appointment_time}</span>
                            </div>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'records' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Medical Records</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
                {medicalRecords.length > 0 ? (
                  <div className="space-y-3">
                    {medicalRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{record.title}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{record.record_type}</span>
                              <span>{new Date(record.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No medical records found</p>
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