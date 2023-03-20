# Project Overview

IDExperts required a WordPress theme that could be quickly launched in the event of a client's security breach. The theme needed to accomodate 4 different layouts and 2 product types. All layouts needed to be responsive and mobile friendly. The theme also needed to be easily customizable by the client.

## Technologies Used

-   WordPress
-   Genesis Framework
-   Advanced Custom Fields
-   PHP
-   CSS

## How I Implemented the Requirements

-   I customized the Corporate Pro theme (Genesis Framework) by creating a custom template file (primary-page.php).
-   I used Advanced Custom Fields to create custom fields for the primary page template.
-   I used PHP to dynamically load the custom fields into the template file.
-   I wrote CSS to style the primary page template.

## How I Would Improve This Application

-   I would use a CSS preprocessor like SASS to make the CSS more maintainable.
-   I would improve the use of CSS flexbox and grid to make reduce the amount of media queries needed to make the site responsive.
-   I would use the WordPress block editor to create reusable blocks rather than using Advanced Custom Fields.
-   I would recommend exporting the WordPress generated site into a static site generator like Jekyll specifically using the [WP->Jekyll exporter](https://github.com/benbalter/wordpress-to-jekyll-exporter) or [Simply Static](https://wordpress.org/plugins/simply-static/) to make the site more secure.
-   A Docker container could include instructions to automatically export the site to a static site generator and deploy the site to a static site host like Netlify.
