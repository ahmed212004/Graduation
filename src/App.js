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
import PromptTesting from "./components/PromptTesting"; 
import CompleteProfile from "./Pages/CompleteProfile";
import Profile from "./Pages/Profile";
import AdminAccounts from "./Pages/AdminAccounts";

// مكون حماية الصفحات: بيمنع الدخول لو مفيش توكن
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // لو مفيش توكن، ارميه على اللوجين فوراً
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. المسارات العامة (بدون حماية) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/VerifyAccount" element={<VerifyAccount />} />        
        <Route path="/reset-code" element={<ResetCodePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 2. المسارات المحمية (بشرط التوكن) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
        <Route path="/successful-attacks" element={<ProtectedRoute><SuccessfulAttacks /></ProtectedRoute>} />
        <Route path="/prompt-testing" element={<ProtectedRoute><PromptTesting /></ProtectedRoute>} />
        <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* 🔴 مسار صفحة الأدمن - تمت إضافته هنا */}
        <Route 
          path="/admin/accounts" 
          element={
            <ProtectedRoute>
              <AdminAccounts />
            </ProtectedRoute>
          } 
        />

        {/* 3. توجيه المسارات غير المعروفة */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;