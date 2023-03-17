<?php
/**
 * Oregon Virtual Academies functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package  Virtual Academies
 */

/**
 * Get all the include files for the theme.
 *
 * @author WebDevStudios
 */
function wp_orva_get_theme_include_files() {
	return [
		'inc/setup.php', // Theme set up. Should be included first.
		'inc/compat.php', // Backwards Compatibility.
		'inc/customizer/customizer.php', // Customizer additions.
		'inc/extras.php', // Custom functions that act independently of the theme templates.
		'inc/hooks.php', // Load custom filters and hooks.
		'inc/security.php', // WordPress hardening.
		'inc/scaffolding.php', // Scaffolding.
		'inc/scripts.php', // Load styles and scripts.
		'inc/template-tags.php', // Custom template tags for this theme.
	];
}

foreach ( wp_orva_get_theme_include_files() as $include ) {
	require trailingslashit( get_template_directory() ) . $include;
}

/**
* Remove Comments Menu
*/
function remove_comments(){
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu('comments');
}
add_action( 'wp_before_admin_bar_render', 'remove_comments' );

function prefix_remove_comments() {
remove_menu_page( 'edit-comments.php' );
}

add_action( 'admin_menu', 'prefix_remove_comments' );

function remove_yoast_metabox(){
remove_meta_box('wpseo_meta', 'header', 'normal');
remove_meta_box('wpseo_meta', 'footer', 'normal');
remove_meta_box('wpseo_meta', 'faq', 'normal');

}
add_action( 'add_meta_boxes', 'remove_yoast_metabox',11 );

add_filter( 'manage_edit-faq_columns', 'manage_faq_columns' ) ;
function manage_faq_columns( $columns ) {
	global $post;
	$columns['cb'] = '<input type="checkbox" />';
	$columns['title'] = _x('FAQ Item', 'column name');
	$columns['tags'] = __('Tags');	

	return $columns;
}

add_filter( 'manage_edit-team_columns', 'manage_team_columns' ) ;
function manage_team_columns( $columns ) {
	$columns['cb'] = '<input type="checkbox" />';
	$columns['title'] = _x('Name', 'column name');
	$columns['tags'] = __('Tags');	

	return $columns;
}


add_filter('enter_title_here', 'name_place_holder' , 20 , 2 );
function name_place_holder($title , $post){

	if( $post->post_type == 'team' ){
		
		$title = "Add Team Member Name";
		
		return $title;
	}

	if( $post->post_type == 'faq' ){
		
		$title = "Add Question";
		
		return $title;
	}

	return $title;

}

add_action('init', 'post_type_support');
function post_type_support() {
    remove_post_type_support( team, 'editor' );
	remove_post_type_support( faq, 'editor' );
	remove_post_type_support( sidebar, 'editor' );
}

// hide post state
add_action('admin_footer', 'hide_post_state');

function hide_post_state() {
  echo '<script type="text/javascript">

   var targets = document.querySelectorAll(".post-state");
   
	for (let i = 0; i < targets.length; i++) {
		var text = targets[i].innerText;
		if (text.includes("editor") === true){
			targets[i].style.display = "none";
		}
		if (text.includes(",") === true){
			targets[i].innerText = targets[i].innerText.replace(/,/g, "");
		}
	}

	var dash = document.querySelectorAll(".status-publish .column-primary");

	for (let i = 0; i < dash.length; i++) {
		console.log(dash[i])
		var column = dash[i].querySelector("strong");

		
		var iter = document.createNodeIterator(column, NodeFilter.SHOW_TEXT);
		var textnode;
		while (textnode = iter.nextNode()) {
			var text = textnode.textContent;
			if(	text === " — "
				|| text.includes("Classic editor") === true
			){
				
				textnode.textContent = "";
			}
		}
		
	}
  </script>';
  echo '<style>
	
  </style>';
}

add_action('admin_head', 'custom_admin_css');

function custom_admin_css() {
  echo '<style>
   .block-editor-post-preview__dropdown {
			display: none!important;
		}
  </style>';
}

function get_url() {
	$site = get_site_url();
	$url = "https://evergreenvirtual.org/";
	// if $site contains "staging" or "stg" then use the staging URL
	if (strpos($site, 'staging') !== false || strpos($site, 'stg') !== false) {
		$url = "https://staging.evergreenvirtual.org/";
	}
	// if $site contains "dev" then use the dev URL
	if (strpos($site, 'dev') !== false) {
		$url = "https://dev.evergreenvirtual.org/";
	}
	return $url;
}
function change_post_permalink($permalink, $post) {
	$url = get_url();
    // Check if this is a post
    if ($post->post_type === 'post') {
        $permalink = $url . 'blog/' . $post->post_name . '/';
    }
    return $permalink;
}
add_filter('post_link', 'change_post_permalink', 10, 2);

function change_page_permalink($link) {
	
	global $post;
    // Check if this is a page
    if ($post->post_type === 'page') {
		$url = get_url();
		$link = $url;
        // Check for all post parents
		$parents = get_post_ancestors($post->ID);
		// If there are parents, add them to the URL
		if ($parents) {
			// reverse the array so that the top level parent is first
			$parents = array_reverse($parents);
			// loop through the parents and add them to the URL
			foreach ($parents as $parent) {
				$link .= get_post($parent)->post_name . '/';
			}
		}
		// Add the post name to the URL
        $link .= $post->post_name . '/';
    }
    return $link;
}
add_filter('page_link', 'change_page_permalink', 10, 2);


add_filter('manage_pages_columns', 'posts_columns', 5);

function posts_columns($defaults){
    foreach($defaults as $key=>$value) {            // Reorder columns
        if($key=='title') {                         // when we find the title column
           $new['tmx_post_thumbs'] = __('Thumbs');  // put the thumb column before it
        }    
        $new[$key]=$value;
    }
	print_r($defaults);
    return $new;
}
add_action( 'rest_api_init', 'register_tag_lookup');
function register_tag_lookup() {

	register_rest_route( 'r593428910/v2/', 'get-by-tag?slug=(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)', array(
		  'methods' => 'GET',
		  'callback' => 'get_posts_by_tag',
		  'args' => array(
			  'slug' => array (
				  'required' => false
			  ),
		  )
	  ) );

  }

function get_posts_by_tag(WP_REST_Request $request){
	$slug = $request['slug'];

	// get tag object
	$term = get_term_by('slug', $slug, 'slug');
	/* term:
		[term_id] => 5
		[name] => My Tag
		[slug] => my-tag
		[term_group] => 0
		[term_taxonomy_id] => 5
		[taxonomy] => post_tag
		[description] => 
		[parent] => 0
		[count] => 1
		[filter] => raw
	*/

	// let's get posts by this tag
	$args = array(
		'numberposts' => 10,
		'tag__in' => $term->term_id
	);
	$posts_by_tag = get_posts( $args );
	
	//return posts to api
	$response = new WP_REST_Response( $posts_by_tag);

	return $response;
}

add_filter('jwt_auth_expire', 'authorization_expire');
function authorization_expire(){
	//3153600000 = 100 years
	return time() + 3153600000;
}

add_filter( 'acf/fields/wysiwyg/toolbars' , 'my_toolbars'  );
function my_toolbars( $toolbars )
{
	// remove the 'Basic' toolbar completely
	// unset( $toolbars['Basic' ] );
	$toolbars['Full'][2][1] = '';
	
	// echo '< pre >';
	// 	print_r($toolbars);
	// echo '< /pre >';

	// return $toolbars - IMPORTANT!
	return $toolbars;
}


// Dashboard Customizations

function remove_dashboard_meta() {
	remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_plugins', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_primary', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_secondary', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_recent_drafts', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_right_now', 'dashboard', 'normal' );
	// remove_meta_box( 'dashboard_activity', 'dashboard', 'normal');//since 3.8

	$dashboard_boxes = get_meta_boxes( 'dashboard', 'normal' ); 

	// echo '<pre>';
	// print_r($dashboard_boxes);
	// echo '</pre>';

}
add_action( 'admin_init', 'remove_dashboard_meta' );

remove_action('welcome_panel', 'wp_welcome_panel');

function get_meta_boxes( $screen = null, $context = 'advanced' ) {
    global $wp_meta_boxes;

    if ( empty( $screen ) )
        $screen = get_current_screen();
    elseif ( is_string( $screen ) )
        $screen = convert_to_screen( $screen );

    $page = $screen->id;

    return $wp_meta_boxes[$page][$context];          
}

add_action('wp_dashboard_setup', 'dashboard_messages' );
function dashboard_messages(){
	wp_add_dashboard_widget('dashboard_messages', 'ORVA Website Administration News', 'dashboard_message_details');
}

if(!function_exists('dashboard_message_details')){
	function dashboard_message_details(){
		echo '<h2>Coming Soon</h2>';
	}
}

// Prevent login on production site
// add_action('init', 'prevent_wp_login');
function prevent_wp_login() {
	$site = $_SERVER['HTTP_X_FORWARDED_HOST'];

    // WP tracks the current page - global the variable to access it
    global $pagenow;
    // Check if a $_GET['action'] is set, and if so, load it into $action variable
    $action = (isset($_GET['action'])) ? $_GET['action'] : '';
    // Check if we're on the production site and login page, and ensure the action is not 'logout'
    if( $site === 'virtual.wpengine.com' &&
		$pagenow == 'wp-login.php' && ( ! $action || ( $action && ! in_array($action, array('logout', 'lostpassword', 'rp', 'resetpass'))))) {
        // Load the home page url
        $page = get_bloginfo('url');
        // Redirect to the home page
        wp_redirect($page);
        // Stop execution to prevent the page loading for any reason
        exit();
    }
}

