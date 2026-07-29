import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-container-lowest dark:bg-inverse-surface shadow-sm sticky top-0 z-40 w-full h-16 flex items-center justify-between px-margin-desktop border-b border-border-subtle dark:border-outline-variant"
    >
      <div className="flex items-center gap-xl">
        <MotionLink
          to="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 font-title-lg text-title-lg text-primary dark:text-inverse-primary font-bold tracking-tight select-none"
        >
          <img src="/logo.svg" className="w-9 h-9 object-contain" alt="ProjectHub Logo" />
          <span>ProjectHub</span>
        </MotionLink>

        <nav className="hidden md:flex items-center gap-lg">
          <motion.a
            whileHover={{ y: -2, color: "var(--color-primary)" }}
            whileTap={{ y: 0 }}
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#features"
          >
            Features
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "var(--color-primary)" }}
            whileTap={{ y: 0 }}
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#pricing"
          >
            Pricing
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "var(--color-primary)" }}
            whileTap={{ y: 0 }}
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#testimonials"
          >
            Success Stories
          </motion.a>
        </nav>
      </div>

      <div className="flex items-center gap-md">
        <MotionLink
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="font-button-text text-button-text text-primary font-semibold px-4 py-2 hover:bg-surface-container-low transition-colors duration-200 rounded-lg"
          to="/login"
        >
          Login
        </MotionLink>

        <MotionLink
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-button-text text-button-text shadow-sm hover:opacity-90 transition-all text-center inline-block"
          to="/register"
        >
          Get Started
        </MotionLink>
      </div>
    </motion.header>
  );
}