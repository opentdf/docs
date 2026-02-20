import React from "react";
import styles from "./ProblemSolution.module.css";

const cards = [
  {
    title: "Revoke After Sharing",
    body: "Revoke access after sharing — even after data has left your environment.",
    icon: (
      <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    title: "Zero-Trust Enforcement",
    body: "Enforce controls in zero-trust environments — no VPN, no network dependency.",
    icon: (
      <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Complete Audit Trail",
    body: "Maintain a complete audit trail — know who accessed what, when, and where.",
    icon: (
      <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

export default function ProblemSolution() {
  return (
    <section className={`${styles.section} section-darker`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Traditional Security Fails When Data Leaves the Perimeter
          </h2>
          <p className={styles.bodyPrimary}>
            Firewalls, VPNs, and network policies protect the boundary — not the data.
            The moment a file is shared, downloaded, or moved to a new environment,
            those controls vanish. Access decisions remain at the perimeter, while the
            data moves on without them.
          </p>
          <p className={styles.bodySecondary}>
            OpenTDF inverts this model. Policies travel with the data itself, so you can:
          </p>
        </div>

        <div className={styles.cards}>
          {cards.map((card) => (
            <div key={card.title} className={styles.card}>
              <div className={styles.iconWrap}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>

        <p className={styles.tagline}>
          This is data-centric security: protection that's embedded, not bolted on.
        </p>

        <div className={styles.cta}>
          <a href="/introduction" className={styles.btn}>
            Learn the Concepts
          </a>
        </div>
      </div>
    </section>
  );
}
