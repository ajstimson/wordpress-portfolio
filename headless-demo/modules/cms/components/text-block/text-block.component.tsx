import React from "react";
import { TextProps } from "./text-block.type";

export const TextComponent: React.FC<TextProps> = ({
  html
}) => {
  return (
    <section className="content">
      <div className="liner">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    </section>
  );
};
