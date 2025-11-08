import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Calendar,
  FileText,
  Activity,
  Upload,
  Stethoscope,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "../../hooks/useNavigate";

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    document.title = `Dashboard - ${profile?.full_name || "Patient"}`;

    // ✅ Real-time listener for appointments
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patient_id", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snap) => {
      setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // ✅ Fetch medical records & diagnoses
    const recordsQuery = query(
      collection(db, "medical_records"),
      where("patient_id", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const diagnosesQuery = query(
      collection(db, "diagnoses"),
      where("patient_id", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    Promise.all([getDocs(recordsQuery), getDocs(diagnosesQuery)]).then(
      ([rSnap, dSnap]) => {
        setMedicalRecords(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setDiagnoses(dSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    return () => unsubscribeAppointments();
  }, [user]);

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
    <DashboardLayout>
      <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {profile?.full_name?.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">Here's your health overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={Calendar}
            color="blue"
            count={appointments.length}
            label="Appointments"
          />
          <SummaryCard
            icon={FileText}
            color="cyan"
            count={medicalRecords.length}
            label="Records"
          />
          <SummaryCard
            icon={Activity}
            color="teal"
            count={diagnoses.length}
            label="Diagnoses"
          />
          <button
            onClick={() => navigate("/patient/ai-diagnosis")}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Stethoscope className="w-8 h-8 mb-2" />
            <p className="font-semibold">AI Diagnosis</p>
            <p className="text-sm opacity-90">Check symptoms</p>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <Tab label="Overview" value="overview" active={activeTab} onClick={setActiveTab} />
              <Tab label="Appointments" value="appointments" active={activeTab} onClick={setActiveTab} />
              <Tab label="Medical Records" value="records" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewSection
                appointments={appointments}
                diagnoses={diagnoses}
                navigate={navigate}
              />
            )}
            {activeTab === "appointments" && (
              <AppointmentsSection appointments={appointments} navigate={navigate} />
            )}
            {activeTab === "records" && <RecordsSection medicalRecords={medicalRecords} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------------- Subcomponents ---------------- */

function SummaryCard({ icon: Icon, color, count, label }: any) {
  const colors: any = {
    blue: "bg-blue-100 text-blue-600",
    cyan: "bg-cyan-100 text-cyan-600",
    teal: "bg-teal-100 text-teal-600",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{count}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, value, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`py-4 border-b-2 font-medium transition-colors ${
        active === value
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- Overview Section ---------------- */
function OverviewSection({ appointments, diagnoses, navigate }: any) {
  const upcoming = appointments.filter((a: any) => a.status === "scheduled");
  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upcoming Appointments
        </h3>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {a.reason || "Consultation"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(a.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {a.appointment_time}
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
              onClick={() => navigate("/patient/book-appointment")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>

      {/* Diagnoses */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Diagnoses
        </h3>
        {diagnoses.length > 0 ? (
          <div className="space-y-3">
            {diagnoses.slice(0, 2).map((d: any) => (
              <div key={d.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-800">
                    {new Date(d.createdAt?.toDate?.() || d.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Symptoms: {d.symptoms?.join(", ")}
                </p>
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
  );
}

/* ---------------- Appointments Section ---------------- */
function AppointmentsSection({ appointments, navigate }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">All Appointments</h3>
        <button
          onClick={() => navigate("/patient/book-appointment")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book New
        </button>
      </div>
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((a: any) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {a.reason || "Consultation"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{new Date(a.appointment_date).toLocaleDateString()}</span>
                    <span>{a.appointment_time}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  a.status === "scheduled"
                    ? "bg-blue-100 text-blue-600"
                    : a.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
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
  );
}

/* ---------------- Records Section ---------------- */
function RecordsSection({ medicalRecords }: any) {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!title || !recordType || !file) {
      alert("Please fill all fields and choose a file.");
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `records/${user?.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "medical_records"), {
        patient_id: user?.uid,
        title,
        record_type: recordType,
        description,
        file_url: fileURL,
        createdAt: serverTimestamp(),
      });

      alert("✅ Record uploaded successfully!");
      setShowUpload(false);
      setTitle("");
      setRecordType("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload record. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Medical Records</h3>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Record List */}
      {medicalRecords.length > 0 ? (
        <div className="space-y-3">
          {medicalRecords.map((r: any) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{r.title}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{r.record_type}</span>
                    <span>
                      {new Date(r.createdAt?.toDate?.() || r.createdAt).toLocaleDateString()}
                    </span>
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

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Medical Record
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter record title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Record Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select type</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Scan Report">Scan Report</option>
                  <option value="Test Result">Test Result</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Add notes or context"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Upload File</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-2 mt-4 text-white rounded-lg font-semibold ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
