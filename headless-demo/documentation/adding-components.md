# Adding a new component

### Wordpress Instructions

1. Create a new field by navigating to `WP Admin > Custom Fields > Field Groups > Components`, select the "Component" flexible content field, hover over one of the existing layouts and click "Add New"
   > Note: The list of components is organized alphabetically
2. The layout can include whichever group of fields you prefer (e.g. title, text, image, posts, etc.)
3. Once you've added the fields, click "Publish" and then "Update" to save the changes
4. The new component will now be available in the "Components" flexible content field on a page NOT using the default template.

### React Instructions

1. Find the expected JSON structure for the component at the Wordpress API endpoint `/wp-json/wp/v2/pages?slug={xyz}`. The component will be nested under the `acf/components` key.
2. Create a new folder in `modules/cms/components` with the name of the component
3. Create 3 new files in the new folder named `{name}.type.ts`, `{name}.normalizer.ts`, `{name}.component.tsx`
4. Use the existing components as a reference for the structure of the files. They `type` file sets the expected types for the incoming WordPress JSON and the desired output. The `normalizer` file is responsible for converting the Wordpress JSON into the desired output. The `component` file is responsible for rendering the component.
   > Note: The `normalizer` file became necessary because the Wordpress API returns the JSON in inconsistent formats.
5. Add the new component's `normalizer` and `component` files to the `modules/cms/components/index.ts` file
6. Styling for the component can be added to the `styles/globals.css` and `styles/responsive.css` files
