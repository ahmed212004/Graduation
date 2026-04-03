import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState("");

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      const res = await api.post("/api/Authentication/verify", {
        email: email,
        code: code,
      });

      // ✅ هنا بقى نحفظ التوكن
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verify Account</h2>

      <p>Email: {email}</p>

      <input
        type="text"
        placeholder="Enter verification code"
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}

export default VerifyAccount;