import React from "react";
import { MarqueeProps } from "./marquee.type";

export const MarqueeComponent: React.FC<MarqueeProps> = ({
  buttons,
  image,
  template,
  text,
  title,
}) => {
  const buttonsJSX = (
    <div className="buttons">
      {buttons.map(({ title, target, url }, index) => (
        <a
          key={index}
          className={`button marquee_${title
            .toLowerCase()
            .split(" ")
            .join("_")}`}
          target={target || "_self"}
          href={url}
        >
          <span>{title}</span>
          <span></span>
        </a>
      ))}
    </div>
  );

  const shouldRenderInFeature = template === "template-landing";

  return (
    <div className="marquee">
      <div className="liner">
        <div className="feature left">
          {image && <img src={image.url} alt={image.name}></img>}
        </div>
        <div className="feature right">
          <h1>{title}</h1>
          {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
          {shouldRenderInFeature && buttonsJSX}
        </div>
        {!shouldRenderInFeature && buttonsJSX}
      </div>
    </div>
  );
};
