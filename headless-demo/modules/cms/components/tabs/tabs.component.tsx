import React from "react";
import { TabsProps, TabItemProps } from "./tabs.type";


export const TabsComponent: React.FC<TabsProps> = ({
 tabs
}) => {
  return (
    <section className="tabs-section">
        <div className="liner">
            <div className="tabbed">
            {tabs.map(({name}, index) => (
              <input type="radio" id={"tab-" + index} name="tabs" key={index} defaultChecked={index < 1 ? true : false}/>
            ))}
              <ul className={"tabs count-" + tabs.length}>
                {tabs.map(({name}, index) => (
                  <li className="tab" key={index}>
                    <label htmlFor={"tab-" + index + ""}><span>{name}</span></label>
                    </li>
                ))}
              </ul>

                {tabs.map(({section_header, html, standalone_cta_link, image}, index) => (
                  <div className="tab-content" key={index}>
                    <div className={`${image.url?.length > 0 ? "grid" : "column"}`}>
                      <div className={`${image.url?.length > 0 ? "tab-left" : "tab-column"}`}>
                        {section_header && <h3>{section_header}</h3> }
                        <div className="tab-html" dangerouslySetInnerHTML={{__html: html }}/>
                        {standalone_cta_link.url &&
                          <a href={standalone_cta_link.url} target={standalone_cta_link.target}>{standalone_cta_link.text}</a>
                        }
                      </div>
                      {image.url?.length > 0  ? 
                        <div className="tab-right">
                          <img src={image.url} alt={image.alt}/>
                        </div>
                      : null }
                    </div>
                  </div>
                ))}
          </div>
      </div>
    </section>
  );
};
