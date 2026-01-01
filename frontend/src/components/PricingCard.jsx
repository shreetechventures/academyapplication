// src/components/PricingCard.jsx
import "../styles/landing.css";

export default function PricingCard({
  plan,
  billing,
  isSelected,
  onSelect,
  onEnquiry,
}) {
  const price =
    billing === "monthly" ? plan.monthly : plan.yearly;

  const save =
    billing === "yearly"
      ? plan.monthly * 12 - plan.yearly
      : 0;

  return (
    <div
      className={`plan-card 
        ${plan.highlight ? "popular" : ""} 
        ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {plan.highlight && (
        <div className="badge">Most Popular ⭐</div>
      )}

      <h3>{plan.name}</h3>
      <p className="plan-desc">{plan.desc}</p>

      {/* Price */}
      <div className="price">
        <span className="amount">₹{price}</span>
        <span className="period">
          /{billing === "monthly" ? "month" : "year"}
        </span>
      </div>

      {/* Save badge */}
      {billing === "yearly" && save > 0 && (
        <div className="save-badge">
          Save ₹{save}
        </div>
      )}

      {/* Features */}
      <ul>
        {plan.features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      {/* Call */}
      <a
        className="call-btn"
        href="tel:9359848300"
        onClick={(e) => e.stopPropagation()}
      >
        📞 Call to Subscribe
      </a>

      {/* Enquiry */}
      <button
        className="enquiry-btn"
        onClick={(e) => {
          e.stopPropagation(); // IMPORTANT
          onEnquiry(plan.name);
        }}
      >
        📝 Raise Enquiry
      </button>
    </div>
  );
}
