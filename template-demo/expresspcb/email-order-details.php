<?php
/**
 * Order details table shown in emails.
 *
 * This template is a customization of /woocommerce/emails/email-order-details.php
 * and should be moved to the theme directory
 * 
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails
 * @version 3.3.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$text_align = is_rtl() ? 'right' : 'left';

$order_id = $order->get_order_number();
$items = $order->get_items();
$metas = $order->get_meta_data();

// loop through meta data to check if this order has been exported
foreach( $metas as $meta ){
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

$current_item="";
    foreach($items as $item){
        $current_item = $item;
        break;
	}

if($current_item!=""){
	$_date = $order->get_date_created()->format ('m-d-Y H:i');
	$_file = $api_file_name;
	// $parse = json_decode($_file, TRUE);
	
	$order = wc_get_order( $order_id );
	$order_data = $order->get_data();
	
	$xml = $current_item->get_meta('xml_data');
	$parse = json_decode($xml, TRUE);

	// body array (item details)
	$_body 							= array();
	$_body['uploaded_file'] 		= $api_file_name;
	$_body['standard_outline'] 		= $current_item->get_meta('Is Standard Outline');
    $_body['layer_count'] 			= $parse['BoardPropCopperLayers'];
    $_body['width'] 				= $current_item->get_meta('Width');
    $_body['height'] 				= $current_item->get_meta('Height');
    $_body['top_silk_screen'] 		= ucfirst($current_item->get_meta('Top Silk Screen'));
	$_body['bottom_silk_screen']	= ucfirst($current_item->get_meta('Bottom Silk Screen'));
	$_body['top_solder_mask'] 		= ucfirst($current_item->get_meta('Top Solder Mask'));
	$_body['bottom_solder_mask'] 	= ucfirst($current_item->get_meta('Bottom Solder Mask'));
	$_body['number_of_holes']		= $current_item->get_meta('Number of Holes');
	$_body['service_selected'] 		= $current_item->get_meta('Options');
	$_body['plating'] 				= $current_item->get_meta('Plating');
	$_body['quantity'] 				= $current_item->get_meta('Quantity');
	$_body['build_time'] 			= $current_item->get_meta('Build Time');
	$_body['ship_date']				= date("m-d-Y", strtotime($api_due_date));
	
	if ($_body['build_time'] > 1){
		$_body['build_time'] = $_body['build_time'] . ' Days';
	} else {
		$_body['build_time'] = $_body['build_time'] . ' Day';
	}

	// footer array (totals and methods)
	$_foot = array();
	$total = $order->get_total();
	$serve = $current_item->get_meta('server_response');
	$serve = json_decode($serve, TRUE);
	$disco = $serve['usedPromo'];
	
	$shipm = get_post_meta( $order_id, '_shipping_options', TRUE );
	$paymn = get_post_meta( $order_id, '_payment_method_title', TRUE );
	$shipc = intval($serve['shippingCost']);
	$_foot['subtotal'] = intval($total) - $shipc;
	$_foot['shipping_method'] = $shipm;
	$_foot['shipping_total'] = '$' . number_format((float)$serve['shippingCost'], 2, '.', '');
	
	$etest = $current_item->get_meta('Electrical Test');
	if ($etest != false){
		$subtotal = str_replace('$', '', $_foot['subtotal']);
		$subtotal = $subtotal - 100;
		$_foot['subtotal'] = '$' . number_format($subtotal, 2, '.', '');
		$_foot['electric_test'] = '$' . number_format(100, 2, '.', '');
	}

	if ($disco != false){
		$_foot['discount'] = $serve['promoDiscount'];
	}

	$_foot['payment_method'] = $paymn;
	$_foot['total'] = $total;
	// $_foot['total'] = '$' . number_format((float)$serve['TotalCost'], 2, '.', '');
}

do_action( 'woocommerce_email_before_order_table', $order, $sent_to_admin, $plain_text, $email );

?>
<h2>
	<?php
	if ( $sent_to_admin ) {
		$before = '<a class="link" href="' . esc_url( $order->get_edit_order_url() ) . '">';
		$after  = '</a>';
	} else {
		$before = '';
		$after  = '';
	}

	echo 'Order #' . $before . $api_order_num . $after;
	?>
</h2>

<p>Created on <?php echo $_date; ?></p>

<div style="margin-bottom: 40px;">
	<table class="td" cellspacing="0" cellpadding="6" style="border-collapse: collapse;width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" border="1">
		<thead>
			<tr>
				<th class="td" scope="col" colspan="2" style="text-align:<?php echo esc_attr( $text_align ); ?>;">
					Board Details
				</th>
			</tr>
		</thead>
		<tbody>
			<?php
				if ( $_body ) {
					$i = 1;
					$html = '';
					foreach ( $_body as $key => $value ) {

						$i++;

						$title = ucwords(str_replace('_', ' ', $key));
						$html .= '<tr';
						if($i%2){
							$html .= ' style="background-color: #ebf9e4"';
						}
						$html .=  '><td style="text-align: left; vertical-align: middle; border: 1px solid #eee; word-wrap: break-word; color: #2a3139; padding: 12px;">';
						$html .= '<strong class="wc-item-meta-label">';
						$html .= $title . ': </strong></td> ';
						$html .= '<td style="text-align: left; vertical-align: middle; border: 1px solid #eee; word-wrap: break-word; color: #2a3139; padding: 12px;">' . $value . '</td></tr>';

					}
					echo $html;
				}
			?>
		</tbody>
		<tfoot>
			<?php
			
			if ( $_foot ) {
				$i = 0;
				$html = '<tr>';
				foreach ( $_foot as $key => $value ) {
					$i++;

					$title = ucwords(str_replace('_', ' ', $key));
					
					$html .= '<tr>';
					$html .= '<th class="td" scope="row" style="text-align:left;';
					if ($i == 1){
						$html .= 'border-top-width: 4px;';
					}
					$html .= '">' . $title . '</th>';
					$html .= '<td class="td" style="text-align:right;';
					if ($i == 1){
						$html .= 'border-top-width: 4px;';
					}
					$html .= '">' . $value . '</td>';
					$html .= '</tr>';
				}
				$html .= '</tr>';
				echo $html;
			}
			if ( $order->get_customer_note() ) {
				?>
				<tr>
					<th class="td" scope="row" colspan="2" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php esc_html_e( 'Note:', 'woocommerce' ); ?></th>
					<td class="td" style="text-align:<?php echo esc_attr( $text_align ); ?>;"><?php echo wp_kses_post( wptexturize( $order->get_customer_note() ) ); ?></td>
				</tr>
				<?php
			}
			?>
		</tfoot>
	</table>
</div>

<?php do_action( 'woocommerce_email_after_order_table', $order, $sent_to_admin, $plain_text, $email ); 

?>
