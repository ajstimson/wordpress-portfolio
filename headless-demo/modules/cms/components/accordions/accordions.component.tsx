import React from "react";
import { AccordionProps, AccordionItemProps } from "./accordions.type";


export const AccordionComponent: React.FC<AccordionProps> = ({
  title,
  accordion
}) => {
  return (
    <section className="accordion-section">
        <div className="liner">
            {title && <h2>{title}</h2>}
              {accordion.map(({ title, html }, index) => (
                <div className='accordion' key={index}>
                    <input type="checkbox" name={title.toLowerCase().split(' ').join('_')} id={title.toLowerCase().split(' ').join('_')} />
                      <label className="title" htmlFor={title.toLowerCase().split(' ').join('_')}>{title}</label>
                      <div className="content" dangerouslySetInnerHTML={{__html: html}}>
                      </div>
                </div>
              ))}
          </div>
      </section>
  );
};
