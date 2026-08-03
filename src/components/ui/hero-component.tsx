"use client";
import React, { useEffect } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800&display=swap');
  
  .branding-hero-wrapper {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Outfit', sans-serif;
      background-color: #050510;
      color: #ffffff;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      position: relative;
  }

  .branding-hero-wrapper * {
      box-sizing: border-box;
  }

  /* ═══════════════════════════════════════════
     SPACE BACKGROUND — Deep space immersion
  ═══════════════════════════════════════════ */

  .space-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Nebula Clouds ── */
  .nebula {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: nebula-pulse 12s ease-in-out infinite alternate;
  }

  .nebula-purple {
    width: 55vw;
    height: 55vw;
    top: -20%;
    left: -15%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
    animation-duration: 14s;
  }

  .nebula-blue {
    width: 50vw;
    height: 50vw;
    top: 5%;
    right: -20%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.10) 0%, transparent 65%);
    animation-duration: 18s;
    animation-delay: -5s;
  }

  .nebula-teal {
    width: 40vw;
    height: 40vw;
    bottom: -10%;
    left: 30%;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 65%);
    animation-duration: 22s;
    animation-delay: -9s;
  }

  .nebula-dark-center {
    width: 60vw;
    height: 60vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%);
    filter: blur(40px);
    animation: none;
  }

  @keyframes nebula-pulse {
    0%   { opacity: 0.6; transform: scale(1); }
    100% { opacity: 1;   transform: scale(1.08); }
  }

  /* ── Stars Layer ── */
  .stars-layer {
    position: absolute;
    inset: 0;
  }

  .stars-drift {
    animation: slow-drift 120s linear infinite;
  }

  @keyframes slow-drift {
    0%   { transform: translate(0, 0); }
    25%  { transform: translate(8px, -5px); }
    50%  { transform: translate(0, -10px); }
    75%  { transform: translate(-8px, -5px); }
    100% { transform: translate(0, 0); }
  }

  /* ── Individual Stars ── */
  .star {
    position: absolute;
    border-radius: 50%;
    animation: twinkle linear infinite;
  }

  .star-tiny {
    background: #ffffff;
    opacity: 0.7;
  }

  .star-medium {
    width: 2px;
    height: 2px;
    background: #ffffff;
    box-shadow: 0 0 4px 1px rgba(255,255,255,0.6);
    animation: twinkle linear infinite;
  }

  .star-glow {
    width: 3px;
    height: 3px;
    background: var(--glow-color, #fff);
    box-shadow:
      0 0 6px 2px var(--glow-color, #fff),
      0 0 14px 4px color-mix(in srgb, var(--glow-color, #fff) 40%, transparent);
    animation: glow-pulse ease-in-out infinite;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.15; }
    50%       { opacity: 1; }
  }

  @keyframes glow-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.4); }
  }

  /* ── Shooting Stars ── */
  .shooting-stars {
    position: absolute;
    inset: 0;
  }

  .shooting-star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    animation: shoot linear infinite;
    opacity: 0;
  }

  .shooting-star::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 2px;
    width: 120px;
    height: 1px;
    background: linear-gradient(to left, rgba(255,255,255,0.8), transparent);
  }

  .shooting-star-1 { top: 12%; left: 20%;  animation-duration: 8s;  animation-delay: 0s; }
  .shooting-star-2 { top: 28%; left: 55%;  animation-duration: 11s; animation-delay: -3s; }
  .shooting-star-3 { top: 8%;  left: 70%;  animation-duration: 14s; animation-delay: -7s; }
  .shooting-star-4 { top: 45%; left: 10%;  animation-duration: 10s; animation-delay: -5s; }
  .shooting-star-5 { top: 18%; left: 40%;  animation-duration: 16s; animation-delay: -11s; }

  @keyframes shoot {
    0%   { opacity: 0; transform: translateX(0)   translateY(0); }
    5%   { opacity: 1; }
    30%  { opacity: 0; transform: translateX(300px) translateY(80px); }
    100% { opacity: 0; transform: translateX(300px) translateY(80px); }
  }

  /* ── Milky Way band ── */
  .milky-way {
    position: absolute;
    top: 0;
    left: -20%;
    width: 140%;
    height: 100%;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(150, 120, 255, 0.03) 30%,
      rgba(100, 160, 255, 0.05) 50%,
      rgba(150, 120, 255, 0.03) 70%,
      transparent 100%
    );
    transform: rotate(-15deg) scaleY(0.4);
    transform-origin: center 40%;
    filter: blur(20px);
    pointer-events: none;
  }

  /* Layout */
  .branding-hero-layout {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      pointer-events: none; /* Let clicks pass through to particles */
  }
  
  .branding-hero-layout > * {
      pointer-events: auto; /* Re-enable clicks for children */
  }

  /* Sidebar */
  .branding-sidebar {
      width: 80px;
      background-color: #ffffff;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 30px;
      border-right: 1px solid rgba(255,255,255,0.1);
      box-shadow: 5px 0 15px rgba(0,0,0,0.1);
      z-index: 2;
  }

  .branding-logo-box {
      width: 100%;
      height: 80px;
      background-color: #df28b9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 800;
  }

  .branding-vertical-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: #666;
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: 700;
      white-space: nowrap;
      text-transform: uppercase;
  }

  .branding-hamburger {
      display: flex;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      padding: 10px;
  }

  .branding-hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background-color: #333;
      transition: all 0.3s ease;
  }

  .branding-hamburger:hover span:nth-child(2) {
      width: 18px;
  }

  /* Main Content */
  .branding-main-content {
      flex: 1;
      position: relative;
      padding: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }

  .branding-hero-text {
      max-width: 600px;
      animation: fadeUp 1s ease-out forwards;
  }

  .branding-hero-text h1 {
      font-size: 120px;
      line-height: 1.1;
      font-weight: 800;
      margin: 0 0 20px 0;
      letter-spacing: -2px;
      text-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .branding-subtitle {
      font-size: 14px;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin: 0;
  }

  /* Right Menu Block */
  .branding-menu-block {
      background-color: rgba(30, 20, 40, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 40px 60px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      animation: fadeInRight 1s ease-out 0.3s forwards;
      opacity: 0;
      transform: translateX(30px);
  }

  .branding-menu-block ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 30px;
      margin: 0;
      padding: 0;
  }

  .branding-menu-block li {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .branding-menu-block li:hover {
      color: #df28b9;
      transform: translateX(5px);
  }

  .branding-number {
      font-weight: 800;
      width: 20px;
  }

  .branding-line {
      width: 40px;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 0 20px;
      transition: all 0.3s ease;
  }

  .branding-menu-block li:hover .branding-line {
      background-color: #df28b9;
      width: 50px;
  }

  /* Animations */
  @keyframes fadeUp {
      from {
          opacity: 0;
          transform: translateY(30px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  @keyframes fadeInRight {
      to {
          opacity: 1;
          transform: translateX(0);
      }
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
      .branding-main-content {
          padding: 50px;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 60px;
      }
      
      .branding-hero-text h1 {
          font-size: 80px;
      }
  }

  @media (max-width: 768px) {
      .branding-sidebar {
          width: 60px;
      }
      
      .branding-logo-box {
          height: 60px;
          font-size: 20px;
      }
      
      .branding-hero-text h1 {
          font-size: 60px;
      }
      
      .branding-menu-block {
          padding: 30px 40px;
      }
  }
`;

export default function BrandingHero() {
  useEffect(() => {
    const initParticles = () => {
      if ((window as any).tsParticles) {
        (window as any).tsParticles.load("tsparticles-bg", {
          fullScreen: { enable: false },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
            modes: {
              repulse: { distance: 100, duration: 0.8, factor: 1, speed: 1 },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "out" },
              random: false,
              speed: { min: 0.1, max: 1 },
              straight: false,
            },
            number: {
              density: { enable: true, width: 400, height: 400 },
              value: 120,
            },
            opacity: {
              value: { min: 0.1, max: 1 },
              animation: {
                enable: true,
                speed: 4,
                sync: false,
                startValue: "random",
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 0.4, max: 1.2 },
              animation: { enable: false },
            },
          },
          detectRetina: true,
        });
      }
    };

    if (!(window as any).tsParticles) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tsparticles@3.3.0/tsparticles.bundle.min.js";
      script.async = true;
      script.onload = initParticles;
      document.head.appendChild(script);
    } else {
      initParticles();
    }
  }, []);

  // Pre-computed star positions to avoid hydration issues
  const tinyStars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    top: ((i * 37 + 13) % 100),
    left: ((i * 53 + 7) % 100),
    delay: ((i * 0.17) % 5).toFixed(2),
    duration: (2 + (i * 0.13) % 3).toFixed(2),
    size: 1 + (i % 2),
  }));

  const mediumStars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: ((i * 61 + 23) % 100),
    left: ((i * 43 + 17) % 100),
    delay: ((i * 0.23) % 6).toFixed(2),
    duration: (3 + (i * 0.19) % 4).toFixed(2),
  }));

  const glowStars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: ((i * 71 + 31) % 90),
    left: ((i * 67 + 11) % 90),
    delay: ((i * 0.41) % 4).toFixed(2),
    duration: (4 + (i * 0.3) % 5).toFixed(2),
    color: ['#a78bfa', '#60a5fa', '#34d399', '#fff', '#fff', '#f9a8d4'][i % 6],
  }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="branding-hero-wrapper">
        <div className="space-bg">
          {/* Deep nebula layers */}
          <div className="nebula nebula-purple" />
          <div className="nebula nebula-blue" />
          <div className="nebula nebula-teal" />
          <div className="nebula nebula-dark-center" />

          {/* Tiny stars layer */}
          <div className="stars-layer">
            {tinyStars.map(s => (
              <div
                key={s.id}
                className="star star-tiny"
                style={{
                  top: s.top + '%',
                  left: s.left + '%',
                  width: s.size + 'px',
                  height: s.size + 'px',
                  animationDelay: s.delay + 's',
                  animationDuration: s.duration + 's',
                }}
              />
            ))}
          </div>

          {/* Medium stars layer */}
          <div className="stars-layer stars-drift">
            {mediumStars.map(s => (
              <div
                key={s.id}
                className="star star-medium"
                style={{
                  top: s.top + '%',
                  left: s.left + '%',
                  animationDelay: s.delay + 's',
                  animationDuration: s.duration + 's',
                }}
              />
            ))}
          </div>

          {/* Large glowing stars */}
          <div className="stars-layer">
            {glowStars.map(s => (
              <div
                key={s.id}
                className="star star-glow"
                style={{
                  top: s.top + '%',
                  left: s.left + '%',
                  animationDelay: s.delay + 's',
                  animationDuration: s.duration + 's',
                  '--glow-color': s.color,
                } as any}
              />
            ))}
          </div>

          {/* Shooting stars */}
          <div className="shooting-stars">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={"shooting-star shooting-star-" + (i + 1)} />
            ))}
          </div>

          {/* Milky way band */}
          <div className="milky-way" />
        </div>
        
        {/* Interactive tsParticles layer */}
        <div 
          id="tsparticles-bg" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
        
        <div className="branding-hero-layout">
            <aside className="branding-sidebar">
                <div className="branding-logo-box">
                    <span>D</span>
                </div>
                <div className="branding-vertical-text">
                    CREATIVE DIGITAL STUDIO
                </div>
                <div className="branding-hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </aside>

            <main className="branding-main-content">
                <div className="branding-hero-text">
                    <h1>Branding<br/>Experience</h1>
                    <p className="branding-subtitle">BRANDING / PACKAGING</p>
                </div>
                
                <div className="branding-menu-block">
                    <ul>
                        <li><span className="branding-number">1</span><span className="branding-line"></span><span>Design</span></li>
                        <li><span className="branding-number">2</span><span className="branding-line"></span><span>Branding</span></li>
                        <li><span className="branding-number">3</span><span className="branding-line"></span><span>Marketing</span></li>
                    </ul>
                </div>
            </main>
        </div>
      </div>
    </>
  );
}
