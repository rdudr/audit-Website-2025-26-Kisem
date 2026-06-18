import { motion } from 'framer-motion';

export default function LaalMinarBanner() {
  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(380px, 50vh, 550px)',
        background: '#020818',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/laal_minar.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          backgroundRepeat: 'no-repeat',
        }} 
      />

      {/* Top Gradient Blend (into Contact's bottom background #0b1528) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, #0b1528 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} 
      />

      {/* Bottom Gradient Blend (into Footer's top background #020818) */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, #020818 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} 
      />

      {/* Side Vignette Blend to ensure soft horizontal edges */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 20%, rgba(2, 8, 24, 0.4) 60%, #020818 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} 
      />

      {/* Label Content Overlay */}
      <div 
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          width: '90%',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div 
            style={{
              fontSize: '0.75rem',
              color: '#00e5a0',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            KISEM Secretariat Campus
          </div>
          <h3 
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            IIT Gandhinagar
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
