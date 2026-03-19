import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';
import { useToast } from '../Toast';

const Register = ({ showLoginHandler }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (username.trim().length < 2) e.username = 'At least 2 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Registered successfully! Please login.');
        setUsername(""); setEmail(""); setPassword("");
        showLoginHandler();
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (hasErr) => ({
    width: '100%', height: 44,
    background: hasErr ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
    border: `1px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s',
    boxSizing: 'border-box',
  });

  const lbl = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--text-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 6,
  };

  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; };
  const onBlur = (field) => e => { e.target.style.borderColor = errors[field] ? 'var(--red)' : 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="registerSection" style={{ animation: 'fadeUp 0.4s ease both' }}>
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles visible height={80} width={80} color="#ff6b35" />
          <p>Creating your account...</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 6 }}>
              Create account 🚀
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Join VendorHub and manage your restaurant</p>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off"
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Username</label>
              <input style={inp(errors.username)} type="text" value={username}
                placeholder="Your restaurant name"
                onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                onFocus={onFocus} onBlur={onBlur('username')} />
              {errors.username && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.username}</span>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Email</label>
              <input style={inp(errors.email)} type="email" value={email}
                placeholder="you@restaurant.com"
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                onFocus={onFocus} onBlur={onBlur('email')} />
              {errors.email && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.email}</span>}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={lbl}>Password</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp(errors.password), paddingRight: 50 }}
                  type={showPw ? "text" : "password"} value={password}
                  placeholder="Min. 6 characters"
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  onFocus={onFocus} onBlur={onBlur('password')} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                }}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
              {errors.password && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.password}</span>}
              {password && !errors.password && (
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 99,
                      background: password.length >= i * 2
                        ? (password.length >= 8 ? 'var(--green)' : 'var(--accent)')
                        : 'var(--surface3)',
                      transition: '0.3s',
                    }} />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" style={{
              marginTop: 22, width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'white', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              boxShadow: 'var(--shadow-accent)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >Create Account →</button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <span onClick={showLoginHandler} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
                Sign in
              </span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
