import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

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

    alert("Login successful");

    // Clear input fields
    setEmail("");
    setPassword("");

    // Save token & vendor info
    localStorage.setItem("loginToken", data.token);
    localStorage.setItem("vendorId", data.vendorId);

    // Save firm info safely
    const firm = data.vendor.primaryFirm;
    if (firm && firm._id) {
      localStorage.setItem("firmId", firm._id);
      localStorage.setItem("firmName", firm.firmName);
    } else {
      localStorage.removeItem("firmId");
      localStorage.removeItem("firmName");
      console.warn("Vendor has no firm assigned yet");
    }

    // Instead of reloading, redirect user
      navigate("/dashboard"); // <-- your dashboard route
      if (showWelcomeHandler) showWelcomeHandler();


  } catch (error) {
    console.error(error);
    alert(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="loginSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
          <p>Logging in... Please wait</p>
        </div>
      )}
      {!loading && (
        <form className="authForm" onSubmit={loginHandler} autoComplete="off">
          <h3>Vendor Login</h3>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <br />
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <br />
          <span className="showPassword" onClick={handleShowPassword}>
            {showPassword ? 'Hide' : 'Show'}
          </span>
          <div className="btnSubmit">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
