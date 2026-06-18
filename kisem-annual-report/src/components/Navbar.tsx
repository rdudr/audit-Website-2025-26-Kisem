import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Impact', href: '#kpi' },
  { label: 'Map', href: '#map' },
  { label: 'Journey', href: '#journey' },
  { label: 'Analysis', href: '#analysis' },
  { label: 'Projects', href: '#projects' },
  { label: 'Partners', href: '#partners' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 400,
          width: 'calc(100% - 2rem)',
          maxWidth: 1200,
          borderRadius: 100,
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(3, 10, 25, 0.85)'
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: scrolled
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.4s ease',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM" style={{ height: 32, width: 32, objectFit: 'contain', borderRadius: 6 }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f0f4ff', letterSpacing: '-0.01em' }}>KISEM</div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(240,244,255,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Annual Report 2025-26</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(240,244,255,0.7)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                padding: '0.5rem 0.875rem',
                borderRadius: 100,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = '#f0f4ff';
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.7)';
                (e.target as HTMLElement).style.background = 'none';
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); handleNav('#contact'); }}
            className="btn-primary hidden-mobile"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
          >
            Request Audit <ChevronRight size={14} />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#f0f4ff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 80,
              left: '1rem',
              right: '1rem',
              zIndex: 399,
              background: 'rgba(3, 10, 25, 0.95)',
              backdropFilter: 'blur(24px)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(240,244,255,0.8)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.875rem 1rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.target as HTMLElement).style.color = '#f0f4ff';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = 'none';
                  (e.target as HTMLElement).style.color = 'rgba(240,244,255,0.8)';
                }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0.5rem 0' }} />
            <button
              onClick={() => handleNav('#contact')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Request Audit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
