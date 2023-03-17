<?php
/**
 * ExpressPCB - Custom functions
 */

//DO NOT REMOVE THIS - several things will fail if you do...
//make sure to start session before HTML doctype tag
add_action('init', 'start_session', 1);
function start_session() {
    if(!session_id()) {
        session_start();
    }
}

// unset session values from previous session
if (ini_get('register_globals'))
{
    foreach ($_SESSION as $key=>$value)
    {
        if (isset($GLOBALS[$key]))
            unset($GLOBALS[$key]);
    }
}

if (!function_exists('write_log')) {

    function write_log($log) {
        if (true === WP_DEBUG) {
            if (is_array($log) || is_object($log)) {
                error_log(print_r($log, true));
            } else {
                error_log($log);
            }
        }
    }

}

add_action('genesis_before', 'gtm_header_script');
function gtm_header_script(){
	
	$is_splash = check_for_splash();
	if ( $is_splash == false ) {
		$script = '<!-- Splash == FALSE -->';
		$script .= '<!-- Google Tag Manager -->';
		$script .= "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
		$script .= "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
		$script .= "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
		$script .= "'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
    	$script .= "})(window,document,'script','dataLayer','GTM-N27F8T');</script>";
    	$script .= '<!-- End Google Tag Manager -->'; 	

    	echo $script;
	}
}

add_action('genesis_after_footer', 'gtm_no_script');
function gtm_no_script(){

	$is_splash = check_for_splash();
	if ( $is_splash == false ) {
		echo '<!-- Splash == FALSE -->';
		echo '<!-- Google Tag Manager (noscript) -->';
		echo '<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-N27F8T" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';
		echo '<!-- End Google Tag Manager (noscript) -->';
	}
}

function check_for_splash(){
	global $post;

	$template = get_page_template_slug($post->ID);
	// echo $template;
	if ( 'template-splash.php' === $template ) {
		return true;
	} else {
		return false;
	}
	}

//checks if we are on the order form page
function check_for_order_form() {
	if( is_page( 'order-form' )  ) {
		return true;
	} else {
		return false;
	}
}

function check_for_order_form_product(){
	// this is the PCB Order form product id
	return 12464;
}

//random character generator
function random_number($length)
{
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    $max = strlen($codeAlphabet);

    for ($i = 0; $i < $length; $i++) {
        $token .= $codeAlphabet[random_int(0, $max - 1)];
    }

    return $token;
}

//generates unique hash composed of random characters and timestamp
function upload_id()
{
    $length = 22;
    $rand = random_number($length);
    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    return $rand . $timestamp;
}

function filename_radnomizer()
{
    $length = 6;
    $rand = random_number($length);
    $timestamp = time();
    $date = new DateTime();
    $date->setTimestamp($timestamp);
    $datetimeFormat = 'dmy';
	$date_file = $date->format($datetimeFormat); 
    return $date_file . '-' . $rand;
}

// Display User IP in WordPress
function get_the_user_ip() {
	if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
	//check ip from share internet
	$ip = $_SERVER['HTTP_CLIENT_IP'];
	} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
	//to check ip is pass from proxy
	$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
	$ip = $_SERVER['REMOTE_ADDR'];
	}
	return apply_filters( 'wpb_get_ip', $ip );
}

add_action( 'wp_ajax_order_form_ajax', 'order_form_ajax' );
add_action( 'wp_ajax_nopriv_order_form_ajax', 'order_form_ajax' );

function order_form_ajax(){
	//create unique upload ID
	$upload_id = upload_id();

	if (!function_exists('wp_handle_upload')) {
	   require_once(ABSPATH . 'wp-admin/includes/file.php');
	}
    
	$uploaded_file = $_FILES['file'];
	$uploaded_file_name = $uploaded_file['name'];
	$upload_overrides = array('test_form' => false);
	$movefile = wp_handle_upload($uploaded_file, $upload_overrides);

    // echo $movefile['url'];
    if ($movefile && !isset($movefile['error'])) {
      	
      	$zip_location = $movefile['file'];
      	$message = '';

      	global $wp;
      	$current = home_url();
      	$redirect = $current . '/order-form/?session=' . $upload_id;

      	WP_Filesystem();
		
		$timestamp = time();
		$datetimeFormat = 'ymd';
		$date = new DateTime();
		$date->setTimestamp($timestamp);
		$directory_date = $date->format($datetimeFormat);
		
		$destination = wp_upload_dir();
		$destination_path = $destination['basedir'];
		$destination_path = $destination_path . '/orders/' . $directory_date . '/' . $upload_id . '/';

		if (! is_dir($destination_path)) {
	       wp_mkdir_p( $destination_path );
	    }
      	

		$zip_preview = new ZipArchive();
		$res = $zip_preview->open($zip_location); 
		
		if ($res === TRUE) {

			$valid_files = array("rrb", "RRB", "pcb", "PCB", "xml", "XML");
			$is_valid = '';
			for( $i = 0; $i < $zip_preview->numFiles; $i++ ){ 
			    
			    $stat = $zip_preview->statIndex( $i ); 
			    $zip_result = $stat['name'];
			    $exploded = explode('.', $zip_result);
			    $extension = end($exploded);
			    
			    if(!in_array($extension, $valid_files)){
			    	
			    	$error_array = array(
			    		"code" => "001",
			    		"message" => "Zip contains invalid file format.",
			    		"info" => "Upload a different file."
			    	);
			    	
			    	upload_error_reporting($error_array);
			    	
			    } elseif (++$i == 2){

			   		$error_array = array(
			    		"code" => "002",
			    		"message" => "Zip contains too many files.",
			    		"info" => "Upload a different file."
			    	);
			    	
			    	upload_error_reporting($error_array);

			    } else {
			    	
			    	$zip_preview->close();
			    	
			    	$unzipfile = unzip_file( $zip_location, $destination_path);
			    	
			    	//delete the original zip file
      				wp_delete_file($zip_location);

      				if ( is_wp_error( $unzipfile ) ) {

			      		$error_array = array(
				    		"code" => "005",
				    		"message" => "There was an error unzipping the file.",
				    		"info" => "Details: " . $movefile
						);
								    	
						upload_error_reporting($error_array);

		      		} else {
		      			$scan_files = scandir($destination_path, 1);
      					$file_1 = pathinfo($destination_path . $scan_files[0]);
      					$file_2 = pathinfo($destination_path . $scan_files[1]);
      					
      					//needed for Classic Orders
      					$xml_file_step_1 = glob($destination_path . "*.xml", GLOB_BRACE);
      					$xml_file_step_2 = pathinfo($xml_file_step_1[0]);
      					$xml_file_name = $xml_file_step_2['filename'];

			      		if ($file_1) {
			      			$extension = $file_1['extension'];
			      			rename($file_1['dirname'] . '/' . $file_1['basename'], $file_1['dirname'] . '/' . filename_radnomizer($file_1['filename']) . '.' . $extension);
			      		}
      		
			      		if ($file_2) {
			      			$extension = $file_2['extension'];
			      			rename($file_2['dirname'] . '/' . $file_2['basename'], $file_1['dirname'] . '/' . filename_radnomizer($file_2['filename']) . '.' . $extension);
			      		}
      		
			      		$xml_file = glob($destination_path . "*.[xX][mM][lL]", GLOB_BRACE);
			      		$xml_file = $xml_file[0];
			      		$rrb_file = glob($destination_path . "*.[rR][rR][bB]", GLOB_BRACE);
			      		$pcb_file = glob($destination_path . "*.[pP][cC][bB]", GLOB_BRACE);
			      		$url_prefix = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . '://' . $_SERVER['SERVER_NAME'];
			      		$rrb_file_location = ' ';
			      		if ($rrb_file) {
			      			$rrb_file_location = str_replace($_SERVER['DOCUMENT_ROOT'], '', $rrb_file[0]);
			      			$rrb_file_location = $url_prefix . $rrb_file_location;
			      		}

			      		$pcb_file_location = ' ';
			      		if ($pcb_file) {
			      			$pcb_file_location = str_replace($_SERVER['DOCUMENT_ROOT'], '', $pcb_file[0]);
			      			$pcb_file_location = $url_prefix . $pcb_file_location;
			      		}
			      		
						if (file_exists($xml_file)) {
						    
							$xml = file_get_contents($xml_file) or die("Could not get file contents");
							
						    database_insert($xml, $xml_file_name, $xml_file, $pcb_file_location, $rrb_file_location, $upload_id);
						
						} else {
							
							error_log("Something is wrong with the XML File: " . print_r($xml_file, true) . "\r\n - TIME: " . time() . "", 1, "andrew@applejuice.codes");
						    
							$error_array = array(
					    		"code" => "003",
					    		"message" => "Invalid or missing XML file.",
					    		"info" => "Upload a different file."
					    	);
					    	
					    	upload_error_reporting($error_array);
						}

			         	wp_send_json_success($redirect);
      				}
			    }
			}
		} else {
			$zip_preview->close();

			$error_array = array(
	    		"code" => "001",
	    		"message" => "Zip contains invalid file format.",
	    		"info" => "Upload a different file."
			);
					    	
			upload_error_reporting($error_array);
		}
    } else {
        $error_array = array(
    		"code" => "006",
    		"message" => "Server error: " . $movefile['error'],
    		"info" => " File uploaded: " . $uploaded_file_name
		);
				    	
		upload_error_reporting($error_array);
    }

    wp_die();
}

function upload_error_reporting($error_array){

    write_log("ORDER FORM UPLOAD ERROR: ARRAY " . print_r($error_array, true));

	$error = new WP_Error($error_array["code"], $error_array["message"], $error_array["info"]);
	$status_code = 400;
	wp_send_json_error( $error, $status_code );
	wp_die();

}

function database_insert($xml, $xml_file_name, $xml_file, $pcb_file_location, $rrb_file_location, $upload_id) {
	
	//connect with the WP database
	global $wpdb;

	// creates order_form_entries table in database if not exists
	$table = $wpdb->prefix . "order_form_entries";
	$charset_collate = $wpdb->get_charset_collate();
	$sql = "CREATE TABLE IF NOT EXISTS $table (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		created text NOT NULL,
		upload_id text NOT NULL,
		ip_address text NOT NULL,
		xml_file_name text NOT NULL,
		xml_data text NOT NULL,
		xml_file_location text NOT NULL,
		rrb_file_location text NOT NULL,
		pcb_file_location text NOT NULL,
		UNIQUE (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );

	ob_start();

	$ip = get_the_user_ip();

	$wpdb->show_errors();
	$wpdb->insert( 
	   $table, 
	   array( 
			'created' => current_time('mysql', 1),
			'upload_id' => $upload_id,
			'ip_address' => $ip,
			'xml_file_name' => esc_sql($xml_file_name),
			'xml_data' => htmlentities($xml, ENT_QUOTES | ENT_XML1, 'UTF-8'),
			'xml_file_location' => $xml_file,
			'rrb_file_location'=> $rrb_file_location,
			'pcb_file_location' => $pcb_file_location
	   )
	);

	//error handling
	if($wpdb->last_error !== '') :

		$wpdb->print_error();

	endif;

}

add_action( 'wp_ajax_price_quote_ajax', 'price_quote_ajax' );
add_action( 'wp_ajax_nopriv_price_quote_ajax', 'price_quote_ajax' );

function price_quote_ajax(){
	//get post data
	$json = $_POST['data'];
	//remove characters that cause errors
	$json = str_replace('\\','', (string) $json);
    
	// get referring page for conditional $_SESSION array access
	$remove_object = json_decode($json, true); // convert it to an array.
	$referring_page = $remove_object["referring_page"];
	//we need this for adding the coupon to the order's coupon line metadata
	$promo_code = $remove_object["PromoCode"];

	$from_order_form = false;
	if (strpos($referring_page, 'order-form') !== false) {
    	$from_order_form = true;
	}

	unset($remove_object["referring_page"]);
	$json = json_encode($remove_object);
    
    
	$result = CallAPI("POST", "https://example.org", $json);

    //decode response JSON for processing in php
	$jsonObj = json_decode($result, true);

	//run the following tasks if we are not calling this function from the order form
	if ($from_order_form == false) {
		//create discount and shipping objects in the $_SESSION array
		$_SESSION['discount'] = $jsonObj['promoDiscount'];
		$_SESSION['$promo_code'] = $promo_code;
		$_SESSION['shipping'] = $jsonObj['shippingCost'];
		$_SESSION['server_response'] = $result;
	}

 	echo $result;

	die();
}

add_action('woocommerce_single_product_image_thumbnail_html', 'remove_order_form_product_image');
function remove_order_form_product_image() {
	$check = check_for_order_form();
	if ( $check == true ) {
    	remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20);
    	remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_gallery', 20 );
    	remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_thumbnails', 20 );
    }
}


add_filter ('woocommerce_add_to_cart_redirect', 'redirect_to_checkout');
function redirect_to_checkout() {
	$check = check_for_order_form();
	if ( $check == true ) {
		
		$session_id = $_GET['session'];
    	
    	global $woocommerce;
	    $checkout_url = $woocommerce->cart->get_checkout_url();
	    
	    if ( ! empty( $session_id ) ) {
	        $checkout_url = esc_url( add_query_arg('session', $session_id, $checkout_url ) );
	    }
	    
	    return $checkout_url;
	}
}

// Enable Gravity Forms field label visibility
add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );

// Empty Cart when navigating to the order form
add_action( 'wp', 'woocommerce_clear_cart_if_template' );
function woocommerce_clear_cart_if_template() {
  global $woocommerce;

    if ( is_page_template('template-order-form.php') && isset( $_GET['empty-cart'] ) ) { 
        $woocommerce->cart->empty_cart();

    error_log("function woocommerce_clear_cart_if_template \r\n THE CART WAS EMPTIED BECAUSE THE USER NAVIGATED TO THE ORDER FORM TEMPLATE " . "\r\n TIME: " . time() . " ", 1, "andrew@applejuice.codes");
    }
}

// set session data for xml data and file location - used on the checkout page for submitting quote requests
add_action( 'woocommerce_before_checkout_form', 'set_session_data', 10,  1);
function set_session_data(){
	global $woocommerce;
	$cart = $woocommerce->cart->get_cart();
    $form_data = array_column($cart, '_gravity_form_lead');
   	$parts = parse_url($form_data[0]['source_url']);
	parse_str($parts['query'], $query);
	$session_id = $query['session'];

	$_SESSION['session_id'] = $session_id;

	$rows = array();

	global $wpdb,$table_prefix;
	foreach( $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_example_table WHERE upload_id = %s", $session_id)) as $key => $row) {
		$rows[] = $row;
	}
	
	$xml_file_location = $rows[0]->xml_file_location;
	$xml_file_location = get_site_url() . '/' . strstr($xml_file_location, 'wp-content');
	$xml = simplexml_load_file($xml_file_location);
	$xml = json_decode(json_encode((array)$xml), TRUE);
	$xml = array_shift($xml);
	$xml_adjusted = array_map(function($value) {
   		return $value === [] ? NULL : $value;
	}, $xml); // array_map should walk through $array
	$xml = json_encode($xml_adjusted);
	$xml_data = str_replace('\\','', (string) $xml);
	
	$rrb = $rows[0]->rrb_file_location;
	$pcb = $rows[0]->pcb_file_location;

	$file_location = '';

	if (strlen($rrb) > 1){
		$file_location = $rrb;
	} else {
		$file_location = $pcb;
	}

	$_SESSION['xml_data'] = $xml_data;
	$_SESSION['file_location'] = $file_location;

}

add_action( 'woocommerce_before_checkout_form', 'custom_coupon_field', 10,  1);
function custom_coupon_field(){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
	?>

	    <div class="custom-coupon">

			<div class="woocommerce-info">
				Have a coupon? <a href="#" class="showcoupon">Click here to enter your code</a>	</div>
			</div>
		</div>
		<form class="checkout-coupon" style="" _lpchecked="1">
			<p>If you have a coupon code, please apply it below.</p>

			<p class="form-row form-row-first">
				<input type="text" name="coupon_code" class="input-text" placeholder="Coupon code" id="coupon_code" value="">
			</p>

			<p class="form-row form-row-second">
				<input type="email" name="email_coupon" class="input-text" placeholder="Email Address" id="email_coupon" value="">
			</p>

			<p class="form-row form-row-last">
				<button type="submit" class="button" name="apply_coupon" value="Apply coupon" disabled>Apply coupon</button>
			</p>

			<div class="clear"></div>
		</form>
	<?php
	}
}


add_action( 'woocommerce_after_checkout_form', 'checkout_page_scripts', 10,  1);
function checkout_page_scripts(){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){

    	global $woocommerce;
	    
	    $cart = $woocommerce->cart->get_cart();
	    $form_data = array_column($cart, '_gravity_form_lead');
	   	$parts = parse_url($form_data[0]['source_url']);
		parse_str($parts['query'], $query);
		$session_id = $query['session'];

		$electric_test_value = $form_data[0]['8.1'];
		if (empty($electric_test_value)){
		 	$electric_test_value = 'false';
		} else {
			$electric_test_value = 'true';
		}

		$include_gerbers = $form_data[0]['35.1'];
		if ($include_gerbers != 'Include Gerbers'){
		 	$include_gerbers = 'false';
		} else {
			$include_gerbers = 'true';
		}

		$part_number = $form_data[0]['30'];

		$term = 'OrderTypeFlag';
		$order_type = look_for_xml_values($session_id, $term);

		$term = 'MaxDim';
		$max_dim = look_for_xml_values($session_id, $term);

		$term = 'MinDim';
		$min_dim = look_for_xml_values($session_id, $term);

		$boardArea = $max_dim * $min_dim;
		
		$term = 'BoardPropCopperLayers';
		$layers = look_for_xml_values($session_id, $term);

		$term = 'OrderNumber';
		$order_number = is_null_or_empty(look_for_xml_values($session_id, $term));

		$is_classic = false;

		if(strlen($order_number) > 0) {
			$is_classic = true;
		}
		
		$term = 'PartNumber';
		if($is_classic == false) {
			$part_number = is_null_or_empty(look_for_xml_values($session_id, $term));
		}
		
		$term = 'IsStandardOutline';
		$standard = look_for_xml_values($session_id, $term);

		$solder_top = $form_data[0]['22'];
		$solder_bottom = $form_data[0]['24'];
		$silk_top = $form_data[0]['21'];
		$silk_bottom = $form_data[0]['23'];

		$term = 'TotalNumberHoles';
		$holes = look_for_xml_values($session_id, $term);

		// get shipping data
		$defualt_array = json_decode(GetShippingMethodDefaults(), true);
		$shipping_methods = array_shift($defualt_array['shipMethods']);
		$shipping_methods = json_encode($shipping_methods);

    	?>
        <style>
		.woocommerce-remove-coupon {
			display:none;
		}
		</style>
		<script type="text/javascript">
			jQuery( document ).ready(function( $ ) {
				console.log('<?php echo json_encode($form_data[0]);?>');
				/* 
				Hidden fields for Meta Data
					- we want this data in the meta_data column for easier access post-order
					1. electric test (true/false)
					2. include gerbers (true/false)
					3. part number
				*/ 
				
				// first fill in electric test field
				$('#electric_test').val('<?php echo $electric_test_value; ?>');

				// and fill in include gerbers field
				$('#include_gerbers').val('<?php echo $include_gerbers; ?>');

				//and fill in part number field
				$('#unique-part-number-field input').val('<?php echo $part_number; ?>');

				// rebuild the order review section after window loads
				$(window).on('load', function (e) {

			        setTimeout(function(){
			        	placeOrderEnable(false);
			        },1000);            
				    
					rebuildOrderReview();
				});
				
				//This needs to be here to prevent old $_SESSION values from loading on new orders
				goGetPrice();

				/* 
				SHIPPING FIELD BEHAVIOR
				- Do this first bc we will need the data-ship-id field for the next set of functions
					1. Define shipping methods
					2. Compare shipping JSON with shipping option values
					3. Set shipping option data attributes
				*/ 

		    	//now take care of shipping
		    	var methodJSON = <?php print_r("'" . $shipping_methods . "'")?>;
				var methods = JSON.parse(methodJSON);
					
				for (var i=methods.length-1; i>=0; i--) {
				    var methodID = methods[i].ShipID,
					    methodInter = methods[i].IsInternational,
					    methodDom = methods[i].IsDomestic,
					    methodShip = methods[i].ShipMethod,
					    methodCode = methods[i].UPSShipCode,
					    methodDiscount = methods[i].ShipDiscount;
				    $('#shipping_options option').each(function () {
						var optionVal = $(this).val();
						if (optionVal == methodShip){
							// yeah this is not pretty but it works
							// for some reason .attr({'x': var1, 'y': var2}); would not work
							$(this).attr(
								'data-ship-id', methodID
								).attr('data-international', methodInter
								).attr('data-domestic', methodInter
								).attr('data-ups-code', methodCode
								).attr('data-discount', methodDiscount);
						}
					});

				}

				/* 
				WATCHING OUT FOR URL PARAMETERS
					1. Check if coupon has been applied
					2. Auto-fill coupon email if billing email is already on form 
					3. Check if shipping method has been selected
					4. Auto-fill select shipping method
				*/
				
				var shippingFormEmail = $('#billing_email').val();
					if (shippingFormEmail){
						$('#email_coupon').val(shippingFormEmail);
				}

				//listens for coupon data as url parameter
		    	var urlParams = new URLSearchParams(window.location.search);
				var entries = urlParams.entries();
				var isCoupon = false;
				var cvalue = '';
				for(pair of entries) {
					if (pair[1] == 'applied'){
						isCoupon = true;
						$('.custom-coupon').text('Coupon Applied!');
						$('.checkout-coupon').hide();
					}
					if (pair[0] == 'cvalue'){
						cvalue = pair[1];
						$('#coupon_code').val(cvalue);
						$('#email_coupon').val(shippingFormEmail);
					}
					if (pair[0] == 'shipping-method'){
						shipID = pair[1].replace(/\+/g,' ');
						$('#shipping_options').val(shipID);
					}
				}

				/* 
				COUPON FIELD BEHAVIOR
					1. Handle toggle behavior
					2. Verify coupon and email field have valid data
				*/
			
				$("form.checkout-coupon").hide();
	            $('.custom-coupon a').click(function () {
	            	var whatClass = $(this).attr('class');
					if (whatClass == 'showcoupon') {
						$(this).removeClass();
						$(this).addClass('hidecoupon');
						$(".checkout-coupon").slideDown(400, function() {
	                		$(".checkout-coupon").find(":input:eq(0)").focus();
	            		});
					}
					if (whatClass == 'hidecoupon') {
						$(this).removeClass();
						$(this).addClass('showcoupon');
						$(".checkout-coupon").slideUp(400);
					}

					
	            });

				var couponField = $('#coupon_code'),
					couponValid = false,
		    		emailField = $('#email_coupon'),
		    		emailValid = false,
		    		emailValue = $(emailField).val();

		    	$('form.checkout-coupon .input-text').keyup(function () {
		    		var couponValue = $(couponField).val(),
		    			couponValid = fieldValidator(couponValue);
		    		
		    		var emailValue = $(emailField).val(),
		    			emailValid = fieldValidator(emailValue);
		    		
		    		if (couponValid == true && emailValid == true){
		    			$('form.checkout-coupon button').prop('disabled', false);
		    		}
		    	});
	    		

			/* 
			
				HANDLES COUPON & SHIPPING FIELD CALCULATIONS

			*/
		
			$('#ship-to-different-address-checkbox').click(function () {
				$(this).toggleClass('ship-to-selected');
				goGetPrice();
			});
	    	
	    	$('form.checkout-coupon button').click(function (event) {
	    		event.preventDefault();
	    		goGetPrice();
	    		$('.checkout-coupon').prepend('<div class="loading-animation"><div class="pre-loader"></div></div>');
	    	});

	    	// sets recalculate class for checout form inputs to watch
			$('#billing_country, #billing_address_1, #billing_address_1, #billing_city, #billing_state, #billing_postcode, #shipping_country, #shipping_address_1, #shipping_city, #shipping_state, #shipping_postcode, #shipping_options').addClass('recalculate');

			//if any recalculate fields change - recalculate quote
	    	$('.recalculate').change(function (event) {
	    		goGetPrice();
	    		$('#order_review').prepend('<div class="loading-animation"><div class="pre-loader"></div></div>');
	    	});

	    	function rebuildOrderReview(){
				/* 
				Remove order_review content and replace with xml values
					-?
					1. First store values that we want to include in our new order_review section
					2. Change table headings
					3.
				*/ 
				
				var plating = $('dd.variation-Plating p').text();
				var buildTime = $('dd.variation-BuildTime p').text();
				var quantity = $('dd.variation-Quantity p').text();

	    	}

			function goGetPrice(){

				var shipToArray = {};
				// if separate shipping address is selected, use the shipping fields to calculate price
				if ($('#ship-to-different-address-checkbox').hasClass('ship-to-selected')){

					shipToArray['address1'] = checkoutFieldCheck("#shipping_address_1");
					shipToArray['address2'] = checkoutFieldCheck("#shipping_address_2");
					shipToArray['zip'] = checkoutFieldCheck("#shipping_postcode");
					shipToArray['city'] = checkoutFieldCheck("#shipping_city");
					shipToArray['state'] = checkoutFieldCheck("select#shipping_state");
					shipToArray['country'] = checkoutFieldCheck("select#shipping_country");

				} else {
					// otherwise use the billing address for price calculations
					shipToArray['address1'] = checkoutFieldCheck("#billing_address_1");
					shipToArray['address2'] = checkoutFieldCheck("#billing_address_2");
					shipToArray['zip'] = checkoutFieldCheck("#billing_postcode");
					shipToArray['city'] = checkoutFieldCheck("#billing_city");
					shipToArray['state'] = checkoutFieldCheck("select#billing_state");
					shipToArray['country'] = checkoutFieldCheck("select#billing_country");

				}

				// gather other field inputs
	    		var couponField = $('#coupon_code'),
	    			coupon = checkoutFieldCheck(couponField),
	    			couponEmailField = $('#coupon_code'),
	    			couponEmail = checkoutFieldCheck(couponEmailField),
	    			billingEmailField = $('#billing_email'),
	    			billingEmail = checkoutFieldCheck(billingEmailField),
	    			orderCommentsField = $('#order_comments'),
	    			orderComments = checkoutFieldCheck(orderCommentsField),
	    			shippingMethodField = $('#shipping_options'),
	    			shippingMethod = checkoutFieldCheck(shippingMethodField);
	    			
	    		var email = couponEmail;
    			if (couponEmail == null || couponEmail.length < 2) {
    				email = billingEmail;
    			}

	    		var referring_page = window.location.href;	
	    		var quoteValues = {};
					quoteValues['referring_page'] = referring_page;
					quoteValues['service'] = $('.variation-Options p').text();
					quoteValues['leadTime'] = $('.variation-BuildTime p').text();
					quoteValues['layerCount'] = <?php echo $layers; ?>;
					quoteValues['quantity'] = $('.variation-Quantity p').text();
					quoteValues['boardArea'] = <?php echo $boardArea ?>;
					quoteValues['boardShortSide'] = <?php echo $min_dim; ?>;
					quoteValues['boardLongSide'] = <?php echo $max_dim; ?>;
					quoteValues['electricTest'] = $('.variation-ElectricalTest li').text();
					quoteValues['PromoCode'] =  $(couponField).val();
					quoteValues['EMailAddress']  = email;
					quoteValues['ShippingServiceDescription'] = shippingMethod;
					quoteValues['ShippingCity'] = shipToArray['city'];
					quoteValues['ShippingZip'] = shipToArray['zip'];
					quoteValues['ShippingState'] = shipToArray['state'];
					quoteValues['ShippingCountry'] = shipToArray['country'];
					quoteValues['ShippingAddressLine1'] = shipToArray['address1'];
					quoteValues['ShippingAddressLine2'] = shipToArray['address2'];

				var query = $(quoteValues).serializeArray();
					query = JSON.stringify(quoteValues);

					console.log('POST JSON: ' + query);

		            //submit to ajax call
			        $.ajax({
		                url: "/wp-admin/admin-ajax.php",
		                type: 'POST',
		                data: {
							action : 'price_quote_ajax',
							data: query
						},
		                success: function(response) {
		                    console.log(response);
		                    
		                    var json = JSON.parse(response);
		                    var couponMessage = json['promoDiscountMessage'];
		                    var couponAmount = json['promoDiscount'];
		                    var errorType = json['errorType'];
		                    placeOrderEnable(false);
		                    
		                    $('#shipping_options').val(shippingMethod);
		                    $('#shipping-error').remove();
		                    $('#coupon-error').remove();
							
							if (coupon.length > 1){
								// remove previous coupon success message
								$('#coupon-success').remove();
								if (couponMessage == null) {
									$( 'body' ).trigger( 'update_checkout' );
									$('#promo_code').val(coupon);
									$('#discount').val(couponAmount);
									$('.custom-coupon').slideUp("slow", function() {
    									$('.checkout-coupon').before('<div id="coupon-success">Success! Your coupon has been applied</div>');
    									$('.checkout-coupon').hide();
    									$('#coupon_code').val(coupon);
    									$('#coupon_email').val(couponEmail);
    									$('.loading-animation').remove();
  									});
								} else {
									$('.checkout-coupon').append('<div id="coupon-error" class="error">' + couponMessage + '</div>');
									$('#coupon_email').val(couponEmail);
									$('.loading-animation').remove();
								}
								
		                    }
		                    if (shippingMethod.length > 1){
		                    	if (errorType == 'Shipping') {
		                    		$('#shipping_options_field').append('<div id="shipping-error" class="error">Shipping method invalid. Please select a different option.</div');
		                    		$('tr.fee .woocommerce-Price-amount').html('Error');
		                    		placeOrderEnable(false);
		                    		
		                    		$('.loading-animation').remove();

		                    	} else {
		                    		$( 'body' ).trigger( 'update_checkout' );
		                    		placeOrderEnable(true);
		                    		$('.loading-animation').remove();

		                    		// var method = $('#shipping_options').val();
		                    		// console.log(method);
		                    		// $('#custom_shipping_method').val(method);
		                    	}
		                    } else {
		                    	placeOrderEnable(false);
		                    }
		            	},
		            	error: function (response) {
							console.log('An error occurred: ' + response);
							placeOrderEnable(false);
			           	}
		            });
		    	}

		    	function fieldValidator (val){
		    		if(val){
		    			return true;
		    		}else{
		    			return false;
		    		}
		    	}

		    	function checkoutFieldCheck(val) {
		    		var fieldValue = $(val).val();
		    		// console.log(fieldValue);
		    		if(fieldValue) {
		    			return fieldValue;
		    		} else {
		    			return ' ';
		    		}
		    	}

		    	function placeOrderEnable(condition){
		    		// console.log(condition);
		    		if (condition == false){
		    			document.querySelector("#payment #place_order").setAttribute("disabled", "disabled");;
		    		} else {
		    			document.querySelector("#payment #place_order").removeAttribute("disabled");
		    		}
		    		
		    	}
			});
		</script>
    	<?php 
	}	
}
/*
	Remove notices from checkout page
*/

add_filter( 'wc_add_to_cart_message_html', 'empty_wc_add_to_cart_message');
function empty_wc_add_to_cart_message( $message ) { 
    return '';
}; 

/*
	Add custom fields to the checkout page
*/
add_filter( 'woocommerce_cart_ready_to_calc_shipping', 'disable_shipping_calc_on_cart', 99 );
function disable_shipping_calc_on_cart( $show_shipping ) {
    $product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
        return false;
    }
    return $show_shipping;
}

add_filter('woocommerce_checkout_fields', 'custom_woocommerce_shipping_calc');
function custom_woocommerce_shipping_calc($fields){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		$defualt_array = json_decode(GetShippingMethodDefaults(), true);
		$shipping_methods = array_shift($defualt_array['shipMethods']);
		$methods = array_column($shipping_methods, 'ShipMethod');

	    $fields['billing']['shipping_options'] = array(
	        'label' => __('Shipping Method', 'woocommerce'), // Add custom field label
	        'required' => true, // if field is required or not
	        'clear' => false, // add clear or not
	     	'type' => 'select', // add field type
	     	'options'       => array(
	     		' '	=> __( $methods[0], 'wps' ),
		    	$methods[4]	=> __( $methods[4], 'wps' ),
		        $methods[3]	=> __( $methods[3], 'wps' ),
		        $methods[2]	=> __( $methods[2], 'wps' ),
		        $methods[1]	=> __( $methods[1], 'wps' ),
		    ),
	        'class' => array('custom-shipping')   // add class name
	    );

    	return $fields;
	}
}

add_filter('woocommerce_checkout_fields', 'custom_woocommerce_purchase_order');
function custom_woocommerce_purchase_order($fields){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
	    $fields['billing']['purchase_order_number'] = array(
	        'label' => __('Purchase Order', 'woocommerce'), // Add custom field label
	        'required' => false, // if field is required or not
	        'clear' => false, // add clear or not
	     	'type' => 'text', // add field type
	        'class' => array('purchase-order')   // add class name
	    );

    	return $fields;
	}
}

add_filter('woocommerce_after_order_notes', 'custom_woocommerce_promo_code_field');
function custom_woocommerce_promo_code_field($checkout){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		 echo '<div id="promo-code-field">';
		 woocommerce_form_field( 'promo_code', array(
	        'type'          => 'text',
	        'class'         => array('promo-code'),
	        'label'         => __('Promo Code'),
        ), $checkout->get_value( 'promo_code' ));
    	
    	echo '</div>';
	}
}

add_filter('woocommerce_after_order_notes', 'custom_woocommerce_discount');
function custom_woocommerce_discount($checkout){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		 echo '<div id="discount-field">';
		 woocommerce_form_field( 'discount', array(
	        'type'          => 'text',
	        'class'         => array('discount-field'),
	        'label'         => __('Discount'),
        ), $checkout->get_value( 'discount' ));
	    
    	echo '</div>';
	}
}

add_filter('woocommerce_after_order_notes', 'custom_woocommerce_electric_test');
function custom_woocommerce_electric_test($checkout){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		 echo '<div id="electric-test-field">';
		 woocommerce_form_field( 'electric_test', array(
	        'type'          => 'text',
	        'class'         => array('electric-test-field'),
	        'label'         => __('Electric Test'),
        ), $checkout->get_value( 'Electric Test' ));
	    
    	echo '</div>';
	}
}

add_filter('woocommerce_after_order_notes', 'custom_woocommerce_include_gerbers');
function custom_woocommerce_include_gerbers($checkout){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		 echo '<div id="include-gerbers-field">';
		 woocommerce_form_field( 'include_gerbers', array(
	        'type'          => 'text',
	        'class'         => array('include-gerbers-field'),
	        'label'         => __('Include Gerbers'),
        ), $checkout->get_value( 'Include Gerbers' ));
	    
    	echo '</div>';
	}
}

add_filter('woocommerce_after_order_notes', 'custom_woocommerce_unique_part_number');
function custom_woocommerce_unique_part_number($checkout){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		 echo '<div id="unique-part-number-field">';
		 woocommerce_form_field( 'promo_code', array(
	        'type'          => 'text',
	        'class'         => array('unique-part-number'),
	        'label'         => __('Part Number'),
        ), $checkout->get_value( 'unique_part_number' ));
    	
    	echo '</div>';
	}
}

// Reorder Billing fields
add_filter("woocommerce_checkout_fields", "order_fields");

function order_fields($fields) {

    $order = array(
        "billing_first_name", 
        "billing_last_name", 
        "billing_company",
        "purchase_order_number", 
        "billing_address_1", 
        "billing_address_2",
        "billing_city", 
        "billing_state", 
        "billing_postcode", 
        "billing_country", 
        "billing_email", 
        "billing_phone",
        "shipping_options"
    );
    foreach($order as $field)
    {
        $ordered_fields[$field] = $fields["billing"][$field];
    }

    $fields["billing"] = $ordered_fields;
    return $fields;

}

add_action( 'woocommerce_checkout_update_order_meta', 'update_meta_purchase_order_number' );

function update_meta_purchase_order_number( $order_id ) {
    if ( ! empty( $_POST['purchase_order_number'] ) ) {
        update_post_meta( $order_id, 'purchase_order_number', sanitize_text_field( $_POST['purchase_order_number'] ) );
    } else {
    	update_post_meta( $order_id, 'purchase_order_number', 'false' );
    }
}

add_action( 'woocommerce_checkout_update_order_meta', 'update_meta_promo_code' );
function update_meta_promo_code( $order_id ) {
    if ( ! empty( $_POST['promo_code'] ) ) {
        update_post_meta( $order_id, 'Promo Code', sanitize_text_field( $_POST['promo_code'] ) );
    } else {
    	update_post_meta( $order_id, 'Promo Code', 'false' );
    }
}

add_action( 'woocommerce_checkout_update_order_meta', 'update_meta_discount_amount' );
function update_meta_discount_amount( $order_id ) {
    if ( ! empty( $_POST['discount'] ) ) {
        update_post_meta( $order_id, 'discount_amount', sanitize_text_field( $_POST['discount'] ) );
    } else {
		update_post_meta( $order_id, 'discount_amount', 'false' );
    }
}

add_action( 'woocommerce_checkout_update_order_meta', 'update_meta_electric_test' );
function update_meta_electric_test( $order_id ) {
    if ( ! empty( $_POST['electric_test'] ) ) {
        update_post_meta( $order_id, 'electric_test', sanitize_text_field( $_POST['electric_test'] ) );
    } else {
		update_post_meta( $order_id, 'electric_test', 'false' );
    }
}

add_action( 'woocommerce_checkout_update_order_meta', 'update_meta_include_gerbers' );
function update_meta_include_gerbers( $order_id ) {
    if ( ! empty( $_POST['include_gerbers'] ) ) {
        update_post_meta( $order_id, 'include_gerbers', sanitize_text_field( $_POST['include_gerbers'] ) );
    } else {
		update_post_meta( $order_id, 'include_gerbers', 'false' );
    }
}

add_action( 'woocommerce_checkout_update_order_meta', 'update_unique_part_number' );
function update_unique_part_number( $order_id ) {
    if ( ! empty( $_POST['unique_part_number'] ) ) {
        update_post_meta( $order_id, 'Part Number', sanitize_text_field( $_POST['unique_part_number'] ) );
    } else {
    	update_post_meta( $order_id, 'Part Number', 'error' );
    }
}

function GetShippingMethodDefaults(){
    $apiurl = "http://example.org";
    $apiUserName = "demo";
    $apiPassword = "password";
    $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_PORT => "443",
        CURLOPT_URL => $apiurl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_POSTFIELDS => "grant_type=password&userName=" . $apiUserName . "&password=" . $apiPassword,
        CURLOPT_CUSTOMREQUEST => "GET",
      ));

      $response = curl_exec($curl);
      $err = curl_error($curl);
      curl_close($curl);
      return $response;   
}

add_filter( 'woocommerce_cart_subtotal', 'coupon_processing', 10, 3 );
function coupon_processing( $subtotal, $compound, $cart ) {     
		if (!isset($_SESSION['discount'])){
			$store_credit = '';
		} else {
			$store_credit = $_SESSION['discount'];
		}
		if (!isset($_SESSION['shipping'])){
			$shipcost = '';
		} else {
			$shipcost = $_SESSION['shipping'];
		}
        
        // We only need to add a store credit coupon if they have store credit
        if($store_credit > 0){

            // Setup our virtual coupon
            $coupon_name = 'discount total';
            $coupon = array($coupon_name => $store_credit);

            // Apply the store credit coupon to the cart & update totals
            $cart->applied_coupons = array($coupon_name);
            $cart->set_discount_total($store_credit);
            $cart->set_total( $cart->get_subtotal() - $store_credit+$shipcost);
            $cart->coupon_discount_totals = $coupon;
        }

    return $subtotal; 
}

add_action( 'woocommerce_cart_calculate_fees','wc_add_surcharge' ); 
function wc_add_surcharge() { 
	global $woocommerce; 

	if ( is_admin() && ! defined( 'DOING_AJAX' ) ) 
	return;

	$fee = 0;
	if (isset($_SESSION['shipping'])){
		// change the $fee to the shipping cost
		$fee = $_SESSION['shipping'];
	}
	
	if($fee > 0){
    	$woocommerce->cart->add_fee( 'Shipping Cost', $fee, true, 'standard' );  
	}
}

function look_for_xml_values($session_id, $term){

	global $wpdb,$table_prefix;
	foreach( $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_example_table WHERE upload_id = %s", $session_id)) as $key => $row) {
		// each column in your row will be accessible like this
		$xml_data = $row->xml_data;
		$xml_file_name = $row->xml_file_name;
		$xml_file_location = $row->xml_file_location;
		$xml_file_location = get_site_url() . '/' . strstr($xml_file_location, 'wp-content');
		$xml = simplexml_load_file($xml_file_location);
		$value = (string) $xml->OrderDetails[0]->$term;
	}
	
	return $value;
}

add_filter( 'wc_coupons_enabled', 'disable_coupon_field_for_product' );

// hide coupon field on the cart page
function disable_coupon_field_for_product( $enabled ) {
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
		$enabled = false;
	}
	return $enabled;
}

function woo_in_cart($product_id) {
    global $woocommerce;
 
    foreach($woocommerce->cart->get_cart() as $cart_item ) {
        $cart_product_id = $cart_item['product_id'];
 
        if($product_id == $cart_product_id ) {
            return true;
        }
    }
 
    return false;
}

function is_null_or_empty($str){
    if (strlen($str) == 0){
    	return '';
	} else {
		return $str;
	}
}

function if_empty_return_false($str){
    if (strlen($str) == 0 || $str == 'False' || $str == 'false'){
    	return 'False';
	} else {
		return 'True';
	}
}

// disable return submit on checkout
add_action('wp_head', 'disable_enter_submit_at_checkout', 10, 1);
function disable_enter_submit_at_checkout (){
	$product_id = check_for_order_form_product();
	$order_form_check = woo_in_cart($product_id);
	if (is_checkout() && $order_form_check == true){
?>
		<script type="text/javascript">
		   	jQuery(document).ready(function($) {
				$("form").keypress(function(e) {
				  //Enter key
				  if (e.which == 13) {
				    return false;
				  }
				});
			});
		</script>
<?php
    }
}

// adds metadata to WooCommerce order data
add_action('woocommerce_checkout_order_processed', 'order_processing');
function order_processing($order_id){
	
	global $woocommerce;
	$items = $woocommerce->cart->get_cart();
	$first = array_shift($items);
	$electric = $first['_gravity_form_lead']['8.1'];
	//select order array and get metadata
	$order = new WC_Order($order_id);
	$items = $order->get_items();
	$metas = $order->get_meta_data();

	//$res= print_r($order);
		
	$base = get_site_url();
	$current_item = "";
	foreach ($items as $item) {
        $current_item = $item;
        break;
    }

    if ($current_item != "") {
    	
		$cart = $woocommerce->cart->get_cart();
	    $form_data = array_column($cart, '_gravity_form_lead');
	   	$parts = parse_url($form_data[0]['source_url']);
		parse_str($parts['query'], $query);
		$session_id = $query['session'];

		$current = $order->get_meta('session_id');
		$item->update_meta_data('session id', $session_id);

		// add rrb/pcb file url to order metadata
		$current = $order->get_meta('file_url');
		$item->update_meta_data('file url', $_SESSION['file_location']);

		$current = $order->get_meta('xml_data');
		$item->update_meta_data('xml_data', $_SESSION['xml_data']);

		$current = $order->get_meta('server_response');
		$item->update_meta_data('server_response', $_SESSION['server_response']);

		//order hasn't been posted to restful service, so add meta value 0 (false) before order is submitted
        update_post_meta($order_id, "_exported_to_rest", 0);
		
		//save all of our changes from above
        $item->save();
    }
}

// Export orders restful service
add_action("wp_export_order_to_rest", "wp_export_order_to_rest", 10, 1);
function wp_export_order_to_rest($order_id)
{
   	update_post_meta( $order_id, '_exported_to_rest', 1 );
    
    $site = get_site_url();

    //connect to WooCommerce REST API and retrieve order details
    $outgoing = file_get_contents( $site . "/wp-json/wc/v2/orders/" . $order_id . "?consumer_key=ck_XXXX&consumer_secret=cs_XXXX");
    
    // POST data to restful service
    $api_response = CallAPI("POST", "http://example.org", $outgoing);

    return $api_response;
}

function GetToken(){
    $apiurl = "http://example.org";
    $apiDestination = "Token";
    $apiUserName = "demo";
    $apiPassword = "password";
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_PORT => "443",
      CURLOPT_URL => $apiurl . $apiDestination,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => "grant_type=password&userName=" . $apiUserName . "&password=" . $apiPassword,
      CURLOPT_HTTPHEADER => array(
        "cache-control: no-cache",
        "content-type: application/x-www-form-urlencoded"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
      echo "cURL Error #:" . $err;
    } else {
       $newObject = json_decode($response,true);  
      return $newObject['access_token'];
    }
}


function CallAPI($method, $url, $data = false){
	$token = GetToken();
	$curl = curl_init();

    switch ($method) {
    	// NOTE: GET is the default so we don't need a case for such a request
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    //Authentication:
    curl_setopt($curl, CURLOPT_PORT, "443");
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    	'authorization: bearer ' . $token,
        'cache-control: no-cache',
        'Content-Type: application/json'
    	));

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;

    // wp_die();
}

// Functions for the Thank You page
add_action( 'woocommerce_thankyou', 'redirect_product_based', 1 );
function redirect_product_based ( $order_id ){
    $order = wc_get_order( $order_id );

    foreach( $order->get_items() as $item ) {
        // Add whatever product id you want below here
        if ( $item['product_id'] == check_for_order_form_product() ) {
        	$site = get_site_url();
            // change below to the URL that you want to send your customer to
             wp_redirect( $site . '/thank-you/?order=' . $order_id . '&session=' . $_SESSION['session_id']);
        }
    }        
}

genesis_register_sidebar( array(
	'id'		=> 'front-page-10-widget',
	'name'		=> __( 'Front Page 10', 'Corporate Pro' ),
	'description'	=> __( 'This widget is for posting stuff on the front page.', 'Corporate Pro' ),
) );

//* Add the page widget in the content - XHTML
add_action( 'genesis_before_footer', 'add_front_page_10_widget' );
function add_front_page_10_widget() {
	if ( is_front_page() )
	genesis_widget_area ('front-page-10-widget', array(
        'before' => '<div id="front-page-10" class="front-page-widget front-page-10"><div class="wrap">',
        'after' => '</div></div>',
	) );
}

//Load FancyBox js in footer
add_action('genesis_after_footer', 'js_to_add_to_footer');
function js_to_add_to_footer() {
    $url = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.20/jquery.fancybox.js';
    $name = 'oldFancybox';
      wp_register_script( $name, $url, false, null);
      wp_enqueue_script( $name );
}

//* Load FancyBox style sheet
add_action( 'wp_enqueue_scripts', 'load_fancybox_style_sheet' );
function load_fancybox_style_sheet() {
	wp_enqueue_style( 'fancybox-stylesheet', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.20/jquery.fancybox.css', array(), PARENT_THEME_VERSION );
}

// Disable confirmation emails (we will add these in later)
add_action( 'woocommerce_email', 'remove_customer_processing_email', 1 );
function remove_customer_processing_email( $email_class ) {
	remove_action( 'woocommerce_customer_processing_order', array( $email_class->emails['WC_Email_Customer_Processing_Order'], 'trigger' ) );
	remove_action( 'woocommerce_new_order', array( $email_class->emails['WC_Email_New_Order'], 'trigger' ) );
	remove_action( 'woocommerce_order_status_pending_to_processing_notification', array( $email_class->emails['WC_Email_New_Order'], 'trigger' ) );
	remove_action( 'woocommerce_order_status_pending_to_completed_notification', array( $email_class->emails['WC_Email_New_Order'], 'trigger' ) );
	remove_action( 'woocommerce_order_status_pending_to_processing_notification', array( $email_class->emails['WC_Email_Customer_Processing_Order'], 'trigger' ) );
}

/*
 * goes in theme functions.php or a custom plugin
 *
 * Subject filters: 
 *   woocommerce_email_subject_new_order
 *   woocommerce_email_subject_customer_processing_order
 *   woocommerce_email_subject_customer_completed_order
 *   woocommerce_email_subject_customer_invoice
 *   woocommerce_email_subject_customer_note
 **/

add_filter('woocommerce_email_subject_new_order', 'change_new_order_email_subject', 1, 2);
add_filter('woocommerce_email_subject_customer_invoice', 'change_invoice_email_subject', 1, 2);
add_filter('woocommerce_email_subject_customer_processing_order', 'change_customer_processing_order', 1, 2);
add_filter('woocommerce_email_subject_customer_completed_order', 'change_customer_completed_order', 1, 2);
add_filter('woocommerce_email_subject_customer_note', 'change_customer_note', 1, 2);

function change_new_order_email_subject( $subject, $order ) {
	global $woocommerce;

	$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
	$text = 'New';
	return build_subject($blogname, $order, $text);
}

function change_invoice_email_subject( $subject, $order ) {
	global $woocommerce;

	$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
	$text = 'Invoice for';
	return build_subject($blogname, $order, $text);
}

function change_customer_processing_order( $subject, $order ) {
	global $woocommerce;

	$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
	$text = 'Processing';
	return build_subject($blogname, $order, $text);
}

function change_customer_completed_order( $subject, $order ) {
	global $woocommerce;

	$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
	$text = 'Completed';
	return build_subject($blogname, $order, $text);
}

function change_customer_note( $subject, $order ) {
	global $woocommerce;

	$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
	$text = 'Note on';
	return build_subject($blogname, $order, $text);
}

function build_subject($blogname, $order, $text) {

	$order_num = get_order_number($order);

	if ($order_num == false){
		exit();
	} else {
		// $subject = sprintf( '[%s] %s #%s', $blogname, $text, $p_num);
		$subject = '[' . $blogname . '] ' . $text . ' Order #' . $order_num;

		return $subject;
	}
}

function get_order_number($order){
	$items = $order->get_items();
	$metas = $order->get_meta_data();

	// loop through meta data to check if this order has been exported
	foreach( $metas as $meta ){	
		// get api_order_num which will only have a value if this order has been exported before
		if ($meta->key == 'api_order_num'){
			$api_order_num = $meta->value;
		}
	}
	
	$current_item="";
	foreach($items as $item){
	        $current_item = $item;
	        break;
	}

	$xml = $current_item->get_meta('xml_data');
	$parse = json_decode($xml, TRUE);
	
	if( $parse["OrderNumber"] != null ){
		$order_num = $parse["OrderNumber"];
	} elseif (!empty($api_order_num)){
		$order_num = $api_order_num;
	} else {
		return false;
	}

	return $order_num;
}

add_action( 'template_redirect', 'redirect_shop_page' );
function redirect_shop_page() {
    if( is_shop() ){
        wp_redirect( home_url() );
        exit();
    }
}

add_action('wp_dashboard_setup', 'website_alive_on_off_widget');
  
function website_alive_on_off_widget() {

	$user = wp_get_current_user();
	$roles = ( array ) $user->roles;
	
	if ($roles[0] ==='administrator'){
		global $wp_meta_boxes;
		add_meta_box( 'website_alive', 'Website Alive Status', 'website_alive_status', 'dashboard', 'side', 'high' );
	}

}
 
function website_alive_status() {

?>
<style>
	.status-wrapper{
		width: 50%;
		text-align: center;
	}
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input { 
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input#website-status + .slider {
		background-color: red;
	}

	input#website-status:checked + .slider {
		background-color: green;
	}

	input#website-status:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	input#website-status:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	input#website-status.loading + .slider {
		background-color: gray;
	}

	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

	span.selected {
		font-weight: bold;
	}

</style>

<div class="status-wrapper">
	<h2>Status</h2>
	<label class="switch">
	<div id="loader"></div>
	<input id="website-status" class="loading" type="checkbox" autocomplete="off">
	<span class="slider round"></span>
	</label>
	<p id="off-on" style="text-align:center">OFF</p>
</div>

<script type="application/javascript">
	(function($) {

		initialState();

		function initialState(){
			$('#website-status').prop( "checked", false );
			$('#off-on').text('Loading...');
		}

		ajaxCall('GET', 'return_status', null, toggleSwitch);
		
		function toggleSwitch(data){


			var result = parseResult(data).toString(),
				state = $('#website-status').is(':checked').toString(),
				target = $('#website-status');
			
			if( result !== state ) {
				
				if(result === false){
					$(target).prop( "checked", false );
				} else {
					$(target).prop( "checked", true );
				}

				
			}

			$(target).removeClass('loading');
			toggleText();

		}

		function parseResult(data){
			var parse = JSON.parse(data),
				result = parse[0].option_value;

			return result;
		}

		$('#website-status').click(function(){
			changeStatus();
		});

		function changeStatus(){
			var status = $('#website-status').is(':checked');

			toggleText();

			ajaxCall('POST', 'toggle_website_alive_script', status, parseChange);
		}

		function parseChange(data){

			var result = parseResult(data);

			console.log( 'result ' + result );

		}

		function ajaxCall(method, func, data, callback){

			var response;
			
			$.ajax({
                url: "/wp-admin/admin-ajax.php",
				type: method,
				data: {
					datatype : "json",
					action : func,
					data: data
				},
				success: function(response) {
					response =  response.replace(/[0-9]/g, '');
					callback(response);
				},
				error: function (response) {
					console.log(response);
					callback( '[{"option_value":"false"}]' );
				}
			});
		}

		function toggleText(){
			var status = $('#website-status').is(':checked');

			if (status === true){

				$('#off-on').text('ON');

			} else {

				$('#off-on').text('OFF');

			}
		}

	})( jQuery );

</script>
<?php
}

add_action( 'wp_ajax_toggle_website_alive_script', 'toggle_website_alive_script' );

function toggle_website_alive_script(){

	$status = $_POST['data'];
	$option_name = 'website_alive_status';
	
	if(!get_option('website_alive_status')){
		add_option('website_alive_status', 'false');
	}

	$response = update_option( $option_name, $status);
	
	echo json_encode(get_website_alive_status());
    
    exit; // exit ajax call(or it will return useless information to the response)
}

add_action( 'wp_ajax_return_status', 'return_status' );

function return_status(){

	echo json_encode(get_website_alive_status());

}

function get_website_alive_status(){
	 
	$sql_query = 'SELECT option_value FROM wp_options WHERE option_name = \'website_alive_status\'' ;
   
   	global $wpdb;

   	$get_status = $wpdb->get_results($sql_query);
   
   	return $get_status;
}

add_action('genesis_after_footer', 'check_website_alive_status');
function check_website_alive_status(){

	$get_status = get_website_alive_status();
	$status = $get_status[0]->option_value;
	if($status === 'true'){
		load_website_alive_api();
	}
}
function load_website_alive_api() {

	$script  = '<script type="text/javascript">';
	$script .= 'function wsa_include_js(){';
	$script .= 'var wsa_host = (("https:" == document.location.protocol) ? "https://" : "http://");';
	$script .= 'var js = document.createElement("script");';
	$script .= 'js.setAttribute("language", "javascript");';
	$script .= 'js.setAttribute("type", "text/javascript");';
	$script .= 'js.setAttribute("src",wsa_host + "tracking-v3.websitealive.com/3.0/?objectref=wsa3&groupid=XXXX&websiteid=XXXX");';
	$script .= 'document.getElementsByTagName("head").item(0).appendChild(js);';
	$script .= '} if (window.attachEvent) {';
	$script .= 'window.attachEvent("onload", wsa_include_js);}';
	$script .= 'else if (window.addEventListener) {';
	$script .= 'window.addEventListener("load", wsa_include_js, false);}';
	$script .= 'else {document.addEventListener("load", wsa_include_js, false);}';
	$script .= '</script>';
	
	echo $script;
}

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

// remove version from head
remove_action('wp_head', 'wp_generator');

// remove version from rss
add_filter('the_generator', '__return_empty_string');

// remove version from scripts and styles
function remove_version_scripts_styles($src) {
    if (strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}
add_filter('style_loader_src', 'remove_version_scripts_styles', 9999);
add_filter('script_loader_src', 'remove_version_scripts_styles', 9999);

// Functions for testing (Don't remove)

// prints order array on thank you page
// add_action( 'woocommerce_thankyou', 'print_order_array', 5 );
 
// function print_order_array( $orderid ) {
// 	$order = wc_get_order( $orderid );
// 	echo '<pre>';
// 	print_r( $order );
// 	echo '</pre>';
// }

// prints cart array on checkout
// 
// add_action('woocommerce_after_checkout_form', 'get_cart_details');
// function get_cart_details(){
	
// 	global $woocommerce;
    
//     //adds cart item data to order array. Allows us to select GF metadata to add to WooCommerce metadata
//     $items = $woocommerce->cart->get_cart();
//     $first = array_shift($items);
    
//     if (empty($first)) {
//     	echo 'NO ITEMS IN ARRAY';
// 	} else {
// 		echo '<pre>';
// 		// print_r($first);
// 		$url = $first['_gravity_form_lead']['source_url'];
// 		$parts = parse_url($url);
// 		parse_str($parts['query'], $query);
// 		$session_id = $query['session'];

// 		$file_url = $_SESSION['file_location'];
// 		// $file_url = find_order_file($session_id);
// 		// $file_url = get_site_url() . '/' . strstr($file_url, 'wp-content');
			
// 		echo 'session id: ' . $session_id . '<br>';
// 		echo 'file location: ' . $file_url;
		
// 		echo '</pre>';
// 	}
// }
