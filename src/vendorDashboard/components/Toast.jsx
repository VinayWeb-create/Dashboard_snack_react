import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const colors = {
    success: { bg: '#16a34a', border: '#22c55e', light: 'rgba(34,197,94,0.12)' },
    error:   { bg: '#dc2626', border: '#ef4444', light: 'rgba(239,68,68,0.12)' },
    info:    { bg: '#2563eb', border: '#3b82f6', light: 'rgba(59,130,246,0.12)' },
    warning: { bg: '#d97706', border: '#f59e0b', light: 'rgba(245,158,11,0.12)' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = colors[t.type];
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#18181d',
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              minWidth: 280, maxWidth: 380,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}22`,
              pointerEvents: 'all',
              cursor: 'pointer',
              animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
            }} onClick={() => removeToast(t.id)}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: c.light, border: `1px solid ${c.border}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: c.border, fontSize: '0.85rem', fontWeight: 700,
              }}>{icons[t.type]}</div>
              <span style={{ fontSize: '0.87rem', color: '#f0f0f2', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4, flex: 1 }}>
                {t.message}
              </span>
              <span style={{ color: '#4a4a5a', fontSize: '0.75rem', flexShrink: 0 }}>✕</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(60px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
