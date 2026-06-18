import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import YearInNumbers from './components/YearInNumbers';
import AuditMap from './components/AuditMap';
import FourYearJourney from './components/FourYearJourney';
import EnergySavings from './components/EnergySavings';
import IndustryVerticals from './components/IndustryVerticals';
import AssessmentFunnel from './components/AssessmentFunnel';
import ScopeOfAssessment from './components/ScopeOfAssessment';
import RoiScatter from './components/RoiScatter';
import TopProjects from './components/TopProjects';
import BaselineEnergy from './components/BaselineEnergy';
import PaidAudits from './components/PaidAudits';
import Instruments from './components/Instruments';
import Partnerships from './components/Partnerships';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020818' }}>
      <Navbar />
      <main>
        <Hero />
        <div className="light-theme">
          <YearInNumbers />
          <AuditMap />
          <FourYearJourney />
          <EnergySavings />
          <IndustryVerticals />
          <AssessmentFunnel />
          <ScopeOfAssessment />
          <RoiScatter />
          <TopProjects />
          <BaselineEnergy />
          <PaidAudits />
          <Instruments />
          <Team />
          <Partnerships />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
