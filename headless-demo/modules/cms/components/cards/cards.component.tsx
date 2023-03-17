import React from "react";
import { CardsProps } from "./cards.type";

export const CardsComponent: React.FC<CardsProps> = ({
  background,
  ornaments,
  title,
  cards,
}) => {
  return (
    <section className={"card-section card-count-" + cards.length  + `${title ? "" : " no-title"}`} >
        <div className="liner">
          {ornaments ? ornaments.length > 0 &&
            <div className="ornament-wrap">
              {ornaments.map(({ url, alt }, index) => (
              <div className='ornament' key={index}>
                <img
                  src={url}
                  alt={alt}
                ></img>
              </div>
            ))}</div>
            : null}
            {title &&             
            <h2 className="cards-title">{title}</h2>
            }
            <div className="cards">
              {cards.map(({ image, title, text, link }, index) => (
                <div 
                  className= 
                    {"card" + 
                      `${image.url ? "" : " no-image"}` +
                      `${link.url ? "" : " no-link"}`
                    }

                key={index}>
                  {image.url && <img
                    src={image.url}
                    alt={image.alt}
                  ></img>
                  }
                  <h4>{title}</h4>
                  <hr></hr>
                  <p>{text}</p>
                  { link.url && 
                  <div className="standalone-link">
                    <a href={link.url} target={link.target}>{link.title}</a>
                  </div>
                  }
                </div>
              ))}
            </div>
          </div>
      </section>
  );
};
