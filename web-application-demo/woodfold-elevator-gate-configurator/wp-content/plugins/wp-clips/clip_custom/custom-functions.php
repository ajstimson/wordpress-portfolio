<?php

add_filter('body_class', 'login_class');
function login_class($classes)
{
	$page_template = get_page_template_slug(get_queried_object_id());
	if ($page_template != 'elevator-form-page.php' || $page_template != 'elevator-dashboard-page.php') {
		$user_ID = get_current_user_id();
		if ($user_ID === 0) {
			$classes[] = 'not-logged-in';
		} else {
			$classes[] = 'logged-in';
		}
		return $classes;
	}
}
global $current_user; // Use global
get_currentuserinfo(); // Make sure global is set, if not set it.
global $pagenow;
// Check user object has not got subscriber role
if (user_can($current_user, "subscriber")) {

	if ($pagenow == 'profile.php') {
		add_action('admin_head', 'admin_color_scheme');

		remove_action("admin_color_scheme_picker", "admin_color_scheme_picker");
		add_action('admin_head', 'hide_personal_options');
		add_action('admin_head', 'localize_ajax');
		add_action('admin_head', 'cart_meta');

		add_action('admin_head', 'frontheader');
		add_action('admin_enqueue_scripts', 'admin_scripts');
	}
	show_admin_bar(false);
}
function localize_ajax()
{
	$translation_array = array(
		'ajax_url' => admin_url('admin-ajax.php')
	);

	wp_localize_script('cart', 'local', $translation_array);
}
function cart_meta()
{
	$user = get_current_user_id();
	$cart_item = random_token(9);
	$secondary_hash = random_token(9);
	echo '<meta property="user-id" content="' . $user . '">';
	echo '<meta property="cart-item" content="' . $cart_item . '">';
	echo '<meta property="secondary-cart-item" content="' . $secondary_hash . '">';
	echo '<meta property="local-ajax" content="' . admin_url('admin-ajax.php') . '">';
}
function frontheader()
{
	$header = get_sidebar_profile_content('elevator-app-header');
	echo $header;
}
function get_sidebar_profile_content($a)
{
	ob_start();
	dynamic_sidebar($a);
	$item = ob_get_contents();
	ob_end_clean();

	return $item;
}
function admin_scripts()
{
	wp_enqueue_media();
	wp_enqueue_style('elevator');
	wp_enqueue_style('bootstrap_css');
	wp_enqueue_style('roboto', 'https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
	wp_enqueue_script('tether_js', '', null, null, true);
	wp_enqueue_script('bootstrap_js');
	wp_enqueue_script('cart', '', null, null, true);
	wp_enqueue_script('profile', get_stylesheet_directory_uri() . '/js/elevator/profile.js', null, null, true);
}
function admin_color_scheme()
{
	global $_wp_admin_css_colors;
	$_wp_admin_css_colors = 0;
}
function hide_personal_options()
{
	echo "\n" .
		'<script type="text/javascript">
    jQuery(document).ready(function($) { 
        $(\'#adminmenumain\').hide();
        $(\'#wpadminbar\').hide();
        $(\'form#your-profile > h3:first\').hide(); 
        $(\'form#your-profile > table:first\').hide(); 
        $(\'form#your-profile\').show();
        $("h2:contains(\'Personal Options\')").hide();
        $("h2:contains(\'Name\')").hide();
        $("h2:contains(\'Contact Info\')").hide();
        $("h2:contains(\'Contact Info\') + table tbody tr[class^=\'user-\'][class$=\'-wrap\']").hide();
        $("tr.user-email-wrap").show();
        $("h2:contains(\'About Yourself\')").hide();
        $("h2:contains(\'About Yourself\') + .form-table").hide();
        $("#your-profile").prepend(\'<h2>Edit Your Profile</h2>\');
        $("#menu-item-1824 a").text("Log Out");
    });
    </script>' .
		"\n";
}
add_action('wp_logout', 'auto_redirect_external_after_logout');
function auto_redirect_external_after_logout()
{
	$page_template = get_page_template_slug(get_queried_object_id());
	if ($page_template != 'elevator-dashboard-page.php') {

		wp_redirect('/user-dashboard');
		exit();
	}
	if ($page_template != 'elevator-form-page.php') {

		wp_redirect('/elevator-form');
		exit();
	}
}

// add the action 
add_action('wp_mail_failed', 'action_wp_mail_failed', 10, 1);
// define the wp_mail_failed callback 
function action_wp_mail_failed($wp_error)
{
	return error_log($wp_error->get_error_message());
}

add_image_size('elevator-form-image', 397, 768, false);
add_image_size('elevator-form-thumb', 9999, 768, false);
function random_token($length)
{
	if (!isset($length) || intval($length) <= 8) {
		$length = 32;
	}
	if (function_exists('random_bytes')) {
		return bin2hex(random_bytes($length));
	}
	if (function_exists('mcrypt_create_iv')) {
		return bin2hex(mcrypt_create_iv($length, MCRYPT_DEV_URANDOM));
	}
	if (function_exists('openssl_random_pseudo_bytes')) {
		return bin2hex(openssl_random_pseudo_bytes($length));
	}
}
function Salt()
{
	return substr(strtr(base64_encode(hex2bin(RandomToken(32))), '+', '.'), 0, 44);
}

add_filter('edit_post_link', 'remove_edit_post_link');
function remove_edit_post_link($link)
{
	$page_template = get_page_template_slug(get_queried_object_id());
	if ($page_template === 'elevator-form-page.php' && $page_template === 'elevator-dashboard-page.php') {
		return '';
	}
}

// Register new sidebar for Elevator Page
genesis_register_sidebar(array(
	'id'          => 'elevator-app-header',
	'name'        => 'Elevator App Header',
	'description' => 'This is the header for the Elevator App',
));

// Register new sidebar for Elevator Page
genesis_register_sidebar(array(
	'id'          => 'elevator-app-footer',
	'name'        => 'Elevator App Footer',
	'description' => 'This is the footer for the Elevator App',
));

add_action('init', 'register_elevator_scripts');
function register_elevator_scripts()
{

	$path = '/js/elevator/';

	wp_register_style('elevator', get_stylesheet_directory_uri() . '/css/elevator-app.css');
	wp_register_style('pagination-style', get_stylesheet_directory_uri() . '/css/pagination.css');
	wp_register_script('el-calc', get_stylesheet_directory_uri() . $path . 'calc.js');
	wp_register_script('cart', get_stylesheet_directory_uri() . $path . 'cart.js');
	wp_register_script('dash', get_stylesheet_directory_uri() . $path . 'dashboard.js');
	wp_register_script('el-render', get_stylesheet_directory_uri() . $path . 'render.js');
	wp_register_script('el-address', get_stylesheet_directory_uri() . $path . 'address.js');
	wp_register_script('el-struts', get_stylesheet_directory_uri() . $path . 'struts.js');
	wp_register_script('el-stack', get_stylesheet_directory_uri() . $path . 'stack.js');
	wp_register_script('el-panels', get_stylesheet_directory_uri() . $path . 'panel-frame.js');
	wp_register_script('el-review', get_stylesheet_directory_uri() . $path . 'review.js');
	wp_register_script('el-error', get_stylesheet_directory_uri() . $path . 'error.js');
	wp_register_script('pagination', get_stylesheet_directory_uri() . $path . 'pagination.min.js');

	wp_register_script('tether_js', 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js');
	wp_register_style('bootstrap_css', get_stylesheet_directory_uri() . '/css/bootstrap.css');
	wp_register_script('bootstrap_js', get_stylesheet_directory_uri() . $path . 'bootstrap.min.js');
}

add_filter('body_class', 'elevator_body_classes');
function elevator_body_classes($classes)
{
	$page_template = get_page_template_slug(get_queried_object_id());
	if ($page_template === 'elevator-form-page.php') {
		$classes[] = 'elevator-form';
	}
	if ($page_template === 'elevator-dashboard-page.php') {
		$classes[] = 'elevator-dashboard';
	}

	if ($page_template === 'elevator-form-page.php' || $page_template === 'elevator-dashboard-page.php') {

		$classes[] = 'elevator-app';
	}

	return $classes;
}

add_action('wp_head', 'meta_user_id');
function meta_user_id($user)
{
	if (is_page('elevator-form') || is_page('user-dashboard')) {
		$user = get_current_user_id();
		$secondary_hash = random_token(9);

		echo '<meta property="user-id" content="' . $user . '">';
		echo '<meta property="secondary-cart-item" content="' . $secondary_hash . '">';
	}
}

add_action('wp_ajax_config_retrieval', 'config_retrieval');
add_action('wp_ajax_nopriv_config_retrieval', 'config_retrieval');

function config_retrieval()
{

	$results = config_details($_POST["data"]);

	if (empty($results)) {

		$error = new WP_Error('007', 'No configuration data was found. Page will reload', '');

		wp_send_json_error($error);
	} else {

		echo $results;
	}

	wp_die();
}

function config_details($id)
{
	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT el_item_data FROM ' . $table .  ' WHERE el_cart_item_id ="' .  $id . '"';

	$results = $wpdb->get_results($sql)[0]->el_item_data;

	return $results;

	wp_die();
}

add_action('wp_ajax_get_cart_contents', 'get_cart_contents');
add_action('wp_ajax_nopriv_get_cart_contents', 'get_cart_contents');

function get_cart_contents()
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$user = $_POST["data"];

	$sql = 'SELECT el_item_data FROM ' . $table .  ' WHERE status = "0" AND el_user_id = ' . $user;

	$results = json_encode($wpdb->get_results($sql));

	echo $results;

	wp_die();
}

add_action('wp_ajax_save_cart_item', 'save_cart_item');
add_action('wp_ajax_nopriv_save_cart_item', 'save_cart_item');
function save_cart_item()
{

	$old_order = $_POST['data']['oldID'];
	$new_order = $_POST['data']['order'];

	$delete = delete($old_order);

	$result = insert($new_order);

	$success = config_details($new_order['cart_item_id']);

	echo $success;

	wp_die();
}

add_action('wp_ajax_insert_order', 'insert_order');
add_action('wp_ajax_nopriv_insert_order', 'insert_order');
function insert_order()
{
	$order = $_POST["data"];
	$item_id = $order["cart_item_id"];

	remove_edit_status($item_id);

	$result = insert($_POST["data"]);

	print_r($result);

	wp_die();
}

function remove_edit_status($id)
{
	global $wpdb;

	$wpdb->show_errors();
	$wpdb->suppress_errors = false;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT status FROM ' . $table .  ' WHERE el_cart_item_id ="' . $id . '"';
	$result = $wpdb->get_results($sql);
	
	if (!empty($result) && $result[0]->status === '3') {
		$sql = 'SELECT id FROM ' . $table .  ' WHERE el_cart_item_id ="' . $id . '"';
		$row_id = $wpdb->get_results($sql)[0]->id;

		$wpdb->delete($table, array('id' => $row_id));
	}
}

function insert($order)
{

	global $wpdb;

	$wpdb->show_errors();
	$wpdb->suppress_errors = false;

	// DEFINE TABLE
	$table = $wpdb->prefix . "elevator_form_entries";

	$exists = create_form_entry_table($wpdb, $table);

	/* 
		! Status # Reference
	 *	0 = item in cart
	 *	1 = completed order
	 *	2 = saved order
	 *	3 = order that is being edited
	*/
	$status = (int)$order['status'];

	if ($exists === true) {

		$order = array(
			'created' => current_time('mysql', 1),
			'el_user_id' => $order['user_id'],
			'el_session_id' => $order['session_id'],
			'el_cart_item_id' => $order['cart_item_id'],
			'el_item_data' => json_encode($order, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
			'order_num' => get_order_num($order['user_id']),
			'submitted' => $status === 1 || $status === 2 ? true : false,
			'status' => $status,
		);

		// INSERT NEW ORDER
		$wpdb->insert($table, $order);

		$result = config_details($order['el_cart_item_id']);

		return $result;

		wp_die();
	} else {

		exit(var_dump($exists));
	}
}


add_action('wp_ajax_delete_item', 'delete_item');
add_action('wp_ajax_nopriv_delete_item', 'delete_item');

function delete_item()
{

	delete($_POST['data']);

	echo $_POST['data'];

	wp_die();
}

function delete($id)
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$wpdb->delete($table, array('el_cart_item_id' => $id));
}

function create_form_entry_table($wpdb, $table)
{

	$charset_collate = $wpdb->get_charset_collate();

	// MAYBE CREATE TABLE
	$sql = "CREATE TABLE IF NOT EXISTS $table (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		created text NOT NULL,
		el_user_id text NOT NULL,
		el_session_id text NOT NULL,
		el_cart_item_id text NOT NULL,
		el_item_data text NOT NULL,
		order_num text NOT NULL,
		submitted boolean NOT NULL,
		status TINYINT NOT NULL,
		UNIQUE (id)
	) $charset_collate;";

	// INCLUDE OR ACTION WILL FAIL
	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

	dbDelta($sql);

	$success = empty($wpdb->last_error);

	return $success;
}

add_action('wp_ajax_update_status', 'update_status');
add_action('wp_ajax_nopriv_update_status', 'update_status');

function update_status()
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";
	$data = json_encode($_POST["data"], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

	$sql = 'SELECT id FROM ' . $table .  ' WHERE el_cart_item_id ="' . $_POST["data"]["cart_item_id"] . '"';

	$result = $wpdb->get_results($sql);
	$id = $result[0]->id;

	$updated = $wpdb->update($table, array('el_item_data' => $data, 'status' => 1), array('id' => $id));

	echo $updated;

	wp_die();
}

// add_action('wp_ajax_update_status', 'update_submit');
// add_action('wp_ajax_nopriv_update_status', 'update_submit');

function update_submit($orders)
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$updated = [];

	if (is_array($orders)) {
		$record_count = 0;
		for ($i = 0; $i < count($orders); $i++) {
			$order = $orders[$i];

			$update = $wpdb->update($table, array('submitted' => "1"), array('el_cart_item_id' => $order));

			if (false === $update) {
				// There was an error.
				array_push($updated, 'THERE WAS AN ERROR');
			} else {
				// No error. You can check updated to see how many rows were changed.
				$updated = $record_count;
				$record_count++;
			}
		}
	} else {
		$update = $wpdb->update($table, array('submitted' => "1"), array('el_cart_item_id' => $orders));
		if (false === $update) {
			$updated = 'THERE WAS AN ERROR';
		} else {
			// No error. You can check updated to see how many rows were changed.
			$updated = $update;
		}
	}

	// exit(var_dump($wpdb->last_query));
	return $updated;
}

add_action('wp_ajax_save_form_item', 'save_form_item');
add_action('wp_ajax_nopriv_save_form_item', 'save_form_item');

function save_form_item()
{

	$order = $_POST["data"];
	$item_id = $order["cart_item_id"];

	remove_edit_status($item_id);

	$save = insert($_POST['data']);

	if (strlen($save) > 0) {
		echo 1;
	} else {
		echo 0;
	}

	wp_die();
}

add_action('wp_ajax_check_item_id', 'check_item_id');
add_action('wp_ajax_nopriv_check_item_id', 'check_item_id');

function check_item_id()
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT * FROM ' . $table .  ' WHERE el_cart_item_id ="' . $_POST["data"] . '"';

	$result = $wpdb->get_results($sql);

	!empty($results) ? print_r(count($result)) : null;

	wp_die();
}

add_action('wp_ajax_edit_cart_item', 'edit_cart_item');
add_action('wp_ajax_nopriv_edit_cart_item', 'edit_cart_item');

function edit_cart_item()
{

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$data = json_encode($_POST["data"]["order"], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

	$sql = 'SELECT id FROM ' . $table .  ' WHERE el_cart_item_id ="' . $_POST["data"]["id"] . '"';

	$result = $wpdb->get_results($sql);

	$updated = $wpdb->update($table, array('el_item_data' => $data, 'status' => 3), array('id' => $result[0]->id));

	// echo $data;

	if ($updated === 1) {
		echo $data;
	} else {

		$error = new WP_Error('012', 'Could not update cart item status. Please check database', '');
		wp_send_json_error($error);
	}

	wp_die();
}

add_action('phpmailer_init', 'fix_my_email_return_path');

function fix_my_email_return_path($phpmailer)
{
	$phpmailer->Sender = $phpmailer->From;
}

add_action('wp_ajax_check_if_already_submitted', 'check_if_already_submitted');
add_action('wp_ajax_nopriv_check_if_already_submitted', 'check_if_already_submitted');
function check_if_already_submitted()
{
	$orders =  $_POST["data"];

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$results = [];
	for ($i = 0; $i < count($orders); $i++) {
		$cart_item_id = $orders[$i];
		$sql = 'SELECT submitted FROM ' . $table .  ' WHERE el_cart_item_id ="' . $cart_item_id . '"';
		$result = $wpdb->get_results($sql);
		$results[$i] = new StdClass;
		$results[$i]->submitted = intVal($result[0]->submitted);

		$results[$i]->cart_item_id = $result ? $cart_item_id : false;
	}

	echo json_encode($results);

	wp_die();
}

add_action('wp_ajax_send_email', 'send_email');
add_action('wp_ajax_nopriv_send_email', 'send_email');
function send_email()
{

	$admin_email = 'support@woodfold.zendesk.com';
	//$admin_email = 'ajstimson@gmail.com';

	$results = [];
	$results['client_email'] = process_email('client', $_POST['data'], $admin_email);
	$results['admin_email'] = process_email('admin', $_POST['data'], $admin_email);
	//$results['admin_email'] = true;
	$results['orders'] = $_POST['data'];

	$results['submit_updated'] = update_submit($results['orders']);

	echo json_encode($results);

	wp_die();
}

add_action('wp_ajax_request_quote_email', 'request_quote_email');
add_action('wp_ajax_nopriv_request_quote_email', 'request_quote_email');
function request_quote_email()
{

	$date_time = new DateTime('NOW');
	$date_formatted = $date_time->format('m/d/Y h:i A');
	$data[0] = $_POST['data'];

	// $html = email_html_header();
	$html = email_output_html('admin', $data, $date_formatted, true);
	$html .= '		<!--[if mso]></div><![endif]-->
						<!--[if IE]></div><![endif]-->
						</div></div>
						</body>
					</html>';
	$subject = 'Elevator Gate Quote Requested. Date: ' . $date_formatted;
	$from = $data[0]['guest']['Email'];
	$from_name = $data[0]['guest']['Name'];
	// $to = 'ajstimson@gmail.com';
	$to = 'support@woodfold.zendesk.com';

	$headers["Reply-To"] = "no-reply@woodfold.com";
	$headers = email_headers($from, $from_name);

	$mail_result = false;
	$mail_result = mail($to, $subject, $html, $headers);

	if ($mail_result === true) {
		wp_send_json_success($mail_result);
	} else {
		wp_send_json_error($mail_result);
	}
	wp_die();
}

function process_email($recipient, $data, $admin_email)
{

	$orders = [];
	$output = [];
	$i = 0;

	foreach ($data as $key => $order) {
		$orders[$i] = json_decode(config_details($order));

		global $wpdb;
		$table = $wpdb->prefix . "elevator_form_entries";
		$sql = 'SELECT created, order_num FROM ' . $table .  ' WHERE el_cart_item_id ="' . $data[$i]  . '"';

		$results = $wpdb->get_results($sql);

		$create_date = new DateTime($results[0]->created);
		$format = $create_date->format('c');
		$timezone = new DateTimeZone('America/Los_Angeles');
		$date_time = new DateTime($format, $timezone);
		$offset = $timezone->getOffset($create_date);
		$interval = DateInterval::createFromDateString((string)$offset . 'seconds');
		$date_time->add($interval);
		$date_formatted = $date_time->format('m/d/Y h:i A');

		$output[$i]['order_number'] = $results[0]->order_num;
		$output[$i]['address_info'] = address_content($orders[$i], $date_formatted);
		$output[$i]['config_details'] = config_content($orders[$i]);

		$i++;
	}

	$client_email = $output[0]['address_info']['shipper_data']['email'];


	if ($recipient === 'client') {
		$from_name = 'Woodfold Manufacturing';
		$from =  $admin_email;
		$to = $client_email;
		$html = email_output_html('client', $output, $date_formatted, false);
		$subject = 'Your elevator order created on ' . $date_formatted;
	}

	if ($recipient === 'admin') {
		$from_name = $output[0]['address_info']['shipper_data']['name'];
		$from = $client_email;
		$to = $admin_email;
		$subject = 'New Elevator Gate Order, created on ' . $date_formatted;
		$html = email_html_header();
		// $html = json_encode($output);
		$html .= email_output_html('admin', $output, $date_formatted, false);
		$html .= '		<!--[if mso]></div><![endif]-->
						<!--[if IE]></div><![endif]-->
						</body>
					</html>';
	}

	$headers = email_headers($from, $from_name);


	$mail_result = false;
	$mail_result = mail($to, $subject, $html, $headers);

	return $mail_result;
}

function concatonate_order_numbers($output)
{
	$length = count($output);
	$string = '';
	if ($length < 4) {
		for ($i = 0; $i < $length; $i++) {
			$string .= ' ' . $output[$i]['order_number'] . ' ';
		}
	} else {
		$string = 's';
	}
	return $string;
}


function email_headers($from, $from_name)
{

	$headers = "From:" . $from_name . " <" . $from . ">\r\n";
	$headers .= "Reply-To: " . $from . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Transfer-Encoding: 8bit\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

	return $headers;
}

function email_output_html($recipient, $output, $date, $request)
{

	$data = [];
	$i = 0;
	$html = '';

	if ($recipient === 'admin') {
		$html = '<div style="max-width:100%;background-color:#e7e7e7;padding: 50px;">
				<div style="max-width:600px;margin: 0 auto;background-color:#fff;padding: 50px;">';
		if ($request === false) {
			$html .= '<p>A new order has been created:</p>';
		}
		if ($request === true) {
			$html .= '<p>A quote has been requested:</p>';
		}
	}
	if ($request === false) {
		//Grab shipper data outside of loop since it is only repeated later on
		$shipper = $output[0]['address_info']['shipper_data'];
	}

	$html .= '<p align="center" style="background-color: #e7e7e7; padding: 10px;"><b>Date created: ' . $date . '</b></p>';

	if ($request === false) {
		$html .= '<h3>Account Info</h3>';
		$html .= email_process_html($shipper, 'ul', 'no_title');
	}

	if ($request === true) {
		$contact = $output[0]['guest'];
		$html .= '<h3>Contact Info</h3>';
		$html .= email_process_html($contact, 'ul', 'no_title');
	}

	$html .= '<hr>';

	if ($request === false) {
		foreach ($output as $key => $item) {

			$html .= '<h3>Order Number: ' . $output[$i]['order_number'] . '</h3>';
			$html .= '<h3>PO Number: ' . $output[$i]['address_info']['po_num']['po'] . '</h3>';

			$sidemark = isset($output[$i]['address_info']['po_num']['sidemark']) ? $output[$i]['address_info']['po_num']['sidemark'] : null;

			$sidemark ? $html .= '<h3>Sidemark: ' . $sidemark . '</h3>' : null;

			$customer[$i] =  isset($output[$i]['address_info']['customer']) ? $output[$i]['address_info']['customer'] : null;

			if (!empty($customer[$i])) {
				$customer[$i]['city'] = $customer[$i]['city'] . ', ' . $customer[$i]['state'] . ' ' . $customer[$i]['zip'];
				unset($customer[$i]['state']);
				unset($customer[$i]['zip']);

				$html .= '<p><b>Ship to address: </b></p>';
				$html .= email_process_html($customer[$i], 'ul', 'no_title');
			}


			$html .= '<h3>Configuration Details: </h3>';

			if ($recipient === 'admin') {
				$output[$i]['config_details'] = admin_config_adjustment($output[$i]['config_details']);
			}

			$html .= email_process_html($output[$i]['config_details'], 'table', 'title');

			$html .= '<hr>';

			$i++;
		}
	}

	if ($request === true) {

		$html .= '<h3>Configuration Details: </h3>';
		$convert = json_decode(json_encode($output[0]), FALSE);;
		$output[0]['config_details'] = config_content($convert);
		$output[0]['config_details'] = admin_config_adjustment($output[0]['config_details']);

		$html .= email_process_html($output[0]['config_details'], 'table', 'title');
	}

	if ($recipient === 'client') {
		$html = email_html($date, $html);
	}

	if ($recipient === 'admin') {
		$html .= '</div><div>';
	}

	return $html;
}

function admin_config_adjustment($config_details)
{

	unset($config_details["Quote"]);

	return $config_details;
}

function email_process_html($data, $el, $style)
{

	if ($el === 'ul') {
		$html = '<ul>';
		foreach ($data as $key => $item) {
			$html .= '<li>';

			if ($style === 'title') {
				$html .= '<b>' . $key . ': </b>';
			}

			$html .= $item;
			$html .= '</li>';
		}
		$html .= '</ul>';
	}

	if ($el === 'table') {
		$html = '<table class="config-table"><tbody>';
		$html .= '<colgroup><col span="1" style="width: 40%;"><col span="1" style="width: 60%;"></colgroup>';
		foreach ($data as $key => $item) {
			if (!empty($item)) {
				$html .= '<tr>';

				if ($style === 'title') {
					$html .= '<td><b>' . $key . ':</b></td>';
				}

				$html .= '<td>' . $item . '</td>';
				$html .= '</tr>';
			}
		}
		$html .= '</tbody></table>';
	}

	return $html;
}

function config_table_style()
{
	return '
		table.config-table{
			order-collapse: collapse;
			margin: 25px 0;
			max-width: 400px;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
			margin: 0 auto;
		}

		table.config-table tr{
			border: .5px solid #eee;
		}

		table.config-table td{
			padding: 12px 15px;
		}
	';
}

function email_html_header()
{
	$html =
		'<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
			<head>
				<!--[if gte mso 9]>
				<xml>
					<o:OfficeDocumentSettings>
						<o:AllowPNG/>
						<o:PixelsPerInch>96</o:PixelsPerInch>
					</o:OfficeDocumentSettings>
				</xml>
				<![endif]-->
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta name="x-apple-disable-message-reformatting">
				<!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
				<title>
					NEW ORDER: Woodfold Elevator Gate Series 1600
				</title>
			
				<style type="text/css">
					table, td { 
						color: #000000; 
					}
					ul li {
						list-style: none;
					}
					'
		. config_table_style() .
		'
					@media (max-width: 480px) { 
						#u_content_menu_1 .v-padding { 
							padding: 5px 35px !important; 
						} 
						#u_content_menu_2 .v-padding { 
							padding: 5px 38px 5px 32px !important; 
						} #u_content_menu_4 .v-padding { 
							padding: 5px 40px 5px 50px !important; 
						} #u_content_menu_3 .v-padding { 
							padding: 5px 40px 5px 55px !important; 
						} 
					}
					@media only screen and (min-width: 660px) {
						.u-row {
							width: 640px !important;
						}
						.u-row .u-col {
							vertical-align: top;
						}

						.u-row .u-col-50 {
							width: 320px !important;
						}

						.u-row .u-col-100 {
							width: 640px !important;
						}
					}

					@media (max-width: 660px) {
						.u-row-container {
							max-width: 100% !important;
							padding-left: 0px !important;
							padding-right: 0px !important;
						}
						.u-row .u-col {
							min-width: 320px !important;
							max-width: 100% !important;
							display: block !important;
						}
						.u-row {
							width: calc(100% - 40px) !important;
						}
						.u-col {
							width: 100% !important;
						}
						.u-col > div {
							margin: 0 auto;
						}
					}

					body {
						margin: 0;
						padding: 0;
					}

					table,
					tr,
					td {
						vertical-align: top;
						border-collapse: collapse;
					}

					p {
					margin: 0;
					}

					.ie-container table,
					.mso-container table {
						table-layout: fixed;
					}

					* {
						line-height: inherit;
					}

					a[x-apple-data-detectors="true"] {
						color: inherit !important;
						text-decoration: none !important;
					}

					@media (max-width: 480px) {
						.hide-mobile {
							display: none !important;
							max-height: 0px;
							overflow: hidden;
						}
					}
				</style>
			</head>
			<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
				<!--[if IE]><div class="ie-container"><![endif]-->
				<!--[if mso]><div class="mso-container"><![endif]-->';
	return $html;
}

function email_html($date, $html)
{
	//TODO: replace "tick" image with something on production site
	$html = email_html_header() .
		'<table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr style="vertical-align: top">
							<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
								<div class="u-row-container" style="padding: 20px 0px 0px;background-color: transparent">
									<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
										<div style="border-collapse: collapse;display: table;width: 100%;background-color: rgb(74, 74, 74);">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 20px 0px 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->	
										<!--[if (mso)|(IE)]><td align="center" width="320" style="width: 320px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-50" style="max-width: 320px;min-width: 320px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
												<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
								
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 15px;font-family:arial,helvetica,sans-serif;" align="left">		
																	<table width="100%" cellpadding="0" cellspacing="0" border="0">
																		<tr>
																			<td style="padding-right: 0px;padding-left: 0px;" align="left">
																				<img align="left" border="0" src="https://woodfold.com/wp-content/uploads/2020/05/wf-for-dark-background-r.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 181px;" width="181"/>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
											<!--[if (mso)|(IE)]></td><![endif]-->
											<!--[if (mso)|(IE)]><td align="center" width="320" style="width: 320px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-50" style="max-width: 320px;min-width: 320px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
												<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
					
													<table class="hide-mobile" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:42px;font-family:arial,helvetica,sans-serif;" align="left">
																	<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
																		<p style="font-size: 14px; line-height: 140%; text-align: right;">
																			<span style="font-size: 16px; line-height: 22.4px; color: #fff;">
																				' . $date . '
																			</span>
																		</p>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
											<!--[if (mso)|(IE)]></td><![endif]-->
											<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
										</div>
									</div>
								</div>
								<div class="u-row-container" style="padding: 0px;background-color: transparent">
									<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
										<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
												<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
																	<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																		<tbody>
																			<tr style="vertical-align: top">
																				<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
																					<span>&#160;</span>
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
																	<table width="100%" cellpadding="0" cellspacing="0" border="0">
																		<tr>
																			<td style="padding-right: 0px;padding-left: 0px;" align="center">
																				<img align="center" border="0" src="https://img.bayengage.com/assets/1613615720006-tick (1).jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 106px;" width="106"/>
																			</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
																	<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
																		<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 18px; line-height: 25.2px; color: #4a4a4a;"><strong>Thank you for placing you order</strong></span><strong style="color: #4a4a4a; font-size: 18px;">!</strong></p>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">       
																	<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
																		<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 12px; line-height: 16.8px;"><strong><span style="color: #4a4a4a; line-height: 16.8px; font-size: 12px;">Please review the details below</span></strong></span></p>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
											<!--[if (mso)|(IE)]></td><![endif]-->
											<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
										</div>
									</div>
								</div>
								<div class="u-row-container" style="padding: 0px;background-color: transparent">
									<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
										<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
												<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">       
																	<div style="line-height: 140%; text-align: left; word-wrap: break-word;padding-left: 20px;padding-right: 20px;">
																		' . $html . '
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
											<!--[if (mso)|(IE)]></td><![endif]-->
											<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
										</div>
									</div>
								</div>
								<div class="u-row-container" style="padding: 0px;background-color: transparent">
									<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
										<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
												<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">       
																	<div style="line-height: 140%; text-align: center; word-wrap: break-word;">
																		<p>If you have any questions, please call us at <a href="tel:503-357-7181">503-357-7181</a></p>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
											<!--[if (mso)|(IE)]></td><![endif]-->
											<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
										</div>
									</div>
								</div>
								<div class="u-row-container" style="padding: 0px;background-color: transparent">
									<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
										<div style="border-collapse: collapse;display: table;width: 100%;background-color:rgb(74,74,74);">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
											<div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
												<div style="width: 100% !important;">
													<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
														<tbody>
															<tr>
																<td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 40px;font-family:arial,helvetica,sans-serif;" align="left">
																	<div style="line-height: 140%; text-align: left; word-wrap: break-word;color: #fff">
																		<p style="color: #fff;font-size: 14px; line-height: 140%; text-align: center;">This email was sent by <span style="color: #E2701E;font-weight:bold;font-size: 14px; line-height: 19.6px;">Woodfold Manufacturing</span>.</p>
																		<p style="color: #fff;font-size: 14px; line-height: 140%; text-align: center;">To ensure delivery to your inbox (not bulk or junk folders), you can add <span style="color: #E2701E; font-size: 14px; line-height: 19.6px;"><a style="color:#fff" href="mailto:support@woodfold.com" target="_blank">support@woodfold.com</a></span> to your address book or safe list.</p>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
												</div>
											</div>
										<!--[if (mso)|(IE)]></td><![endif]-->
										<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
										</div>
									</div>
								</div>
							<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
							</td>
						</tr>
					</tbody>
				</table>
				<!--[if mso]></div><![endif]-->
				<!--[if IE]></div><![endif]-->
			</body>
		</html>';
	return $html;
}

function email_config_content($type, $data)
{

	$array = [];
	$array['customer_shipping'] = get_customer_data($data);

	$i = 0;
	foreach ($data as $key => $item) {
		if (
			$key != 'company'
			&& $key != 'first_name'
			&& $key != 'last_name'
			&& $key != 'email'
			&& $key != 'street_address'
			&& $key != 'city'
			&& $key != 'state'
			&& $key != 'zip_code'
			&& $key != 'country'
			&& $key != 'phone'
			&& $key != 'ext'
			&& $key != 'ship_to_country'
			&& $key != 'customer_po_number'
			&& $key != 'customer_sidemark'
			&& $key != 'customer_first_name'
			&& $key != 'customer_last_name'
			&& $key != 'customer_company'
			&& $key != 'ship_to_address'
			&& $key != 'apartment_suite_unit_etc'
			&& $key != 'ship_to_city'
			&& $key != 'state__province__region'
			&& $key != 'ship_to_state'
			&& $key != 'ship_to_region'
			&& $key != 'ship_to_province'
			&& $key != 'zip__postal_code'
			&& $key != 'customer_phone'
			&& $key != 'extension'
		) {
			if (empty($item->type) && $item != '' && !empty($item->value)) {
				$array[$key] = $item->value;
			}

			if ($item->type === 'number' && $item->value !== '0') {

				$array[$key] = $item->value;
			}

			if ($item->type === 'text' && $item->value !== '') {
				$array[$key] = $item->value;
			}

			if ($item->type === 'email' && $item->value !== '') {
				$array[$key] = $item->value;
			}

			if ($item->type === 'select-one' && $item->value !== '' && $item->value !== 'AA' && $item->value !== 'false') {
				$array[$key] = $item->value;
			}

			if ($item->type === 'select-one' && $item->value !== '' && $item->value !== 'AA' && $item->value !== 'false') {
				$array[$key] = $item->value;
			}

			if ($item->type === 'radio' && !empty($item->value)) {

				foreach ($item->value as $nested => $thing) {

					if ($thing->status === 'true' && $thing->name !== 'No') {
						$array[$key] = $thing->name;
					}
				}
			}
		}

		$i++;
	}

	$html = '<hr>';
	$html .= '<h3>PO Number: ' . $array['po_number'] . '</h3>';

	if (!empty($array['sidemark'])) {
		$html .= '<h3>Sidemark: ' . $array['sidemark'] . '</h3>';
	}

	unset($array['po_number']);
	unset($array['sidemark']);

	if (!empty($array['customer_shipping'])) {
		$html .= '<h3>Ship to Customer</h3>';
		$html .= '<p>';
		foreach ($array['customer_shipping'] as $key => $value) {
			$html .= $value . '<br>';
		}
		$html .= '</p>';
	}

	$html .= '<p><b>Configuration Details</b></p>';

	$html .= configure_html($array);

	return $html;
}

function get_customer_data($data)
{
	$customer_shipping = [];

	if ($data->ship_to_a_different_address->value !== 'false') {
		foreach ($data as $key => $item) {
			if (
				$key === 'ship_to_country'
				|| $key === 'customer_po_number'
				|| $key === 'customer_sidemark'
				|| $key === 'customer_company'
				|| $key === 'ship_to_address'
				|| $key === 'apartment_suite_unit_etc'
				|| $key === 'ship_to_city'
				|| $key === 'state__province__region'
				|| $key === 'ship_to_state'
				|| $key === 'ship_to_region'
				|| $key === 'ship_to_province'
				|| $key === 'zip__postal_code'
				|| $key === 'customer_phone'
				|| $key === 'extension'
			) {
				if (!empty($item->value) && $item->value != 'US') {

					$customer_shipping[$key] = $item->value;
				}
			}
		}
		$name = [];
		if (!empty($data->customer_first_name->value) && !empty($data->customer_last_name->value)) {

			$name['name'] = $data->customer_first_name->value . ' ' . $data->customer_last_name->value;
		}

		array_splice($customer_shipping, 1, 0, $name);
	}


	return $customer_shipping;
}

function move_key_position($arr, $find, $move)
{
	if (!isset($arr[$find], $arr[$move])) {
		return $arr;
	}

	$elem = [$move => $arr[$move]];  // cache the element to be moved
	$start = array_splice($arr, 0, array_search($find, array_keys($arr)));
	unset($start[$move]);  // only important if $move is in $start
	return $start + $elem + $arr;
}

function configure_html($array)
{
	if (!empty($array)) {

		$html = '<ul>';

		foreach ($array as $key => $value) {
			$html .= '<li>' . clean_up_text($key) . ': ' . $value . '</li>';
		}

		$html .= '</ul>';

		return $html;
	}
}

function clean_up_text($str)
{
	return ucwords(str_replace("_", " ", $str));
}


add_action('wp_ajax_get_salt', 'get_salt');
add_action('wp_ajax_nopriv_get_salt', 'get_salt');

function get_salt()
{

	echo random_token(18);

	wp_die();
}

add_action('wp_ajax_create_pdf', 'create_pdf');
add_action('wp_ajax_nopriv_create_pdf', 'create_pdf');

function create_pdf()
{

	$order = json_decode(config_details($_POST['data']));

	global $wpdb;
	$table = $wpdb->prefix . "elevator_form_entries";
	$sql = 'SELECT created FROM ' . $table .  ' WHERE el_cart_item_id ="' . $_POST["data"] . '"';

	$date_created = $wpdb->get_results($sql);
	$date_time = new DateTime($date_created[0]->created);
	$date_formatted = $date_time->format('m/d/Y h:i A');

	$order_sql = 'SELECT order_num FROM ' . $table .  ' WHERE el_cart_item_id ="' .  $_POST["data"] . '"';
	$order_num = $wpdb->get_results($order_sql);


	$output = [];

	if (!empty($order)) {

		$output['date'] = $date_formatted;
		$output['order_number'] = $order_num[0]->order_num;
		$output['address_info'] = address_content($order, $output['date']);
		$output['config_details'] = config_content($order);

		$output = json_encode($output);
	} else {

		$output = 'error';
	}

	echo $output;

	wp_die();
}

function address_content($order, $date)
{
	$array = [];
	$po_num = [];
	$shipper = [];
	$customer = [];

	$po_num['po'] = $order->po_number->value;

	if (!empty($order->sidemark->value)) {

		$po_num['sidemark'] = $order->sidemark->value;
	}

	$po_num['date'] = $date;

	if ($order->rush_shipping->value !== 'false') {

		$po_num['rush'] = 'Yes';
	}

	$array['po_num'] = $po_num;

	$shipper['company'] = $order->company->value;
	$shipper['name'] = $order->first_name->value . ' ' . $order->last_name->value;
	$shipper['email'] = $order->email->value;
	$shipper['street_address'] = $order->street_address->value;

	if (!empty($order->street_address_2->value)) {

		$shipper['street_address_2'] = $order->street_address_2->value;
	}

	if ($order->country->value === 'US') {

		$shipper['street_address_3'] = $order->city->value . ', ' . $order->state->value . ' ' . $order->zip_code->value;
	}

	if ($order->country->value !== 'US') {

		$shipper['city'] = $order->city->value;
		$shipper['country'] = $order->country->value;
	}

	if (!empty($order->ext->value)) {

		$shipper['phone'] = $order->phone->value . ' ext: ' . $order->ext->value;
	} else {

		$shipper['phone'] = $order->phone->value;
	}

	$array['shipper_data'] = array_filter($shipper);

	// IF DIFFERENT SHIP TO ADDRESS IS SELECTED

	if ($order->ship_to_a_different_address->value === 'true') {

		$customer['po_num'] = $order->customer_po_number->value;
		$customer['sidemark'] = $order->customer_sidemark->value;
		$customer['company'] = $order->customer_company->value;
		$customer['name'] = $order->customer_first_name->value . ' ' . $order->customer_last_name->value;

		if ($customer['name']  == ' ') {
			unset($customer['name']);
		}
		$customer['street_address'] = $order->ship_to_address->value;

		if (!empty($order->apartment_suite_unit_etc->value)) {

			$customer['street_address_2'] = $order->apartment_suite_unit_etc->value;
		}

		$customer['city'] = $order->ship_to_city->value;

		if ($order->ship_to_country->value === 'US') {

			$customer['state'] = $order->ship_to_state->value;
			$customer['zip'] = $order->zip__postal_code->value;
		}

		if ($order->ship_to_country->value !== 'US') {

			$customer['country'] = $order->ship_to_country->value;
		}

		$customer['phone'] = $order->customer_phone->value;

		$array['customer'] = array_filter($customer);
	}

	return $array;
}

add_action('wp_ajax_guest_config_pdf', 'guest_config_pdf');
add_action('wp_ajax_nopriv_guest_config_pdf', 'guest_config_pdf');

function guest_config_pdf()
{
	// $config = (object) $_POST['data'];
	$config = json_decode(json_encode($_POST['data']), FALSE);
	$fin = config_content($config);

	if (!empty($fin)) {
		wp_send_json_success(json_encode($fin));
	} else {

		$response = array('success' => false, 'message' => 'An error occurred, please try again');
	}

	echo $response;
	// echo json_encode($config);
	wp_die();
}

function config_content($order)
{
	$config['Cab Width'] = $order->gate_width->value;

	$pocket_depth = (float)$order->pocket_depth->value;
	//Show pocket depth if greater than 0
	if ($pocket_depth > 0) {
		$config['Pocket Depth'] = $order->pocket_depth->value;
	}

	$config['Gate Height'] = $order->cab_height->value;

	$height_options = $order->height_options->value;

	//If height option is not standard - show
	if ($height_options !== '.3125') {
		$config['Height Option'] = $height_options;
	}

	$config['Number of Gate Panels'] = $order->number_of_gate_panels->value;
	$config['Stack Direction'] = radio_sort($order->stack_direction);

	$double_gate = radio_sort($order->double_ended_gate);

	//If double gate is selected - show
	if ($double_gate === 'Yes') {
		$config['Double Gate'] = 'Yes';
	}

	$config['Panel Material'] = panel_material($order);

	if ($config['Panel Material'] !== 'Custom') {
		$config['Finish'] = panel_finish($order);
	}

	$custom_finish = radio_sort($order->finish);
	// Only show special finish if selected
	if ($custom_finish === 'Special Finish') {
		$config['Special Finish'] = $order->enter_type_of_color->value;
	}

	if ($custom_finish === 'Unfinished') {
		$config['Finish Type'] = $custom_finish;
	}

	$vision_panel_status = vision_panel_status($order);
	// Only show vision panel options if selected
	if ($vision_panel_status === true) {
		$config['Number of Vision Panels'] = $order->number_of_vision_panels->value;
		$config['Vision Panel Position'] = $order->vision_panel_position->value;
		$config['Vision Panel Material'] = $order->vision_panel_material->value;
	}

	$config['Track'] = radio_sort($order->track);
	$config['Hinge Hardware'] = radio_sort($order->hinge_hardware);
	$config['Side Channels'] = radio_sort($order->side_channels);
	$config['Connector Color & Lead Post'] = radio_sort($order->lead_post__connector);

	// Closure options (only show if not standard option)
	for ($i = 0; $i < count($order->closure_options->value); $i++) {
		// $config['Closure Options'][$i] = $order->closure_options->value[$i]->name . ' ' . $order->closure_options->value[$i]->status;
		if (
			$order->closure_options->value[$i]->name !== 'Single Magnetic Catch (Standard)'
			&& $order->closure_options->value[$i]->status === 'true'
		) {
			$config['Closure Options'] = $order->closure_options->value[$i]->name;
		}
	}

	if (!empty($order->order_notes->value)) {
		$config['Additional Notes'] = $order->order_notes->value;
	}

	if ($config['Panel Material'] === 'Custom') {
		$config['Quote'] = 'Woodfold will contact you shortly to provide a quote';
	}

	if (!empty($order->rush_shipping->value)) {
		$config['Rush'] = $order->rush_shipping->value;
	}

	if (!empty($order->quantity->value)) {
		$config['Quantity'] = $order->quantity->value;
	}

	return $config;
}

function radio_sort($item)
{
	$radio = '';

	for ($i = 0; $i < count($item->value); $i++) {
		if ($item->value[$i]->status === 'true') {
			$radio .=  $item->value[$i]->name;
		}
	}

	return $radio;
}

function panel_material($order)
{
	$panel = '';
	// we need to loop through the following radio options to find what was selected

	$panel .= material_sort('Acrylic', $order->acrylic);
	$panel .= material_sort('Hardwood', $order->natural_hardwood_veneers);
	$panel .= material_sort('Vinyl', $order->vinyl_laminate_woodgrains);
	$panel .= material_sort('Vinyl', $order->vinyl_laminate_solid_colors__textures);
	$panel .= material_sort('Alumifold', $order->alumifold_perforated);
	$panel .= material_sort('Alumifold', $order->alumifold_solid);
	$panel .= material_sort('Fire Core', $order->fire_core);
	$panel .= material_sort('Custom', $order->custom);

	return $panel;
}

function material_sort($name, $item)
{
	$material = '';

	for ($i = 0; $i < count($item->value); $i++) {
		if ($item->value[$i]->status === 'true') {
			$material .=  $name;
		}
	}

	return $material;
}

function panel_finish($order)
{
	$panel_finish = '';

	$panel_finish .= finish_sort($order, $order->natural_hardwood_veneers);
	$panel_finish .= finish_sort($order, $order->vinyl_laminate_woodgrains);
	$panel_finish .= finish_sort($order, $order->vinyl_laminate_solid_colors__textures);
	$panel_finish .= finish_sort($order, $order->acrylic);
	$panel_finish .= finish_sort($order, $order->alumifold_perforated);
	$panel_finish .= finish_sort($order, $order->alumifold_solid);
	$panel_finish .= finish_sort($order, $order->fire_core);
	$panel_finish .= finish_sort($order, $order->custom);

	return $panel_finish;
}

function finish_sort($order, $item)
{
	$finish = '';

	//Loop through 
	for ($e = 0; $e < count($item->value); $e++) {
		//Find selected panel material finish
		if ($item->value[$e]->status === 'true') {
			$special_finish = '';
			//Then check for special finish
			for ($i = 0; $i < count($order->finish->value); $i++) {
				//If clear finish is not selected
				if ($order->finish->value[$i]->name === 'Clear Finish' && $order->finish->value[$i]->status !== 'true') {
					//Loop through finish and find what was selected
					for ($j = 0; $j < count($order->finish->value); $j++) {
						if ($order->finish->value[$j]->status === 'true' && $order->finish->value[$j]->name !== 'Special Finish') {
							//Store it in a string (finish)
							$special_finish = '(' . $order->finish->value[$j]->name . ')';
						}
						if ($order->finish->value[$j]->status === 'true' && $order->finish->value[$j]->name !== 'Special Finish') {
							//Include Special Finish enter_type_of_color field value
							$special_finish = '(Special Finish: ' . $order->enter_type_of_color->value . ')';
						}
					}
				}
			}
			//Generate object
			$finish .=   $item->value[$e]->name . ' ' . $special_finish;
		}
	}

	return $finish;
}

function vision_panel_status($order)
{
	$vision_panel = false;
	$vision_data = $order->include_vision_panels;

	for ($i = 0; $i < count($vision_data->value); $i++) {
		if ($vision_data->value[$i]->name === 'True' && $vision_data->value[$i]->status === 'true') {
			$vision_panel = true;
			break;
		}
	}

	return $vision_panel;
}

function run_activate_plugin($plugin)
{
	if (!function_exists('activate_plugin')) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	if (!is_plugin_active($plugin)) {
		activate_plugin($plugin);
	}
}

run_activate_plugin('revslider/revslider.php');

add_action('genesis_before_entry', 'do_slider');

function do_slider()
{
	$slider = get_field('slider');
	if (!empty($slider)) {
		echo $slider;
	}
}

add_action('wp_ajax_get_po_sidemark', 'get_po_sidemark');
add_action('wp_ajax_nopriv_get_po_sidemark', 'get_po_sidemark');
function get_po_sidemark()
{
	global $wpdb;

	$id = intval($_GET["data"]);

	$entries = $wpdb->prefix . "elevator_form_entries";
	$query = 'SELECT el_item_data FROM ' . $entries . ' WHERE el_user_id = ' . $id . ' AND status = "1"';
	$json = $wpdb->get_results($query);
	$po_array = array_unique(po_sidemark_sort($json, 'po'));
	$sidemark_array = array_unique(po_sidemark_sort($json, 'sidemark'));

	$merged = [];

	$merged['po'] = $po_array;
	$merged['sidemark'] = $sidemark_array;

	$result = json_encode($merged);

	print_r($result);

	wp_die();
}

function po_sidemark_sort($items, $key)
{
	$array = [];
	$i = 0;
	foreach ($items as $item) {
		$order = json_decode($item->el_item_data);
		if ($key === 'po') {

			$array[$i] = $order->po_number->value;
		}
		if ($key === 'sidemark') {

			$array[$i] = $order->sidemark->value;
		}

		$i++;
	}
	return $array;
}

add_action('wp_ajax_get_queried_orders', 'get_queried_orders');
add_action('wp_ajax_nopriv_get_queried_orders', 'get_queried_orders');
function get_queried_orders()
{
	$data = $_GET["data"];

	if (isset($data['filters'])) {
		$filters = $data['filters'];
	}

	$order_by = $data['orderBy'];
	$sort = $data['newSort'];

	$results['filters'] = $data;


	if (isset($filters['po_number']) || isset($filters['sidemark']) || $order_by === 'po' || $order_by === 'sidemark') {
		// unset($order_by, $sort);
		$orders = sort_by_po_sidemark($filters, $order_by, $sort);

		$orders =  add_account_names($orders);

		$results['orders'] = $orders;

		$results['count'] = count($results['orders']);

		echo json_encode($results);

		wp_die();
	}


	global $wpdb;

	$entries = $wpdb->prefix . "elevator_form_entries";

	$query = 'SELECT * FROM ' . $entries . ' WHERE status = "1"';

	if (isset($filters['el_user_id'])) {
		$query .= ' AND el_user_id = ' . $filters['el_user_id'];
	}

	if ($order_by === 'created' && isset($sort)) {
		$query .= ' ORDER BY created ' .  $sort;
	}
	$orders = $wpdb->get_results($query);
	$orders =  add_account_names($orders);
	$results['orders'] = $orders;
	$results['count'] = count($results['orders']);
	if (isset($filters['el_user_id'])) {
		$results['account_po_sidemark'] = add_account_po_sidemark($orders);
	}

	echo json_encode($results);

	wp_die();
}

function add_account_names($orders)
{
	$results = [];
	for ($i = 0; $i < count($orders); $i++) {

		$account_id = $orders[$i]->el_user_id;
		$account_data = get_userdata($account_id);

		if (empty($account_data)) {
			$details = json_decode($orders[$i]->el_item_data);
			$email = $details->email->value;
			$account_data = get_user_by('email', $email);
		}

		$account = company_name($account_data, $account_id);

		if (empty($account)) {
			$detail = json_decode($orders[$i]->el_item_data);
			$account = $detail->company->value;
		}

		$results[$i]['account'] = $account;
		$results[$i]['details'] = $orders[$i];
	}
	return $results;
}

function company_name($user_data, $user_id)
{
	global $wpdb;

	$user_meta = $wpdb->prefix . "usermeta";
	$get_account = $wpdb->get_results("SELECT meta_value FROM " . $user_meta . " WHERE meta_key = 'company_name' AND user_id = " . $user_id);
	$company = !empty($get_account) ? $get_account[0]->meta_value : null;

	//Avoids deleted users from showing up
	if (!$user_data) {
		return;
	}

	//If user doesn't have a company name, get their login name
	if (empty($company)) {
		$company = $user_data->user_login;
	}

	//Filter results to create more readable company names
	$company = preg_replace('/([a-z])([A-Z])/', '$1 $2', $company);
	$company = preg_replace('/([A-Z])\1{1,}/', '$1 $1', $company);
	$company = preg_replace('/\d+$/', '', $company);

	return $company;
}

function add_account_po_sidemark($orders)
{
	$results = [];
	for ($i = 0; $i < count($orders); $i++) {
		$order = json_decode($orders[$i]['details']->el_item_data);
		$po = $order->po_number->value;
		$sidemark = $order->sidemark->value;

		$results[$i]['po'] = $po;
		$results[$i]['sidemark'] = $sidemark;
	}
	return $results;
}

function sort_by_po_sidemark($filters, $order_by, $sort)
{
	global $wpdb;

	$entries = $wpdb->prefix . "elevator_form_entries";

	$query = 'SELECT * FROM ' . $entries;

	if (isset($filters['el_user_id'])) {
		$query .= ' WHERE el_user_id = ' . $filters['el_user_id'] . ' AND status = "1"';
	} else {
		$query .= ' WHERE status = "1"';
	}


	if ($order_by === 'created') {
		$query .= ' ORDER BY created ' .  $sort;
	}

	$all_orders = $wpdb->get_results($query);

	return $all_orders;
}

function get_order_num($user_id)
{
	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT MAX(order_num) AS order_num FROM ' . $table . ' WHERE el_user_id = ' . $user_id;
	$last_order_num = $wpdb->get_results($sql);
	$last_order_num = $last_order_num[0]->order_num;
	$num = substr($last_order_num, -4);
	$num = intval($num) + 1;

	//pad count with up to 3 zeros
	$num = str_pad($num, 4, "00", STR_PAD_LEFT);

	$user = str_pad($user_id, 2, "00", STR_PAD_LEFT);
	/*  
		order number pattern
		Woodfold User ID YY Entry Number
			WF 	 	01 	 22	 0001
		12 characters
	*/
	$new_order_num = 'WF' . $user . date("y") . $num;

	return $new_order_num;

	wp_die();
}

//! Uncomment line below to create values in new columnm
// add_action('init', 'create_new_el_column_and_fill_it');
function create_new_el_column_and_fill_it()
{
	/*  
	! 	FIRST: Open phpMyAdmin and paste this MySQL code:
	*	ALTER TABLE _elevator_form_entries ADD COLUMN order_num TEXT
		Then refresh the page
	*/

	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT DISTINCT el_user_id FROM ' . $table;
	$rows = $wpdb->get_results($sql);
	for ($i = 0; $i < count($rows); $i++) {
		$row = $rows[$i];
		$user_id = $row->el_user_id;

		$sql = 'SELECT * FROM ' . $table . ' WHERE el_user_id = ' . $user_id;
		$orders = $wpdb->get_results($sql);
		//Get count of number of orders
		$count = count($orders);
		for ($j = 0; $j < count($orders); $j++) {
			$id = $orders[$j]->id;

			//pad count with up to 3 zeros
			$num = str_pad($count, 4, "00", STR_PAD_LEFT);

			$user = str_pad($user_id, 2, "00", STR_PAD_LEFT);
			/*  
				order number pattern
				Woodfold User ID YY Entry Number
					WF 	 	01 	 22	 0001
				12 characters
			*/
			$order_num = 'WF' . $user . date("y") . $num;

			$update = $wpdb->update($table, array('order_num' => $order_num), array(
				'id' => $id
			));

			$count--;
		}
	}
}

//! Uncomment line below to create values in new column
// add_action('init', 'create_new_submitted_column_and_fill_it');
function create_new_submitted_column_and_fill_it()
{

	/*  
	!	First Open phpMyAdmin and paste this MySQL code:
	*	ALTER TABLE wp_elevator_form_entries ADD COLUMN submitted BOOLEAN
		Then Refresh the page
	*/
	global $wpdb;

	$table = $wpdb->prefix . "elevator_form_entries";

	$sql = 'SELECT * FROM ' . $table;
	$rows = $wpdb->get_results($sql);

	for ($i = 0; $i < count($rows); $i++) {
		$row = $rows[$i];
		$id = $row->id;
		$status = $row->status;
		$submit = $status === "1" || $status === "2" ? true : false;

		$update = $wpdb->update($table, array('submitted' => $submit), array(
			'id' => $id
		));
	}
}

?>