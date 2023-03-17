import React from "react";
import './footer.module.scss';
export var Footer = function (_a) {
    var data = _a.data;
    if (!data || !Object.keys(data).length) {
        return null;
    }
    return (React.createElement(FooterHTML, { data: data }));
};
var FooterHTML = function (_a) {
    var _b = _a.data, logo = _b.logo, main_content = _b.main_content, main_background = _b.main_background, social = _b.social, statement = _b.statement, subFooterList = _b.subFooterList, subFooterStatement = _b.subFooterStatement, utility_statement = _b.utility_statement;
    return (React.createElement("footer", { id: "bottom", role: "contentinfo", className: "the-page-footer" },
        React.createElement("div", { className: "footer-back", style: { backgroundImage: "url(".concat(main_background.url, ")") } },
            React.createElement("div", { className: "footer-main" },
                React.createElement("div", { className: "liner" },
                    React.createElement("div", { className: "grid" },
                        React.createElement("div", { className: "branding" },
                            React.createElement("img", { src: logo.url, title: logo.name })),
                        React.createElement("div", { className: "footer-content" }, main_content.map(function (_a, index) {
                            var content = _a.content;
                            return (React.createElement("div", { className: 'column', key: index, dangerouslySetInnerHTML: { __html: content } }));
                        })),
                        React.createElement("div", { className: "bottom-row" },
                            React.createElement("div", { className: "social", dangerouslySetInnerHTML: { __html: social } }),
                            React.createElement("div", { className: "statement", dangerouslySetInnerHTML: { __html: statement } })))))),
        React.createElement("div", { className: "footer-sub" },
            React.createElement("div", { className: "liner" },
                React.createElement("div", { className: "sub-list", dangerouslySetInnerHTML: { __html: subFooterList } }),
                React.createElement("div", { className: "sub-statement" },
                    React.createElement("p", { dangerouslySetInnerHTML: { __html: subFooterStatement } })))),
        React.createElement("div", { className: "utility" },
            React.createElement("div", { className: "liner" },
                React.createElement("p", null,
                    "Copyright \u00A9 ",
                    new Date().getFullYear(),
                    " Oregon Virtual Academy. All rights reserved.")))));
};
