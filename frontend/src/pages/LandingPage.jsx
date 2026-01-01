// src/pages/LandingPage.jsx
import { useState } from "react";
import Header from "../components/Header";
import PricingCard from "../components/PricingCard";
import EnquiryModal from "../components/EnquiryModal";
import "../styles/landing.css";

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState(null);
  const [billing, setBilling] = useState("monthly"); // monthly | yearly
  // Default selected = Most Popular
  const [selectedPlan, setSelectedPlan] = useState("STANDARD");

  const plans = [
    {
      name: "BASIC",
      desc: "For Small Academies",
      monthly: 999,
      yearly: 9999,
      features: ["Up to 50 students", "Basic assessment", "WhatsApp support"],
    },
    {
      name: "STANDARD",
      desc: "Best for Police / Army Academies",
      monthly: 1999,
      yearly: 19999,
      highlight: true,
      features: [
        "Up to 150 students",
        "Detailed assessment",
        "Weekly & monthly reports",
        "Physical test tracking",
        "Call + WhatsApp support",
      ],
    },
    {
      name: "PREMIUM",
      desc: "For Large Academies",
      monthly: 3999,
      yearly: 39999,
      features: [
        "Unlimited students",
        "Advanced analytics",
        "Multi-admin login",
        "Custom reports",
        "Priority support",
      ],
    },
  ];

  return (
    <>
      <Header />

      <section className="hero">
        <h1>Academy Management Software</h1>
        <p>Designed for Police & Army Training Academies</p>
        <a href="#plans" className="hero-btn">
          View Plans
        </a>
      </section>

      <div className="billing-toggle">
        <span className={billing === "monthly" ? "active" : ""}>Monthly</span>

        <label className="switch">
          <input
            type="checkbox"
            checked={billing === "yearly"}
            onChange={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
          />
          <span className="slider" />
        </label>

        <span className={billing === "yearly" ? "active" : ""}>
          Yearly <small>Save more</small>
        </span>
      </div>

      <section id="plans" className="pricing-section">
        {plans.map((p) => (
          <PricingCard
            key={p.name}
            plan={p}
            billing={billing}
            isSelected={selectedPlan === p.name}
            onSelect={() => setSelectedPlan(p.name)}
            onEnquiry={setActivePlan}
          />
        ))}
      </section>

<section className="contact-strip">
  <div className="contact-content">
    <span className="contact-label">
      📞 To activate subscription, call or WhatsApp
    </span>

    <a href="tel:9359848300" className="contact-number">
      9359848300
    </a>
  </div>

  <div className="copyright">
    © 2026 Shree Group. All rights reserved.
  </div>
</section>


      {activePlan && (
        <EnquiryModal plan={activePlan} onClose={() => setActivePlan(null)} />
      )}
    </>
  );
}
