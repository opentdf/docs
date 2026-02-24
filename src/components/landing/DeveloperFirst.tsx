import React, { useState } from "react";
import styles from "./DeveloperFirst.module.css";

const sdks = [
  {
    name: "Web SDK",
    lang: "TypeScript / JS",
    install: "npm install @opentdf/sdk",
    colorClass: "sdk-js",
    icon: "TS",
    href: "/sdks",
    recommended: true,
  },
  {
    name: "Platform SDK",
    lang: "Go",
    install: "go get github.com/opentdf/platform/sdk",
    colorClass: "sdk-go",
    icon: "Go",
    href: "/sdks",
    recommended: false,
  },
  {
    name: "Java SDK",
    lang: "Java",
    install: "implementation 'io.opentdf:sdk:latest'",
    colorClass: "sdk-java",
    icon: "Jv",
    href: "/sdks",
    recommended: false,
  },
  {
    name: "CLI",
    lang: "otdfctl",
    install: null,
    releaseUrl: "https://github.com/opentdf/otdfctl/releases/latest",
    colorClass: "sdk-cli",
    icon: ">_",
    href: "/sdks",
    recommended: false,
  },
];

const CopyIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#22d3ee" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export default function DeveloperFirst() {
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section className={`${styles.section} section-dark bg-mesh`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Built for Developers</h2>
          <p className={styles.subheading}>
            Pick your language. Native SDKs for TypeScript, Go, and Java — plus a CLI for scripting
            and automation. Everything you need to get building.
          </p>
        </div>

        <div className={styles.cards}>
          {sdks.map((sdk) => (
            <div key={sdk.name} className={`${styles.card} sdk-card ${sdk.colorClass}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardLeft}>
                  <div
                    className={styles.sdkIcon}
                    style={{
                      background: `color-mix(in srgb, var(--sdk-color) 15%, transparent)`,
                      color: `var(--sdk-color)`,
                    }}
                  >
                    {sdk.icon}
                  </div>
                  <div>
                    <a href={sdk.href} className={styles.sdkName}>
                      {sdk.name}
                    </a>
                    <div className={styles.sdkLang}>{sdk.lang}</div>
                  </div>
                </div>
                {sdk.recommended && (
                  <span className={styles.badge}>Start here</span>
                )}
              </div>

              <div className={styles.installRow}>
                {"releaseUrl" in sdk ? (
                  <a
                    href={sdk.releaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.releaseLink}
                  >
                    Download latest release →
                  </a>
                ) : (
                  <>
                    <div className={styles.installCmd}>
                      <span>{sdk.install}</span>
                    </div>
                    <button
                      className={styles.copyBtn}
                      onClick={() => handleCopy(sdk.install, sdk.name)}
                      aria-label="Copy install command"
                      title="Copy"
                    >
                      {copied === sdk.name ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctas}>
          <a href="/quickstart" className={`${styles.btn} ${styles.btnPrimary}`}>
            JS Quickstart
          </a>
          <a href="/sdks" className={`${styles.btn} ${styles.btnSecondary}`}>
            All SDKs
          </a>
        </div>
      </div>
    </section>
  );
}
