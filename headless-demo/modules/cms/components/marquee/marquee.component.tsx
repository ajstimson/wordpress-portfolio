import React from "react";
import { MarqueeProps } from "./marquee.type";

export const MarqueeComponent: React.FC<MarqueeProps> = ({
  buttons,
  image,
  template,
  text,
  title,
}) => {
  
  const shouldRenderInFeature = template === 'template-landing'

  const featureLeft = (
      <div className="feature left">
        {image && <img src={image.url} alt={image.name}></img>}
      </div>
  );

  const featureRightContent = (
    <>
      <h1>{title}</h1>
      {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
    </>
  );

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

  const inFeature = (
    <>
      {featureLeft}
      <div className="feature right">
        {featureRightContent}
        {buttonsJSX}
      </div>
    </>
  );

  const outFeature = (
    <>
      {featureLeft}
      <div className="feature right">
        {featureRightContent}
      </div>
      {buttonsJSX}
    </>
  );

  const combinedFeature = (
    <>
      {featureLeft}
      <div className="feature right">
        {featureRightContent}
        {shouldRenderInFeature && buttonsJSX}
      </div>
      {!shouldRenderInFeature && buttons.length>0 && <div className="feature-bottom">{buttonsJSX}</div>}
    </>
  )

  return (
    <section className="marquee">
      <div className={`liner ${!shouldRenderInFeature && buttons.length>0 ? "bottom-feature" : ""}`}>
        {combinedFeature}
      </div>
    </section>
  );
};
