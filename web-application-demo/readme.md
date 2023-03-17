# Woodfold Elevator Gate Configurator tool

This is a product configurator tool I built for Woodfold in 2019. I shepherded this project from discovery sessions with several stakeholders, through drafting functional specifications, wireframes, design mock-ups and implementation.

The project constraints were as follows:

-   The client required support for legacy browsers (IE9), so the JavaScript files could not use ES5 syntax - which is why the code is written in ES3.
-   They required the application to be built using their existing WordPress site.
-   They wanted the tool to be independent of most plugins, to avoid future conflicts with other plugins.

The application is built using

-   WordPress
-   Gravity Forms
-   Bootstrap
-   Pagination.js
-   A customized version of Shopping Cart API.

The application also uses two custom WordPress templates written in PHP and jQuery/JavaScript code.

The application offers the following features:

-   Dynamic product configuration (e.g. product options are displayed based on the user's selections)
-   Dynamic quotes (e.g. product pricing is displayed based on the user's selections)
-   Cart system for combining multiple product configurations
-   Customer dashboard for managing orders
-   Admin dashboard for managing users and orders

# How I would improve this application

-   Update the JavaScript code to use ES6 syntax
-   Replace the `struts.js` file functionality with server-side code using PHP and Gravity Forms' updated API.
-   Move much of the relevant PHP code into a custom WordPress plugin.
-   Responsive design
