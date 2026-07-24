import { Link } from "react-router-dom";

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
}

function PricingCard({
  name,
  price,
  pricePeriod,
  features,
  buttonText,
  highlighted = false,
  buttonVariant,
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
    <div
      className={`bg-surface-main rounded-2xl p-xl flex flex-col h-full transition-all shadow-sm ${
        highlighted
          ? "border-2 border-primary relative scale-105 z-10 my-4 md:my-0"
          : "border border-border-subtle hover:border-primary/30"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full font-label-md text-label-md">
          MOST POPULAR
        </div>
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
      <Link
        to="/register"
        className={`w-full py-3 rounded-xl font-button-text text-button-text transition-all cursor-pointer text-center block ${getButtonClass()}`}
      >
        {buttonText}
      </Link>
    </div>
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
        <div className="text-center mb-20">
          <h2 className="font-headline-lg text-headline-lg text-text-heading mb-4">
            Precision Pricing
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Choose the plan that fits your current operational scale.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch pt-4">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
