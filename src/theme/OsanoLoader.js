import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const script = document.createElement('script');
  script.src =
    'https://cmp.osano.com/AzZnZZU1pGA9X28W3/5e8e2168-3b0b-4c78-8560-e7bea6d12cf4/osano.js';
  script.async = true;
  document.head.appendChild(script);
}

export default {};
