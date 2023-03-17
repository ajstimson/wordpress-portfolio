<?php

/**
 * Template Name: Elevator Dashboard User
 */

$translation_array = array(
	'ajax_url' => admin_url('admin-ajax.php')
);

wp_localize_script('dash', 'local', $translation_array);

add_action('wp_head', 'cart_item');
function cart_item()
{

	$cart_item = random_token(9);
	if(isset($_GET["itemID"])){
		$current_cart_item = htmlspecialchars($_GET["itemID"]);
	}

	if (isset($current_cart_item) && isset($current_cart_hash)) {
		$cart_item = $current_cart_item;
	}

	//   echo '<meta property="cart-item" content="' . $cart_item . '">';
	echo cart_meta();
?>
<!-- 1. Load libraries -->
<!-- Polyfill(s) for older browsers -->
<!-- <script src="https://npmcdn.com/core-js/client/shim.min.js"></script> -->

<!-- <script src="https://npmcdn.com/zone.js@0.6.12?main=browser"></script> -->
<script src="/wp-content/themes/Genesis-Sandbox-HTML5/js/elevator/html2canvas.min.js"></script>
<script src="https://npmcdn.com/reflect-metadata@0.1.3"></script>
<script src="https://npmcdn.com/systemjs@0.19.27/dist/system.src.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.0.16/jspdf.plugin.autotable.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>

<?php
}

global $header;
// global $footer;

$header = get_sidebar_content('elevator-app-header');
// $footer = get_sidebar_content( 'elevator-app-footer' );

function get_sidebar_content($a)
{
	ob_start();

	dynamic_sidebar($a);

	$item = ob_get_contents();

	ob_end_clean();

	return $item;
}

add_action('wp_head', 'head_scripts');
function head_scripts()
{
	// wp_enqueue_script( 'jspdf' );
	wp_enqueue_script('tether_js');
	wp_enqueue_script('bootstrap_js');
}

add_action('wp_footer', 'foot_scripts');
function foot_scripts()
{
	wp_enqueue_style('elevator');
	if (is_user_logged_in()) {
		wp_enqueue_script('cart');
	}
	wp_enqueue_script('dash');
	wp_enqueue_style('pagination-style');
	wp_enqueue_script('pagination');
}

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

// Now Add Stuff!

if (current_user_can('administrator')) {
	add_filter('body_class', 'my_body_classes');

	function my_body_classes($classes)
	{

		$classes[] = 'is_admin';

		return $classes;
	}
}

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
	$html = '<header class="pre-login"><section id="media_image-6" class="widget widget_media_image"><div class="widget-wrap"><a href="' . get_home_url() . '"><img width="246" height="88" src="/wp-content/uploads/2021/07/wf-for-dark-background-r.png" class="image wp-image-1707  attachment-full size-full" style="max-width: 100%; height: auto;"></a></div></section>';
	$html .= '<section id="nav_menu-9" class="widget widget_nav_menu"><div class="widget-wrap">';
	$html .= '<div class="menu-elevator-header-container"><ul id="menu-elevator-header" class="menu">';
	$html .= '<li class="menu-item"><a href="' . get_home_url() . '"><i class="fa fa-angle-double-left"></i>Back</a></li>';
	$html .= '</ul></div></div></section></header>';

	echo $html;
}


add_action('genesis_entry_content', 'do_content', 9);
function do_content()
{

	global $post;

	$page = $post->post_name;

	if (is_user_logged_in()) {

		if ($page === 'elevator') {

			wp_redirect('/elevator/user-dashboard/');
			exit;
		} else {

			$user = wp_get_current_user();

			dashboard_content($user);
		}
	} else {

		add_filter('login_form_top', 'login_form_title');


		if ($page === 'user-dashboard') {
			wp_redirect('/elevator/');
			exit;
		} else {
			$args = array(
				'redirect' => site_url('/elevator/user-dashboard')
			);

			if (isset($_GET["redirect"]) && $_GET["redirect"] === 'form') {
				$args = array(
					'redirect' => site_url('/elevator/order-form')
				);
			}
		}

		wp_login_form($args);

		echo '<article id="login-content">';
		genesis_do_post_content();
		elevatorGallery();
		echo '</article>';
	}
}

function login_form_title()
{
	return '<h2>Manufacturer/Distributor Login</h2>';
}

function elevatorGallery()
{
	echo '<div class="login-gallery">
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/gold-perforated-panel-gate.png" alt="Gold Perforated Panel" title="Gold Perforated Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/black-vision-panel-gate.png" alt="Black with Vision Panel" title="Black with Vision Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/alumifold-solid-clear-panel-gate.png" alt="Alumifold Solid Clear Panel" title="Alumifold Solid Clear Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/bronze-acrylic-gate.png" alt="Bronze Acrylic Panel" title="Bronze Acrylic Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/tan-panel-gate.png" alt="Tan Vinyl Panel" title="Tan Vinyl Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/gray-vision-panel-gate.png" alt="Gray Vinyl with Vision Panel" title="Gray Vinyl with Vision Panel">
			</div>
			<div class="gallery-item">
				<img src="/wp-content/uploads/2021/05/cherry-panel-gate.png" alt="Hardwood Cherry Panel" title="Hardwood Cherry Panel">
			</div>
		</div>';
}


function elevator_user_html($data)
{

	$user = 'user_' . $data->ID;

	$html = '<div id="user-data">';
	$html .= '<h3>Profile</h3><ul>';
	$html .= '<li class="user_first">'				. $data->first_name 					. '</li>';
	$html .= '<li class="user_last">'				. $data->last_name 						. '</li>';
	$html .= '<li class="user_email">'				. $data->user_email 					. '</li>';
	$html .= '<li class="user_company">'			. get_field('company_name', $user) 		. '</li>';
	$html .= '<li class="user_street_address">'		. get_field('street_address', $user) 	. '</li>';
	$html .= '<li class="user_street_address_2">'	. get_field('street_address_2', $user) 	. '</li>';
	$html .= '<li class="user_city">'				. get_field('city', $user) 				. '</li>';
	$html .= '<li class="user_state"> '				. get_field('state', $user) 			. '</li>';
	$html .= '<li class="user_zip">, '				. get_field('zip_code', $user) 			. '</li>';
	$html .= '<li class="user_country">'			. get_field('country', $user) 			. '</li>';
	$html .= '<li class="user_phone">'				. get_field('phone', $user) 			. '</li> ';
	$html .= '<li class="user_extension">x'			. get_field('extension', $user) 		. '</li>';
	$html .= '<li class="user_ed_link"><a href="/wp-admin/profile.php">Edit</a></li>';
	$html .= '</ul>';
	$html .= '</div>';

	echo $html;
}

function get_saved_configs(){
	global $wpdb;
	$id = get_current_user_id();
	$table = $wpdb->prefix . "elevator_form_entries";

	$saved = $wpdb->get_results('SELECT * FROM ' . $table . ' WHERE el_user_id =' . $id . ' AND status = "2" ORDER BY created DESC');
	
	return $saved;
}

function dashboard_content($user)
{
	global $wpdb;
	$id = get_current_user_id();
	$table = $wpdb->prefix . "elevator_form_entries";
	$admin = false;


	sanitize_order_output($id, $table);
	if (current_user_can('administrator')) {
		$admin = true;
		$all_configs = $wpdb->get_results('SELECT * FROM ' . $table . ' WHERE status = "1" ORDER BY created DESC');
	} else {
		$all_configs = $wpdb->get_results('SELECT * FROM ' . $table . ' WHERE el_user_id =' . $id);
	}

	//TODO: Remove all Previous Order Processing
	// $previous_orders = get_config($all_configs, 1);
	$saved_configurations = get_saved_configs();

	echo '<div class="user_id" style="display:none">' . $id . '</div>';

	echo '<div class="card">';

	echo '<div class="dashboard-title">
				<h2 class="mg-b-0 tx-spacing--1">' . ($admin ? 'Admin ' : null) . 'Dashboard</h2> 
				<button onClick="window.location.href=window.location.href">Refresh ↻</button>
			</div>';
	echo '<div class="dashboard-header">';
	elevator_user_html($user);
	echo '<div class="dashboard-message">';
	echo '<h3>News</h3>';
	genesis_do_post_content();
	echo '</div>';
	echo '</div>';

	$table_state = $admin == true ? 'table-admin' : 'table-standard';
	echo 	'<div class="col mg-t-10">
				<div class="card card-dashboard-table">
					<div class="table-responsive">
						<table class="table table-hover previous-results ' . $table_state . '">
							<thead>
								<tr class="info">';
	$previous_th = $admin == true ? '<th colspan="9"><h4>Orders</h4>' : '<th colspan="9"><h4>Previous Orders</h4>';
	echo $previous_th . ' 
						<div class="entry-count-data">
							<p>
								<span class="range-data">
									<span id="entry-count-low">0</span> – <span id="entry-count-high">0</span> of 
								</span>
								<span id="total-entries">0</span> <span>results</span>
							</p>
						</div>
					</th>
				</tr>
				<tr>
					<th class="sortable" data="created" data-sort="DESC">Date</th>
					<th class="standard-only">Received</th>
					<th colspan="2" class="admin-only conditional oknow sortable" data="el_user_id">Account</th>
					<th class="conditional sortable" data="po">PO Number</th>
					<th class="conditional sortable" data="sidemark">Sidemark</th>
					<th><center>Order Details</center></th>
					<th colspan="3"><center>Actions</center></th>
				</tr>
			</thead>
		<tbody class="data-container">
		<h3>Filters <i class="fa fa-minus-circle" style="display:none;"></i></h3>
			<div class="view-options col mg-t-10">
				<div class="entry-filters col mg-t-10">
				
				<div class="filter-group">';
	if (current_user_can('administrator')) {
		echo '<div class="filter-wrap">
			<label for="account">Account:</label>
			<div class="select">
				<select name="el_user_id" id="accounts">
				<option value="0">--select</option>' . accountList() . '</select>
			</div></div>';
	} else {
		echo '<select name="el_user_id" id="accounts" class="admin-only"><option value="' . $id . '">--select</option>' . $id . '</select>';
	}
	echo '
			<div class="filter-wrap">
			<label for="po">PO Number:</label>
			<div class="select">
				<select name="po_number" id="po" disabled>
					<option value="0">--select</option>
				</select>
				</div>
			</div>
			<div class="filter-wrap">
				<label for="sidemark">Sidemark:</label>
				<div class="select">
				<select name="sidemark" id="sidemark" disabled>
					<option value="0">--select</option>
				</select>
				</div>
			</div>
			<div class="filter-wrap">
				<a href="#" id="clear">Clear All</a>
			</div>
		</div>
	</div>';

	echo '<div class="pagination-details col mg-t-10">
			<div class="filter-group">
				<div class="filter-wrap">
					<label for="orders_per_page">Results per page:</label>
					<div class="select">
					<select name="orders_per_page" id="opp">
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="all">All</option>
					</select>
					</div>
				</div>
				<div class="filter-wrap">
					<div id="pagination"></div>
				</div>
			</div>
		</div>';

	//Loading placeholders
	echo '
		<tr class="loading"><td colspan="9"><div>&nbsp;</div></td></tr>
		<tr class="loading"><td colspan="9"><div>&nbsp;</div></td></tr>
		<tr class="loading"><td colspan="9"><div>&nbsp;</div></td></tr>';
	// if (!empty($previous_orders)) {
	// 	foreach ($previous_orders as $row) {

	// 		$da = strtotime($row->created);
	// 		$date = date('m-d-Y', $da);
	// 		$item = json_decode($row->el_item_data);

	// 		// echo '<pre>';
	// 		// print_r($row);
	// 		// echo '<br>';
	// 		// print_r($item);
	// 		// echo '</pre>';

	// 		echo '<tr>
	// 				<td>' . $date . '</td>
	// 				<td><i class="fa fa-check"></i></td>
	// 				<td class="admin-only">' . $item->company->value . '</td>
	// 				<td>' . $item->po_number->value . '</td>
	// 				<td>' . $item->sidemark->value . '</td>
	// 				<td class="has-button">
	// 					<!-- ORDER DETAILS -->
	// 					<center>
	// 						<button type="button" class="btn btn-primary order-details" data-toggle="modal" data-target="#dash-modal" data-ss="' . $item->session_id . '" data-val="' . $row->id . '" data-item="' . $item->cart_item_id . '">
	// 							View
	// 						</button>
	// 					</center>
	// 				</td>
	// 				<td class="has-button">
	// 					<!-- ACTIONS -->
	// 					<center>
	// 						<button class="download btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">
	// 							Download Order
	// 						</button>
	// 						<button class="save-this-config btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">
	// 							Save Configuration
	// 						</button>
	// 						<button class="add-to-cart btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">
	// 							Reorder
	// 						</button>
	// 					</center>
	// 				</td>
	// 			</tr>';
	// 	}
	// }

	echo '</tbody></table></div><!-- table-responsive -->';

	echo '<div id="saved-configs" class="table-responsive">';
	echo '<table class="table table-hover">
				<thead>
                    <tr class="info">
						<th colspan="7">Saved Configurations</th>
                    </tr>
					<tr>
						<th>Date Saved</th>
						<th>PO Number</th>
						<th>Sidemark</th>
						<th><center>Configuration Details</center></th>
						<th colspan="3"><center>Actions</center></th>
                    </tr>
                </thead>
				<tbody>';


	if (!empty($saved_configurations)) {
		foreach ($saved_configurations as $row) {

			$item = json_decode($row->el_item_data);
			$da = strtotime($row->created);
			$date = date('m-d-Y', $da);

			echo '<tr>
					<td>' . $date . '</td>
					<td>' . $item->po_number->value . '</td>
					<td>' . $item->sidemark->value . '</td>
					<td class="has-button">
						<!-- ORDER DETAILS -->
						<center>
							<button type="button" class="btn btn-primary saved-config" data-toggle="modal" data-target="#dash-modal1" data-ss="' . $row->el_session_id . '" data-id="' . $row->id . '" data-val="' . $row->id . '" data-item="' . $row->el_cart_item_id . '">
								View</button>
						</center>
					</td>
					<td class="has-button" colspan="3">
						<center>
							<button class="delete-saved btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">Delete</button>
							<button class="edit-saved btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">Edit</button>
							<button class="add-to-cart btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5" data-item="' . $item->cart_item_id . '">Reorder</button>
						</center>
					</td>
				</tr>';
		}
	} else {

		echo '<tr>
				<td colspan="7">
					No saved configurations found
				</td>
			</tr>';
	}

	echo '</tbody></table></div><!-- table-responsive -->';
	echo '</div>';
	echo '<div id="pagination"></div>';
	//echo '</div><!-- card --></div><!-- col --></div><!-- row --></div><!-- container --></div><!-- content --></div><!-- row --></div><!-- container --></div><!-- content --></div></div>';
	if (!current_user_can('administrator')) {
		document_content();
	}
	echo '<!-- MODAL: PREVIOUS ORDER DETAILS -->
		<div class="modal" id="dash-modal" tabindex="-1" role="dialog" aria-labelledby="dash-modalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="dash-modalLabel">Order Details</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="tt-res"></div>
							<table>
								<tr>
								</tr>
							</table>
      				</div>
    			</div>
  			</div>
		</div>';

	echo '<!-- MODAL: SAVE CONFIG DETAILS -->
		<div class="modal" id="dash-modal1" tabindex="-1" role="dialog" aria-labelledby="dash-modalLabel" aria-hidden="true">
  			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="dash-modalLabel">Order Details</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="tt-res"></div>
						<table>
							<tr></tr>
						</table>
					</div>
				</div>
			</div>
  		</div>';

	echo '<!-- MODAL: CONFIRM DELETE -->
		<div class="modal" id="delete" tabindex="-1" role="dialog" aria-labelledby="dash-modalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Order Delete</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body"><div class="del-data">
						<p>Are you sure you want to delete this?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="del btn btn-primary clodes">
							Yes
						</button>
						<button type="button" class="close btn btn-primary clodes" data-dismiss="modal" aria-label="Close">
							No
						</button>
					</div>
				</div>
			</div>
    	</div>';

	echo '<!-- MODAL: CONFIRM SAVE -->
		<div class="modal" id="saved" tabindex="-1" role="dialog" aria-labelledby="dash-modalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content"><div class="modal-header">
					<h5 class="modal-title">Order Save</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body"><div class="save-data">
					<p>Saved entry Successfully</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="close btn btn-primary clode" data-dismiss="modal" aria-label="Close">
						OK
 					</button>
				</div>
			</div>
		</div>';
}

function document_content()
{
	echo '<section id="documents">
    		<h2>Literature &amp; Information</h2>
				<div class="flex-no-align-items">
					<div class="flex-child-20 flex-column">
						<p>Download Our 4-page Finish Option Digital Brochure</p>
						<p><a href="https://woodfold.com/wp-content/uploads/2019/12/WF-Elevator-Swatch-Brochure_Digital_121019.pdf" target="_blank" rel="noopener noreferrer">
						<img loading="lazy" src="https://woodfold.com/wp-content/uploads/2019/12/Screenshot_2019-12-12-WF-Elevator-Swatch-Brochure_Digital_1210191.png" alt="Digital Brochure 121019" width="200" height="259"></a></p>
					</div>
					<div class="flex-child-20 flex-column">
						<p>View Our Online Digital Flipbook of Finish Options</p>
						<p><a href="https://woodfold.com/wp-content/uploads/2019/12/WF-Elevator-Swatch-Brochure_Digital_121019.pdf" target="_blank" rel="noopener noreferrer">
						<img loading="lazy" class="" src="https://woodfold.com/wp-content/uploads/2019/12/Screenshot_2019-12-12-WF-Elevator-Swatch-Brochure_Digital_1210192.png" alt="Digital Brochure 121019 Online" width="336" height="259"></a></p>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Accordion Gate Price List</p>
						<figure><a href="/wp-content/uploads/2019/10/2020Woodfold_ElevatorSeries1600-1.pdf" target="_blank" rel="nofollow noopener noreferrer"><img loading="lazy" class="alignnone" src="/images/elevator/Woodfold-2018-Elevator-Price-List-Series-1600.png" alt="" width="194" height="150"></a></figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Accordion Gate Order Form</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Woodfold-ACC-Elevator-Order-Form-2018-02-02.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/elevatorOrderForm.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>How &amp; Where to Measure</p>
						<figure>
							<a href="/wp-content/uploads/2020/02/AccDoor-ElevatorGateMeasurementGuide.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/AccDoor-ElevatorGateMeasurementGuideThumb.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Woodfold Gate Handle Identification</p>
						<figure>
							<a href="/wp-content/uploads/2020/02/AccDoor-ElevatorGateHandleIdentification2.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/AccDoor-ElevatorGateHandleIdentificationThumb.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>How to use the Gate Configurator</p>
						<figure>
							<a href="/wp-content/uploads/2020/02/Elevator-Doors-Standard-work-Configurator-Jan-2018.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Elevator-Doors-Standard-work-Configurator-Jan-2018.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Woodfold Letter Regarding Code Compliance (ASME)</p>
						<figure>
							<a href="" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Woodfold-letter-regarding-strength-compliance-ASME.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Woodfold Letter Regarding Code Compliance (FL-R321)</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Woodfold-letter-regarding-strength-compliance-FL-R321-May2017.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Woodfold-letter-regarding-strength-compliance-ASME-FL.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Ball Deflection Report #15189 Vinyl Veneer on MDF Door</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Ball-Deflection-Report-15189-Vinyl-Veneer-on-MDF-Door.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Ball-Rejection-Report.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Ball Reflection Report #15200 Vinyl Veneer on MDF Door</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Ball-Deflection-Report-15189-Vinyl-Veneer-on-MDF-Door-1.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Ball-Rejection-Report.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Ball Deflection Report #16006 – Acrylic Door</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Ball-Rejection-Report-15200-Vinyl-Veneer-on-MDF-Door.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Ball-Rejection-Report.png">
							</a>
						</figure>
					</div>
					<div class="flex-child-20 flex-column">
						<p>Ball Rejection Report #16007 – Acrylic Door</p>
						<figure>
							<a href="/wp-content/uploads/2018/11/Ball-Rejection-Report-16007-Acrylic-Door.pdf" rel="nofollow noopener noreferrer" target="_blank">
								<img src="/images/elevator/Ball-Rejection-Report.png">
							</a>
						</figure>
					</div>
				</div>
		</section>';
}

function sanitize_order_output($id, $table)
{
	global $wpdb;

	$sql = 'SELECT * FROM ' . $table .  ' WHERE el_user_id = ' . $id;

	$results = $wpdb->get_results($sql);

	for ($i = 0; $i < count($results); $i++) {

		// Cleans up a common error where encoded data includes multiple backslashes before double and single quotes
		$pattern = '/(\\\\*\\\\")|(\\\\*\')/';
		$fixed_data = preg_replace($pattern, '', $results[$i]->el_item_data);
		$id = $results[$i]->id;

		$wpdb->update($table, array('el_item_data' => $fixed_data), array('id' => $id));
	}
}

function get_config($all_configs, $status)
{
	$arr = array();

	if (!empty($all_configs)) {

		$all_configs = array_reverse($all_configs);

		for ($i = 0; $i < count($all_configs); $i++) {

			$item_status = (int)$all_configs[$i]->status;

			if ($item_status === $status) {

				$arr[$i] = $all_configs[$i];
			}
		}

		return $arr;
	} else {
		return false;
	}
}

function accountList()
{
	global $wpdb;

	$entries = $wpdb->prefix . "elevator_form_entries";

	$user_ids = $wpdb->get_results('SELECT DISTINCT el_user_id FROM ' . $entries);
	$results = [];
	$html = '';

	if (!empty($user_ids)) {
		for ($i = 0; $i < count($user_ids); $i++) {

			$user_id = $user_ids[$i]->el_user_id;
			$user_data = get_user_by('id', $user_id);

			$company = company_name($user_data, $user_id);

			if (empty($company)) {
				$detail = $wpdb->get_results('SELECT * FROM ' . $entries . ' WHERE el_user_id = ' . $user_id);
				// If detail isn't empty run for loop
				if (!empty($detail) && is_array($detail)) {
					for ($e = 0; $e < count($detail); $e++) {
						$detail = json_decode($detail[$e]->el_item_data);
						$company = $detail->company->value;
						$results[$company] = $user_id;
					}
				}
			}

			$results[$company] = $user_id;
		}

		//Sort keys alphabetically
		ksort($results);

		//Remove blank company names
		unset($results[""]);

		//Create html option elements
		foreach ($results as $key => $value) {
			$html .= '<option value=' . $value . '>' . $key . '</option>';
		}
	}

	return $html;
}

genesis();