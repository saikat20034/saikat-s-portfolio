import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Services from './components/Services';
import TechMarquee from './components/TechMarquee';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CursorGlow from './components/CursorGlow';
import { stats } from './data/content';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-ink-900 relative selection:bg-brass-500/30 selection:text-paper">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Stats items={stats} />
        <About />
        <Services />
        <TechMarquee />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
