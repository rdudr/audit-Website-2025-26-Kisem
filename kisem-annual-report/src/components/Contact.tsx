import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', org: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to backend/email service
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-padding" style={{
      background: 'linear-gradient(180deg, #020818 0%, #0b1528 100%)',
      position: 'relative',
      overflow: 'hidden',
      '--color-bg': '#020818',
      '--color-bg-2': '#0b1528',
      '--color-bg-3': '#0a1628',
      '--color-surface': 'rgba(255, 255, 255, 0.04)',
      '--color-surface-2': 'rgba(255, 255, 255, 0.08)',
      '--color-text': '#ffffff',
      '--color-text-2': 'rgba(255, 255, 255, 0.7)',
      '--color-text-3': 'rgba(255, 255, 255, 0.45)',
      '--color-border': 'rgba(255, 255, 255, 0.1)',
      '--color-border-2': 'rgba(255, 255, 255, 0.06)',
      '--glass-bg': 'rgba(255, 255, 255, 0.05)',
      '--glass-border': 'rgba(255, 255, 255, 0.12)',
    } as React.CSSProperties}>
      {/* Background elements */}
      <div className="glow-orb" style={{
        width: 700,
        height: 700,
        background: 'radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(0,102,255,0.05) 0%, transparent 60%)',
      }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Ready to Transform Your{' '}
            <span className="gradient-text">Energy Future?</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center', maxWidth: 680 }}>
            Whether you're an MSME looking for an energy audit, an industrial cluster association, 
            or a CSR partner — KISEM is here to help.
          </p>
        </div>

        {/* CTA Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '4rem',
        }}>
          {[
            {
              icon: '🔍',
              title: 'Request Audit',
              desc: 'Get a free walkthrough assessment for your industrial facility',
              cta: 'Apply for Audit',
              color: '#00e5a0',
              primary: true,
              href: 'https://docs.google.com/forms/d/e/1FAIpQLSfeadTKCwRTvHE4xfaucn2SZ8SN00jFp-2lOI_qiD4C9Jfziw/viewform',
              target: '_blank',
            },
            {
              icon: '🤝',
              title: 'Partner With Us',
              desc: 'Join as a CSR partner, knowledge partner, or implementation agency',
              cta: 'Explore Partnership',
              color: '#60a5fa',
              primary: false,
              href: '#contact',
              target: undefined,
            },
            {
              icon: '📄',
              title: 'Download Report',
              desc: 'Download the full KISEM Annual Report FY 2025-26 in PDF format',
              cta: 'Download PDF',
              color: '#f59e0b',
              primary: false,
              href: '/KISEM-Annual-Report-2025-26.pdf',
              target: '_blank',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{
                background: card.primary ? `linear-gradient(135deg, rgba(0,229,160,0.15), rgba(0,102,255,0.1))` : 'var(--color-surface)',
                border: `1px solid ${card.color}30`,
                borderRadius: 20,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{card.icon}</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>{card.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-2)', lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
              <a
                href={card.href}
                target={card.target}
                rel={card.target ? "noopener noreferrer" : undefined}
                className={card.primary ? 'btn-primary' : 'btn-glass'}
                style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
              >
                {card.cta} <ChevronRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Contact form + info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass"
            style={{ padding: '2rem' }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              Send Us a Message
            </h3>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ color: '#00e5a0', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Message Received!
                </h4>
                <p style={{ color: 'var(--color-text-2)', fontSize: '0.875rem' }}>
                  Our team will get back to you within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Rajesh Kumar' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'rajesh@company.com' },
                  { key: 'org', label: 'Organization', type: 'text', placeholder: 'Company / Cluster / Institute' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-2)', display: 'block', marginBottom: '0.4rem' }}>
                      {field.label}
                    </label>
                    <input
                      id={`contact-${field.key}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formState[field.key as keyof typeof formState]}
                      onChange={e => setFormState(prev => ({ ...prev, [field.key]: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        color: 'var(--color-text)',
                        fontSize: '0.9375rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(0,229,160,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-2)', display: 'block', marginBottom: '0.4rem' }}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell us about your facility, industry sector, and energy challenges..."
                    rows={4}
                    value={formState.message}
                    onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                      color: 'var(--color-text)',
                      fontSize: '0.9375rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,229,160,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message <ChevronRight size={16} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                Contact Details
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-2)', lineHeight: 1.6 }}>
                KISEM is executed by IIT Gandhinagar in collaboration with IIT Madras / IEAC, 
                supported by Kotak Mahindra Bank's CSR initiative.
              </p>
            </div>

            {[
              { icon: <MapPin size={18} />, label: 'Address', value: 'IIT Gandhinagar, Palaj, Gandhinagar, Gujarat 382055' },
              { icon: <Mail size={18} />, label: 'Email', value: 'kisem@iitgn.ac.in' },
              { icon: <Phone size={18} />, label: 'Phone', value: '+91 79 2395 2001' },
            ].map(info => (
              <div key={info.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(0,229,160,0.1)',
                  border: '1px solid rgba(0,229,160,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00e5a0',
                  flexShrink: 0,
                }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>{info.value}</div>
                </div>
              </div>
            ))}

            {/* Partner logos */}
            <div style={{
              padding: '1.5rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
            }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '1rem' }}>
                Our Partners
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <img src="/iitgn_Logo.png" alt="IIT Gandhinagar" style={{ height: 36, objectFit: 'contain' }} />
                <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM" style={{ height: 36, objectFit: 'contain', borderRadius: 6 }} />
                <img src="/download.png" alt="Kotak" style={{ height: 28, objectFit: 'contain' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
