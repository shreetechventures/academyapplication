import React, { useEffect, useState } from "react";

export default function SubscriptionWarning() {
  const [show, setShow] = useState(
    localStorage.getItem("subscriptionWarning") === "true"
  );

  useEffect(() => {
    const syncWarning = () => {
      setShow(localStorage.getItem("subscriptionWarning") === "true");
    };

    // Listen to storage changes (multi-tab safe)
    window.addEventListener("storage", syncWarning);

    // Also poll when interceptor updates same tab
    const interval = setInterval(syncWarning, 1000);

    return () => {
      window.removeEventListener("storage", syncWarning);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        background: "#fff3cd",
        color: "#856404",
        padding: "10px 16px",
        borderBottom: "1px solid #ffeeba",
        textAlign: "center",
        fontWeight: 500,
      }}
    >
      ⚠️ Your academy subscription will expire soon.
      Please contact support to avoid service interruption.
    </div>
  );
}
