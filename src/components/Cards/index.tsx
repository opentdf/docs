import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import Image from "@theme/IdealImage";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

interface Props {
  name: string;
  image: string;
  url: string;
  urlTS: string;
  description: string;
  height: number;
  columns: number;
  accentColor: string;
}

function Card({ name, image, url, description, height, columns, accentColor }: Props) {
  return (
    <div className={"col col--"+columns+" margin-bottom--lg " + styles.card}>
      <div className={"card "+ styles["card_accent--"+accentColor]}>
        <div className={clsx("card__image")}>
          <Link to={url}>
            {image && <Image img={image} alt={`${name}'s image`} />}
          </Link>
        </div>
        <div
          className={clsx("card__body")}
          style={{
            height: height,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Heading as="h3">{name}</Heading>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            <Link className="button button--secondary" to={url}>
              <Translate id="general.learnMore">Learn more</Translate>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsRow({
  items,
  height,
  columns,
  accentColor,
}: {
  items: Props[];
  height: number;
  columns: number;
  accentColor?: string;
}): JSX.Element {
  let cols = 6;
  if (columns <= 12 || columns >= 1) {
    cols = 12 / columns;
  }

  return (
    <div className="row">
      {items.map((card) => (
        <Card key={card.name} {...card} height={height} columns={cols} accentColor={accentColor} />
      ))}
    </div>
  );
}
