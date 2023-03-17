import React from "react";
import { ResourceProps } from "./resources.type";

export const ResourcesComponent: React.FC<ResourceProps> = ({
  background,
  title,
  resource
}) => {
  return (
    <section className={"resource-section resource-item-count-" + resource.length  + `${title ? "" : " no-title"}`} >
        <div className="liner">
            {title &&             
            <h2 className="cards-title">{title}</h2>
            }
            <div className="cards">
              {resource.map(({ item_title, text, link_data }, index) => (
                <div 
                  className= 
                    {"card" + 
                      `${link_data.link_type}`
                    }

                  key={index}>
                  <h4>{item_title}</h4>
                  <hr></hr>
                  <p>{text}</p>
                  { link_data.url && 
                  <div className="standalone-link">
                    <a href={link_data.url} target={link_data.target}><span></span></a>
                  </div>
                  }
                </div>
              ))}
            </div>
          </div>
      </section>
  );
};
