import React from "react";
import Button from "@site/src/components/Button";
import styles from "./styles.module.css";

export default function Callout({
  title,
  children,
  callToAction,
}: {
  title: string;
  children: React.ReactNode;
  callToAction: {
    label: string;
    link: string;
  };
}): JSX.Element {
  let cta: React.JSX.Element;
  if (
    callToAction &&
    callToAction?.label &&
    callToAction?.link
  ) {
    cta = (
      <Button
        variant="primary"
        link={callToAction.link}
        label={callToAction.label}
      />
    );
  }

  return (
    <div className="row">
      <div className="col col--12">
        <div className={styles.container}>
          <div>
            <div className={styles.title}>{title}</div>
            <p>{children}</p>
          </div>
          <div className={styles.cta}>
            <Button
              variant="primary"
              link={callToAction.link}
              label={callToAction.label}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
