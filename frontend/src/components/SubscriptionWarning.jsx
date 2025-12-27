import React from "react";

export default function SubscriptionWarning() {
  if (!localStorage.getItem("subscriptionWarning")) return null;

  return (
    <div style={{
      background: "#fff3cd",
      color: "#856404",
      padding: "10px",
      textAlign: "center",
      fontWeight: 500
    }}>
      ⚠️ Your academy subscription will expire soon.
      Please renew to avoid service interruption.
    </div>
  );
}
