import React from "react";
import styles from "./Community.module.css";

const GitHubIcon = () => (
  <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const DiscussionsIcon = () => (
  <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ContributeIcon = () => (
  <svg className={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const links = [
  {
    href: "https://github.com/opentdf",
    external: true,
    Icon: GitHubIcon,
    title: "GitHub",
    description: "Browse the source",
  },
  {
    href: "https://github.com/opentdf/platform/discussions",
    external: true,
    Icon: DiscussionsIcon,
    title: "Discussions",
    description: "Ask questions, share ideas",
  },
  {
    href: "https://github.com/opentdf/platform/blob/main/CONTRIBUTING.md",
    external: true,
    Icon: ContributeIcon,
    title: "Contribute",
    description: "Help build OpenTDF",
  },
];

export default function Community() {
  return (
    <section className={`${styles.section} section-darker`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Join the Movement</h2>
          <p className={styles.body}>
            Open source, open community. Shape the future of data-centric security with developers,
            security professionals, and organizations from around the world. Contribute code, share
            ideas, and help build the next generation of data protection.
          </p>
        </div>

        <div className={styles.cards}>
          {links.map(({ href, external, Icon, title, description }) => (
            <a
              key={title}
              href={href}
              className={styles.card}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon />
              <div className={styles.cardTitle}>{title}</div>
              <div className={styles.cardDesc}>{description}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
