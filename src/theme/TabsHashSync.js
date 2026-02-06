import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // Function to determine which tab should be active based on the hash
  function getTabFromHash(hash) {
    if (!hash) return null;

    // Remove the # from the hash
    const anchor = hash.substring(1);

    // Map hash patterns to tab values
    // Check if the hash contains specific SDK identifiers
    // IMPORTANT: Check -javascript BEFORE -java since -javascript contains -java
    if (anchor.includes('-javascript')) {
      return 'js'; // Tab value is "js" not "javascript"
    } else if (anchor.includes('-java')) {
      return 'java';
    } else if (anchor.includes('-go')) {
      return 'go';
    }

    // Check for section IDs
    if (anchor === 'java-sdk-implementation' || anchor.startsWith('next-steps-with-java')) {
      return 'java';
    } else if (anchor === 'javascript-sdk-implementation' || anchor.startsWith('next-steps-with-javascript')) {
      return 'js'; // Tab value is "js" not "javascript"
    } else if (anchor === 'go-sdk-implementation' || anchor.startsWith('next-steps-with-go')) {
      return 'go';
    }

    return null;
  }

  // Function to activate a tab
  function activateTab(tabValue) {
    // Find all tab buttons
    const tabButtons = document.querySelectorAll('[role="tab"]');

    for (const button of tabButtons) {
      // Try different possible attribute names
      const buttonValue = button.getAttribute('data-value') ||
                         button.getAttribute('value') ||
                         button.getAttribute('data-tab-value');

      // Try matching by text content as fallback
      const buttonText = button.textContent?.trim().toLowerCase();

      // Match logic:
      // 1. Exact match on value attribute
      // 2. Exact match on button text
      // 3. Special case: 'js' matches button text starting with 'javascript'
      const isMatch = (buttonValue && buttonValue.toLowerCase() === tabValue.toLowerCase()) ||
                     (buttonText === tabValue.toLowerCase()) ||
                     (tabValue === 'js' && buttonText?.startsWith('javascript'));

      if (isMatch) {
        // Click the tab to activate it
        button.click();
        return true;
      }
    }

    return false;
  }

  // Function to handle hash-based tab switching
  function handleHashTabSwitch() {
    const hash = window.location.hash;
    const targetTab = getTabFromHash(hash);

    if (targetTab) {
      // Wait a bit for Docusaurus to render the tabs
      setTimeout(() => {
        if (activateTab(targetTab)) {
          // Wait for tab content to be visible, then scroll to the hash
          setTimeout(() => {
            const element = document.getElementById(hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }
      }, 300); // Increased wait time for tabs to render
    }
  }

  // Run on page load
  window.addEventListener('load', handleHashTabSwitch);

  // Run on hash change (when clicking anchor links on the same page)
  window.addEventListener('hashchange', handleHashTabSwitch);

  // Also run immediately in case tabs are already rendered
  if (document.readyState === 'complete') {
    handleHashTabSwitch();
  }
}

export default {};
