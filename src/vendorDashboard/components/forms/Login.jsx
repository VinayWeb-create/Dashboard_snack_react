import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      // ✅ Store data first
      localStorage.setItem("loginToken", data.token);
      localStorage.setItem("vendorId", data.vendorId);

      const firm = data.vendor.primaryFirm;
      if (firm && firm._id) {
        localStorage.setItem("firmId", firm._id);
        localStorage.setItem("firmName", firm.firmName);
      } else {
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmName");
      }

      // ✅ Then show alert
      alert("✅ Login successful!");

      // ✅ After clicking OK, reload page once
      window.location.reload();

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={loginHandler}>
        <h3>Vendor Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
