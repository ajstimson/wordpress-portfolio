import React from "react";
import { ContentProps } from "./content.type";

export const ContentComponent: React.FC<ContentProps> = ({
  title,
  html
}) => {
  return (
    <section className="content">
      <div className="liner">
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    </section>
  );
};
