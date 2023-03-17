<?php

/**
 * Template Name: Elevator Order Form Template
 */

$translation_array = array(
	'ajax_url' => admin_url('admin-ajax.php')
);

wp_localize_script('cart', 'local', $translation_array);
wp_localize_script('el-review', 'local', $translation_array);

add_action('gform_pre_render_2', 'elevator_form_loop');

function elevator_form_loop($form)
{
	$user_ID = get_current_user_id();
	$template = get_page_template_slug();
	if (isSet($_GET["user"])){
		$guest_status = $_GET["user"];
	}

	if ($user_ID !== 0 || $guest_status === 'guest') {

		if ($guest_status !== 'guest') {
			$data = $user_ID ? new WP_User($user_ID) : wp_get_current_user();
			// echo '<pre>';
			// print_r($data);
			// echo '</pre>';
			echo elevator_user_html($data);
		}
	} else {

		wp_redirect('/elevator?redirect=form');
		exit;
	}

	return $form;
}

function elevator_user_html($data)
{

	$user = 'user_' . $data->ID;

	$html = '<div id="user-data" style="display:none;"><ul>';
	$html .= '<li class="user_first">'				. $data->first_name 					. '</li>';
	$html .= '<li class="user_last">'				. $data->last_name 						. '</li>';
	$html .= '<li class="user_email">'				. $data->user_email 					. '</li>';
	$html .= '<li class="user_company">'			. get_field('company_name', $user) 		. '</li>';
	$html .= '<li class="user_street_address">'		. get_field('street_address', $user) 	. '</li>';
	$html .= '<li class="user_street_address_2">'	. get_field('street_address_2', $user) 	. '</li>';
	$html .= '<li class="user_city">'				. get_field('city', $user) 				. '</li>';
	$html .= '<li class="user_state">'				. get_field('state', $user) 			. '</li>';
	$html .= '<li class="user_zip">'				. get_field('zip_code', $user) 			. '</li>';
	$html .= '<li class="user_country">'			. get_field('country', $user) 			. '</li>';
	$html .= '<li class="user_phone">'				. get_field('phone', $user) 			. '</li>';
	$html .= '<li class="user_extension">'			. get_field('extension', $user) 		. '</li>';
	$html .= '<li class="user_id">'					. $user 								. '</li>';
	$html .= '</ul></div>';

	return $html;
}

add_action('wp_head', 'cart_item');
function cart_item()
{

	$cart_item = random_token(9);
	if(isSet($_GET["itemID"])){
		$current_cart_item = htmlspecialchars($_GET["itemID"]);
	}

	if (isset($current_cart_hash)) {
		$cart_item = $current_cart_item;
	}

	//   echo '<meta property="cart-item" content="' . $cart_item . '">';
	echo cart_meta();
}


add_action('wp_enqueue_scripts', 'app_scripts');

function app_scripts()
{

	$user_ID = get_current_user_id();
	if (isSet($_GET["user"])){
		$guest_status = $_GET["user"];
	} else {
		$guest_status = 'user';
	}

	wp_enqueue_style('elevator');
	wp_enqueue_script('el-struts');

	if ($user_ID !== 0 || $guest_status === 'guest') {
		wp_enqueue_script('el-address');
		wp_enqueue_script('el-stack');
		wp_enqueue_script('el-panels');
		wp_enqueue_script('el-render');
		wp_enqueue_script('el-calc');
		wp_enqueue_script('el-review');
		wp_enqueue_script('el-error');

?>

<script src="/wp-content/themes/Genesis-Sandbox-HTML5/js/elevator/html2canvas.min.js"></script>
<script src="https://npmcdn.com/reflect-metadata@0.1.3"></script>
<script src="https://npmcdn.com/systemjs@0.19.27/dist/system.src.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.0.16/jspdf.plugin.autotable.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>


<?php
	}

	if ($guest_status !== 'guest') {

		wp_enqueue_script('cart');
	}

	wp_enqueue_script('tether_js');
	wp_enqueue_script('bootstrap_js');
}

global $header;
global $footer;
$header = get_sidebar_content('elevator-app-header');
$footer = get_sidebar_content('elevator-app-footer');

remove_post_type_support('page', 'genesis-scripts');

remove_action('genesis_entry_header', 'genesis_post_info', 12);
//* Remove site header elements
remove_action('genesis_header', 'genesis_header_markup_open', 5);
remove_action('genesis_header', 'genesis_do_header');
remove_action('genesis_header', 'genesis_header_markup_close', 15);
remove_action('genesis_meta', 'genesis_load_stylesheet');

//* Remove navigation
remove_theme_support('genesis-menus');

//* Remove breadcrumbs
remove_action('genesis_before_loop', 'genesis_do_breadcrumbs');

remove_action('genesis_entry_content', 'genesis_do_post_content');

//* Remove site footer elements
remove_action('genesis_footer', 'genesis_footer_markup_open', 5);
remove_action('genesis_footer', 'genesis_do_footer');
remove_action('genesis_footer', 'genesis_footer_markup_close', 15);

// explicitly deactivate uneeded plugins
deactivate_plugins(
	array(
		'/genesis-simple-sidebars/plugin.php',
		'/mobile-menu/mobmenu.php',
		'/php-everywhere/phpeverywhere.php',
		'/revslider/revslider.php',
		'/svg-support/svg-support.php',
		'/wordpress-seo/index.php',
	)
);

// remove all widgets
add_filter('sidebars_widgets', 'disable_all_widgets');
function disable_all_widgets($sidebars_widgets)
{
	$sidebars_widgets = array(false);
	return $sidebars_widgets;
}

//disable autocomplete
add_filter('gform_form_tag', function ($form_tag) {
	return str_replace('>', ' autocomplete="off" novalidate>', $form_tag);
}, 11);

// Diable auto-complete on each field.
add_filter('gform_field_content', function ($input) {
	return preg_replace('/<(input|textarea)/', '<${1} autocomplete="off" ', $input);
}, 11);

// Now Add Stuff!



if (is_user_logged_in()) {
	add_action('genesis_header', 'header_logged_in_content', 12);
} else {
	add_action('genesis_header', 'header_default_content', 12);
}
function header_logged_in_content($header)
{
	echo '<header>';
	global $header;
	echo $header;
	echo '</header>';
}

function header_default_content()
{
	$html = '<header class="pre-login"><section id="media_image-6" class="widget widget_media_image"><div class="widget-wrap"><a href="' . get_home_url() . '"><img width="246" height="88" src="/wp-content/uploads/2020/05/wf-for-dark-background-r.png" class="image wp-image-1707  attachment-full size-full" style="max-width: 100%; height: auto;"></a></div></section>';
	$html .= '<section id="nav_menu-9" class="widget widget_nav_menu"><div class="widget-wrap">';
	$html .= '<div class="menu-elevator-header-container"><ul id="menu-elevator-header" class="menu">';
	$html .= '<li class="menu-item"><a href="' . get_home_url() . '"><i class="fa fa-angle-double-left"></i>Back</a></li>';
	$html .= '</ul></div></div></section></header>';

	echo $html;
}

function get_sidebar_content($a)
{
	ob_start();

	dynamic_sidebar($a);

	$item = ob_get_contents();

	ob_end_clean();

	return $item;
}
// add_action( 'genesis_header', 'header_content', 12 );
// function header_content($header){
// 	echo '<header>';
// 	global $header;
// 	echo $header;
// 	echo '</header>';
// }

add_action('genesis_entry_content', 'do_content', 9);
function do_content()
{
	echo '<article>';
	genesis_do_post_content();
	echo '</article>';
}

add_action('genesis_footer', 'footer_content', 12);
function footer_content($footer)
{
	echo '<footer><div class="footer-wrap">';
	global $footer;
	echo $footer;
	echo '</div></footer>';
}

genesis();