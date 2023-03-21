# Project Overview

This is a product configurator tool I built for Woodfold in 2019. I shepherded this project from discovery sessions with several stakeholders, through drafting functional specifications, wireframes, design mock-ups and implementation. The goal was to create an online tool that would replace the client's time-intensive system.

## Technologies Used

-   WordPress
-   Gravity Forms
-   Bootstrap
-   [Pagination.js](https://pagination.js.org/)
-   [JS Shopping Cart API](https://codepen.io/Dimasion/pen/oBoqBM)
-   PHP
-   jQuery
-   CSS

## Website Order Form Requirements

-   Dynamic product configuration (e.g. product options are displayed based on the user's selections)
-   Dynamic quotes (e.g. product pricing is displayed based on the user's selections)
-   Customer dashboard for managing orders
-   Admin dashboard for managing users and orders, including filters and pagination
-   Cart system for combining multiple product configurations
-   Forwarding succesful orders to Zendesk
-   The client required support for legacy browsers (IE9), so the JavaScript files could not use ES5 syntax - which is why the code is written in ES3.
-   They wanted the tool to be independent of most plugins, to avoid future conflicts with other plugins.

## How I Implemented the Requirements

-   I used Gravity Forms to create a product configuration form that the client's staff could manage and update with changing prices.
-   I reorganized the Gravity Forms output, client-side using jQuery, to match the product configuration design.
-   To create a visual representation of the final product, I created layers from images of the client's product catalog and used jQuery and CSS to dynamically display selected options.
-   I customized the JS Shopping Cart API to create a cart system and used PHP and MySQL to store and retrieve cart data.
-   To create the customer and admin dashboards, I used PHP, MySQL, jQuery, and Pagination.js. I also used PHP to forward successful orders to Zendesk.

# How I would improve this application

-   Update the JavaScript code to use ES6 syntax
-   Replace the `struts.js` file functionality with server-side code using PHP and Gravity Forms' REST API.
-   Move much of the relevant PHP code in clip_custom.php into a WordPress plugin.
-   Responsive design
