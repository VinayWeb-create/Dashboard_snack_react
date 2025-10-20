// Login.jsx (React Router redirect)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ← import & create navigate

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      // Save auth data
      localStorage.setItem("loginToken", data.token);
      localStorage.setItem("vendorId", data.vendorId);

      const firm = data.vendor?.primaryFirm || null;
      if (firm && firm._id) {
        localStorage.setItem("firmId", firm._id);
        localStorage.setItem("firmName", firm.firmName || "");
      } else {
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmName");
      }

      // show success, then navigate without reload
      alert("✅ Login successful");
      if (showWelcomeHandler) showWelcomeHandler();
      navigate("/dashboard"); // <- use this only if you have a dashboard route

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles visible={loading} height={100} width={100} color="#4fa94d" />
          <p>Logging in... Please wait</p>
        </div>
      ) : (
        <form className="authForm" onSubmit={loginHandler} autoComplete="off">
          <h3>Vendor Login</h3>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          <div className="btnSubmit">
            <button type="submit">{loading ? "Logging..." : "Login"}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
