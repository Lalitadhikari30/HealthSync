// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { supabase } from '../../lib/supabase';
// import { Brain, Plus, X, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
// import { useNavigate } from '../../hooks/useNavigate';

// const COMMON_SYMPTOMS = [
//   'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting',
//   'Diarrhea', 'Chest Pain', 'Shortness of Breath', 'Dizziness',
//   'Sore Throat', 'Body Aches', 'Chills', 'Loss of Appetite', 'Abdominal Pain'
// ];

// const AI_DISEASES_DB = [
//   { name: 'Common Cold', symptoms: ['Cough', 'Sore Throat', 'Fatigue', 'Headache'] },
//   { name: 'Influenza (Flu)', symptoms: ['Fever', 'Cough', 'Body Aches', 'Fatigue', 'Chills'] },
//   { name: 'Gastroenteritis', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Fever'] },
//   { name: 'Migraine', symptoms: ['Headache', 'Nausea', 'Dizziness'] },
//   { name: 'Bronchitis', symptoms: ['Cough', 'Chest Pain', 'Fatigue', 'Shortness of Breath'] },
//   { name: 'COVID-19', symptoms: ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Body Aches'] },
//   { name: 'Food Poisoning', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain'] },
//   { name: 'Pneumonia', symptoms: ['Fever', 'Cough', 'Chest Pain', 'Shortness of Breath', 'Fatigue'] },
// ];

// export default function AIDiagnosis() {
//   const { profile } = useAuth();
//   const navigate = useNavigate();
//   const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
//   const [customSymptom, setCustomSymptom] = useState('');
//   const [analyzing, setAnalyzing] = useState(false);
//   const [results, setResults] = useState<{ disease: string; confidence: number }[]>([]);
//   const [patientId, setPatientId] = useState<string | null>(null);

//   useEffect(() => {
//     loadPatientId();
//   }, [profile]);

//   const loadPatientId = async () => {
//     const { data } = await supabase
//       .from('patients')
//       .select('id')
//       .eq('user_id', profile?.id)
//       .maybeSingle();
//     if (data) setPatientId(data.id);
//   };

//   const toggleSymptom = (symptom: string) => {
//     if (selectedSymptoms.includes(symptom)) {
//       setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
//     } else {
//       setSelectedSymptoms([...selectedSymptoms, symptom]);
//     }
//   };

//   const addCustomSymptom = () => {
//     if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
//       setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
//       setCustomSymptom('');
//     }
//   };

//   const analyzeSymptoms = async () => {
//     if (selectedSymptoms.length === 0) return;

//     setAnalyzing(true);
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     const predictions = AI_DISEASES_DB.map(disease => {
//       const matchingSymptoms = disease.symptoms.filter(s =>
//         selectedSymptoms.some(selected => selected.toLowerCase() === s.toLowerCase())
//       );
//       const confidence = matchingSymptoms.length / Math.max(disease.symptoms.length, selectedSymptoms.length);
//       return { disease: disease.name, confidence };
//     })
//       .filter(p => p.confidence > 0)
//       .sort((a, b) => b.confidence - a.confidence)
//       .slice(0, 5);

//     setResults(predictions);

//     if (patientId) {
//       await supabase.from('diagnoses').insert({
//         patient_id: patientId,
//         symptoms: selectedSymptoms,
//         ai_prediction: predictions,
//       });
//     }

//     setAnalyzing(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate('/patient/dashboard')}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2 rounded-xl">
//                   <Brain className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-800">AI Diagnosis Assistant</h1>
//                   <p className="text-sm text-gray-600">Powered by Advanced AI</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white mb-8">
//             <h2 className="text-3xl font-bold mb-4">Get Instant Health Insights</h2>
//             <p className="text-lg opacity-90">
//               Our AI analyzes your symptoms and provides potential diagnoses. This is not a substitute for professional medical advice.
//             </p>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
//             <h3 className="text-xl font-bold text-gray-800 mb-6">Select Your Symptoms</h3>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
//               {COMMON_SYMPTOMS.map((symptom) => (
//                 <button
//                   key={symptom}
//                   onClick={() => toggleSymptom(symptom)}
//                   className={`p-3 rounded-lg border-2 transition-all text-left ${
//                     selectedSymptoms.includes(symptom)
//                       ? 'border-purple-600 bg-purple-50 text-purple-600'
//                       : 'border-gray-300 hover:border-purple-300'
//                   }`}
//                 >
//                   {symptom}
//                 </button>
//               ))}
//             </div>

//             <div className="flex gap-2 mb-6">
//               <input
//                 type="text"
//                 value={customSymptom}
//                 onChange={(e) => setCustomSymptom(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
//                 placeholder="Add custom symptom..."
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
//               />
//               <button
//                 onClick={addCustomSymptom}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>

//             {selectedSymptoms.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Symptoms:</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedSymptoms.map((symptom) => (
//                     <span
//                       key={symptom}
//                       className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full"
//                     >
//                       {symptom}
//                       <button onClick={() => toggleSymptom(symptom)}>
//                         <X className="w-4 h-4" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={analyzeSymptoms}
//               disabled={selectedSymptoms.length === 0 || analyzing}
//               className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {analyzing ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" />
//                   Analyzing Symptoms...
//                 </>
//               ) : (
//                 <>
//                   <Brain className="w-5 h-5" />
//                   Analyze Symptoms
//                 </>
//               )}
//             </button>
//           </div>

//           {results.length > 0 && (
//             <div className="bg-white rounded-xl shadow-sm p-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <Brain className="w-6 h-6 text-purple-600" />
//                 <h3 className="text-xl font-bold text-gray-800">AI Analysis Results</h3>
//               </div>

//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
//                 <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//                 <div className="text-sm text-yellow-800">
//                   <p className="font-semibold mb-1">Important Disclaimer</p>
//                   <p>This AI analysis is for informational purposes only. Please consult with a healthcare professional for proper diagnosis and treatment.</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {results.map((result, index) => (
//                   <div
//                     key={index}
//                     className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="text-lg font-semibold text-gray-800">{result.disease}</h4>
//                       <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
//                         {(result.confidence * 100).toFixed(1)}% Match
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
//                         style={{ width: `${result.confidence * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h4 className="font-semibold text-gray-800 mb-3">Recommended Next Steps:</h4>
//                 <ul className="space-y-2 text-gray-600 mb-6">
//                   <li className="flex items-center gap-2">
//                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
//                     Book an appointment with a healthcare professional
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
//                     Monitor your symptoms and note any changes
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
//                     Get adequate rest and stay hydrated
//                   </li>
//                 </ul>
//                 <button
//                   onClick={() => navigate('/patient/book-appointment')}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Book Appointment with Doctor
//                 </button>
//               </div>
//             </div>
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
  Brain,
  Plus,
  X,
  ArrowLeft,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "../../hooks/useNavigate";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

const COMMON_SYMPTOMS = [
  "Fever",
  "Cough",
  "Headache",
  "Fatigue",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Chest Pain",
  "Shortness of Breath",
  "Dizziness",
  "Sore Throat",
  "Body Aches",
  "Chills",
  "Loss of Appetite",
  "Abdominal Pain",
];

const AI_DISEASES_DB = [
  { name: "Common Cold", symptoms: ["Cough", "Sore Throat", "Fatigue", "Headache"] },
  { name: "Influenza (Flu)", symptoms: ["Fever", "Cough", "Body Aches", "Fatigue", "Chills"] },
  { name: "Gastroenteritis", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Fever"] },
  { name: "Migraine", symptoms: ["Headache", "Nausea", "Dizziness"] },
  { name: "Bronchitis", symptoms: ["Cough", "Chest Pain", "Fatigue", "Shortness of Breath"] },
  { name: "COVID-19", symptoms: ["Fever", "Cough", "Shortness of Breath", "Fatigue", "Body Aches"] },
  { name: "Food Poisoning", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain"] },
  { name: "Pneumonia", symptoms: ["Fever", "Cough", "Chest Pain", "Shortness of Breath", "Fatigue"] },
];

export default function AIDiagnosis() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ disease: string; confidence: number }[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);

  // 🔹 Load patient ID (from Firestore)
  useEffect(() => {
    if (user) loadPatientId();
  }, [user]);

  const loadPatientId = async () => {
    try {
      const patientsRef = collection(db, "patients");
      const q = query(patientsRef, where("user_id", "==", user?.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setPatientId(snap.docs[0].id);
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate AI processing

    // 🔹 Local AI-like logic
    const predictions = AI_DISEASES_DB.map((disease) => {
      const matchingSymptoms = disease.symptoms.filter((s) =>
        selectedSymptoms.some(
          (selected) => selected.toLowerCase() === s.toLowerCase()
        )
      );
      const confidence =
        matchingSymptoms.length /
        Math.max(disease.symptoms.length, selectedSymptoms.length);
      return { disease: disease.name, confidence };
    })
      .filter((p) => p.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    setResults(predictions);

    // 🔹 Save results to Firestore
    if (patientId) {
      try {
        await addDoc(collection(db, "diagnoses"), {
          patient_id: patientId,
          user_id: user?.uid,
          symptoms: selectedSymptoms,
          ai_prediction: predictions,
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("Error saving diagnosis:", err);
      }
    }

    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/patient/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    AI Diagnosis Assistant
                  </h1>
                  <p className="text-sm text-gray-600">Powered by AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Card */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Instant Health Insights</h2>
            <p className="text-lg opacity-90">
              Our AI analyzes your symptoms and provides potential diagnoses. 
              This is not a substitute for professional medical advice.
            </p>
          </div>

          {/* Symptom Selection */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Select Your Symptoms</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {COMMON_SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedSymptoms.includes(symptom)
                      ? "border-purple-600 bg-purple-50 text-purple-600"
                      : "border-gray-300 hover:border-purple-300"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSymptom()}
                placeholder="Add custom symptom..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={addCustomSymptom}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Symptoms:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full"
                    >
                      {symptom}
                      <button onClick={() => toggleSymptom(symptom)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || analyzing}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {analyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>

          {/* AI Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  AI Analysis Results
                </h3>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Disclaimer</p>
                  <p>
                    This AI analysis is for informational purposes only. 
                    Please consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {result.disease}
                      </h4>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {(result.confidence * 100).toFixed(1)}% Match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Recommended Next Steps:
                </h4>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Book an appointment with a healthcare professional
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Monitor your symptoms and note any changes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Get adequate rest and stay hydrated
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/patient/book-appointment")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment with Doctor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
