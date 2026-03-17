import React, { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { useLocation } from "@docusaurus/router";

// Extracted helper — called on mount (returning visitor) and on accept (new visitor)
function grantAnalyticsConsent() {
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_personalization: "denied",
    ad_user_data: "denied",
  });
}

export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Runs once on mount: restore consent for returning visitors
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("opentdf-cookie-consent="))
      ?.split("=")[1];
    if (cookieValue !== "true") return;
    grantAnalyticsConsent();
  }, []);

  // Runs on every navigation: track page views
  useEffect(() => {
    const hasConsent = document.cookie.includes("opentdf-cookie-consent=true");
    if (!hasConsent) return;
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search + location.hash,
    });
  }, [location]);

  const handleAcceptCookie = () => {
    grantAnalyticsConsent();
    // ← Trigger GA4 to fire now that consent is granted
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search + location.hash,
    });
  };

  const handleDeclineCookie = () => {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_personalization: "denied",
      ad_user_data: "denied",
    });
  };

  return (
    <>
      {children}
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        cookieName="opentdf-cookie-consent"
        containerClasses="cookie-consent-banner"
        buttonClasses="cookie-consent-accept-button"
        declineButtonClasses="cookie-consent-decline-button"
        expires={365}
        enableDeclineButton
        onAccept={handleAcceptCookie}
        onDecline={handleDeclineCookie}
      >
        This website uses cookies to improve user experience and analyze website
        traffic. By clicking "Accept", you consent to our use of cookies. See
        our <a href="/privacy-policy">Privacy Policy</a> and{" "}
        <a href="/cookie-policy">Cookie Policy</a> for more information.
      </CookieConsent>
    </>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}