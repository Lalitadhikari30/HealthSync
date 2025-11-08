import { AuthProvider } from './contexts/AuthContext';
import Router from './components/Router';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Router />
       <Toaster position="top-center" reverseOrder={false} /> {/* 👈 Toast container */}
    </AuthProvider>
  );
}

export default App;
