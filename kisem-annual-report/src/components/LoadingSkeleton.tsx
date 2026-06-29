import React from 'react';

interface LoadingSkeletonProps {
  height?: string;
  label?: string;
  isLightTheme?: boolean;
}

export default function LoadingSkeleton({
  height = '350px',
  label = 'Loading section',
  isLightTheme = false,
}: LoadingSkeletonProps) {
  const bg = isLightTheme ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)';
  const border = isLightTheme ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)';
  const textColor = isLightTheme ? 'rgba(15, 23, 42, 0.45)' : 'rgba(240, 244, 255, 0.45)';
  const spinnerTrack = isLightTheme ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)';
  const spinnerColor = '#00e5a0';

  return (
    <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: border,
        borderRadius: '24px',
        margin: '2rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer Effect */}
      <div
        className="skeleton-shimmer-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isLightTheme
            ? 'linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.02), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
          width: '100%',
        }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', zIndex: 1 }}>
        {/* Animated Spinner */}
        <div
          className="skeleton-spin-indicator"
          style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '50%',
            border: `3px solid ${spinnerTrack}`,
            borderTopColor: spinnerColor,
          }}
        />
        
        {/* Text Label */}
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: textColor,
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
