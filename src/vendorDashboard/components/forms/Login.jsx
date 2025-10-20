import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Login Request
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // 2️⃣ Store token & vendorId
      localStorage.setItem('loginToken', data.token);
      localStorage.setItem('vendorId', data.vendorId);

      alert('Login successful!');
      setEmail("");
      setPassword("");
      showWelcomeHandler();

      // 3️⃣ Fetch vendor info (requires token)
      const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${data.vendorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': data.token
        }
      });

      const vendorData = await vendorResponse.json();

      if (vendorResponse.ok) {
        const vendorFirmId = vendorData.vendorFirmId || '';
        const vendorFirmName = vendorData.firm?.[0]?.firmName || '';
        localStorage.setItem('firmId', vendorFirmId);
        localStorage.setItem('firmName', vendorFirmName);
        console.log("Vendor info stored:", vendorFirmId, vendorFirmName);
      } else {
        console.error("Failed to fetch vendor info:", vendorData.error);
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed due to network or server error");
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
        <form className='authForm' onSubmit={loginHandler} autoComplete='off'>
          <h3>Vendor Login</h3>

          <label>Email</label>
          <input
            type="text"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
          /><br />

          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          /><br />

          <span className='showPassword' onClick={handleShowPassword}>
            {showPassword ? 'Hide' : 'Show'}
          </span>

          <div className="btnSubmit">
            <button type='submit'>Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
