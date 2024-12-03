import React from "react";
import { Icon } from "@iconify-icon/react";
import styles from "./features.module.css";
import sharedStyles from "./shared.module.css";

export default function Features({
  title,
  description,
  imageUrl,
  children,
}: {
  title: string;
  description: string | React.ReactNode;
  imageUrl?: string;
  children: React.ReactNode;
}) {
  const featuresList: React.ReactNode[] = [];
  React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Features.Item) {
      featuresList.push(child);
    }
  });

  let imageElement;
  if (imageUrl && imageUrl !== "") {
    imageElement = (
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="OpenTDF features" />;
        </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <div className={sharedStyles.subtitle}>Features</div>
        <h2 className={sharedStyles.title}>{title}</h2>
        <div className={sharedStyles.content}>
          <p>{description}</p>
        </div>
        <div className={styles.content}>
          <div className={styles.features}>{featuresList}</div>
          {imageElement}
        </div>
      </div>
    </div>
  );
}

Features.Item = function FeatureItem({
  icon,
  title,
  description,
  callToAction,
}: {
  icon?: string;
  title: string;
  description: string;
  callToAction?: { title: string; url: string };
}) {
  if (!icon) {
    icon = "carbon:circle-filled";
  }

  return (
    <div className={styles.item}>
      <div className={styles.iconContainer}>
        <Icon icon={icon} inline style={{ fontSize: 24, paddingLeft: 11, paddingTop: 11 }} />
      </div>
      <div className={styles.itemDetails}>
        <div className={styles.itemTitle}>{title}</div>
        <div className={styles.itemDescription}>{description}</div>
        <div className={styles.itemCallToAction}>
          {callToAction && <a href={callToAction.url}>{callToAction.title}</a>}
        </div>
      </div>
    </div>
  );
};
