import { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import YearInNumbers from './components/YearInNumbers';
import AssessmentFunnel from './components/AssessmentFunnel';
import ScopeOfAssessment from './components/ScopeOfAssessment';
import TopProjects from './components/TopProjects';
import BaselineEnergy from './components/BaselineEnergy';
import Instruments from './components/Instruments';
import Partnerships from './components/Partnerships';
import Team from './components/Team';
import Contact from './components/Contact';
import LaalMinarBanner from './components/LaalMinarBanner';
import Footer from './components/Footer';
import LoadingSkeleton from './components/LoadingSkeleton';

// Lazy load heavy interactive components to drastically reduce initial bundle size
const AuditMap = lazy(() => import('./components/AuditMap'));
const FourYearJourney = lazy(() => import('./components/FourYearJourney'));
const EnergySavings = lazy(() => import('./components/EnergySavings'));
const IndustryVerticals = lazy(() => import('./components/IndustryVerticals'));
const RoiScatter = lazy(() => import('./components/RoiScatter'));
const PaidAudits = lazy(() => import('./components/PaidAudits'));


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
          <Suspense fallback={<LoadingSkeleton height="550px" label="Loading interactive audit map" isLightTheme />}>
            <AuditMap />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton height="450px" label="Loading 4-year journey trends" isLightTheme />}>
            <FourYearJourney />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton height="450px" label="Loading energy savings analysis" isLightTheme />}>
            <EnergySavings />
          </Suspense>
          <Suspense fallback={<LoadingSkeleton height="450px" label="Loading industry vertical breakdown" isLightTheme />}>
            <IndustryVerticals />
          </Suspense>
          <AssessmentFunnel />
          <ScopeOfAssessment />
          <Suspense fallback={<LoadingSkeleton height="450px" label="Loading ROI scatter plot" isLightTheme />}>
            <RoiScatter />
          </Suspense>
          <TopProjects />
          <BaselineEnergy />
          <Suspense fallback={<LoadingSkeleton height="400px" label="Loading audit comparison details" isLightTheme />}>
            <PaidAudits />
          </Suspense>
          <Instruments />
          <Team />
          <Partnerships />
          <Contact />
        </div>
        <LaalMinarBanner />
      </main>
      <Footer />
    </div>
  );
}
