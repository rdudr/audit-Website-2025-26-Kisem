export function Logo({ sub = 'Kotak IIT Madras Save Energy Mission', href = '#top' }: { sub?: string; href?: string }) {
  return (
    <a href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#000000', minWidth: 0 }}>
      {/* The two logos side by side: KISEM, then IIT Gandhinagar, with a thin line between them. */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <img src="/kotak_iit_madras_save_energy_mission_logo.jpg" alt="KISEM" width={36} height={36} style={{ borderRadius: 10, objectFit: 'contain' }} />
        <span aria-hidden="true" style={{ width: 1, height: 24, background: '#D9D9D9' }} />
        <img src="/iitgn_Logo.png" alt="IIT Gandhinagar" width={36} height={36} style={{ objectFit: 'contain' }} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
        <span className="hide-xs" style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>KISEM · IIT Gandhinagar</span>
        <span className="show-xs" style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>KISEM · IITGN</span>
        <span className="hide-sm" style={{ fontSize: 12, color: '#5E5E5E' }}>{sub}</span>
      </span>
    </a>
  );
}
