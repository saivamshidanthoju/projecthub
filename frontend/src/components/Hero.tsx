import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
};

const MotionLink = motion(Link);

export default function Hero() {
  return (
    <section className="hero-gradient relative pt-24 pb-32 overflow-hidden border-b border-border-subtle/50">
      <div className="max-w-max-width mx-auto px-margin-desktop grid md:grid-cols-12 gap-xl items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-6 z-10"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/20 px-3 py-0.5 rounded-full font-label-md text-[11px] font-bold mb-6 tracking-wide select-none"
          >
            NEW: v4.0 ENTERPRISE
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="font-display-lg text-display-lg text-text-heading mb-6 tracking-tight leading-tight font-bold"
          >
            Manage Projects with{" "}
            <span className="text-primary">Kinetic Speed</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-body-lg text-body-lg text-text-body mb-10 max-w-[512px] leading-relaxed"
          >
            The enterprise-grade project hub designed for high-performance
            teams. Consolidate architecture, real-time data, and global
            collaboration into one unified workspace.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-md">
            <MotionLink
              to="/register"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 15px -3px rgba(0, 74, 198, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-lg font-button-text text-button-text shadow-md cursor-pointer text-center font-semibold"
            >
              Start Your Free Trial
            </MotionLink>
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "var(--color-surface-container-low)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-sm bg-surface-main text-primary border border-border-subtle px-8 py-3.5 rounded-lg font-button-text text-button-text shadow-sm transition-colors cursor-pointer font-semibold"
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
            initial={{ opacity: 0, scale: 0.95, rotate: 1.5, y: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            whileHover={{ y: -6, rotate: -0.2, scale: 1.005 }}
            className="glass-card rounded-xl p-3 shadow-lg border-border-subtle/50 cursor-pointer"
          >
            <img
              className="rounded-lg shadow-inner w-full h-auto"
              alt="A clean, high-fidelity user interface dashboard of a project management software. The layout features a dense multi-column bento grid showing real-time Gantt charts, team velocity graphs, and colorful task cards."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ls_znhOCjPDDyWwHHo1Lo8jVtDi-NkR_1gzQ-b6AJc1WiT7oSkSck7YV9QqrQ-D1wjoflXViVixQDYY-RWKHsSDa3ZdyhTpOzEpCU9CG-u6lc3xXxZ-QcC-nhfe3KSa4ODSzb05xCI-RaX53kZIUs6F7b9lSSg5I3dLyMK8H_XRbtpSwWc4ABfmDOCuRNKk5cAa0ph6yXKB5ojeITFyFkhvs-T1BTsCT6ujVpeTeEGs4YQzVq7EpH2gbZeV1bQHP_U9hroSA-ig"
            />
          </motion.div>
          <motion.div
            initial={{ x: -30, y: 20, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 90,
              damping: 15,
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md border border-border-subtle rounded-lg p-5 shadow-lg w-60 hidden lg:block cursor-pointer z-20"
          >
            <div className="flex items-center gap-md mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  bolt
                </span>
              </div>
              <div className="text-left">
                <p className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                  System Velocity
                </p>
                <p className="font-title-md text-sm text-primary font-bold">
                  +24% Increase
                </p>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-primary w-3/4 h-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
