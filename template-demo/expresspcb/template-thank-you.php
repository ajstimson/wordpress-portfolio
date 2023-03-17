<?php
/**
 * Template Name: Thank You
 *
 * Description: This template is a full-width version of the page.php template file. It removes the sidebar area.
 *
 */

//* Add order form class to the head
add_filter( 'body_class', 'thank_you_add_body_class' );
function thank_you_add_body_class( $classes ) {
	$classes[] = 'thank-you-page';
	return $classes;
}

// Force full width content layout
add_filter( 'genesis_site_layout', '__genesis_return_full_width_content' );

// Remove default Genesis loop
remove_action( 'genesis_loop', 'genesis_do_loop' );
add_action( 'genesis_loop', 'conditional_content_loop' );

function conditional_content_loop (){
	echo '<div id="order-details" class="woocommerce">';
	
	$session_id = $_GET['session'];
	$api_order_num = '';

	if(isset($_GET['order'])){

		$order_id = $_GET['order'];
		$order = wc_get_order( $order_id );
		$items = $order->get_items();
		$metas = $order->get_meta_data();
		
		// lets assume this order is not exported
		$exported = 0;

		// loop through meta data to check if this order has been exported
		foreach( $metas as $meta ){
			// get _exported_to_rest value (which will most likely be "0")
			if ($meta->key == '_exported_to_rest'){
				$exported = $meta->value;
			}
			// get api_order_num which will only have a value if this order has been exported before
			if ($meta->key == 'api_order_num'){
				$api_order_num = $meta->value;
			}
			if ($meta->key == 'api_due_date'){
				$api_due_date = $meta->value;
			}
			if($meta->key == 'api_file_name'){
				$api_file_name = $meta->value;
			}
		}

		//display the order summary
		$display_summary = true;

		// if the order has not been exported...
		if ( $exported == 0 ){
			// put this order in the queue
			update_post_meta( $order_id, '_exported_to_rest', 1 );
			
			// // export the order to API
			$api_response = wp_export_order_to_rest($order_id);

			// // get API response
			$api = json_decode($api_response, true);
			
			// echo '<pre>';
			// print_r($api);
			// echo '</pre>';

			// echo $api['hasErrors'];

			// if no errors in response...
			if ($api['hasErrors'] == false){
				// for body content, order number derives from API response
				$api_order_num = $api['orderNumber'];
				// same with due date value
				$api_due_date = $api['DueDate'];
				// and with file name
				$api_file_name = $api['PCBFileName'];

				// update _exported_to_rest with "2" which means success
				update_post_meta( $order_id, '_exported_to_rest', 2 );

				// update order meta_data with new api order number
				update_post_meta( $order_id, 'api_order_num', $api_order_num );

				// update order meta_data with new api due date
				update_post_meta( $order_id, 'api_due_date', $api_due_date );

				// update order meta_data with new api due date
				update_post_meta( $order_id, 'api_file_name', $api_file_name );

				$pageWasRefreshed = isset($_SERVER['HTTP_CACHE_CONTROL']) && $_SERVER['HTTP_CACHE_CONTROL'] === 'max-age=0';

				if($pageWasRefreshed) {
				   //do nothing because page was refreshed;
				} else {
					// if this is the first time this page was loaded, trigger the order confirmation email
					WC()->mailer()->emails['WC_Email_Customer_Processing_Order']->trigger($order_id);
					
					//also trigger the new order email
					WC()->mailer()->emails['WC_Email_New_Order']->trigger($order_id);
					
				}

				// don't display the order summary
				$display_summary = true;
			
			} elseif  ($api['hasErrors'] == 1) {
				// if there are errors, reset _exported_to_rest value to "0" which means this order was not exported
				// this way the order will be re-exported upon page refresh
				update_post_meta( $order_id, '_exported_to_rest', 0 );

				// display error message
				echo error_handling($api);

				// don't display the order summary
				$display_summary = false;

				// exit;
			} else {
				// if there is an unspecified error (such as a connection reset)
				// reset _exported_to_rest value to "0" which means this order was not exported
				// this way the order will be re-exported upon page refresh
				update_post_meta( $order_id, '_exported_to_rest', 0 );
				
				// display error message
				echo error_handling($api);

				// don't display the order summary
				$display_summary = false;

				// exit;
			}
		} elseif ($exported == 1) {
			// if somehow the order never got out of the queue
			// reset _exported_to_rest value to "0" which means this order was not exported
			// this way the order will be re-exported upon page refresh
			update_post_meta( $order_id, '_exported_to_rest', 0 );
			
			// display generic error message
			echo error_handling();

			// don't display the order summary
			$display_summary = false;
		}

		// only display order summary when no errors have occurred
		if($display_summary == true):
?>		
	
	<ul class="woocommerce-order-overview woocommerce-thankyou-order-details order_details">
		<?php echo get_order_overview($order_id, $session_id, $api_order_num); ?>
	</ul>

    <section class="woocommerce-order-details">
    	<h2 class="woocommerce-order-details__title">Order details</h2>
    		<table class="woocommerce-table woocommerce-table--order-details shop_table order_details">
	    		<thead>
				<tr>
					<th class="woocommerce-table__product-name product-name">Board Details</th>
					<th class="woocommerce-table__product-table product-total"></th>
				</tr>
				</thead>
	    		<tbody>
					<tr >
						<td colspan="2">
							<ul class="wc-item-meta">
								<?php get_board_details($order_id, $session_id, $api_due_date, $api_file_name);?>
							</ul>
						</td>
					</tr>
				</tbody>
	    		<tfoot>
					<?php get_subtotal_meta_data($order_id); ?>
				</tfoot>
			</table>
    </section>
    

    <section class="woocommerce-customer-details">
    	<section class="woocommerce-columns woocommerce-columns--2 woocommerce-columns--addresses col2-set addresses">
    		<div class="woocommerce-column woocommerce-column--1 woocommerce-column--billing-address col-1"> 
    			<?php echo get_billing_details($order_id); ?>	
    		</div>
			<div class="woocommerce-column woocommerce-column--2 woocommerce-column--shipping-address col-2">
				<?php echo get_shipping_details($order_id); ?>
			</div>
    	</section>
    </section>
		
<?php
	endif;

	// closing bracket for if(isset($_GET['order'])){
	} else {
		echo '<div id="thank-you-error">Could not find your order</div>';
	}

	echo '</div>';
}

function error_handling($api = ''){
	$html =  '<div class="woocommerce-error"><h3>An Error Occurred!</h3>';
	
	if ( !empty($api) ) {
		$html .=  '<p>Error Type: ' . $api['errorType'] . '</p>';
		$html .=  '<p>Error Message: ' . $api['errors'] . '</p>';
	}
	
	$html .=  '<p>There was a problem submitting your order. Please refresh this page.</p>';
	if ( !empty($api) ) {
		$html .=  '<p>If refreshing the page does not work, please contact ExpressPCB support at <a href="mailto:support@expresspcb.com?subject=[ExpressPCB]%20Error:%20' . preg_replace('/\s+/', '%20', $api['errorType'])  . '%20' . preg_replace('/\s+/', '%20', $api['errors']) . '">support@expresspcb.com</a></p>';
	} else {
		$html .=  '<p>If refreshing the page does not work, please contact ExpressPCB support at <a href="mailto:support@expresspcb.com?subject=[ExpressPCB]%20Error:%20Submitting%20Order">support@expresspcb.com</a></p>';
	}
	$html .=  '</div>';

	return $html;
}

function get_order_overview($order_id, $session_id, $api_order_num){
	
	$order = wc_get_order( $order_id );

	$order_data = $order->get_data();

	$order_number = $api_order_num;

	$order_date_created = $order_data['date_created']->date('m-d-Y');

	$order_billing_email = is_null_or_empty($order_data['billing']['email']);

	$order_total = $order_data['total'];

	$order_payment_method_title = $order_data['payment_method_title'];

	$html = '<li class="woocommerce-order-overview__order order">Order number: <strong>' . $order_number . '</strong></li>';
	$html .= '<li class="woocommerce-order-overview__date date">Date: <strong>' . $order_date_created . '</strong></li>';
	$html .= '<li class="woocommerce-order-overview__email email">Email: <strong>' . $order_billing_email . '</strong></li>';
	$html .= '<li class="woocommerce-order-overview__total total">Total: <strong><span class="woocommerce-Price-amount amount">';
	$html .= '<span class="woocommerce-Price-currencySymbol">$</span>' . $order_total . '</span></strong></li>';
	$html .= '<li class="woocommerce-order-overview__payment-method method">Payment method: <strong>' . $order_payment_method_title . '</strong></li>';

	echo $html;
}

function is_classic($session_id){
	$is_classic = false;

	$term = 'OrderNumber';
	$order_number = is_null_or_empty(look_for_xml_values($session_id, $term));

	if(strlen($order_number) != null) {
		$is_classic = true;
	}

	return $is_classic;
}

function get_board_details ($order_id, $session_id, $api_due_date, $api_file_name){

	$is_classic = is_classic($session_id);
	
	$term = 'IsStandardOutline';
	$standard = look_for_xml_values($session_id, $term);

	$term = 'BoardPropCopperLayers';
	$layers = look_for_xml_values($session_id, $term);

	$term = 'MaxDim';
	$max_dim = look_for_xml_values($session_id, $term);

	$term = 'MinDim';
	$min_dim = look_for_xml_values($session_id, $term);

	$mask_silk_data =  get_mask_silk_data($order_id);
	
	$term = 'TotalNumberHoles';
	$holes = look_for_xml_values($session_id, $term);
	
	$due_date = date("m-d-Y", strtotime($api_due_date));

	echo '<li><strong class="wc-item-meta-label">File Name:</strong> <span>' . $api_file_name . '</span></li>';

	if($is_classic != true) {
		$term = 'PartNumber';
		$part_number = is_null_or_empty(look_for_xml_values($session_id, $term));
		echo '<li><strong class="wc-item-meta-label">Part Number:</strong> <span class="result">' . $part_number . '</span></li>';
	}

	echo '<li><strong class="wc-item-meta-label">Standard Outline:</strong> <span>' . $standard . '</span></li>';
	echo '<li><strong class="wc-item-meta-label">Layer Count:</strong> <span>' . $layers . '</span></li>';
	echo '<li><strong class="wc-item-meta-label">Board Width:</strong> <span>' . $max_dim  . '</span></li>';
	echo '<li><strong class="wc-item-meta-label">Board Height:</strong> <span>' . $min_dim . '</span></li>';
	echo $mask_silk_data;
	echo '<li><strong class="wc-item-meta-label">Number of Holes:</strong> <span>' . $holes . '</span></li>';
	echo '<li><strong class="wc-item-meta-label">Expected Ship Date:</strong> <span>' . $due_date . '</span></li>';

}

function get_mask_silk_data($order_id){
	$order = wc_get_order( $order_id );

	$top_silk = '';
	$bottom_silk = '';
	$top_solder = '';
	$bottom_solder = '';
	foreach( $order->get_items() as $item ){
	   	$data = $item->get_meta_data();
	   	$top_silk = ucfirst($item["Top Silk Screen"]);
	   	$bottom_silk = ucfirst($item["Bottom Silk Screen"]);
	   	$top_solder =  ucfirst($item["Top Solder Mask"]);
	   	$bottom_solder = ucfirst($item["Bottom Solder Mask"]);
	}

	$string = '<li><strong class="wc-item-meta-label">Top Solder Mask:</strong>';
	$string .= '<span>' . $top_solder . '</span>';
	$string .= '<li><strong class="wc-item-meta-label">Bottom Solder Mask:</strong>';
	$string .= '<span>' . $bottom_solder . '</span>';
	$string .= '<li><strong class="wc-item-meta-label">Top Silk Screen:</strong>';
	$string .= '<span>' . $top_silk . '</span>';
	$string .= '<li><strong class="wc-item-meta-label">Bottom Silk Screen:</strong>';
	$string .= '<span>' . $bottom_silk . '</span>';
	   	
	return $string;
}

function get_subtotal_meta_data($order_id){
	$shipping_method = get_post_meta( $order_id, '_shipping_options', TRUE );
	$shipping_cost = get_shipping_cost($order_id);
	$discount_amount = strtolower(get_post_meta( $order_id, 'discount_amount', TRUE ));
	$electric_test = strtolower(get_post_meta( $order_id, 'electric_test', TRUE ));
	$order_total = get_post_meta( $order_id, '_order_total', TRUE );
	$sub_total = $order_total - $shipping_cost;

	if ($discount_amount != 'false'){
		$sub_total = $sub_total + $discount_amount;
	}

	if ($electric_test != 'false'){
		$electric_test = 100;
		$sub_total = $sub_total - $electric_test;
	}

	echo '<tr><th scope="row">Subtotal</th><td><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>' . twoDecimals($sub_total) . '</span></td></tr>';
	echo '<tr><th scope="row">Shipping Method</th><td><span class="woocommerce-Price-amount amount">' . $shipping_method . '</span></td></tr>';			
	echo '<tr><th scope="row">Shipping Cost</th><td><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>' . twoDecimals($shipping_cost) . '</span></td></tr>';

	if ($discount_amount != 'false'){
		echo '<tr><th scope="row">Coupon Discount</th><td><span class="woocommerce-Price-amount amount">- <span class="woocommerce-Price-currencySymbol">$</span>' . twoDecimals($discount_amount) . '</span></td></tr>';
	}

	if ($electric_test == 100){
		echo '<tr><th scope="row">Electrical Test</th><td><span class="woocommerce-Price-amount amount">+ <span class="woocommerce-Price-currencySymbol">$</span>' . twoDecimals($electric_test) . '</span></td></tr>';
	}

	echo '<tr><th scope="row">Total</th><td><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>' . twoDecimals($order_total) . '</span></td></tr>';
}

function get_shipping_cost($order_id){
	$order = wc_get_order( $order_id );
	
	// Iterating through order fee items ONLY
	foreach( $order->get_items('fee') as $item_id => $item_fee ){

	    // The fee total amount
	    $fee_total = $item_fee->get_total();

	   return $fee_total;

	}
	
}

function twoDecimals($number){
	return number_format((float)$number, 2, '.', '');
}

function get_billing_details($order_id){
	$order = wc_get_order( $order_id );
	$order_data = $order->get_data();

	$order_billing_first_name = is_null_or_empty($order_data['billing']['first_name']);
	$order_billing_last_name = is_null_or_empty($order_data['billing']['last_name']);
	$order_billing_company = is_null_or_empty($order_data['billing']['company']);
	$order_billing_address_1 = is_null_or_empty($order_data['billing']['address_1']);
	$order_billing_address_2 = is_null_or_empty($order_data['billing']['address_2']);
	$order_billing_city = is_null_or_empty($order_data['billing']['city']);
	$order_billing_state = is_null_or_empty($order_data['billing']['state']);
	$order_billing_postcode = is_null_or_empty($order_data['billing']['postcode']);
	$order_billing_country = is_null_or_empty($order_data['billing']['country']);
	$order_billing_email = is_null_or_empty($order_data['billing']['email']);
	$order_billing_phone = is_null_or_empty($order_data['billing']['phone']);

	echo '<h2 class="woocommerce-column__title">Billing address</h2><address>' . $order_billing_first_name . ' ' . $order_billing_last_name . '<br>' . $order_billing_company . '<br>' . $order_billing_address_1 . '<br>' . $order_billing_address_2 . '<br>' . $order_billing_city . ', ' . $order_billing_state . ' ' . $order_billing_postcode . '<br>' . $order_billing_country .'<br>' . $order_billing_email . '<br>' . $order_billing_phone . '</address>';
}

function get_shipping_details($order_id){
	$order = wc_get_order( $order_id );
	$order_data = $order->get_data();

	$order_shipping_first_name = is_null_or_empty($order_data['shipping']['first_name']);
	$order_shipping_last_name = is_null_or_empty($order_data['shipping']['last_name']);
	$order_shipping_company = is_null_or_empty($order_data['shipping']['company']);
	$order_shipping_address_1 = is_null_or_empty($order_data['shipping']['address_1']);
	$order_shipping_address_2 = is_null_or_empty($order_data['shipping']['address_2']);
	$order_shipping_city = is_null_or_empty($order_data['shipping']['city']);
	$order_shipping_state = is_null_or_empty($order_data['shipping']['state']);
	$order_shipping_postcode = is_null_or_empty($order_data['shipping']['postcode']);
	$order_shipping_country = is_null_or_empty($order_data['shipping']['country']);

	echo '<h2 class="woocommerce-column__title">Shipping address</h2><address>' . $order_shipping_first_name . ' ' . $order_shipping_last_name . '<br>' . $order_shipping_company . '<br>' . $order_shipping_address_1 . '<br>' . $order_shipping_address_2 . '<br>' . $order_shipping_city . ', ' . $order_shipping_state . ' ' . $order_shipping_postcode . '<br>' . $order_shipping_country . '</address>';
}

genesis();

function order_form_scripts() {
	include ('thank-you-functions.php');
}
  
?>
