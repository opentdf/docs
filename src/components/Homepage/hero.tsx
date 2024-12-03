import React from "react";
import styles from "./hero.module.css";

export default function Hero({
  children,
  heading,
  callToAction,
  video,
}: {
  children: React.ReactNode;
  heading: string;
  callToAction: {
    text: string;
    url: string;
  };
  video: {
    title?: string;
    url: string;
  };
}) {
  let videoEl: React.ReactNode = null;
  if (video) {
    videoEl = (
      <div className={styles.video}>
        <iframe
          src={video.url}
          title={video?.title}
          // frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
          picture-in-picture; web-share"
          // referrerpolicy="strict-origin-when-cross-origin"
          // allowfullscreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <div className={styles.tag}>
          <div>Sponsored by Virtru</div>
        </div>
        <h1 className={styles.heading}>{heading}</h1>
        <div className={styles.content}>{children}</div>
        <div className={styles.callToAction}>
          <a href={callToAction?.url || ""}>{callToAction?.text || ""}</a>
        </div>
        {videoEl}
      </div>
    </div>
  );
}
