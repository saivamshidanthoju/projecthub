import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarBg: string;
}

function TestimonialCard({ quote, name, role, avatarBg }: Testimonial) {
  return (
    <motion.div
      whileHover={{ y: -8, borderColor: "var(--color-primary)", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
      className="min-w-[320px] md:min-w-[400px] select-none bg-surface-sunken p-xl rounded-3xl border border-border-subtle cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className="flex text-primary mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
      <p className="font-title-md text-title-md text-text-heading mb-10 italic">
        {quote}
      </p>
      <div className="flex items-center gap-md">
        <div className={`w-12 h-12 rounded-full ${avatarBg}`} />
        <div>
          <p className="font-title-md text-title-md text-text-heading">
            {name}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  const testimonialsList: Testimonial[] = [
    {
      quote:
        '"The real-time data sync in ProjectHub is actually instant. It\'s the first time our global dev team hasn\'t felt the friction of distributed work."',
      name: "Sarah Jenkins",
      role: "CTO at InnovateX",
      avatarBg: "bg-slate-300",
    },
    {
      quote:
        '"Managing 50+ clients across different time zones was a nightmare before ProjectHub. The multi-tenant architecture is a literal game changer."',
      name: "David Chen",
      role: "Project Director, Nexus Agency",
      avatarBg: "bg-slate-400",
    },
    {
      quote:
        '"Enterprise security shouldn\'t be complex. ProjectHub gives us full control and audit logs that pass every compliance check we face."',
      name: "Elena Rodriguez",
      role: "Security Lead, FinTech Solutions",
      avatarBg: "bg-slate-200",
    },
  ];

  useEffect(() => {
    const updateConstraints = () => {
      if (sliderRef.current && containerRef.current) {
        const scrollWidth = sliderRef.current.scrollWidth;
        const clientWidth = containerRef.current.clientWidth;
        setDragConstraints({
          left: Math.min(-(scrollWidth - clientWidth), 0),
          right: 0,
        });
      }
    };

    updateConstraints();
    // Add small delay to ensure rendering completes
    const timer = setTimeout(updateConstraints, 100);

    window.addEventListener("resize", updateConstraints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleScrollLeft = () => {
    const currentX = x.get();
    const newX = Math.min(currentX + 432, 0);
    animate(x, newX, { type: "spring", stiffness: 150, damping: 20 });
  };

  const handleScrollRight = () => {
    const currentX = x.get();
    const minX = dragConstraints.left;
    const newX = Math.max(currentX - 432, minX);
    animate(x, newX, { type: "spring", stiffness: 150, damping: 20 });
  };

  return (
    <section
      className="py-32 bg-white border-y border-border-subtle overflow-hidden"
      id="testimonials"
    >
      <div className="max-w-max-width mx-auto px-margin-desktop" ref={containerRef}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-md"
        >
          <div className="max-w-[512px]">
            <h2 className="font-headline-lg text-headline-lg text-text-heading mb-4">
              Trusted by Market Leaders
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              See how ProjectHub transformed the operational workflows for global
              tech organizations.
            </p>
          </div>
          <div className="flex gap-sm">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollLeft}
              className="p-4 border border-border-subtle rounded-full hover:bg-surface-sunken transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollRight}
              className="p-4 border border-border-subtle rounded-full hover:bg-surface-sunken transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </motion.button>
          </div>
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.div
            ref={sliderRef}
            drag="x"
            dragConstraints={dragConstraints}
            style={{ x }}
            className="flex gap-xl pb-8"
          >
            {testimonialsList.map((t, index) => (
              <TestimonialCard key={index} {...t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

