import { title } from "process";
import React from "react";
import { NewsSidebarProps } from "./news-sidebar.type"

export const NewsSidebarComponent: React.FC<NewsSidebarProps> = ({
    posts,
    more_news_link,
    sidebars

}) =>{
    return (
        
        <section className="news-section has-sidebars">
            <div className="liner">
                <div className="news-content">
                    <h2>News & Events</h2>
                    {posts &&
                    <>
                        <hr />
                        <ul>
                        {posts.map(({title, excerpt}, index) => (
                            <li className="news-item" key={index}>
                                <div dangerouslySetInnerHTML={{__html: excerpt}} />
                            </li>
                        ))}
                        </ul>
                        <hr />
                    </>
                    }
                    <a className="standalone-link" href={more_news_link.url} target={more_news_link.target}  dangerouslySetInnerHTML={{__html: more_news_link.title}}/>
                </div>

                <div className="sidebars">
                    {sidebars.map(({title, link}, index) => (
                    <div className="sidebar" key={index}>
                        <a href={link.url} target={link.target}>
                            <span className="row">
                                <span className="flex-item">
                                    <span className="prefix" dangerouslySetInnerHTML={{__html: title}} />
                                    <h4>{link.title}</h4>
                                </span>
                                <span className="flex-item arrow" />
                            </span>
                        </a>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

