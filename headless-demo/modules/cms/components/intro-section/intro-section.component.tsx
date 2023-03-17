import React from "react";
import {size} from 'lodash';

import {
  IntroImageProps,
  IntroProps,
  IntroSignatureProps,
  IntroSidebarProps,
} from "./intro-section.type";

const Salutations: React.FC<{
  image: IntroImageProps;
  salutation: string;
  name: string;
}> = ({ image, name, salutation }) => {
  return (
    <div className={"salutation"}>
      <p>{salutation}</p>
      {image && <img src={image.url} alt={image.alt}></img>}
      <p dangerouslySetInnerHTML={{ __html: name }} />
    </div>
  );
};

const Signature: React.FC<IntroSignatureProps> = ({
  name,
  salutation,
  headshot,
  signatureImage,
}) => {
  if (headshot) {
    return (
      <div className="grid">
        <div className="headshot">
          <div className="yellow circle" />
          <img src={headshot.url}></img>
        </div>
        <div>
          <Salutations
            image={signatureImage}
            salutation={salutation}
            name={name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="column">
      <Salutations image={signatureImage} salutation={salutation} name={name} />
    </div>
  );
};

//suppresses "Encountered two children with the same key, `0`" Error
const random = Math.floor((Math.random() * 100) + 1);


export const IntroComponent: React.FC<IntroProps> = ({
  html,
  signature,
  sidebars,
}) => {
  return (
    <section className={sidebars ? "intro has-sidebar" : "intro no-sidebars"}>
      <div className="liner">
        <div className="content">
          <div className="letter" dangerouslySetInnerHTML={{ __html: html }} />
            {signature && <Signature {...signature} />}
        </div>       
      <div className="sidebars">
        {sidebars?.map(({ sidebarType, title, content, links }, index) => (
          
          <div className={"sidebar type-" + sidebarType.toLowerCase()} key={index}>
            {title && <h4>  {title}</h4>}   
              {content?.map(item => 
              <div className="sidebar-content" key={random}>
                <div className="news-content">
                  <div dangerouslySetInnerHTML={{__html: item.html}}></div>
                </div>
                {item.standalone_link &&
                <div className="standalone-link">
                  <a href={item.standalone_link.url} target={item.standalone_link.url}>{item.standalone_link.title}</a>
                </div>
              }
              </div>
              )}
              {links?.map(({ text, url, target }, index) => (
                <React.Fragment key={index}>
                  { text &&
                    <div className="sidebar-content" key={index}>
                      <div className="link" >
                        <a href={url} target={target} dangerouslySetInnerHTML={{__html: text }} />
                      </div>
                    </div>
                  }
                </React.Fragment>
              ))}
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};
