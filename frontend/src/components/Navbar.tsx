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
          className="font-title-lg text-title-lg text-primary dark:text-inverse-primary font-bold tracking-tight select-none"
        >
          ProjectHub
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

        <div className="flex items-center gap-sm ml-xl border-l border-border-subtle pl-xl">
          <motion.span
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-low"
          >
            notifications
          </motion.span>

          <motion.span
            whileHover={{ scale: 1.1, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-low"
          >
            account_circle
          </motion.span>
        </div>
      </div>
    </motion.header>
  );
}