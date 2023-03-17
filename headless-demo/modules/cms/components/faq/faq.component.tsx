import React from "react";
import { FAQProps } from "./faq.type";

export const FAQComponent: React.FC<FAQProps> = ({
  title,
  faqs
}) => {
  return(
      <section className={"accordion-section faq items-" + faqs.length}>
          <div className="liner">
          <h2 dangerouslySetInnerHTML={{__html: title}} />
              {faqs.map(({ question, answer }, index) => (
                  <div className="accordion" key={index}>
                      <input type="checkbox" name={'item-' + index} id={'item-' + index} />
                        <label className="title" htmlFor={'item-' + index} dangerouslySetInnerHTML={{__html: question}} />
                        <div className="content" dangerouslySetInnerHTML={{__html: answer}}>
                        </div>
                  </div>
                ))}
            </div>
        </section>
    )
  };