import React from "react";
import styles from "./columns.module.css";
import sharedStyles from "./shared.module.css";

export default function Columns({ children }: { children: React.ReactNode }) {
  const cols: React.ReactNode[] = [];
  React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Columns.Item) {
      cols.push(child);
    }
  });

  return <div className={styles.container}>{cols}</div>;
}

Columns.Item = function Item({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  // if children is a string, wrap it in a paragraph
  if (typeof children === "string") {
    children = <p>{children}</p>;
  }
  return (
    <div className={styles.item}>
      <div className={sharedStyles.subtitle}>{subtitle}</div>
      <h3 className={sharedStyles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
