import React from "react";
import { ImageTextProps } from "./image-text.type";



export const ImageTextComponent: React.FC<ImageTextProps> = ({
  mixed_content
}) => {
  return (
    <section className="image-text">
      <div className="liner">
          {mixed_content.map(({
            layout,
            content,
            image
          }, index) => (
            <React.Fragment key={index}>
              { index === 0 && 
              <div className={'feature left layout-' + layout.replace('_', '-').toLowerCase()} key={index}>
                <div className="feature-liner">

                { content &&
                  <div className={'html-' + index} dangerouslySetInnerHTML={{ __html: content }} />
                }
                { image.url &&
                  <img className={'image-' + index} src={image.url} alt={image.alt} />
                }
                </div>
              </div>
              }
               </React.Fragment>
          ))}
          {mixed_content.map(({
            layout,
            content,
            image
          }, index) => (
            <React.Fragment key={index}>
              { index === 1 && 
              <div className={'feature right layout-' + layout.replace('_', '-').toLowerCase()} key={index}>
                <div className="feature-liner">
                  { content &&
                    <div className={'html-' + index} dangerouslySetInnerHTML={{ __html: content }} />
                  }
                  { image.url &&
                    <img className={'image-' + index} src={image.url} alt={image.alt} key={index} />
                  }
                </div>
              </div>
              }
              </React.Fragment>
          ))}
        </div>
    </section>
  );
};
