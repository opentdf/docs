import React from "react";
import styles from "./Standards.module.css";

const CheckIcon = () => (
  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const features = [
  "AES-256-GCM authenticated encryption",
  "NIST SP 800-162 ABAC model",
  "Cryptographic policy binding",
  "Open specification — not proprietary",
];

export default function Standards() {
  return (
    <section className={`${styles.section} section-dark bg-mesh-reverse`}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left: TDF diagram */}
          <div className={`${styles.diagramOrder} ${styles.diagramWrap}`}>
            <div className={styles.diagram}>
              <div className={styles.diagramComment}>{"<!-- TDF Object Structure -->"}</div>
              <div className={styles.diagramBody}>
                <div className={styles.diagramRow}>
                  <span className={styles.cCyan}>┌</span>
                  <span className={styles.cLight}>TDF Object</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl4}`}>
                  <span className={styles.cCyan}>├─</span>
                  <span className={styles.cGreen}>manifest.json</span>
                  <span className={styles.cFaint}>policy + key access</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl8}`}>
                  <span className={styles.cFaint2}>├─</span>
                  <span className={styles.cAmber}>encryptionMethod</span>
                  <span className={styles.cFaint}>AES-256-GCM</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl8}`}>
                  <span className={styles.cFaint2}>├─</span>
                  <span className={styles.cAmber}>keyAccess[]</span>
                  <span className={styles.cFaint}>wrapped DEK + KAS URL</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl8}`}>
                  <span className={styles.cFaint2}>├─</span>
                  <span className={styles.cAmber}>policy</span>
                  <span className={styles.cFaint}>ABAC attributes</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl8}`}>
                  <span className={styles.cFaint2}>└─</span>
                  <span className={styles.cAmber}>assertions[]</span>
                  <span className={styles.cFaint}>signed bindings</span>
                </div>
                <div className={`${styles.diagramRow} ${styles.pl4}`}>
                  <span className={styles.cCyan}>└─</span>
                  <span className={styles.cPurple}>payload</span>
                  <span className={styles.cFaint}>encrypted content</span>
                </div>
                <div className={styles.diagramRow}>
                  <span className={styles.cCyan}>└</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={styles.contentOrder}>
            <h2 className={styles.heading}>Standards-Based Security</h2>
            <p className={styles.body}>
              Built on the proven NIST ABAC model for interoperability and compliance. OpenTDF
              follows established standards for attribute-based access control, ensuring your data
              protection strategy is future-proof and audit-ready.
            </p>

            <ul className={styles.featureList}>
              {features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className={styles.ctas}>
              <a href="/spec" className={`${styles.btn} ${styles.btnSecondary}`}>
                View Specification
              </a>
              <a href="/architecture" className={`${styles.btn} ${styles.btnGhost}`}>
                Architecture Overview
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
