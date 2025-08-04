import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedBase = API_URL.replace(/\/+$/, ''); // remove trailing slash if any
      const response = await fetch(`${trimmedBase}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || 'Login failed';
        alert(msg);
        setLoading(false);
        return;
      }

      // Successful login
      alert('Login success');
      setEmail('');
      setPassword('');
      const token = data.token;
      const vendorId = data.vendorId;

      localStorage.setItem('loginToken', token);
      localStorage.setItem('vendorId', vendorId);

      // Grab vendor info either from login payload or by fetching
      let vendorObj = null;
      if (data.vendor) {
        vendorObj = data.vendor;
      } else {
        const vendorRes = await fetch(`${trimmedBase}/vendor/single-vendor/${vendorId}`, {
          headers: { token },
        });
        if (vendorRes.ok) {
          vendorObj = await vendorRes.json();
        }
      }

      // Extract firm info (primaryFirm if provided, else first in array)
      const firm = vendorObj?.primaryFirm || vendorObj?.firm?.[0];
      if (firm) {
        localStorage.setItem('firmId', firm._id);
        localStorage.setItem('firmName', firm.firmName || '');
        localStorage.setItem('products', JSON.stringify(firm.products || []));
      }

      showWelcomeHandler();

      // Optional: if you really need a full page refresh for legacy logic
      // window.location.reload();
    } catch (error) {
      console.error("login fail", error);
      alert('Login failed, please try again.');
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
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p>Login in process... Please wait</p>
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
            placeholder="enter your email"
          />
          <br />
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
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
