import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown, Play, Map } from 'lucide-react';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

const HEADLINE = ['Measuring the Energy', 'of an Industrial State'];

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const chars = headlineRef.current.querySelectorAll('.char');
    gsap.fromTo(chars,
      { y: 60, opacity: 0, rotateX: -40 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.4,
      }
    );
  }, []);

  const handleScrollToKpi = () => {
    document.querySelector('#kpi')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToMap = () => {
    document.querySelector('#map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Full-screen video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Subtle vignette only at edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2, 8, 24, 0.7) 100%)',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to top, #020818, transparent)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div
        className="section-container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            background: 'rgba(0, 229, 160, 0.12)',
            border: '1px solid rgba(0, 229, 160, 0.3)',
            borderRadius: 100,
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', display: 'block' }} className="pulse-glow" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00e5a0' }}>
            Annual Report FY 2025-26
          </span>
        </motion.div>

        {/* Animated headline */}
        <div
          ref={headlineRef}
          style={{
            perspective: '1000px',
            marginBottom: '1.5rem',
          }}
        >
          {HEADLINE.map((line, li) => (
            <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0 0.3rem',
                paddingBottom: '0.1em',
              }}>
                {line.split(' ').map((word, wi) => (
                  <span key={wi} style={{ display: 'inline-flex', gap: '0' }}>
                    {word.split('').map((char, ci) => (
                      <span
                        key={ci}
                        className="char"
                        style={{
                          display: 'inline-block',
                          opacity: 0,
                        }}
                      >
                        {char}
                      </span>
                    ))}
                    <span className="char" style={{ display: 'inline-block', opacity: 0 }}>&nbsp;</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          style={{
            maxWidth: 520,
            marginBottom: '2.5rem',
          }}
        >
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '0.5rem', fontWeight: 400 }}>
            <strong style={{ color: '#fff' }}>60 detailed audits.</strong>{' '}
            <strong style={{ color: '#00e5a0' }}>₹33.85 crore savings identified.</strong>{' '}
            <strong style={{ color: '#60a5fa' }}>59,208 tonnes of CO₂ reduction potential.</strong>
          </p>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Transforming MSMEs across Gujarat, Rajasthan and Daman.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem', alignItems: 'center' }}
        >
          <button id="cta-explore" onClick={handleScrollToKpi} className="btn-primary">
            <Play size={16} fill="currentColor" />
            Explore Impact
          </button>
          <button id="cta-map" onClick={handleScrollToMap} className="btn-glass">
            <Map size={16} />
            View Audit Map
          </button>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfeadTKCwRTvHE4xfaucn2SZ8SN00jFp-2lOI_qiD4C9Jfziw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              backgroundColor: '#00e5a0',
              color: '#0f172a',
              fontWeight: 600,
              padding: '0.75rem 1.5rem',
              borderRadius: 100,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 229, 160, 0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'none';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Apply Audit
          </a>
        </motion.div>

        {/* Floating glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, type: 'spring', stiffness: 100 }}
          className="float"
          style={{
            display: 'flex',
            gap: '1px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {[
            { value: '132', label: 'Assessments' },
            { value: '60', label: 'Detailed Audits' },
            { value: '37', label: 'Industrial Clusters' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem 1.75rem',
                background: i === 1 ? 'rgba(0, 229, 160, 0.12)' : 'rgba(255,255,255,0.05)',
                textAlign: 'center',
                minWidth: 100,
              }}
            >
              <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: i === 1 ? '#00e5a0' : '#fff', letterSpacing: '-0.04em' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Partner logos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14,
          padding: '0.75rem 1.25rem',
        }}
      >
        <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Executed by</span>
        <img src="/iitgn_Logo.png" alt="IIT Gandhinagar" style={{ height: 28, objectFit: 'contain', filter: 'brightness(1.2)' }} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={handleScrollToKpi}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <span style={{ fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Scroll</span>
        <ChevronDown size={18} className="scroll-indicator" />
      </motion.div>
    </section>
  );
}
