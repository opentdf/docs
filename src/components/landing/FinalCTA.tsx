import React from "react";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className={`${styles.section} section-dark bg-mesh`}>
      {/* Centered glow blob */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <h2 className={styles.heading}>Ready to Protect Your Data?</h2>
        <p className={styles.body}>Choose your path and start building with OpenTDF today.</p>

        <div className={styles.ctas}>
          <a href="/quickstart" className={`${styles.btn} ${styles.btnPrimary}`}>
            Start Tutorial
          </a>
          <a href="/introduction" className={`${styles.btn} ${styles.btnSecondary}`}>
            Browse Documentation
          </a>
          <a
            href="https://github.com/opentdf"
            className={`${styles.btn} ${styles.btnGhost}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </div>
      </div>
    </section>
  );
}
