import React from "react";
import Link from "next/link";
import { PageBreadcrumb } from "../../types";

const ConditionalWrapper = ({ condition, wrapper, children }) => 
  condition ? wrapper(children) : children;

export const Breadcrumbs: React.FC<{ items: PageBreadcrumb[] }> = ({
  items,
}) => {
  const lastIndex = items.length - 1;
  return (
    <section className="breadcrumbs">
      <div className="liner">
        <ul>
          {items.map(({ name, url }, index) => (
              <li key={index}>
                <ConditionalWrapper
                  condition={
                    index !== lastIndex && 
                    name !== 'false' && 
                    name !== 'Admissions' &&
                    name !== 'About' &&
                    name !== 'Academics' && 
                    name !== 'Resources'
                  }
                  wrapper={children => <a href={url}>{children}</a>
                }
                >
                  <React.Fragment>
                    {name} 
                  </React.Fragment>
                </ConditionalWrapper>
                { index !== lastIndex && <span>/</span> }
              </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
