import React, { useEffect, useRef, useState } from 'react';

// ── Food items with emoji + label + color tint ────────────────────────────
const FOOD_ITEMS = [
  { emoji: '🍛',  label: 'Biryani',        color: '#ff9f1c', delay: 0    },
  { emoji: '🍕',  label: 'Pizza',           color: '#ff6b35', delay: 0.4  },
  { emoji: '🍔',  label: 'Burger',          color: '#f59e0b', delay: 0.8  },
  { emoji: '🥘',  label: 'Curry',           color: '#ef4444', delay: 1.2  },
  { emoji: '🍜',  label: 'Noodles',         color: '#22c55e', delay: 1.6  },
  { emoji: '🥗',  label: 'Salad',           color: '#10b981', delay: 2.0  },
  { emoji: '🍱',  label: 'Bento',           color: '#3b82f6', delay: 2.4  },
  { emoji: '🥐',  label: 'Croissant',       color: '#d97706', delay: 2.8  },
  { emoji: '🍣',  label: 'Sushi',           color: '#ec4899', delay: 3.2  },
  { emoji: '🍦',  label: 'Ice Cream',       color: '#8b5cf6', delay: 3.6  },
  { emoji: '🌮',  label: 'Taco',            color: '#f97316', delay: 4.0  },
  { emoji: '🫕',  label: 'Stew',            color: '#b45309', delay: 4.4  },
];

// ── Orbit paths: each card follows a lazy floating path ───────────────────
const LANES = [
  { x: 62, baseY: 12,  amplitude: 8,  speed: 3.8, size: 'lg' },
  { x: 78, baseY: 34,  amplitude: 12, speed: 4.6, size: 'md' },
  { x: 55, baseY: 52,  amplitude: 9,  speed: 5.1, size: 'sm' },
  { x: 72, baseY: 68,  amplitude: 11, speed: 3.4, size: 'lg' },
  { x: 88, baseY: 20,  amplitude: 7,  speed: 6.0, size: 'md' },
  { x: 48, baseY: 80,  amplitude: 10, speed: 4.2, size: 'sm' },
  { x: 65, baseY: 90,  amplitude: 6,  speed: 5.5, size: 'md' },
  { x: 82, baseY: 56,  amplitude: 13, speed: 3.9, size: 'lg' },
  { x: 93, baseY: 76,  amplitude: 8,  speed: 4.8, size: 'sm' },
  { x: 58, baseY: 38,  amplitude: 11, speed: 5.3, size: 'md' },
  { x: 75, baseY: 6,   amplitude: 9,  speed: 4.0, size: 'sm' },
  { x: 90, baseY: 44,  amplitude: 7,  speed: 6.2, size: 'lg' },
];

const sizeMap = { lg: 72, md: 58, sm: 46 };
const fontMap = { lg: '2rem', md: '1.6rem', sm: '1.2rem' };

export default function FoodAnimationPanel() {
  const [tick, setTick]       = useState(0);
  const [hovered, setHovered] = useState(null);
  const rafRef = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      setTick(Date.now());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  const elapsed = (Date.now() - startRef.current) / 1000;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'transparent',
      pointerEvents: 'none',
    }}>

      {/* ── Ambient glow blobs ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: '20%', right: '10%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'blobPulse 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%', right: '5%',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(255,159,28,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'blobPulse 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '55%', right: '30%',
        width: 150, height: 150,
        background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'blobPulse 7s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />

      {/* ── Floating food cards ────────────────────────────────────────── */}
      {FOOD_ITEMS.map((food, i) => {
        const lane    = LANES[i];
        const t       = elapsed + lane.delay;
        const yOffset = Math.sin(t / lane.speed * Math.PI) * lane.amplitude;
        const rotate  = Math.sin(t / (lane.speed * 1.3) * Math.PI) * 8;
        const size    = sizeMap[lane.size];
        const isHov   = hovered === i;

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left:   `${lane.x}%`,
              top:    `${lane.baseY + yOffset}%`,
              transform: `translate(-50%, -50%) rotate(${isHov ? 0 : rotate}deg) scale(${isHov ? 1.25 : 1})`,
              transition: isHov
                ? 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 0.1s linear',
              pointerEvents: 'all',
              cursor: 'default',
              zIndex: isHov ? 10 : 1,
            }}
          >
            {/* Card */}
            <div style={{
              width:  size,
              height: size,
              background: isHov
                ? `radial-gradient(135deg, ${food.color}22, ${food.color}11)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isHov ? food.color + '55' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: lane.size === 'lg' ? 20 : lane.size === 'md' ? 16 : 12,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              boxShadow: isHov
                ? `0 12px 40px ${food.color}33, 0 0 0 1px ${food.color}33`
                : '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
            }}>
              <span style={{ fontSize: fontMap[lane.size], lineHeight: 1, userSelect: 'none' }}>
                {food.emoji}
              </span>
              {lane.size === 'lg' && (
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: 'DM Sans, sans-serif',
                  color: isHov ? food.color : 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'color 0.3s',
                  marginTop: 2,
                }}>
                  {food.label}
                </span>
              )}
            </div>

            {/* Tooltip on hover */}
            {isHov && lane.size !== 'lg' && (
              <div style={{
                position: 'absolute',
                bottom: '110%', left: '50%',
                transform: 'translateX(-50%)',
                background: '#1f1f26',
                border: `1px solid ${food.color}44`,
                borderRadius: 8,
                padding: '4px 10px',
                whiteSpace: 'nowrap',
                fontSize: '0.7rem',
                fontWeight: 700,
                fontFamily: 'DM Sans, sans-serif',
                color: food.color,
                pointerEvents: 'none',
                boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                animation: 'tooltipIn 0.2s ease both',
              }}>
                {food.label}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Falling food drops (CSS-only decoration) ──────────────────── */}
      {['🍅','🧅','🌶️','🫑','🧄','🍋','🥕','🫐'].map((e, i) => (
        <div key={`drop-${i}`} style={{
          position: 'absolute',
          left: `${48 + i * 7}%`,
          top: '-5%',
          fontSize: '1.1rem',
          opacity: 0.18,
          animation: `dropFall ${4 + i * 0.7}s linear infinite`,
          animationDelay: `${i * 0.9}s`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>{e}</div>
      ))}

      {/* ── "Today's specials" label ───────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 28,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'DM Sans, sans-serif',
        }}>Today's Menu</div>
        <div style={{
          display: 'flex',
          gap: 5,
        }}>
          {['🍛','🍕','🍔','🥘','🍜'].map((e, i) => (
            <span key={i} style={{
              fontSize: '0.85rem',
              opacity: 0.35,
              animation: `menuBounce 2s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
              display: 'inline-block',
            }}>{e}</span>
          ))}
        </div>
      </div>

      {/* ── Global keyframes injected once ────────────────────────────── */}
      <style>{`
        @keyframes blobPulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 1; }
          50%       { transform: scale(1.2) translate(10px, -15px); opacity: 0.7; }
        }
        @keyframes dropFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.18; }
          90%  { opacity: 0.18; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes menuBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
