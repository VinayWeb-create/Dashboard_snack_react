// src/vendorDashboard/components/VideoPanel.jsx
import React, { useRef, useEffect, useState } from 'react';

// ── PASTE YOUR CLOUDINARY VIDEO URL HERE ──────────────────────────────────────
const VIDEO_SRC = 'https://res.cloudinary.com/dctmlindk/video/upload/v1774022455/Food_Delivery_Experience_Video_Generation_q00li9.mp4';
// ─────────────────────────────────────────────────────────────────────────────

const VideoPanel = () => {
  const videoRef          = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.loop  = true;
    vid.play().catch(() => {});
  }, []);

  const toggle = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play();  setPlaying(true);  }
    else            { vid.pause(); setPlaying(false); }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      overflow: 'hidden',
      background: '#0a0a0b',
    }}>

      {/* Loading shimmer */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: '#111114',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🎬</div>
          <div style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.82rem',
            fontFamily: 'DM Sans, sans-serif',
          }}>Loading video…</div>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay muted loop playsInline
        onCanPlay={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* Dark gradient overlay top + bottom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,10,11,0.35) 0%, transparent 35%, transparent 65%, rgba(10,10,11,0.6) 100%)',
      }} />

      {/* Brand text overlay */}
      <div style={{
        position: 'absolute', bottom: 52, left: 20, right: 20,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.1rem', fontWeight: 800,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          Manage your restaurant
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.5)',
          marginTop: 3,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Powered by VendorHub
        </div>
      </div>

      {/* Play / Pause button */}
      <button
        onClick={toggle}
        title={playing ? 'Pause' : 'Play'}
        style={{
          position: 'absolute', bottom: 14, right: 14,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          color: 'white', fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: '0.2s', zIndex: 10,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.55)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* LIVE dot */}
      {playing && (
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 99, padding: '4px 10px',
          backdropFilter: 'blur(6px)', zIndex: 10,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e',
            animation: 'pulseDot 2s infinite',
          }} />
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.06em',
          }}>LIVE PREVIEW</span>
        </div>
      )}

      <style>{`
        @keyframes pulseDot {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </div>
  );
};

export default VideoPanel;
