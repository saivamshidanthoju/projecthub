import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PlanProps {
  name: string;
  price: string;
  pricePeriod?: string;
  features: PricingFeature[];
  buttonText: string;
  highlighted?: boolean;
  buttonVariant: "outline" | "primary" | "dark";
  index: number;
}

const cardVariants = {
  hidden: (highlighted: boolean) => ({
    opacity: 0,
    y: 40,
    scale: highlighted ? 1.05 : 1,
  }),
  visible: (custom: { index: number; highlighted: boolean }) => ({
    opacity: 1,
    y: 0,
    scale: custom.highlighted ? 1.05 : 1,
    transition: {
      opacity: { duration: 0.5 },
      scale: { type: "spring", stiffness: 90, damping: 14, delay: custom.index * 0.12 },
      y: { type: "spring", stiffness: 90, damping: 14, delay: custom.index * 0.12 },
    },
  }),
};

const MotionLink = motion(Link);

function PricingCard({
  name,
  price,
  pricePeriod,
  features,
  buttonText,
  highlighted = false,
  buttonVariant,
  index,
}: PlanProps) {
  const getButtonClass = () => {
    switch (buttonVariant) {
      case "primary":
        return "bg-primary text-on-primary shadow-lg hover:opacity-90";
      case "dark":
        return "bg-inverse-surface text-surface hover:opacity-90";
      case "outline":
      default:
        return "border border-primary text-primary hover:bg-primary/5";
    }
  };

  return (
    <motion.div
      custom={{ index, highlighted }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover={{
        y: -12,
        scale: highlighted ? 1.07 : 1.02,
        borderColor: highlighted ? "var(--color-primary)" : "var(--color-primary-fixed-dim)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className={`bg-surface-main rounded-2xl p-xl flex flex-col h-full transition-all shadow-sm cursor-pointer ${
        highlighted
          ? "border-2 border-primary relative z-10 my-4 md:my-0"
          : "border border-border-subtle"
      }`}
    >
      {highlighted && (
        <motion.div
          initial={{ y: 10, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-4 left-1/2 bg-primary text-on-primary px-4 py-1 rounded-full font-label-md text-label-md shadow-md"
        >
          MOST POPULAR
        </motion.div>
      )}
      <div className="mb-10">
        <p
          className={`font-label-md text-label-md uppercase tracking-widest mb-2 ${
            highlighted ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          {name}
        </p>
        <h3 className="text-4xl font-bold text-text-heading">
          {price}
          {pricePeriod && (
            <span className="text-lg font-normal text-on-surface-variant">
              {pricePeriod}
            </span>
          )}
        </h3>
      </div>
      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((feature, i) => (
          <li
            key={i}
            className={`flex items-center gap-sm font-body-md text-body-md text-text-body ${
              !feature.included ? "opacity-40" : ""
            }`}
          >
            <span
              className={`material-symbols-outlined text-sm ${
                feature.included ? "text-primary" : ""
              }`}
            >
              check_circle
            </span>
            {feature.text}
          </li>
        ))}
      </ul>
      <MotionLink
        whileTap={{ scale: 0.97 }}
        to="/register"
        className={`w-full py-3 rounded-xl font-button-text text-button-text transition-all cursor-pointer text-center block ${getButtonClass()}`}
      >
        {buttonText}
      </MotionLink>
    </motion.div>
  );
}

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      pricePeriod: "/mo",
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      features: [
        { text: "Up to 10 users", included: true },
        { text: "Standard analytics", included: true },
        { text: "50GB Shared Storage", included: true },
        { text: "API Access", included: false },
      ],
    },
    {
      name: "Professional",
      price: "$99",
      pricePeriod: "/mo",
      buttonText: "Upgrade to Pro",
      buttonVariant: "primary" as const,
      highlighted: true,
      features: [
        { text: "Unlimited users", included: true },
        { text: "Advanced AI insights", included: true },
        { text: "500GB Shared Storage", included: true },
        { text: "Full API Suite", included: true },
        { text: "Priority Support", included: true },
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      buttonText: "Contact Sales",
      buttonVariant: "dark" as const,
      features: [
        { text: "Custom SSO/SAML", included: true },
        { text: "Dedicated Success Manager", included: true },
        { text: "On-premise options", included: true },
        { text: "Unlimited everything", included: true },
      ],
    },
  ];

  return (
    <section className="py-32 bg-surface" id="pricing">
      <div className="max-w-max-width mx-auto px-margin-desktop">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-center mb-20"
        >
          <h2 className="font-headline-lg text-headline-lg text-text-heading mb-4">
            Precision Pricing
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Choose the plan that fits your current operational scale.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch pt-4">
          {plans.map((plan, index) => (
            <PricingCard key={index} index={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

