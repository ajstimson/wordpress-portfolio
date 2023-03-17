import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"
import ReactDOMServer from 'react-dom/server'
import './header.module.scss'
import { HeaderProps } from '../../types/header-data'

export const Header: React.FC<{data: HeaderProps}> = ({ data }) => {
    useEffect(() => {
        if (data) {
            const menuItems = document.querySelectorAll('#menu-main-nav>.menu-item');


            let width = window.innerWidth

            const toggle = (el, status) => el.classList.toggle(status);
            
            const menuSetup = (menuItems, width) => {

                // delays in milliseconds
                let showDelay = 100,
                    hideDelay = 400;
                // holding variables for timers
                let menuEnterTimer, menuLeaveTimer;
                // get the top-level menu items

                for (let i = 0; i < menuItems.length; i++) {
                    const el = menuItems[i].querySelector('*:first-of-type');
                    const  title = el.innerHTML.replace(' ', '-').toLowerCase();
                    el.classList.add(title)
                    
                    // el.classList.add(title);

                    if (width > 1080){
                          // triggered when user's mouse enters the menu item
                        menuItems[i].addEventListener('mouseenter', function() {
                           
                            let thisItem = this;
                            // clear the opposite timer
                            clearTimeout(menuLeaveTimer);
                            // hide any active dropdowns
                            for (let j = 0; j < menuItems.length; j++) {
                                menuItems[j].classList.remove('active');
                            }

                            if (thisItem.classList.contains('menu-item-872')){
                                return;
                            }
                        
                            // add active class after a delay
                            menuEnterTimer = setTimeout(function() {
                                thisItem.classList.add('active');
                            }, showDelay);
                        });
                
                        // triggered when user's mouse leaves the menu item
                        menuItems[i].addEventListener('mouseleave', function() {
                            let thisItem = this;
                            // clear the opposite timer
                            clearTimeout(menuEnterTimer);
                            // remove active class after a delay
                            menuLeaveTimer = setTimeout(function() {
                                thisItem.classList.remove('active');
                            }, hideDelay);
                        });
                    } else {
                        menuItems[i].addEventListener('click', function(e) {
                            let thisItem = this;
                            thisItem.onClick = toggle(thisItem, 'active');
                            removeActive(menuItems, thisItem);
                        });
                    }
                  
                }
            }


            menuSetup(menuItems, width);

            const removeActive = (menuItems, thisItem) => {
                for (let i = 0; i < menuItems.length; i++) {
                    let thatItem = menuItems[i];

                    if (thatItem !== thisItem){
                        thatItem.classList.remove('active');
                    }
                }
            }
            //responsive menu detection
            const mobileMenu = width => {
                const nav = document.querySelector('.menu-main-nav-container');
                const enroll = document.querySelector('.header-enroll');
                const utility =  document.querySelector('header .utility');
                const mobileMenu = document.querySelector('.mobile-menu');

                
                enroll.appendChild(utility);
                nav.appendChild(enroll);
                mobileMenu.appendChild(nav);

            }

            const nav = document.querySelector('#nav');
           
            if (width < 1081){
                mobileMenu(width);

                nav.addEventListener('click', function(e){
                    toggle(nav, 'active');
                    e.preventDefault;
                    if(nav.classList.contains('active')){
                        document.body.classList.add('mobile-menu-active');
                    } else {
                        document.body.classList.remove('mobile-menu-active');
                        removeActive(menuItems, null)
                    }

                });

                const call =  document.querySelector('.utility li:first-child');
                while (call.childNodes[2]) {
                    call.removeChild(call.childNodes[2]);
                }
            //    call.textContent = call.textContent.slice(0, -1);
            }
            window.addEventListener("resize", () => {
                width = window.innerWidth
                if (width < 1081){
                    mobileMenu(width)
                }
            });

        }
    }, [data])

    

    if (!data || !Object.keys(data).length) {
        return null
    }

    return (
        <HeaderHTML data={data} />
    )
} 

function preProcess(nav){
    if (nav.length > 0){
        return nav
        // return nav.replace("https://staging.example.com", "");
    }
}

const HeaderHTML :React.FC<{ data: HeaderProps}> = ({ data: {
    utility_header,
    logo,
    nav_menu,
    enroll_button,
    request_info_button
} }) => {
    const nav = preProcess(nav_menu);

    // import Link from next/link
    // <Link href={yourObject.href}>{yourObject.text}</Link>
    // https://nextjs.org/docs/api-reference/next/link
    // <Link href={yourObject.href} as="button" | as="span">{yourObject.text}</Link>
    // when you have target, use <a>
    return(
        <header id="top" role="banner" className="the-page-header">
            <div className="utility">
                <div className="liner">
                    <div dangerouslySetInnerHTML={{ __html: utility_header.contact_info}} />
                </div>
            </div>
            <div className="header-main">
                <div className="liner">
                    <div className="branding">
                        <a href='/'>
                            <img src={logo.url} title={logo.alt} />
                        </a>
                    </div>
                    <div className="navigation">
                        <div className="nav-liner" dangerouslySetInnerHTML={{ __html: nav}} />
                        <input id="nav" type="checkbox" />
                        <label htmlFor="nav" className="icon">
                            <div className="mobile-nav-liner">
                                <div className="menu"></div>
                            </div>
                            <span>MENU</span>
                        </label>
                        <nav className="mobile-menu" />
                    </div>
                    <div className="header-enroll">
                        <a className="button" target={enroll_button.target} href={enroll_button.url}>{enroll_button.title}</a>
                        <a className="button request-info" target={request_info_button.target} href={request_info_button.url}>{request_info_button.title}</a>
                    </div>
                </div>
            </div>
        </header>
    )
}
