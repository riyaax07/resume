import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { OpenSource } from './components/OpenSource';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AudioDemoModal } from './components/AudioDemoModal';
import { Toast } from './components/Toast';
import { ScrollProgressHUD } from './components/ScrollProgressHUD';
import { VelocityTicker } from './components/VelocityTicker';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Project } from './types';

export default function App() {
  // Activate Razorpay-style inertial smooth scrolling via Lenis
  useSmoothScroll();

  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedProjectSpec, setSelectedProjectSpec] = useState<Project | null>(null);
  const [audioDemoOpen, setAudioDemoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleCopyEmail = (email: string) => {
    setToastMessage(`Copied to clipboard: ${email}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  return (
    <div className="bg-[#0E0B08] text-[#e9e1db] font-sans antialiased min-h-screen selection:bg-[#0f6bf5] selection:text-white">
      {/* Razorpay-Style Top Scroll Laser & Floating Telemetry HUD */}
      <ScrollProgressHUD />

      {/* HUD Toast Feedback */}
      <Toast message={toastMessage} show={showToast} />

      {/* Top Navigation */}
      <Navbar onOpenResume={() => setResumeOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative pt-14">
        {/* 00. HERO (HOME WITH STACKING PILLARS) */}
        <Hero />

        {/* Scroll-accelerated ticker */}
        <VelocityTicker />

        {/* 01. ABOUT */}
        <About />

        {/* 02. PROJECTS (ENGINEERED SYSTEMS WITH STACKING CARDS & TRACK INDEX) */}
        <Projects
          onSelectProjectSpec={(project) => setSelectedProjectSpec(project)}
          onOpenAudioDemo={() => setAudioDemoOpen(true)}
        />

        {/* Scroll-accelerated ticker 2 */}
        <VelocityTicker />

        {/* 03. OPEN SOURCE (EXPERIENCES WITH STACKING CARDS & PROGRAM INDEX) */}
        <OpenSource />

        {/* 04. SKILLS & PROFICIENCIES */}
        <Skills />

        {/* 05. CONTACT */}
        <Contact
          onCopyEmail={handleCopyEmail}
          onOpenResume={() => setResumeOpen(true)}
        />
      </main>

      {/* FOOTER */}
      <Footer onOpenResume={() => setResumeOpen(true)} />

      {/* Interactive Modals */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      <ArchitectureModal
        project={selectedProjectSpec}
        onClose={() => setSelectedProjectSpec(null)}
      />

      <AudioDemoModal
        isOpen={audioDemoOpen}
        onClose={() => setAudioDemoOpen(false)}
      />
    </div>
  );
}
