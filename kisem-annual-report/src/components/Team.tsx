import { motion } from 'framer-motion';
import ReflectiveCard from './ReflectiveCard';
import { GraduationCap, ClipboardCheck, Gauge, Zap, Thermometer, Sun, Cpu } from 'lucide-react';

const FACULTY_TEAM = [
  {
    name: 'Dr. Naran Pindoriya',
    role: 'Project Coordinator, IITGN-KISEM',
    title: 'Professor & Head, Electrical Engineering',
    email: 'naran@iitgn.ac.in',
    id: 'KISEM-FAC-01',
    photo: '/team/Dr. Naran Pindoriya.png',
    badgeText: 'Faculty Member 1',
    badgeIcon: <GraduationCap size={12} className="security-icon" />
  },
  {
    name: 'Dr. Chinmay Ghoroi',
    role: 'B. S. Gelot Chair Professor',
    title: 'Professor, Chemical Engineering',
    email: 'chinmayg@iitgn.ac.in',
    id: 'KISEM-FAC-02',
    photo: '/team/Dr. Chinmay Ghoroi.png',
    badgeText: 'Faculty Member 2',
    badgeIcon: <GraduationCap size={12} className="security-icon" />
  },
  {
    name: 'Mr. S. Rajendran',
    role: 'Associate Teaching Professor',
    title: 'Professor, Electrical Engineering',
    email: 'rajendran@iitgn.ac.in',
    id: 'KISEM-FAC-03',
    photo: '/team/Mr. S. Rajendran.png',
    badgeText: 'Faculty Member 3',
    badgeIcon: <GraduationCap size={12} className="security-icon" />
  },
  {
    name: 'Dr. Atul Bhargav',
    role: 'Professor',
    title: 'Professor, Mechanical Engineering',
    email: 'atul.bhargav@iitgn.ac.in',
    id: 'KISEM-FAC-04',
    photo: '/team/Dr. Atul Bhargav.png',
    badgeText: 'Faculty Member 4',
    badgeIcon: <GraduationCap size={12} className="security-icon" />
  }
];

const AUDIT_TEAM = [
  {
    name: 'Mr. Rahul Patel',
    role: 'Project Manager-II',
    title: 'BEE CEA-30215, GHG Lead Verifier',
    email: 'rahuljayantibhai.p@iitgn.ac.in',
    id: 'KISEM-ENG-01',
    photo: '/team/Mr. Rahul Patel.png',
    badgeText: 'Lead Energy Auditor',
    badgeIcon: <ClipboardCheck size={12} className="security-icon" />
  },
  {
    name: 'Mr. Abhay Singh Maurya',
    role: 'Project Fellow',
    title: 'BEE CEM, M.Tech, EE',
    email: 'abhay.maurya@iitgn.ac.in',
    id: 'KISEM-ENG-02',
    photo: '/team/Mr. Abhay Singh Maurya.jpg',
    badgeText: 'Energy Manager',
    badgeIcon: <Gauge size={12} className="security-icon" />
  },
  {
    name: 'Mr. Md Faizan',
    role: 'Project Fellow',
    title: 'M.Tech, EE',
    email: 'md.faizan@iitgn.ac.in',
    id: 'KISEM-ENG-03',
    photo: '/team/Md. Faizan.png',
    badgeText: 'Electrical Expert',
    badgeIcon: <Zap size={12} className="security-icon" />
  },
  {
    name: 'Mr. Sagar Loriya',
    role: 'Project Assistant-III',
    title: 'B.E. Mechanical',
    email: 'loriyasagar.b@iitgn.ac.in',
    id: 'KISEM-ENG-04',
    photo: '/team/Mr. Sagar Loriya.jpg',
    badgeText: 'Thermal Expert',
    badgeIcon: <Thermometer size={12} className="security-icon" />
  },
  {
    name: 'Mr. Dhruvit Patel',
    role: 'Project Assistant-I',
    title: 'PGD Energy Management',
    email: 'dhruvit.patel@iitgn.ac.in',
    id: 'KISEM-ENG-05',
    photo: '/team/Dhruvit Patel.png',
    badgeText: 'Solar Expert',
    badgeIcon: <Sun size={12} className="security-icon" />
  },
  {
    name: 'Mr. Rishabh Dangi',
    role: 'Project Assistant-I',
    title: 'B.E. Electrical',
    email: 'rishabh.dangi@iitgn.ac.in',
    id: 'KISEM-ENG-06',
    photo: '/team/Mr. Rishabh Dangi.jpg',
    badgeText: 'AI Automation',
    badgeIcon: <Cpu size={12} className="security-icon" />
  }
];

export default function Team() {
  return (
    <section id="team" className="section-padding" style={{ position: 'relative', background: '#020818', color: '#ffffff' }}>
      <div className="section-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Project Team</div>
          <h2 className="section-title" style={{ textAlign: 'center', color: '#ffffff' }}>
            Meet Our <span className="gradient-text">Experts & Engineers</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            The driving force behind KISEM audits, energy conservation studies, and industry implementations at IIT Gandhinagar.
          </p>
        </div>

        {/* Associated Faculty Team */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00e5a0', letterSpacing: '-0.02em' }}>
              Associated Faculty Team
            </h3>
            <span style={{
              fontSize: '0.75rem',
              background: 'rgba(0, 229, 160, 0.1)',
              color: '#00e5a0',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              fontWeight: 600
            }}>
              {FACULTY_TEAM.length} Members
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
            justifyContent: 'center'
          }}>
            {FACULTY_TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <ReflectiveCard
                  name={member.name}
                  role={member.role}
                  email={member.email}
                  idNumber={member.id}
                  photo={member.photo}
                  badgeText={member.badgeText}
                  badgeIcon={member.badgeIcon}
                  overlayColor="rgba(0, 229, 160, 0.04)"
                  blurStrength={0}
                  glassDistortion={6}
                  metalness={0.8}
                  roughness={0.2}
                  displacementStrength={10}
                  noiseScale={0.8}
                  specularConstant={1.4}
                  grayscale={0}
                  color="#ffffff"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Field Management Audit Team */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.02em' }}>
              Field Management Audit Team
            </h3>
            <span style={{
              fontSize: '0.75rem',
              background: 'rgba(96, 165, 250, 0.1)',
              color: '#60a5fa',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              fontWeight: 600
            }}>
              {AUDIT_TEAM.length} Members
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
            justifyContent: 'center'
          }}>
            {AUDIT_TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ReflectiveCard
                  name={member.name}
                  role={member.role}
                  email={member.email}
                  idNumber={member.id}
                  photo={member.photo}
                  badgeText={member.badgeText}
                  badgeIcon={member.badgeIcon}
                  overlayColor="rgba(96, 165, 250, 0.04)"
                  blurStrength={0}
                  glassDistortion={6}
                  metalness={0.8}
                  roughness={0.2}
                  displacementStrength={10}
                  noiseScale={0.8}
                  specularConstant={1.4}
                  grayscale={0}
                  color="#ffffff"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
