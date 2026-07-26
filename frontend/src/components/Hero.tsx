import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  },
};

const MotionLink = motion(Link);

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 150 + 50;
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-6 z-10"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-md text-label-md mb-6"
          >
            NEW: v4.0 RELEASED
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="font-display-lg text-display-lg text-text-heading mb-6 tracking-tight leading-tight"
          >
            Manage Projects with{" "}
            <span className="text-primary italic">Kinetic Speed</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-body-lg text-body-lg text-text-body mb-10 max-w-[512px]"
          >
            The enterprise-grade project hub designed for high-performance
            teams. Consolidate architecture, real-time data, and global
            collaboration into one unified workspace.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-md">
            <MotionLink
              to="/register"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 20px -3px rgba(0, 74, 198, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-button-text text-button-text shadow-lg cursor-pointer text-center"
            >
              Start Your Free Trial
            </MotionLink>
            <motion.button
              whileHover={{
                scale: 1.03,
                backgroundColor: "var(--color-surface-container-low)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-sm bg-surface-main text-primary border border-border-subtle px-8 py-4 rounded-xl font-button-text text-button-text shadow-sm transition-colors cursor-pointer"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>
        <div className="md:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 3, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.25 }}
            whileHover={{ y: -8, rotate: -0.5, scale: 1.01 }}
            className="glass-card rounded-2xl p-4 shadow-xl border-border-subtle/50 animate-float cursor-pointer"
          >
            <img
              className="rounded-xl shadow-inner w-full h-auto"
              alt="A clean, high-fidelity user interface dashboard of a project management software. The layout features a dense multi-column bento grid showing real-time Gantt charts, team velocity graphs, and colorful task cards."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ls_znhOCjPDDyWwHHo1Lo8jVtDi-NkR_1gzQ-b6AJc1WiT7oSkSck7YV9QqrQ-D1wjoflXViVixQDYY-RWKHsSDa3ZdyhTpOzEpCU9CG-u6lc3xXxZ-QcC-nhfe3KSa4ODSzb05xCI-RaX53kZIUs6F7b9lSSg5I3dLyMK8H_XRbtpSwWc4ABfmDOCuRNKk5cAa0ph6yXKB5ojeITFyFkhvs-T1BTsCT6ujVpeTeEGs4YQzVq7EpH2gbZeV1bQHP_U9hroSA-ig"
            />
          </motion.div>
          <motion.div
            initial={{ x: -50, y: 30, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 90,
              damping: 14,
            }}
            whileHover={{ y: -5, scale: 1.04 }}
            className="absolute -bottom-8 -left-8 glass-card rounded-xl p-6 shadow-2xl -rotate-2 w-64 hidden lg:block cursor-pointer z-20"
          >
            <div className="flex items-center gap-md mb-4">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  bolt
                </span>
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
          </motion.div>
        </div>
      </div>
      {/* Atmospheric micro-particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        id="hero-particles"
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, Math.random() * 60 - 30, Math.random() * -60 + 30, 0],
              y: [0, Math.random() * 60 - 30, Math.random() * -60 + 30, 0],
            }}
            transition={{
              duration: parseFloat(p.duration) || 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute bg-primary/10 rounded-full blur-xl"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
            }}
          />
        ))}
      </div>
    </section>
  );
}

