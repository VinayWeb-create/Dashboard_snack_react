import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: '', resolve: null });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ open: true, message, resolve });
    });
  }, []);

  const handleYes = () => {
    state.resolve(true);
    setState({ open: false, message: '', resolve: null });
  };

  const handleNo = () => {
    state.resolve(false);
    setState({ open: false, message: '', resolve: null });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.15s ease both',
        }}>
          <div style={{
            background: '#18181d', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18, padding: '28px 28px 24px',
            maxWidth: 360, width: '90%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
            animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12, textAlign: 'center' }}>🗑️</div>
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontSize: '1.05rem',
              color: '#f0f0f2', marginBottom: 8, textAlign: 'center', fontWeight: 700,
            }}>Are you sure?</h3>
            <p style={{
              color: '#8b8b9a', fontSize: '0.85rem', textAlign: 'center',
              lineHeight: 1.5, marginBottom: 22,
            }}>{state.message}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleNo} style={{
                flex: 1, padding: '10px', borderRadius: 9,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: '#8b8b9a', fontSize: '0.87rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                transition: '0.2s',
              }}
              onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >Cancel</button>
              <button onClick={handleYes} style={{
                flex: 1, padding: '10px', borderRadius: 9,
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none', color: 'white',
                fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                transition: '0.2s',
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </ConfirmContext.Provider>
  );
};
