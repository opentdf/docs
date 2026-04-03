import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const OSANO_SRC =
  'https://cmp.osano.com/AzZnZZU1pGA9X28W3/5e8e2168-3b0b-4c78-8560-e7bea6d12cf4/osano.js';

if (ExecutionEnvironment.canUseDOM) {
  if (!document.querySelector(`script[src="${OSANO_SRC}"]`)) {
    const script = document.createElement('script');
    script.src = OSANO_SRC;
    script.async = true;
    script.onerror = () => {
      console.warn('Osano CMP failed to load');
    };
    document.head.appendChild(script);
  }

  // Safe wrapper for footer preferences button — Osano may not be loaded yet
  window.openOsanoPreferences = () => {
    window.Osano?.cm?.showDrawer?.('osano-cm-dom-info-dialog-open');
  };
}

export default {};
