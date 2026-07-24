import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: string;
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 200 + 50;
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${Math.random() * 20 + 20}s`,
      };
    });
    setParticles(generated);
  }, []);

  return (
    <section className="hero-gradient relative pt-24 pb-32 overflow-hidden">
      <div className="max-w-max-width mx-auto px-margin-desktop grid md:grid-cols-12 gap-xl items-center">
        <div className="md:col-span-6 z-10">
          <span className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-md text-label-md mb-6">
            NEW: v4.0 RELEASED
          </span>
          <h1 className="font-display-lg text-display-lg text-text-heading mb-6 tracking-tight leading-tight">
            Manage Projects with{" "}
            <span className="text-primary italic">Kinetic Speed</span>
          </h1>
          <p className="font-body-lg text-body-lg text-text-body mb-10 max-w-[512px]">
            The enterprise-grade project hub designed for high-performance
            teams. Consolidate architecture, real-time data, and global
            collaboration into one unified workspace.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link
              to="/register"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-button-text text-button-text shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              Start Your Free Trial
            </Link>
            <button className="flex items-center gap-sm bg-surface-main text-primary border border-border-subtle px-8 py-4 rounded-xl font-button-text text-button-text shadow-sm hover:bg-surface-container-low transition-all cursor-pointer">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              Watch Demo
            </button>
          </div>
        </div>
        <div className="md:col-span-6 relative">
          <div className="glass-card rounded-2xl p-4 shadow-xl rotate-1 border-border-subtle/50 animate-float">
            <img
              className="rounded-xl shadow-inner w-full h-auto"
              alt="A clean, high-fidelity user interface dashboard of a project management software. The layout features a dense multi-column bento grid showing real-time Gantt charts, team velocity graphs, and colorful task cards."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ls_znhOCjPDDyWwHHo1Lo8jVtDi-NkR_1gzQ-b6AJc1WiT7oSkSck7YV9QqrQ-D1wjoflXViVixQDYY-RWKHsSDa3ZdyhTpOzEpCU9CG-u6lc3xXxZ-QcC-nhfe3KSa4ODSzb05xCI-RaX53kZIUs6F7b9lSSg5I3dLyMK8H_XRbtpSwWc4ABfmDOCuRNKk5cAa0ph6yXKB5ojeITFyFkhvs-T1BTsCT6ujVpeTeEGs4YQzVq7EpH2gbZeV1bQHP_U9hroSA-ig"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 glass-card rounded-xl p-6 shadow-2xl -rotate-2 w-64 hidden lg:block">
            <div className="flex items-center gap-md mb-4">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white">bolt</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-text-body">
                  System Velocity
                </p>
                <p className="font-title-md text-title-md text-primary">
                  +24% Increase
                </p>
              </div>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary w-3/4 h-full"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Atmospheric micro-particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        id="hero-particles"
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-primary/10 rounded-full blur-xl animate-[float-particle_20s_infinite_linear_alternate]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </section>
  );
}
