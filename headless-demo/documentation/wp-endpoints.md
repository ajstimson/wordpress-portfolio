# WordPress Endpoints

## Pages

### All Pages

[/wp-json/wp/v2/pages](/wp-json/wp/v2/pages)

### Single Page

[/wp-json/wp/v2/pages/{id}](/wp-json/wp/v2/pages/1)

### By Slug

[/wp-json/wp/v2/pages?slug={slug}](/wp-json/wp/v2/pages?slug=about)

---

## Posts

### All Posts

[/wp-json/wp/v2/posts](/wp-json/wp/v2/posts)[^1]

### Single Post

[/wp-json/wp/v2/posts/{id}](/wp-json/wp/v2/posts/1)

### By Slug

[/wp-json/wp/v2/posts?slug=sample-post](/wp-json/wp/v2/posts?slug=sample-post)

### Post Categories

[/wp-json/wp/v2/categories](/wp-json/wp/v2/categories)

### Single Post Category

[/wp-json/wp/v2/categories/{id}](/wp-json/wp/v2/categories/1)

### Post Tags

[/wp-json/wp/v2/tags](/wp-json/wp/v2/tags)

### Single Post Tag

[/wp-json/wp/v2/tags/{id}](/wp-json/wp/v2/tags/1)

---

## Custom Post Types

### Team Members

[/wp-json/wp/v2/team](/wp-json/wp/v2/team)[^1]

### FAQ Items

[/wp-json/wp/v2/faq](/wp-json/wp/v2/faq)[^1].

### Sidebar Items

[/wp-json/wp/v2/sidebar](/wp-json/wp/v2/sidebar)[^1].

---

[^1]: Note: The server will limit the number of results returned to **47**. To get more results, use a loop to fetch `per_page=47&offset=${47 * (i + 1)}` parameter.
