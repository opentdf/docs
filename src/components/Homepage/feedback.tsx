import React from "react";
import styles from "./feedback.module.css";

export default function Feedback({
  children,
  title,
  iframe,
}: {
  children: React.ReactNode;
  title: string;
  iframe?: React.ReactNode;
}) {
  if (!title || title === "") {
    title = "Feedback";
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.description}>{children}</div>
        </div>
        <div className={styles.formWrapper}>{iframe}</div>
      </div>
      </div>
  );
}
