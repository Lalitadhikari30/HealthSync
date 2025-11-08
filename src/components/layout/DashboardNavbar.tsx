import { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Settings,
  MessageSquare,
  Activity
} from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "../../hooks/useNavigate";


export default function DashboardNavbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/patient/book-appointment' },
    { icon: Stethoscope, label: 'AI Diagnosis', path: '/patient/ai-diagnosis' },
    { icon: FileText, label: 'Records', path: '/patient/dashboard' },
  ];

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      {(isMobileMenuOpen || showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={handleClickOutside}
        />
      )}

      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/patient/dashboard')}>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">HealthSync</h1>
                <p className="text-xs text-gray-500">Patient Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">2 new</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Appointment Reminder</p>
                            <p className="text-xs text-gray-600 mt-1">Your appointment is tomorrow at 10:00 AM</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-green-500">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Activity className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New Test Results</p>
                            <p className="text-xs text-gray-600 mt-1">Your lab results are now available</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Record Updated</p>
                            <p className="text-xs text-gray-600 mt-1">Your medical record has been updated</p>
                            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-1 hover:bg-blue-50 rounded transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'P'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {profile?.full_name?.split(' ')[0] || 'Patient'}
                    </p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-semibold text-lg">
                            {profile?.full_name?.charAt(0).toUpperCase() || 'P'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{profile?.full_name}</p>
                          <p className="text-xs text-gray-600">{profile?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/patient/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/patient/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/patient/messages');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">Messages</span>
                      </button>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-slideDown">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'P'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-600">{profile?.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate('/patient/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">My Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate('/patient/settings');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button
                onClick={() => {
                  navigate('/patient/messages');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Messages</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}