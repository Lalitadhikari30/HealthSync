// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { supabase, Doctor } from '../../lib/supabase';
// import { ArrowLeft, Calendar, Clock, Search, Check } from 'lucide-react';
// import { useNavigate } from '../../hooks/useNavigate';

// export default function BookAppointment() {
//   const { profile } = useAuth();
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState<(Doctor & { profiles: { full_name: string } })[]>([]);
//   const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [reason, setReason] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [patientId, setPatientId] = useState<string | null>(null);

//   const timeSlots = [
//     '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
//     '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
//   ];

//   useEffect(() => {
//     loadDoctors();
//     loadPatientId();
//   }, []);

//   const loadPatientId = async () => {
//     const { data } = await supabase
//       .from('patients')
//       .select('id')
//       .eq('user_id', profile?.id)
//       .maybeSingle();
//     if (data) setPatientId(data.id);
//   };

//   const loadDoctors = async () => {
//     const { data } = await supabase
//       .from('doctors')
//       .select('*, profiles(full_name)')
//       .eq('status', 'active');

//     if (data) {
//       setDoctors(data as (Doctor & { profiles: { full_name: string } })[]);
//     }
//   };

//   const handleBooking = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!patientId || !selectedDoctor || !selectedDate || !selectedTime) return;

//     setLoading(true);
//     try {
//       const { error } = await supabase.from('appointments').insert({
//         patient_id: patientId,
//         doctor_id: selectedDoctor,
//         appointment_date: selectedDate,
//         appointment_time: selectedTime,
//         reason,
//         status: 'scheduled',
//       });

//       if (error) throw error;

//       setSuccess(true);
//       setTimeout(() => navigate('/patient/dashboard'), 2000);
//     } catch (error) {
//       console.error('Error booking appointment:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDoctors = doctors.filter(doctor =>
//     doctor.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const minDate = new Date().toISOString().split('T')[0];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/patient/dashboard')}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <div>
//               <h1 className="text-xl font-bold text-gray-800">Book Appointment</h1>
//               <p className="text-sm text-gray-600">Schedule a consultation with a doctor</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto">
//           {success ? (
//             <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Check className="w-8 h-8 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
//               <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
//             </div>
//           ) : (
//             <form onSubmit={handleBooking} className="space-y-6">
//               <div className="bg-white rounded-xl shadow-sm p-8">
//                 <h2 className="text-xl font-bold text-gray-800 mb-6">Select a Doctor</h2>
//                 <div className="mb-6">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search by name or specialization..."
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {filteredDoctors.map((doctor) => (
//                     <button
//                       key={doctor.id}
//                       type="button"
//                       onClick={() => setSelectedDoctor(doctor.id)}
//                       className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
//                         selectedDoctor === doctor.id
//                           ? 'border-blue-600 bg-blue-50'
//                           : 'border-gray-300 hover:border-blue-300'
//                       }`}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <p className="font-semibold text-gray-800">{doctor.profiles.full_name}</p>
//                           <p className="text-sm text-gray-600">{doctor.specialization}</p>
//                           <p className="text-sm text-gray-500 mt-1">{doctor.experience_years} years experience</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-blue-600">${doctor.consultation_fee}</p>
//                           <p className="text-xs text-gray-500">consultation</p>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {selectedDoctor && (
//                 <>
//                   <div className="bg-white rounded-xl shadow-sm p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Select Date & Time</h2>
//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <Calendar className="inline w-4 h-4 mr-1" />
//                           Appointment Date
//                         </label>
//                         <input
//                           type="date"
//                           value={selectedDate}
//                           onChange={(e) => setSelectedDate(e.target.value)}
//                           min={minDate}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <Clock className="inline w-4 h-4 mr-1" />
//                           Time Slot
//                         </label>
//                         <select
//                           value={selectedTime}
//                           onChange={(e) => setSelectedTime(e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                           required
//                         >
//                           <option value="">Select time</option>
//                           {timeSlots.map((time) => (
//                             <option key={time} value={time}>{time}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-xl shadow-sm p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Reason for Visit</h2>
//                     <textarea
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                       placeholder="Describe your symptoms or reason for consultation..."
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                       rows={4}
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading || !selectedDate || !selectedTime}
//                     className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {loading ? 'Booking...' : 'Confirm Appointment'}
//                   </button>
//                 </>
//               )}
//             </form>
//           )}
//         </div>
//       </div>
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
  addDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Search,
  Check,
} from "lucide-react";
import { useNavigate } from "../../hooks/useNavigate";

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  useEffect(() => {
    if (user) {
      loadDoctors();
      loadPatientId();
    }
  }, [user]);

  // 🔹 Load logged-in patient's Firestore ID
  const loadPatientId = async () => {
    try {
      const patientsRef = collection(db, "patients");
      const q = query(patientsRef, where("user_id", "==", user?.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setPatientId(snap.docs[0].id);
      }
    } catch (err) {
      console.error("Error fetching patient ID:", err);
    }
  };

  // 🔹 Load all active doctors from Firestore
  const loadDoctors = async () => {
    try {
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where("status", "==", "active"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(data);
    } catch (err) {
      console.error("Error loading doctors:", err);
    }
  };

  // 🔹 Handle appointment creation
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !selectedDoctor || !selectedDate || !selectedTime)
      return;

    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason,
        status: "scheduled",
        createdAt: new Date(),
      });

      setSuccess(true);
      setTimeout(() => navigate("/patient/dashboard"), 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter doctors based on search
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/patient/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Book Appointment
              </h1>
              <p className="text-sm text-gray-600">
                Schedule a consultation with a doctor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {success ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Appointment Booked!
              </h2>
              <p className="text-gray-600">
                Your appointment has been successfully scheduled.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-6">
              {/* Doctor Selection */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Select a Doctor
                </h2>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or specialization..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDoctor === doctor.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {doctor.full_name || "Dr. Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {doctor.specialization}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {doctor.experience_years || 0} years experience
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">
                            ${doctor.consultation_fee || 0}
                          </p>
                          <p className="text-xs text-gray-500">consultation</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              {selectedDoctor && (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Select Date & Time
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={minDate}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="inline w-4 h-4 mr-1" />
                          Time Slot
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Reason for Visit
                    </h2>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your symptoms or reason for consultation..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Confirm Button */}
                  <button
                    type="submit"
                    disabled={loading || !selectedDate || !selectedTime}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Booking..." : "Confirm Appointment"}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
