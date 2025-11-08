import { useState, useEffect } from 'react';
import { Activity, Calendar, FileText, Heart, Shield, Users, ArrowRight, Stethoscope } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
          boxShadow: scrollY > 50 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              HealthSync
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-semibold animate-fade-in">
                🏥 Next Generation Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  Your Health,
                </span>
                <br />
                <span className="text-gray-800">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience seamless healthcare management with AI-powered diagnostics,
                instant appointment booking, and comprehensive medical records at your fingertips.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all font-semibold flex items-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold"
                >
                  Sign In
                </button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-gray-600">Patients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Doctors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Real-time Monitoring</div>
                      <div className="text-sm text-gray-600">Track your health 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
                    <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Easy Appointments</div>
                      <div className="text-sm text-gray-600">Book in seconds</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Secure & Private</div>
                      <div className="text-sm text-gray-600">Your data is protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Role</span>
            </h2>
            <p className="text-xl text-gray-600">Join thousands of users transforming healthcare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate('/signup?role=patient')}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="mt-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Patient</h3>
                <p className="text-gray-600">
                  Access your medical records, book appointments, and get AI-powered health insights
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    AI Diagnosis Assistant
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    24/7 Appointment Booking
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Digital Medical Records
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate('/signup?role=doctor')}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="mt-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Doctor</h3>
                <p className="text-gray-600">
                  Manage patients, appointments, and provide better care with smart tools
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                    Patient Management
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                    Appointment Scheduling
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                    Digital Prescriptions
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate('/signup?role=admin')}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="mt-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Admin</h3>
                <p className="text-gray-600">
                  Oversee operations, manage users, and access comprehensive analytics
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    User Management
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    System Analytics
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    Full Control Panel
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            <div className="text-center space-y-2">
              <Activity className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold">AI Diagnostics</h3>
              <p className="opacity-90">Advanced symptom analysis</p>
            </div>
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold">Smart Booking</h3>
              <p className="opacity-90">Find & book instantly</p>
            </div>
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold">Digital Records</h3>
              <p className="opacity-90">Secure cloud storage</p>
            </div>
            <div className="text-center space-y-2">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold">Privacy First</h3>
              <p className="opacity-90">Bank-level security</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">HealthSync</span>
            </div>
            <div className="text-gray-400">
              © 2025 HealthSync. Transforming Healthcare Together.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}