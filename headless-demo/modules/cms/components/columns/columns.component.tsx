import React from "react";
import { ColumnsProps } from "./columns.type";

export const ColumnsComponent: React.FC<ColumnsProps> = ({
  title,
  column
}) => {
  return (
    <section className="columns-section">
      <div className="background" />
      {title && 
      <div className="title-liner">
        <h2>{title}</h2>
      </div>
      }
        <div className={"liner column-" + column.length}>
              {column.map(({ image, link, text }, index) => (
                <div className='column' key={index}>
                  <a href={link.url} target={link.target}>
                    <img
                      src={image.url}
                      alt={image.alt}
                    ></img>
                    <h4><span dangerouslySetInnerHTML={{__html: link.title}}/></h4>
                      {text &&
                        <span>
                        {text}
                       </span>
                     }
                  </a>
                </div>
              ))}
          </div>
      </section>
  );
};
