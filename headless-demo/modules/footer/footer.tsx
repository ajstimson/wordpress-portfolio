import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import ReactDOMServer from 'react-dom/server'
import './footer.module.scss'
import { FooterData } from '../../types/footer-data'

export const Footer: React.FC<{data: FooterData}> = ({ data }) => {
    if (!data || !Object.keys(data).length) {
        return null
    }

    return (<FooterHTML data={data} />)
}


const FooterHTML :React.FC<{ data: FooterData}> = ({ data: {
    logo, 
    main_content,
    main_background,
    social,
    statement,
    subFooterList,
    subFooterStatement,
    utility_statement
} }) => {
    return(
        <footer id="bottom" role="contentinfo" className="the-page-footer">
            <div className="footer-back" style={{backgroundImage: `url(${main_background.url})`}}>
                <div className="footer-main">
                    <div className="liner">
                        <div className="grid">
                            <div className="branding">
                                <img src={logo.url} title={logo.name}></img>
                            </div>
                            <div className="footer-content">
                                {main_content.map(({ content }, index) => (
                                    <div className='column' key={index} dangerouslySetInnerHTML={{__html: content}}>
                                    </div>
                                ))}
                            </div>
                            <div className="bottom-row">
                                <div className="social" dangerouslySetInnerHTML={{ __html: social}}></div>
                                <div className="statement" dangerouslySetInnerHTML={{ __html: statement}}></div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="footer-sub">
                <div className="liner">
                    <div className="sub-list" dangerouslySetInnerHTML={{ __html: subFooterList}}></div>
                    <div className="sub-statement">
                        <p dangerouslySetInnerHTML={{ __html: subFooterStatement}}></p>
                    </div>
                </div>
            </div>
            <div className="utility">
                <div className="liner">
                <p>Copyright © {new Date().getFullYear()} Oregon Virtual Academy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}