import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ResetCodePage from "./components/ResetCodePage";
import ResetPassword from "./components/ResetPassword";
import PlansPage from "./Pages/plans"; 
import SuccessfulAttacks from "./Pages/SuccessfulAttacks";
import PromptTesting from "./components/PromptTesting"; // 👈 استدعاء الصفحة الجديدة

// مكون بسيط لحماية الصفحات (بيحول لـ Login لو مفيش Token)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/reset-code" element={<ResetCodePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- Protected Routes (محمية بالتوكن) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/successful-attacks" 
          element={
            <ProtectedRoute>
              <SuccessfulAttacks />
            </ProtectedRoute>
          } 
        />

        {/* 👇 إضافة مسار الـ AI Playground الجديد هنا */}
        <Route 
          path="/prompt-testing" 
          element={
            <ProtectedRoute>
              <PromptTesting />
            </ProtectedRoute>
          } 
        />

        {/* --- 404 Page --- */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;