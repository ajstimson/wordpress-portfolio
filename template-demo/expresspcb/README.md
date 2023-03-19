# Project Overview

The goal of this project was to create a website showcasing the features of thier custom circuit board software. The website also serves as an alternate portal for ordering circuit board prototypes. Due to strict firewall rules, some software users were blocked from placing orders, so the website provided an alternative means of ordering.

## Technologies Used

-   WordPress
-   Genesis Framework
-   WooCommerce
-   Gravity Forms
-   PHP
-   jQuery

## Website Order Form Requirements

1. Parse .zip files to make sure the archive contained a proprietary file with circuit board manufacture instructions and an XML file that provided crucial details to providing a quote value.

2. Dynamically load form options depending on variables collected from the XML file.

3. Access a RESTful API to check for pricing and availability and shipping method details.

4. Customize the WooCommerce checkout process to display relevant details.

5. Customize the WooCommerce order confirmation process (success page and confirmation emails) to display relevant order details.

6. Transmit order details to client ERP software and retrieve order status.

7. The website needed to support legacy browsers (IE9), so the JavaScript files could not use ES5 syntax.

## How I Implemented the Requirements

1. I used PHP's ZipArchive class to parse the .zip file and extract the proprietary file and XML file.

2. I used PHP's SimpleXML class to parse the XML file and extract the variables needed to dynamically load the form options.

3. I used jQuery to dynamically load the form options.

4. I used AJAX to initiate PHP cURL requests to the RESTful API.

5. I stored persistent order details in the WordPress database and used PHP's session class to store the order details during the checkout process.

6. I used PHP templates to customize the order form page, checkout page, and order confirmation page.

7. I used PHP cURL requests to transmit order details to the client ERP software and retrieve order status. This process was initiated on the order confirmation page to avoid blocking the user's browser and transmitting failed orders.

## How I Would Improve This Application

1. I would update the JavaScript code to use ES6 syntax, specifically using async and await to handle asynchronous requests.

2. I would handle more of the form validation on the server-side using PHP.

3. I would separate JS and PHP functionality into separate files.
