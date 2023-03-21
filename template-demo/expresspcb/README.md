# Project Overview

The objective of this project was to create a website to showcase the features of a custom circuit board software, while also serving as an alternative portal for ordering circuit board prototypes. Some users were blocked from placing orders due to strict firewall rules, so the website provided an alternative ordering method.

## Technologies Used

-   WordPress
-   Genesis Framework
-   WooCommerce
-   Gravity Forms
-   PHP
-   jQuery

## Website Order Form Requirements

1. Verify the content of .zip files to ensure they contained a proprietary file with circuit board manufacture instructions and an XML file with important quote details.
2. Dynamically load form options based on variables collected from the XML file.
3. Access a RESTful API to check pricing, availability, and shipping method details.
4. Customize the WooCommerce checkout process to display relevant details.
5. Customize the WooCommerce order confirmation process (success page and confirmation emails) to show pertinent order information.
6. Transmit order details to client ERP software and retrieve order status.
7. The website needed to support legacy browsers (IE9), so the JavaScript files could not use ES5 syntax.

## How I Implemented the Requirements

-   I used PHP's ZipArchive class to extract the proprietary file and XML file from the .zip file.
-   I used PHP's SimpleXML class to extract the variables needed for dynamic form options from the XML file.
-   I used jQuery to dynamically load the form options.
-   I used AJAX to initiate PHP cURL requests to the RESTful API.
-   I stored order details persistently in the WordPress database and used PHP's session class to retain order details during the checkout process.
-   I used PHP templates to customize the order form page, checkout page, and order confirmation page.
-   I used PHP cURL requests to transmit order details to the client ERP software and retrieve order status. This process was initiated on the order confirmation page to avoid blocking the user's browser and transmitting failed orders.

## How I Would Improve This Application

1. I would update the JavaScript code to use ES6 syntax, specifically using async and await to handle asynchronous requests.

2. I would handle more of the form validation on the server-side using PHP.

3. I would separate JS and PHP functionality into separate files.
