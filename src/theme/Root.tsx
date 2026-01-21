import React from 'react';
import CookieConsent from 'react-cookie-consent';

// This component wraps the entire application
export default function Root({ children }: { children: React.ReactNode }) {
  const handleAcceptCookie = () => {
    // Initialize Google Analytics when user accepts cookies
    if (typeof window !== 'undefined') {
      // Load gtag.js script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JH0PNJK88L';
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-JH0PNJK88L', { anonymize_ip: true });

      // Store gtag globally for future use
      (window as any).gtag = gtag;
    }
  };

  return (
    <>
      {children}
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        cookieName="opentdf-cookie-consent"
        style={{
          background: '#1c1e21',
          alignItems: 'center',
          padding: '1rem',
        }}
        buttonStyle={{
          background: '#4CAF50',
          color: '#fff',
          fontSize: '14px',
          padding: '10px 24px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
        declineButtonStyle={{
          background: 'transparent',
          color: '#fff',
          fontSize: '14px',
          padding: '10px 24px',
          borderRadius: '4px',
          border: '1px solid #fff',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
        expires={365}
        enableDeclineButton
        onAccept={handleAcceptCookie}
      >
        This website uses cookies to improve user experience and analyze website traffic.
        By clicking "Accept", you consent to our use of cookies. See our{' '}
        <a
          href="/privacy-policy"
          style={{ color: '#4CAF50', textDecoration: 'underline' }}
        >
          Privacy Policy
        </a>
        {' '}and{' '}
        <a
          href="/cookie-policy"
          style={{ color: '#4CAF50', textDecoration: 'underline' }}
        >
          Cookie Policy
        </a>
        {' '}for more information.
      </CookieConsent>
    </>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
