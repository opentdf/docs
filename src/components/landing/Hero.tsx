import React from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={`${styles.section} section-dark bg-grid bg-mesh`}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left: Copy */}
          <div>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Open Source &middot; BSD-3-Clause-Clear
            </div>

            <h1 className={styles.heading}>
              <span className="text-gradient">Protect the Data,</span>
              <br />
              Build the Future
            </h1>

            <p className={styles.bodyPrimary}>
              Open-source data-centric security for developers. OpenTDF delivers the
              Trusted Data Format (TDF) specification, foundational services for key
              management and access control, and SDKs — the building blocks to
              cryptographically bind protection directly to your data, wherever it goes.
            </p>

            <p className={styles.bodySecondary}>
              Explore the standard. Prototype custom applications. Build architectures
              where security travels with the data, not the network.
            </p>

            <div className={styles.ctas}>
              <a href="/quickstart" className={`${styles.btn} ${styles.btnPrimary}`}>
                Get Started
              </a>
              <a href="/introduction" className={`${styles.btn} ${styles.btnSecondary}`}>
                View Documentation
              </a>
            </div>
          </div>

          {/* Right: Code preview */}
          <div className={styles.codeWrap}>
            <div className={`${styles.codeWindow} glow-cyan`}>
              {/* Window chrome */}
              <div className={styles.windowChrome}>
                <span className={`${styles.dot} ${styles.dotRed}`} />
                <span className={`${styles.dot} ${styles.dotYellow}`} />
                <span className={`${styles.dot} ${styles.dotGreen}`} />
                <span className={styles.filename}>encrypt.ts</span>
              </div>

              {/* Code */}
              <div className={styles.code}>
                <div className="code-line">
                  <span className={styles.cPurple}>import</span>
                  {" { "}
                  <span className={styles.cYellow}>OpenTDF</span>
                  {" } "}
                  <span className={styles.cPurple}>from</span>
                  {" "}
                  <span className={styles.cCyan}>'@opentdf/sdk'</span>;
                </div>
                <div className={`code-line ${styles.mt}`}>
                  <span className={styles.cGray}>{"// Connect to the platform"}</span>
                </div>
                <div className="code-line">
                  <span className={styles.cPurple}>const</span>
                  {" "}
                  <span className={styles.cBlue}>client</span>
                  {" = "}
                  <span className={styles.cPurple}>await</span>
                  {" "}
                  <span className={styles.cYellow}>OpenTDF</span>
                  {"."}<span className={styles.cGreen}>connect</span>
                  {"("}
                  <span className={styles.cCyan}>'http://localhost:8080'</span>
                  {");"}
                </div>
                <div className={`code-line ${styles.mt}`}>
                  <span className={styles.cGray}>{"// Encrypt with attribute-based policy"}</span>
                </div>
                <div className="code-line">
                  <span className={styles.cPurple}>const</span>
                  {" "}
                  <span className={styles.cBlue}>ciphertext</span>
                  {" = "}
                  <span className={styles.cPurple}>await</span>
                  {" "}
                  <span className={styles.cBlue}>client</span>
                  {"."}<span className={styles.cGreen}>encrypt</span>
                  {"(data, {"}
                </div>
                <div className="code-line">
                  <span className={styles.indent}>
                    <span className={styles.cBlue}>attributes</span>
                    {": ["}
                    <span className={styles.cCyan}>'https://example.com/attr/class/value/secret'</span>
                    {"],"}
                  </span>
                </div>
                <div className="code-line">{"});"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
