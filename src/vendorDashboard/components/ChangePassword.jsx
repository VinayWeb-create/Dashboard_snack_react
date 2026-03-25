// src/vendorDashboard/components/ChangePassword.jsx
// Drop this into your src/vendorDashboard/components/ folder
// Then wire it into LandingPage.jsx + SideBar.jsx (see comments below)

import React, { useState } from 'react';
import { API_URL } from '../data/apiPath';
import { useToast } from './Toast';

/* ─────────────────────────────────────────
   Strength meter helpers
───────────────────────────────────────── */
const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-5
};

const strengthLabel = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const strengthColor = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981'];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
const ChangePassword = () => {
  const toast = useToast();

  const [current,    setCurrent]    = useState('');
  const [next,       setNext]       = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showCur,    setShowCur]    = useState(false);
  const [showNext,   setShowNext]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [success,    setSuccess]    = useState(false);

  const strength = getStrength(next);

  const validate = () => {
    const e = {};
    if (!current)               e.current  = 'Current password is required';
    if (!next)                  e.next     = 'New password is required';
    else if (next.length < 6)   e.next     = 'Minimum 6 characters';
    if (next && next === current)
                                e.next     = 'New password must differ from current';
    if (!confirm)               e.confirm  = 'Please confirm your new password';
    else if (confirm !== next)  e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setSuccess(false);
    try {
      const token = localStorage.getItem('loginToken');
      const res   = await fetch(`${API_URL}/vendor/change-password`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body:    JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Password updated successfully! 🔒');
        setSuccess(true);
        setCurrent(''); setNext(''); setConfirm(''); setErrors({});
      } else {
        if (data.error?.toLowerCase().includes('current')) {
          setErrors({ current: data.error });
        } else {
          toast.error(data.error || 'Failed to update password');
        }
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── styles ─── */
  const fieldWrap = { marginBottom: 20 };

  const lbl = {
    display:       'block',
    fontSize:      '0.73rem',
    fontWeight:    700,
    color:         'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom:  7,
  };

  const inpBase = (hasErr) => ({
    width:       '100%',
    height:      46,
    boxSizing:   'border-box',
    background:  hasErr ? 'rgba(239,68,68,0.07)' : 'var(--surface2)',
    border:      `1.5px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    color:       'var(--text-primary)',
    fontSize:    '0.92rem',
    fontFamily:  'DM Sans, sans-serif',
    padding:     '0 46px 0 14px',
    outline:     'none',
    transition:  'border-color 0.2s, box-shadow 0.2s',
  });

  const eyeBtn = {
    position:   'absolute',
    right:      12,
    top:        '50%',
    transform:  'translateY(-50%)',
    background: 'none',
    border:     'none',
    color:      'var(--text-muted)',
    cursor:     'pointer',
    fontSize:   '0.8rem',
    fontWeight: 700,
    fontFamily: 'DM Sans, sans-serif',
    padding:    0,
  };

  const errMsg = { color: 'var(--red)', fontSize: '0.74rem', marginTop: 5, display: 'block' };

  const onFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
    e.target.style.boxShadow   = '0 0 0 3px var(--accent-subtle)';
  };
  const onBlur = (hasErr) => (e) => {
    e.target.style.borderColor = hasErr ? 'var(--red)' : 'var(--border)';
    e.target.style.boxShadow   = 'none';
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both', maxWidth: 480 }}>

      {/* Page heading */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
          Change Password
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Update your login credentials securely
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{
          background:   'var(--green-subtle)',
          border:       '1px solid var(--green)',
          borderRadius: 'var(--radius-sm)',
          padding:      '12px 16px',
          marginBottom: 20,
          display:      'flex',
          alignItems:   'center',
          gap:          10,
          fontSize:     '0.88rem',
          color:        'var(--green)',
          fontWeight:   600,
        }}>
          <span style={{ fontSize: '1.1rem' }}>✓</span>
          Password changed successfully! You can now log in with your new password.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding:      28,
        }}
      >
        {/* ── Current Password ── */}
        <div style={fieldWrap}>
          <label style={lbl}>Current Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showCur ? 'text' : 'password'}
              value={current}
              placeholder="Your current password"
              style={inpBase(!!errors.current)}
              onChange={(e) => { setCurrent(e.target.value); setErrors(p => ({ ...p, current: '' })); setSuccess(false); }}
              onFocus={onFocus}
              onBlur={onBlur(!!errors.current)}
            />
            <button type="button" style={eyeBtn} onClick={() => setShowCur(!showCur)}>
              {showCur ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.current && <span style={errMsg}>{errors.current}</span>}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 20px' }} />

        {/* ── New Password ── */}
        <div style={fieldWrap}>
          <label style={lbl}>New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showNext ? 'text' : 'password'}
              value={next}
              placeholder="Min. 6 characters"
              style={inpBase(!!errors.next)}
              onChange={(e) => { setNext(e.target.value); setErrors(p => ({ ...p, next: '' })); setSuccess(false); }}
              onFocus={onFocus}
              onBlur={onBlur(!!errors.next)}
            />
            <button type="button" style={eyeBtn} onClick={() => setShowNext(!showNext)}>
              {showNext ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.next && <span style={errMsg}>{errors.next}</span>}

          {/* Strength meter */}
          {next.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    style={{
                      flex:         1,
                      height:       4,
                      borderRadius: 99,
                      background:   i <= strength ? strengthColor[strength] : 'var(--surface3)',
                      transition:   'background 0.3s',
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.73rem', color: strengthColor[strength] || 'var(--text-muted)', fontWeight: 600 }}>
                {strengthLabel[strength]}
              </span>
            </div>
          )}
        </div>

        {/* ── Confirm New Password ── */}
        <div style={fieldWrap}>
          <label style={lbl}>Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConf ? 'text' : 'password'}
              value={confirm}
              placeholder="Repeat new password"
              style={inpBase(!!errors.confirm)}
              onChange={(e) => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); setSuccess(false); }}
              onFocus={onFocus}
              onBlur={onBlur(!!errors.confirm)}
            />
            <button type="button" style={eyeBtn} onClick={() => setShowConf(!showConf)}>
              {showConf ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirm && <span style={errMsg}>{errors.confirm}</span>}

          {/* Match indicator */}
          {confirm.length > 0 && next.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <div style={{
                width:        8,
                height:       8,
                borderRadius: '50%',
                background:   confirm === next ? 'var(--green)' : 'var(--red)',
                transition:   '0.2s',
              }} />
              <span style={{ fontSize: '0.73rem', fontWeight: 600, color: confirm === next ? 'var(--green)' : 'var(--red)' }}>
                {confirm === next ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background:   'var(--surface2)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding:      '10px 14px',
          marginBottom: 22,
          fontSize:     '0.78rem',
          color:        'var(--text-muted)',
          lineHeight:   1.6,
        }}>
          💡 <strong style={{ color: 'var(--text-secondary)' }}>Tips:</strong> Use 10+ characters, mix uppercase, numbers and symbols for a very strong password.
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width:        '100%',
            padding:      '12px',
            background:   loading ? 'var(--surface3)' : 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border:       'none',
            borderRadius: 'var(--radius-sm)',
            color:        loading ? 'var(--text-muted)' : 'white',
            fontSize:     '0.92rem',
            fontWeight:   700,
            cursor:       loading ? 'not-allowed' : 'pointer',
            fontFamily:   'DM Sans, sans-serif',
            boxShadow:    loading ? 'none' : 'var(--shadow-accent)',
            transition:   '0.2s',
          }}
          onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
        >
          {loading ? 'Updating password…' : '🔒 Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;


/* ═══════════════════════════════════════════════════════════════
   INTEGRATION GUIDE — read this before wiring it up
   ═══════════════════════════════════════════════════════════════

   1. BACKEND  ──────────────────────────────────────────────────
      Create controllers/passwordController.js with the content
      from the companion file, then add to routes/vendorRoutes.js:

        const { changePassword } = require('../controllers/passwordController');
        const verifyToken = require('../middlewares/verifyToken');
        router.put('/change-password', verifyToken, changePassword);

   2. SIDEBAR  ──────────────────────────────────────────────────
      In src/vendorDashboard/components/SideBar.jsx add a new item
      inside the Account <ul>:

        {item('changePassword', '🔒', 'Change Password', showChangePasswordHandler)}

   3. LANDING PAGE  ─────────────────────────────────────────────
      In src/vendorDashboard/pages/LandingPage.jsx:

      a) Import:
           import ChangePassword from '../components/ChangePassword';

      b) Add state:
           const [showChangePassword, setShowChangePassword] = useState(false);

      c) Add 'changePassword' to VIDEO_PANEL_VIEWS or not — your call.

      d) In resetViews() add:
           setShowChangePassword(false);

      e) Add handler:
           const showChangePasswordHandler = () => {
             if (showLogOut) { resetViews(); setShowChangePassword(true); setActiveView('changePassword'); }
             else { toast.warning('Please login first'); resetViews(); setShowLogin(true); setActiveView('login'); }
           };

      f) Pass to SideBar:
           showChangePasswordHandler={showChangePasswordHandler}

      g) Render in the left column:
           {showChangePassword && showLogOut && <ChangePassword />}

   ═══════════════════════════════════════════════════════════════ */
