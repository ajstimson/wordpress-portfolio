<?php
/**
 * Custom functions
 */


//REDIRECT TO IDExperts if "pathless" url is used
add_action('template_redirect', 'homepage_redirect');

function homepage_redirect() {

    $current_url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    $path = parse_url($current_url, PHP_URL_PATH);
    $url = 'https://www.idexpertscorp.com/';

    if(strlen($path) < 2){

        exit( wp_redirect( $url ));
        
    }     

}

/**
 * Hide the Page and Post Content Editor - Gutenberg
 */
add_action( 'init', function() {
    
    remove_post_type_support( 'page', 'editor' );
   
}, 99);

// CUSTOMIZATIONS TO USER DASHBOARD
//Remove dashboard widgets
add_action( 'wp_dashboard_setup', 'remove_dashboard_widgets', 20 );
function remove_dashboard_widgets(){
	remove_meta_box( 'dashboard_right_now', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_activity', 'dashboard', 'normal' );
	remove_meta_box( 'example_dashboard_widget', 'dashboard', 'normal' );
	remove_meta_box( 'rg_forms_dashboard', 'dashboard', 'normal' );
	remove_meta_box( 'woocommerce_dashboard_recent_reviews', 'dashboard', 'normal' );
	remove_meta_box( 'woocommerce_dashboard_status', 'dashboard', 'normal' );
	remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_primary', 'dashboard', 'side' );

}

add_filter( 'genesis_pre_load_favicon', 'ide_icon' );
function ide_icon( $icon ) {
    $icon = '/wp-content/uploads/2020/07/favicon-32x32-1.png';
    return $icon;
}