<?php
/**
 * Template Name: Order Form
 *
 * Description: This template is a full-width version of the page.php template file. It removes the sidebar area.
 *
 */

//* Add order form class to the head
add_filter( 'body_class', 'order_form_add_body_class' );
function order_form_add_body_class( $classes ) {
	$classes[] = 'pcb-order-form';
	return $classes;
}


WC()->cart->empty_cart( true );

// Force full width content layout
add_filter( 'genesis_site_layout', '__genesis_return_full_width_content' );

// Remove default Genesis loop
remove_action( 'genesis_loop', 'genesis_do_loop' );
add_action( 'genesis_loop', 'conditional_content_loop' );

function check_session() {
	global $wpdb;
	
	if(isset($_GET['session'])){
	    
	    $id_check = $_GET['session'];
	    $match = '';
	    foreach( $wpdb->get_results($wpdb->prepare("SELECT id FROM wp_example_table WHERE upload_id = %s", $id_check)) as $key => $row) {
	    	$match = $row->id;
	    }
		
		if($match < 1) {
		    echo 'Your upload could not be found, please try again.';
		} else {
		    return true;
		}
	} else {
		return false;
	}

}
function conditional_content_loop (){
	if(check_session() == true){
		genesis_standard_loop();
		add_action('genesis_after_footer', 'order_form_scripts');
	} else {
		?>
		<script type="text/javascript">
			function validate_fileupload(fileName){
				    var allowed_extensions = "zip",
				    	file_extension = fileName.split('.').pop().toLowerCase(),
				    	errorElem = document.querySelector('.upload-error');
				    
				    if (allowed_extensions == file_extension) {
				    	if (errorElem) {
				        		//remove error if previous attempt was unsucessful
				        		var remove = document.querySelector('.upload-error');
								remove.parentNode.removeChild(remove);
				        	}

			        	var uploadButton = document.getElementById("file_upload");
			        	if (uploadButton.classList.contains('none-yet')) {
			        		uploadButton.classList.remove('none-yet');
								uploadButton.classList.add('has-some');
			        	}

			        	//enable submit button
			        	document.getElementById("submit_button").removeAttribute("disabled");

				    } else {
				    	if (errorElem) {
				    			errorElem.classList.remove('reiterate');
				        		errorElem.classList.add('reiterate');
				    	} else {
						        var error = document.createElement('div');
					    		error.innerHTML = "Error! Not a zip file.";
					    		error.classList.add('upload-error');
					    		var reference = document.getElementById("file_upload");
					    		reference.after(error);
				    	}
				    }
				}
			jQuery( document ).ready(function( $ ) {
				$("form#upload-zip").submit(function(e) {
		        
		        event.preventDefault();
				
		        var data = new FormData(this);
		        var dataFile = $('#file_upload').get(0).files[0];
		     	
				data.append('file', dataFile);
				data.append('action', 'order_form_ajax');

            	console.log(dataFile);

		            //submit to ajax call
			        $.ajax({
		                url: "/wp-admin/admin-ajax.php",
		                type: 'POST',
		                data: data,
						contentType: false,
						dataType: "JSON",
						processData: false,
		                success: function(response) {
		                    
		                    //console.log('You will be redirected to: ' + response);
		                    alert('Success! Please, proceed to your order form...');
		                    
		                    location.href = response.data;
		            	},
		            	error: function (response) {
    						var input = $('#file_upload');
    						clearInput(input);
    						alert(response.responseJSON.data[0].message);
			            }
		            });
		    	});
		    	function clearInput(input) {
			        input = input.val('').clone(true);
			    };
		    });
		</script>
		<?php echo do_shortcode( '[example_shortcode]' ); ?>
		<form id="upload-zip" method="post" action="" enctype="multipart/form-data">
			<label>
				Choose a zip file to upload:
				<input id="file_upload" class="none-yet" type="file" name="zip_file" accept="application/zip" onchange="validate_fileupload(this.value);" />
			</label>
			
			<br />
			<input id="submit_button" class="formsubmit" type="submit" name="submit" value="Upload" disabled/>
		</form>
	<?php
	}
}
genesis();

function order_form_scripts() {
	include ('order-form-functions.php');
}
  
?>
