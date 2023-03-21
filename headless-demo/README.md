# Project Overview

Evergreen Virtual Academy is a virtual charter school that provides online education to Oregon students in grades K-12. The school required a website that could be updated easily by its staff, while ensuring security. Therefore, a headless CMS was chosen to separate the content management system from the website, with WordPress being selected as the platform of choice due to the familiarity of its content editor.

## Technologies Used

-   [Next.js](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Docker](https://www.docker.com/)
-   WordPress
-   Gravity Forms
-   Advanced Custom Fields
-   PHP
-   CSS

## Website Requirements

The project required a website that meets the following requirements:

1. The website's content must be easily editable by the school's staff, without causing any issues with design elements.
2. The website must be responsive and mobile-friendly.
3. The website must be secure.
4. The client was interested in using node.js and React for the front-end application.

## How I Implemented the Requirements

To meet the project's requirements, the following steps were taken:

1. Next.js dynamic routing was used to generate pages from WordPress posts and pages.
2. A component library was created in Advanced Custom Fields to mirror the front-end application components. The front-end application would fetch the data from the WordPress REST API and use the component library to render the page. You can view the relevant code here: [Wordpress functions.php](wordpress-files/functions.php)

3. Custom post types were created in WordPress to store FAQs, staff illustrations, and other content used repeatedly throughout the site. A custom REST API endpoint was built to fetch the data from the WordPress REST API.
4. Access to the WordPress REST API was restricted using the [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) plugin.
5. Editing of the production site was prevented. Instead, staff members would edit the site on a staging site and then use the WPEngine dashboard to push the changes to the production site. The dashboard could also be used to revert the site to a previous version in case of errors or mistakes.
6. A file proxy was set up to prevent direct access to the WordPress files. This prevented the WordPress files from being modified.
7. Docker was used to containerize the application and deploy it to a cloud server. I also used Portainer to manage the Docker containers.
8. During development, I used [Husky](https://github.com/typicode/husky) to run ESLint and Prettier on every commit to ensure code quality. I also used [Jest](https://jestjs.io/) to write unit tests for the front-end application.
9. I added component documentation for collaborators here: [Component Documentation](documentation/adding-components.md)

## Possible Improvements

The following improvements could be made to the application:

-   I would consider using Gatsby instead of Next.js as there is [more documentation](https://www.gatsbyjs.com/guides/wordpress/) on building headless WordPress sites with Gatsby. In particular I found that form handling with Next.js and Gravity Forms was complex and not well documented. Gatsby has a [plugin](https://www.gatsbyjs.com/plugins/gatsby-source-gravityforms/) for integrating Gravity Forms with Gatsby.
-   I'm not sure I would use TypeScript for this application as it adds unnecessary complexity. During development, I discovered that ACF components did not have reliably consistent data types. For example, a text field could return a string or an array. I used type guards to check the data type, but I found the resulting complexity to be unnecessary.

After the first phase of development, I found that the block editor had more consistent data types than ACF, which would have significantly simplified front-end component library development.

-   Use the block editor instead of ACF and write a custom block for each component. This would allow the client to easily edit the content of the site without having to learn how to use ACF. Additionally, the block editor's REST API output can be extended to allow for control over the data structure similar to ACF.
-   A CSS preprocessor like SASS could be used to make the CSS more maintainable.
-   If I had more time, I would have moved the Wordpress site into a Docker container and automated the staging to production deployment process using a CI/CD pipeline. This would have allowed me to add safeguards to prevent editors from pushing changes that could break design elements. It would also have improved the editor's experience by removing the need to use the WPEngine dashboad.
