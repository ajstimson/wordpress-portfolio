import React from "react";
import { Anchor } from "../../../../components/anchor/anchor";
import {
  ContentRowProps,
  ContentProps,
  ContentRowSidebarProps,
  SidebarLinkProps,
} from "./content-row-sidebar.type";

//suppresses "Encountered two children with the same key, `0`" Error
const random = Math.floor((Math.random() * 100) + 1);

export const ContentRowComponent: React.FC<ContentRowProps> = ({
  content,
  sidebars,
}) => {
  return (
    <section className="content row sidebar">
      <div className="liner">
          {content.map(({html, image}, index) => (
            <div key={index} dangerouslySetInnerHTML={{__html: html}} />
          ))}
            <div className="sidebars">
              {sidebars?.map(({ 
                sidebarType, 
                title, 
                icon_content, 
                cta_content, 
                links }, 
              index) => (
              <React.Fragment key={index}>
               <div className={"sidebar type-" + sidebarType.toLowerCase()}> 
                 {icon_content?.map(icon => !!icon && (
                  <React.Fragment key={random + index++}>
                    {index === 0 && <div className="illustrated-title" /> }
                        <div className="sidebar-content">
                        <div className="icon-sidebar">
                          <a href={icon.link.url} target={icon.link.target}>
                            <img src={icon.image.url}  alt={icon.image.alt}/>
                            <span>{icon.link.title}</span>
                          </a>
                        </div>
                      </div>
                      
                      </React.Fragment>
                  ))}
                 
                    {cta_content?.map(cta => !!cta && (
                  <React.Fragment key={random}>
                      <h4>{title}</h4> 
                      <div className="news-content" key={index}>
                        <div dangerouslySetInnerHTML={{__html: cta.content}} />
                      </div>
                      <div className="standalone-link">
                          <a href={cta.link.url} target={cta.link.url}>{cta.link.title}</a>
                        </div>
                    </React.Fragment>
                  ))}
                  <React.Fragment key={random}>
                    {links && <h4 className={"links-" + links.length}>{title}</h4> }
                  {links?.map(({ text, url, target }, index) => (
                    <div className="link" key={index}>
                      <Anchor href={url} target={target} html={text} />
                      {/* <a href={url} target={target} dangerouslySetInnerHTML={{__html: text }} /> */}
                    </div>
                  ))}
                  </React.Fragment>
                </div>
                </React.Fragment>
              ))}
            </div>
      </div>
    </section>
  );
};
