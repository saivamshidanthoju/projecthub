import { useRef } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarBg: string;
}

function TestimonialCard({ quote, name, role, avatarBg }: Testimonial) {
  return (
    <div className="min-w-[400px] snap-center bg-surface-sunken p-xl rounded-3xl border border-border-subtle">
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
    </div>
  );
}

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -432, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 432, behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-32 bg-white border-y border-border-subtle overflow-hidden"
      id="testimonials"
    >
      <div className="max-w-max-width mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-md">
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
            <button
              onClick={handleScrollLeft}
              className="p-4 border border-border-subtle rounded-full hover:bg-surface-sunken transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={handleScrollRight}
              className="p-4 border border-border-subtle rounded-full hover:bg-surface-sunken transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div
          ref={sliderRef}
          className="flex gap-xl overflow-x-auto pb-8 snap-x no-scrollbar"
        >
          {testimonialsList.map((t, index) => (
            <TestimonialCard key={index} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
