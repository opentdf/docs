import React from "react";
import styles from "./feedback.module.css";
declare const window: any;

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

  const script = document.createElement('script');
  script.src='https://js.hsforms.net/forms/embed/v2.js';
  document.body.appendChild(script);

  script.addEventListener('load', () => {
      // @TS-ignore
      if (window.hbspt) {
          // @TS-ignore
          window.hbspt.forms.create({
              portalId: '1769758',
              formId: '19521728-3774-4b99-9e01-d94782691310',
              target: '#contact-form'
          })
      }})
          
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.description}>{children}</div>
        </div>
        <div id="contact-form" className={styles.formWrapper}>{iframe}</div>
      </div>
      </div>
  );
}
