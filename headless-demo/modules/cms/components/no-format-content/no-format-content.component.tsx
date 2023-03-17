import React from "react";
import { ContentProps } from "./no-format-content.type";

export const NoFormatContentComponent: React.FC<ContentProps> = ({
  title,
  html
}) => {
  return (
    <section className="content no-format">
      <div className="liner">
          <h2>{title}</h2>
          <div className="block" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    </section>
  );
};
