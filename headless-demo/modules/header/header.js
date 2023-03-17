import React, { useEffect } from "react";
import './header.module.scss';
export var Header = function (_a) {
    var data = _a.data;
    useEffect(function () {
        if (data) {
            var menuItems_1 = document.querySelectorAll('#menu-main-nav>.menu-item');
            var width_1 = window.innerWidth;
            var toggle_1 = function (el, status) { return el.classList.toggle(status); };
            var menuSetup = function (menuItems, width) {
                // delays in milliseconds
                var showDelay = 100, hideDelay = 400;
                // holding variables for timers
                var menuEnterTimer, menuLeaveTimer;
                // get the top-level menu items
                for (var i = 0; i < menuItems.length; i++) {
                    var el = menuItems[i].querySelector('*:first-of-type');
                    var title = el.innerHTML.replace(' ', '-').toLowerCase();
                    el.classList.add(title);
                    // el.classList.add(title);
                    if (width > 1080) {
                        // triggered when user's mouse enters the menu item
                        menuItems[i].addEventListener('mouseenter', function () {
                            var thisItem = this;
                            // clear the opposite timer
                            clearTimeout(menuLeaveTimer);
                            // hide any active dropdowns
                            for (var j = 0; j < menuItems.length; j++) {
                                menuItems[j].classList.remove('active');
                            }
                            if (thisItem.classList.contains('menu-item-872')) {
                                return;
                            }
                            // add active class after a delay
                            menuEnterTimer = setTimeout(function () {
                                thisItem.classList.add('active');
                            }, showDelay);
                        });
                        // triggered when user's mouse leaves the menu item
                        menuItems[i].addEventListener('mouseleave', function () {
                            var thisItem = this;
                            // clear the opposite timer
                            clearTimeout(menuEnterTimer);
                            // remove active class after a delay
                            menuLeaveTimer = setTimeout(function () {
                                thisItem.classList.remove('active');
                            }, hideDelay);
                        });
                    }
                    else {
                        menuItems[i].addEventListener('click', function (e) {
                            var thisItem = this;
                            thisItem.onClick = toggle_1(thisItem, 'active');
                            removeActive_1(menuItems, thisItem);
                        });
                    }
                }
            };
            menuSetup(menuItems_1, width_1);
            var removeActive_1 = function (menuItems, thisItem) {
                for (var i = 0; i < menuItems.length; i++) {
                    var thatItem = menuItems[i];
                    if (thatItem !== thisItem) {
                        thatItem.classList.remove('active');
                    }
                }
            };
            //responsive menu detection
            var mobileMenu_1 = function (width) {
                var nav = document.querySelector('.menu-main-nav-container');
                var enroll = document.querySelector('.header-enroll');
                var utility = document.querySelector('header .utility');
                var mobileMenu = document.querySelector('.mobile-menu');
                enroll.appendChild(utility);
                nav.appendChild(enroll);
                mobileMenu.appendChild(nav);
            };
            var nav_1 = document.querySelector('#nav');
            if (width_1 < 1081) {
                mobileMenu_1(width_1);
                nav_1.addEventListener('click', function (e) {
                    toggle_1(nav_1, 'active');
                    e.preventDefault;
                    if (nav_1.classList.contains('active')) {
                        document.body.classList.add('mobile-menu-active');
                    }
                    else {
                        document.body.classList.remove('mobile-menu-active');
                        removeActive_1(menuItems_1, null);
                    }
                });
                var call = document.querySelector('.utility li:first-child');
                while (call.childNodes[2]) {
                    call.removeChild(call.childNodes[2]);
                }
                //    call.textContent = call.textContent.slice(0, -1);
            }
            window.addEventListener("resize", function () {
                width_1 = window.innerWidth;
                if (width_1 < 1081) {
                    mobileMenu_1(width_1);
                }
            });
        }
    }, [data]);
    if (!data || !Object.keys(data).length) {
        return null;
    }
    return (React.createElement(HeaderHTML, { data: data }));
};
function preProcess(nav) {
    if (nav.length > 0) {
        return nav;
        // return nav.replace("https://staging.example.com", "");
    }
}
var HeaderHTML = function (_a) {
    var _b = _a.data, utility_header = _b.utility_header, logo = _b.logo, nav_menu = _b.nav_menu, enroll_button = _b.enroll_button, request_info_button = _b.request_info_button;
    var nav = preProcess(nav_menu);
    // import Link from next/link
    // <Link href={yourObject.href}>{yourObject.text}</Link>
    // https://nextjs.org/docs/api-reference/next/link
    // <Link href={yourObject.href} as="button" | as="span">{yourObject.text}</Link>
    // when you have target, use <a>
    return (React.createElement("header", { id: "top", role: "banner", className: "the-page-header" },
        React.createElement("div", { className: "utility" },
            React.createElement("div", { className: "liner" },
                React.createElement("div", { dangerouslySetInnerHTML: { __html: utility_header.contact_info } }))),
        React.createElement("div", { className: "header-main" },
            React.createElement("div", { className: "liner" },
                React.createElement("div", { className: "branding" },
                    React.createElement("a", { href: '/' },
                        React.createElement("img", { src: logo.url, title: logo.alt }))),
                React.createElement("div", { className: "navigation" },
                    React.createElement("div", { className: "nav-liner", dangerouslySetInnerHTML: { __html: nav } }),
                    React.createElement("input", { id: "nav", type: "checkbox" }),
                    React.createElement("label", { htmlFor: "nav", className: "icon" },
                        React.createElement("div", { className: "mobile-nav-liner" },
                            React.createElement("div", { className: "menu" })),
                        React.createElement("span", null, "MENU")),
                    React.createElement("nav", { className: "mobile-menu" })),
                React.createElement("div", { className: "header-enroll" },
                    React.createElement("a", { className: "button", target: enroll_button.target, href: enroll_button.url }, enroll_button.title),
                    React.createElement("a", { className: "button request-info", target: request_info_button.target, href: request_info_button.url }, request_info_button.title))))));
};
