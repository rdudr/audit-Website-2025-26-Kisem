import React from 'react';
import './ReflectiveCard.css';
import { Lock } from 'lucide-react';

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
  name: string;
  role: string;
  email?: string;
  idNumber?: string;
  photo?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
}

const ReflectiveCard = ({
  blurStrength = 1,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 15,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 0.2,
  glassDistortion = 0,
  className = '',
  style = {},
  name,
  role,
  email,
  idNumber,
  photo,
  badgeText,
  badgeIcon
}: ReflectiveCardProps) => {
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  } as React.CSSProperties;

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {photo ? (
        <img src={photo} alt={name} className="reflective-photo" />
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          zIndex: 0
        }} />
      )}

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            {badgeIcon || <Lock size={12} className="security-icon" />}
            <span>{badgeText || 'SECURE ACCESS'}</span>
          </div>
          <img 
            src="/iitgn_Logo.png" 
            alt="IITGN Logo" 
            className="status-icon" 
            style={{ 
              width: '20px', 
              height: '20px', 
              objectFit: 'contain', 
              opacity: 0.9,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
            }} 
          />
        </div>

        <div className="card-body">
          <div className="user-info">
            <h2 className="user-name">{name}</h2>
            <p className="user-role">{role}</p>
            {email && (
              <p className="user-email" style={{
                fontSize: '0.75rem',
                opacity: 0.7,
                marginTop: '0.35rem',
                textTransform: 'none',
                wordBreak: 'break-all',
                color: 'var(--text-color, white)'
              }}>
                {email}
              </p>
            )}
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">MEMBER ID</span>
            <span className="value">{idNumber || 'IITGN-KISEM'}</span>
          </div>
          <div className="fingerprint-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="/kotak_iit_madras_save_energy_mission_logo.jpg" 
              alt="KISEM" 
              style={{ 
                width: 28, 
                height: 28, 
                objectFit: 'contain', 
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                opacity: 0.85
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
