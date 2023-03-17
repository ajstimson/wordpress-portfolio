import React from "react";
import { BrandStatementProps } from "./brand-statement.type"

export const BrandStatementComponent: React.FC<BrandStatementProps> = ({
    title,
    html

}) =>{
    return (
        <section className="brand-statement">
            <div className="liner">
                { title && 
                <h3>{title}</h3>
                }
                <div className="cta-content" dangerouslySetInnerHTML={{ __html: html}}></div>
            </div>
        </section>
    )
}

