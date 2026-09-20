import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, CheckCircle2, ArrowDown, Layers, LayoutGrid, Cpu, Shield, Activity } from 'lucide-react';
import { HERO_DATA, HOME_PILLARS_DATA } from '../data/portfolioData';
import { ScrollReveal3D } from './ScrollReveal3D';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Canvas radar animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 800);

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const spacing = 28;
    let frame = 0;
    let animationId: number;

    const draw = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
      frame++;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const intensity = 1 - dist / 140;
            ctx.fillStyle = `rgba(15, 107, 245, ${intensity * 0.45})`;
            ctx.fillRect(x - 1, y - 1, 3, 3);
          } else if ((i + j) % 6 === 0) {
            const pulse = (Math.sin(frame * 0.02 + i + j) + 1) * 0.5;
            ctx.fillStyle = `rgba(63, 63, 70, ${0.15 + pulse * 0.15})`;
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Pillar scroll detector for active sidebar state
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 120 : 180;
      pillarRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom >= offset) {
          setActivePillarIdx(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPillar = (idx: number) => {
    setActivePillarIdx(idx);
    const target = pillarRefs.current[idx];
    if (target) {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? -75 : -110;
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const getPillarIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Shield className="w-4 h-4 text-[#0f6bf5]" />;
      case 1:
        return <Cpu className="w-4 h-4 text-[#0f6bf5]" />;
      case 2:
        return <Activity className="w-4 h-4 text-[#0f6bf5]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#0f6bf5]" />;
    }
  };

  return (
    <section id="hero" className="relative bg-[#0E0B08] py-10 sm:py-16 md:py-20 border-b border-[#27272A] w-full">
      {/* Interactive Background Canvas & Scanner */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-[650px] pointer-events-none opacity-40 z-0"
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[#0f6bf5]/5 to-transparent pointer-events-none radar-line z-0" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 space-y-12 sm:space-y-16">
        {/* HERO INTRO & POSITIONING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Terminal Flag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#161412]/90 backdrop-blur-sm border border-[#27272A] rounded-[2px] shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#0f6bf5] rounded-none"></span>
              <span className="font-mono text-[11px] text-[#0f6bf5] uppercase tracking-wider font-semibold">
                {HERO_DATA.tagline}
              </span>
            </div>

            {/* Name & Title */}
            <div className="space-y-2">
              <h1 className="font-sans text-[36px] sm:text-[44px] md:text-[52px] font-extrabold text-white tracking-tight leading-[1.08]">
                {HERO_DATA.name}
              </h1>
              <p className="font-mono text-[14px] sm:text-[16px] text-[#9CA3AF] font-medium tracking-tight">
                {HERO_DATA.role}
              </p>
            </div>

            {/* Engineering Mission */}
            <p className="font-sans text-[15px] sm:text-[16px] text-[#e9e1db] max-w-xl leading-relaxed">
              {HERO_DATA.positioning}
            </p>

            {/* Quick Proof Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1 font-mono max-w-lg">
              <div className="p-3 bg-[#161412] border border-[#27272A] rounded-[2px]">
                <span className="text-[11px] text-[#71717A] block">// FOCUS</span>
                <span className="text-[13px] sm:text-[14px] font-bold text-white">Systems &amp; FOSS</span>
              </div>
              <div className="p-3 bg-[#161412] border border-[#27272A] rounded-[2px]">
                <span className="text-[11px] text-[#71717A] block">// STATUS</span>
                <span className="text-[13px] sm:text-[14px] font-bold text-[#10B981]">GSSoC &apos;25/&apos;26</span>
              </div>
              <div className="p-3 bg-[#161412] border border-[#27272A] rounded-[2px]">
                <span className="text-[11px] text-[#71717A] block">// TARGET</span>
                <span className="text-[13px] sm:text-[14px] font-bold text-[#0f6bf5]">SWE 2025/26</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-[12px] sm:text-[13px]">
              <a
                href="#projects"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0f6bf5] text-white rounded-[2px] font-semibold uppercase tracking-wider fast-trans hover:ring-2 hover:ring-[#0f6bf5]/40 active:scale-95 inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>VIEW PROJECTS</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href={HERO_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#161412] text-white border border-[#27272A] hover:border-[#0f6bf5] rounded-[2px] font-medium uppercase tracking-wider fast-trans active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>GITHUB</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
              </a>
            </div>
          </div>

          {/* Right Column: Live Telemetry Daemon (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal3D delay={120}>
              <div className="p-4 sm:p-5 bg-[#161412] border border-[#27272A] rounded-[2px] space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="font-mono text-[11px] text-white font-semibold uppercase tracking-wider">
                      daemon_telemetry.sys
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717A]">PID: 4082</span>
                </div>

                <div className="space-y-2 font-mono text-[11px] sm:text-[12px]">
                  <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                    <span className="text-[#71717A]">ARCHETYPE:</span>
                    <span className="text-white font-medium">Distributed &amp; Low-Latency</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                    <span className="text-[#71717A]">ACTIVE TARGET:</span>
                    <span className="text-[#10B981] font-semibold">GPO-CIS / Privacy Pipeline</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                    <span className="text-[#71717A]">THROUGHPUT:</span>
                    <span className="text-white font-medium">1.2M events/sec benchmark</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                    <span className="text-[#71717A]">NETWORK BOUNDARY:</span>
                    <span className="text-[#0f6bf5]">0ms External Egress</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#71717A]">UPTIME: 99.98%</span>
                  <span className="text-[#10B981] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SYSTEM HEALTHY
                  </span>
                </div>
              </div>
            </ScrollReveal3D>

            {/* Quick Proof Pills */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 bg-[#1A1A1A] border border-[#27272A] rounded-[2px]">
                <span className="text-[#71717A] block text-[10px]">// FELLOWSHIPS</span>
                <span className="text-white font-semibold">GSSoC &apos;25/&apos;26 • OSCI</span>
              </div>
              <div className="p-2.5 bg-[#1A1A1A] border border-[#27272A] rounded-[2px]">
                <span className="text-[#71717A] block text-[10px]">// EDUCATION</span>
                <span className="text-white font-semibold">ABES EC (B.Tech SWE)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 CORE CAPABILITY PILLARS (STACKING DECK ON HOME) */}
        <div className="pt-6 border-t border-[#27272A] space-y-6 sm:space-y-8">
          {/* Header & Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272A] pb-4">
            <div>
              <span className="font-mono text-[11px] text-[#0f6bf5] tracking-wider uppercase font-semibold">
                // 01. CORE SPECIALIZATIONS &amp; ARCHITECTURAL PILLARS
              </span>
              <h2 className="font-sans text-[20px] sm:text-[24px] md:text-[28px] font-bold text-white tracking-tight mt-0.5">
                Technical Focus &amp; Capability Deck
              </h2>
            </div>

            {/* Toggle between Stack Deck and Grid */}
            <div className="flex items-center gap-1 p-1 bg-[#161412] border border-[#27272A] rounded-[2px] self-start sm:self-auto shrink-0">
              <button
                onClick={() => setViewMode('stack')}
                className={`px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider rounded-[2px] fast-trans flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'stack'
                    ? 'bg-[#0f6bf5] text-white shadow-sm'
                    : 'text-[#71717A] hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 shrink-0" />
                <span>STACK DECK</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider rounded-[2px] fast-trans flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0f6bf5] text-white shadow-sm'
                    : 'text-[#71717A] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3 shrink-0" />
                <span>GRID</span>
              </button>
            </div>
          </div>

          {viewMode === 'stack' ? (
            /* STACKING DECK VIEW (Exact Match to Projects.tsx) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Sticky Sidebar (4 cols on desktop) */}
              <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-5 self-start">
                <div className="p-5 bg-[#161412] border border-[#27272A] rounded-[2px] space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                    <span className="font-mono text-[11px] text-[#0f6bf5] tracking-wider uppercase font-semibold">
                      // SPECIALIZATION INDEX
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A]">
                      {String(activePillarIdx + 1).padStart(2, '0')} / {String(HOME_PILLARS_DATA.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {HOME_PILLARS_DATA.map((pillar, idx) => {
                      const isActive = activePillarIdx === idx;
                      return (
                        <button
                          key={pillar.id}
                          onClick={() => scrollToPillar(idx)}
                          className={`w-full text-left px-3 py-2.5 rounded-[2px] font-mono text-[12px] fast-trans flex items-center justify-between group cursor-pointer ${
                            isActive
                              ? 'bg-[#0f6bf5]/15 border border-[#0f6bf5] text-white'
                              : 'text-[#71717A] hover:text-white hover:bg-[#1A1A1A] border border-transparent'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">
                            0{idx + 1}. {pillar.title}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-none shrink-0 ${
                              isActive ? 'bg-[#0f6bf5]' : 'bg-[#27272A] group-hover:bg-[#71717A]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#27272A] font-mono text-[11px] text-[#71717A] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span>Scroll down to stack capability cards</span>
                  </div>
                </div>
              </div>

              {/* Stacking Pillar Cards Container (8 cols on desktop) */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8 md:space-y-12 pb-16">
                {HOME_PILLARS_DATA.map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    ref={(el) => (pillarRefs.current[idx] = el)}
                    className="sticky top-[68px] sm:top-[76px] lg:top-[108px] transition-transform duration-300"
                    style={{
                      zIndex: 10 + idx,
                    }}
                  >
                    <ScrollReveal3D enableMouseTilt={true} intensity={0.9}>
                      <div className="w-full bg-[#161412] border border-[#27272A] hover:border-[#0f6bf5] rounded-[2px] p-5 sm:p-7 md:p-8 card-interactive group relative overflow-hidden shadow-[0_-8px_32px_rgba(0,0,0,0.85)] backdrop-blur-md">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 border-b border-[#27272A] pb-3 sm:pb-4">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <span className="font-mono text-[12px] sm:text-[13px] font-bold text-[#0f6bf5]">
                              0{idx + 1}.
                            </span>
                            <span className="font-mono text-[11px] text-[#71717A] tracking-wider font-semibold">
                              {pillar.num}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-[10px] font-semibold uppercase tracking-wider rounded-[2px]">
                            {pillar.statusTag}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2.5">
                            {getPillarIcon(idx)}
                            <h3 className="font-sans text-[20px] sm:text-[22px] md:text-[24px] font-bold text-white group-hover:text-[#b1c5ff] fast-trans tracking-tight leading-snug">
                              {pillar.title}
                            </h3>
                          </div>

                          <p className="font-sans text-[14px] sm:text-[15px] text-[#9CA3AF] leading-relaxed">
                            {pillar.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {pillar.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 bg-[#0E0B08] border border-[#27272A] rounded-[2px] font-mono text-[11px] text-[#9CA3AF]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Metrics Bar & Link */}
                        <div className="pt-4 mt-5 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] sm:text-[12px]">
                          <div className="flex items-center gap-4 text-[#71717A]">
                            {pillar.metrics.map((m, mIdx) => (
                              <span key={mIdx} className="text-[#10B981] font-semibold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {m}
                              </span>
                            ))}
                          </div>

                          <a
                            href="#projects"
                            className="text-white hover:text-[#0f6bf5] inline-flex items-center gap-1.5 fast-trans font-semibold uppercase tracking-wider"
                          >
                            <span>EXPLORE IN PROJECTS</span>
                            <ArrowDown className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </ScrollReveal3D>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* GRID MATRIX VIEW */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {HOME_PILLARS_DATA.map((pillar, idx) => (
                <ScrollReveal3D key={pillar.id} delay={idx * 60}>
                  <div className="h-full bg-[#161412] border border-[#27272A] hover:border-[#0f6bf5] rounded-[2px] p-5 flex flex-col justify-between card-interactive group shadow-md">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#71717A] font-semibold">
                          0{idx + 1}. {pillar.num.split('//')[0].trim()}
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#10B981]/15 text-[#10B981] font-mono text-[9px] font-semibold uppercase tracking-wider rounded-[2px]">
                          {pillar.statusTag}
                        </span>
                      </div>

                      <h3 className="font-sans text-[16px] sm:text-[17px] font-bold text-white group-hover:text-[#b1c5ff] fast-trans leading-snug">
                        {pillar.title}
                      </h3>

                      <p className="font-sans text-[13px] text-[#9CA3AF] leading-relaxed">
                        {pillar.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {pillar.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 bg-[#0E0B08] border border-[#27272A] rounded-[2px] font-mono text-[10px] text-[#9CA3AF]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#27272A] flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#10B981] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {pillar.metrics[0]}
                      </span>
                      <a
                        href="#projects"
                        className="text-white hover:text-[#0f6bf5] inline-flex items-center gap-1 fast-trans"
                      >
                        <span>Explore</span>
                        <ArrowDown className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal3D>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
