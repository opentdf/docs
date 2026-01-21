import React, { useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const { googleGtagId } = siteConfig.customFields as { googleGtagId?: string };
  const location = useLocation();

  const initializeGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && googleGtagId) {
      // Check if GA is already loaded
      if (window.gtag) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleGtagId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', googleGtagId, { anonymize_ip: true });
      (window as any).gtag = gtag;
    }
  };

  // Check if user has already accepted cookies on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('opentdf-cookie-consent='))
        ?.split('=')[1];

      if (cookieValue === 'true') {
        initializeGoogleAnalytics();
      }
    }
  }, [googleGtagId]);

  // Track page views on route changes (SPA navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && googleGtagId) {
      // Send page view event to Google Analytics
      window.gtag('config', googleGtagId, {
        page_path: location.pathname + location.search + location.hash,
        anonymize_ip: true,
      });
    }
  }, [location, googleGtagId]);

  const handleAcceptCookie = () => {
    initializeGoogleAnalytics();
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
      >
        This website uses cookies to improve user experience and analyze website traffic.
        By clicking "Accept", you consent to our use of cookies. See our{' '}
        <a href="/privacy-policy">Privacy Policy</a>
        {' '}and{' '}
        <a href="/cookie-policy">Cookie Policy</a>
        {' '}for more information.
      </CookieConsent>
    </>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
