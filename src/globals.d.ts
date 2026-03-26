declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    Osano: any;
  }
}

export {};