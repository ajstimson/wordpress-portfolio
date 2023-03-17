<?php

function GetOrderFormDefaults(){

	$response = CallAPI("GET", "https://example.com", false);
    return $response;   

}

$def_array = json_decode(GetOrderFormDefaults(), true);
$lead_time = array_shift($def_array['leadTimes']);
$lead_time = json_encode($lead_time);
$mfg_data = array_shift($def_array['MfgData']);
$mfg_data = json_encode($mfg_data);


global $wpdb,$table_prefix;
	$upload_id_val = $_GET['session'];

	foreach( $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_example_table WHERE upload_id = %s", $upload_id_val)) as $key => $row) {
		// each column in your row will be accessible like this
		$xml_data = $row->xml_data;

		$design_file = $row->rrb_file_location;
		if (empty($design_file)) {
			$design_file = $row->pcb_file_location;
		}

		$xml_file_name = $row->xml_file_name;
		$xml_file_location = $row->xml_file_location;
		$xml_file_location = get_site_url() . '/' . strstr($xml_file_location, 'wp-content');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $xml_file_location);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$xml = curl_exec($ch);
		curl_close($ch);

		$cont = produce_XML_object_tree($xml);


		$xml = simplexml_load_file($xml_file_location);
		// echo "<pre>";
		// print_r($ch);
		// echo "</pre>";
		$xml = json_encode($xml);
}

function produce_XML_object_tree($raw_XML) {
    libxml_use_internal_errors(true);
    try {
        $xmlTree = new SimpleXMLElement($raw_XML);
    } catch (Exception $e) {
        // Something went wrong.
        $error_message = 'SimpleXMLElement threw an exception.';
        foreach(libxml_get_errors() as $error_line) {
            $error_message .= "\t" . $error_line->message;
        }
        trigger_error($error_message);
        return false;
    }
    return $xmlTree;
}

?>

<script type="text/javascript">
	(function($) {
		$(window).on('load', function(){

			// make sure elec test value doesn't carry over from previous sessions
			document.getElementById("choice_1_8_1").checked = false;
			// clear input values from previous sessions
			$("#input_1_3").val("");
			// create column blocks
			wrapBlocks();

			//process xml file values
			var xmlFile = <?php print_r($xml);?>,
				layerCount = xmlFile.OrderDetails.BoardPropCopperLayers,
				maxDim = xmlFile.OrderDetails.MaxDim,
				minDim = xmlFile.OrderDetails.MinDim,
				boardArea = maxDim * minDim;

			console.log(xmlFile);

			//process remote service values
			var mfgData = <?php print_r("'" . $mfg_data . "'")?>;
    			mfgData = jQuery.parseJSON(mfgData);
    			console.log(mfgData);

			var radioButtons = $('#field_1_2 input[type=radio]'),
				radioVal = '',
		    	quantityField = $('#input_1_3'),
		    	quantity = '',
		    	leadTimeField = $('#input_1_4'),
		    	leadValue = '',
		    	elecTestValue = elecTestHandler();

			initExpressLoop(xmlFile, mfgData, radioButtons);

		    // if radiobutton selection changes re-run quantity min/max
		   
		    $(radioButtons).click(function () {
		    		radioVal = $(this).val();
		    	
		    	$(radioButtons).each(function () {
		    		var radioValTest = $(this).val();
		    		
		    		if (radioValTest != radioVal){
		    			$(this).prop('checked', false).removeAttr('checked');
		    		} else {
		    			$(this).prop('checked', true);
		    		}
		    	});
		    	
		    	//Remove Silver Plating if StandardPlus
		    	if (radioVal == 'StandardPlus (No Mask)' || radioVal == 'Standard MiniBoardPlus (No Mask)'){
		    		$('#input_1_5 option[value="Silver (RoHS)"]').remove(); 
		    	} else {
		    		// Otherwise put it back the way we found it
		    		if( $('#input_1_5 option[value="Silver (RoHS)"]').length){
		    			// it's already here don't do anything
		    		} else {
		    			$('#input_1_5').append('<option value="Silver (RoHS)">Silver (RoHS)</option>');
		    		}
		    	}

		    	//Set Silk Solder Board Spec Values
		    	silkSolderServiceOptions(xmlFile, mfgData, radioVal);

				quantity = $(quantityField).val();
				elecTestValue = elecTestHandler();
				leadValue = $(leadTimeField).val();

				// TO DO: This process needs to be refactored
				// set lead time
				setLeadTime(mfgData, layerCount, radioVal, quantity);
				// set quantity min/max values
				setQuantityMinMax(mfgData, layerCount, radioVal);
				// check quantity for errors
				checkQuantity(quantityField, quantity);

				if(quantity > 0 && leadValue > 0){
					quoteLoading();
				}

				priceCalculator(radioVal, quantity, leadValue, elecTestValue, layerCount, minDim, maxDim, boardArea);

				// var quantityInput = document.getElementById('input_1_3');
				// console.log('radioButtons click \n min ' + quantityInput.getAttribute('data-min') + '\n' + 'max ' + quantityInput.getAttribute('data-max'));
			});



			//if quantity value changes, evaluate lead time options
			$(quantityField).keyup(delay(function (e) {
				radioVal = whatService(radioButtons);
				quantity = $(quantityField).val();
				elecTestValue = elecTestHandler();

				// TO DO: This process needs to be refactored
				// reset leadtime requirements
				setLeadTime(mfgData, layerCount, radioVal, quantity);
				// set quantity min/max values
				setQuantityMinMax(mfgData, layerCount, radioVal);
				// check quantity min/max values
				checkQuantity(quantityField, quantity);
				

				if(leadValue > 0){
					quoteLoading();
				}

				if(quantity < 1){
					clearQuote();
				} else {
					// calculate price
					priceCalculator(radioVal, quantity, leadValue, elecTestValue, layerCount, minDim, maxDim, boardArea);
				}
			}, 300));


			var previous = '';


			$(leadTimeField).on('focus', function () {
			        // Store the current value on focus and on change
			        previous = this.value;
			    }).change(function() {
			        // Do something with the previous value after the change
			        // console.log('previous: ' + previous);
			        var oldVal = previous;
			        // Make sure the previous value is updated
			        previous = this.value;
			        var newVal = previous;
			        
			        if (oldVal === newVal){
			        	// console.log('LEADVALUE DID NOT CHANGE - do not load any functions');
			        } else {
			        	radioVal = whatService(radioButtons);
						quantity = $(quantityField).val();
						elecTestValue = elecTestHandler();
						leadValue = $(leadTimeField).val();

						// check leadtime and quantity min/max requirements
						checkLeadTime(mfgData, layerCount, radioVal, leadTimeField, leadValue, quantityField, quantity);


						if(quantity > 0){
							quoteLoading();
						}

						// calculate price
						priceCalculator(radioVal, quantity, leadValue, elecTestValue, layerCount, minDim, maxDim, boardArea);
			        }
			});

			//if electrical test is clicked and is checked, toggle true/false in spec value and evaluate price
			$('#choice_1_8_1').click(function () {

				elecTestValue = elecTestHandler();					
				radioVal = whatService(radioButtons);
				quantity = $(quantityField).val();
				leadValue = $(leadTimeField).val();
				
				if(quantity > 0 && leadValue > 0){
					quoteLoading();
					priceCalculator(radioVal, quantity, leadValue, elecTestValue, layerCount, minDim, maxDim, boardArea);
				}
			});			
		});
	
	function delay(callback, ms) {
	  var timer = 0;
	  return function() {
	    var context = this, args = arguments;
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      callback.apply(context, args);
	    }, ms || 0);
	  };
	}

	function wrapBlocks(){
		//adding blocks for CSS styling
		$( ".left-half" ).wrapAll( "<ul class='left-block' />");
		$( ".right-half" ).wrapAll( "<ul class='right-block' />");
		$( ".bottom-half" ).wrapAll( "<ul class='bottom-block' />");
		$( ".bottom-block" ).appendTo("form.cart");

		//Promo Code area wrap
		$('#field_1_38, #field_1_37').wrapAll('<div id="promo-section" />');
	}

	function whatService(radioButtons) {
		var radios = document.querySelectorAll('input[type="radio"]:checked');
		var value = radios.length>0? radios[0].value: null;
		// var checked = $(radioButtons).prop("checked", true),
		// 	value = $(checked).val();

		return value;
	}

	function initExpressLoop(xmlFile, mfgData, radioButtons){

		//STEP 1: disable all radio buttons and associated labels
        $(radioButtons).prop('checked', false).removeAttr('checked').css('pointer-events', 'none');
        $('#input_1_2 li label').addClass("disabled").css('pointer-events', 'none');

		//STEP 2: loop through layer, dimensions and silk/solder data to create an array of available service ids
		var serviceIdArray = layerCountLoop(xmlFile, mfgData);
			serviceIdArray = dimensionsLoop(serviceIdArray, xmlFile, mfgData);
			serviceIdArray = silkSolderLoop(serviceIdArray, xmlFile, mfgData);
			

		//Step 3: Remove duplicate IDs
		var unique = (value, index, self) => {
			return self.indexOf(value) === index;
		}

		serviceIdArray = serviceIdArray.filter(unique);

		//STEP 4: create a new array of service names that match the service ids that passed the last three loops
		var returnedServices = [];
		//loop through getstartupdata and return valid service names
		for (var i=serviceIdArray.length-1; i>=0; i--) {
			// for each service id run a function that will return the associated service name
			returnedServices[i] = returnData(mfgData, 'Service', serviceIdArray[i]);
		}

		//Step 5: Remove duplicate service names
		returnedServices = returnedServices.filter(unique);
		// console.log(returnedServices);
		
		//STEP 5: enable options radiobutton if the input value matches the array of mfgData services
		$('#field_1_2 input').each( function() {
			var radioValue = $(this).val();
			if (returnedServices.includes(radioValue)){
				$(this).prop("disabled",false).addClass('enabled').css('pointer-events', 'auto').next("label").removeClass("disabled").css('pointer-events', 'onautocompleteerror');
			}
		});

		//STEP 6: Set board specification values (visual)
		specValueSet(xmlFile);

		//STEP 7: Update hidden fields for meta data processing
		duplicateXMLVals(xmlFile);
	}

	function layerCountLoop(xmlFile, mfgData){
		var array = [];
		var a = 0;
		for (var i=mfgData.length-1; i>=0; i--) {
			if (xmlFile.OrderDetails.BoardPropCopperLayers == mfgData[i].Layers){
				array[a] = mfgData[i].ServiceConfigId;
				a++;
			}
		}
		return array;
	}

	function dimensionsLoop(serviceIdArray, xmlFile, mfgData){
		// Get dimension values from xml file
		var xmlMinSide 	= xmlFile.OrderDetails.MinDim,
			xmlMaxSide 	= xmlFile.OrderDetails.MaxDim,
			xmlArea 	= xmlMinSide * xmlMaxSide;

		var array = [];
		var a = 0;
		//Loop through service IDs
		for (var i=serviceIdArray.length-1; i>=0; i--){
			// Get dimension values from getstartupdata
			var service 			= returnData(mfgData, 'Service', serviceIdArray[i]),
				mfgMinArea 			= returnData(mfgData, 'Minimum_Area', serviceIdArray[i]),
				mfgMaxArea 			= returnData(mfgData, 'Maximum_Area', serviceIdArray[i]),
				mfgMaxBoardArea 	= returnData(mfgData, 'Maximum_Board_Area', serviceIdArray[i]),
				mfgShortSide 		= returnData(mfgData, 'Short_Side', serviceIdArray[i]),
				mfgLongSide 		= returnData(mfgData, 'Long_Side', serviceIdArray[i]),
				mfgMinSideLength	= returnData(mfgData, 'Min_Side_Length', serviceIdArray[i]);
			
			//compare values and return true if mfg data is either 0 or Less/Greater than
			var lngSideMatch = testIfLess(mfgLongSide, xmlMaxSide),
				srtSideMatch = testIfGreater(mfgShortSide, xmlMinSide),
				maxAreaMatch = testIfLess(mfgMaxArea, xmlArea),
				minAreaMatch = testIfGreater(mfgMinArea, xmlArea),
				maxBoardArea = testIfLess(mfgMaxBoardArea, xmlArea),
				maxAreaMatch = testIfGreater(mfgMinSideLength, xmlMinSide);
				minSideMatch = testIfGreater(mfgMinSideLength, xmlMaxSide);
				if(minSideMatch == true){
					minSideMatch = testIfGreater(mfgMinSideLength, xmlMinSide);
				}

			// MiniboardPlus & Standard MiniBoardPlus (No Mask) Testing
			if( service == 'MiniboardPlus' || service == 'Standard MiniBoardPlus (No Mask)' ){
				
				if(isClassic(xmlFile) == true){
					// ignore area match values
					minAreaMatch = true;
					maxAreaMatch = true;
					// Classic orders rely on lngSideMatch & srtSideMatch for validation
				} else {
					// For plus orders, test for max and min area values
					// TO DO: update getstartupdata values so we don't have to hardcode the values below
					minAreaMatch = testIfGreater(0.4, xmlArea);
					maxBoardArea = testIfLess(10, xmlArea);
					// ignore the following match values
					lngSideMatch = true;
					srtSideMatch = true;
				}
				// Otherwise ignore the following
				maxAreaMatch = true;
				maxAreaMatch = true;

			}
			
			// StandardPlus & ProductionPlus Testing
			if( service == 'StandardPlus (No Mask)' || service == 'ProductionPlus'){
				
				// These services have a maximum size of 12” x 14”
				// Convert 12x14 to an area value (168)
				// TO DO: update getstartupdata to avoid hardcoding this value
				mfgMaxBoardArea = 168;
				maxAreaMatch = testIfLess(mfgMaxBoardArea, xmlArea);
				
				// And a minimum dimension of 0.35”
				srtSideMatch = testIfGreater(mfgMinSideLength, xmlMinSide);

				// Otherwise set all other match values to True (we are ignoring them)
				lngSideMatch = true;
				maxBoardArea = true;
				minSideMatch = true;
			}
			
			
			
			if ( 	
					lngSideMatch == true && 
					srtSideMatch == true && 
					minAreaMatch == true && 
					maxAreaMatch == true && 
					minSideMatch == true && 
					maxBoardArea == true
				)
			{
				array[a] = serviceIdArray[i];
				a++;
			}		
		}
		return array;
	}

	function silkSolderLoop(serviceIdArray, xmlFile, mfgData){
		
		// Get silk/solder values from xml file
		var ssArr = silkSolderArray(xmlFile);
		// console.log(ssArr);
		var array = [];
		var a = 0;

		
		//IF all silk solder values are false
		if ( isClassic(xmlFile) 	== false && 
				ssArr.TopSilk		== 0 &&
				ssArr.BottomSilk 	== 0 &&
				ssArr.TopSolder 	== 0 &&
				ssArr.BottomSolder 	== 0
			) 
		{
			//Loop through service IDs
			for (var i=serviceIdArray.length-1; i>=0; i--) {
				// If service is (No Mask)
				var service = returnData(mfgData, 'Service', serviceIdArray[i]);
				
				if (service == "StandardPlus (No Mask)" || service == "Standard MiniBoardPlus (No Mask)") {
					// add (or keep) this in the service ID array
					array[a] = serviceIdArray[i];
					a++;
				} else {
					// Otherwise remove this option from service ID array
					serviceIdArray.splice(i, 1); 
				}
			}
		} else {
			array = serviceIdArray;
		}
		// console.log(array);
		return array;
	}

	function plusSilkSolderCheck (mfg, xml){
		if ( xml == 0 && mfg == 1 ) {
			return false;
		} else {
			return true;
		}
	}

	function silkSolderArray(xmlFile){
    	var silkSolderArray = [];
	    	silkSolderArray.TopSilk = boolEnumerated(xmlFile.OrderDetails.HasTopSilkscreen);
			silkSolderArray.BottomSilk = boolEnumerated(xmlFile.OrderDetails.HasBottomSilkscreen);
			silkSolderArray.TopSolder = boolEnumerated(xmlFile.OrderDetails.HasTopSolderMask);
			silkSolderArray.BottomSolder = boolEnumerated(xmlFile.OrderDetails.HasBottomSolderMask);
			// console.log(silkSolderArray);
		return silkSolderArray;
    }

	function returnData(mfgData, term, id) {
  		for (var i=mfgData.length-1; i>=0; i--) {
  			if (id == mfgData[i].ServiceConfigId){
  				return mfgData[i][term];
  			}
  		}
	}

	function testIfLess(a, b){
    	if (a !== 0){
    		if (b <= a){
    			return true;
	    	} else {
	    		return false;
	    	}
    	} else {
    		return true;
    	}	
    }

	function testIfGreater(a,b){
    	if (a !== 0){
    		if(b >= a){
    			return true;
    		} else {
    			return false;
    		}
    	} else {
    		return true;
    	}
    }

    function boolEnumerated(bool){
    	if( bool == false || bool == 'false' || bool =='False' ){
    		return 0;
    	}
    	if( bool == true || bool == 'true' || bool =='True' ){
    		return 1;
    	}
    }

    function boolVerbose(bool){
    	if ( bool == 0 ){
    		return false;
    	}
    	if ( bool == 1 ){
    		return true;
    	}
    }

    function isClassic(xmlFile) {
		if(xmlFile.OrderDetails.OrderTypeFlag == 'EPCBP' || xmlFile.OrderDetails.OrderNumber == null) {
			// console.log('isClassic = false');
			return false;
		} else {
			// console.log('isClassic = true');
			return true;
		}
	}

	function removeEmpty(a) {
		a.filter(function(e){return e;});
	}

	function specValueSet(xmlFile){
    	$('#standard-outline .spec-value').text(xmlFile.OrderDetails.IsStandardOutline);
		$('#layer-count .spec-value').text(xmlFile.OrderDetails.BoardPropCopperLayers);
		$('#board-width .spec-value').text(xmlFile.OrderDetails.MaxDim);
		$('#board-height .spec-value').text(xmlFile.OrderDetails.MinDim);
		$('#number-of-holes .spec-value').text(xmlFile.OrderDetails.TotalNumberHoles);

		if (isClassic(xmlFile) != true){
			var partNumber = xmlFile.OrderDetails.PartNumber;
			$('#board-specs').prepend('<li id="part-number"><span class="spec-title">Part Number</span><span class="spec-value">' + partNumber + '</span></li>');
			$('#top-solder-mask .spec-value').text(xmlFile.OrderDetails.HasTopSolderMask);
			$('#bottom-solder-mask .spec-value').text(xmlFile.OrderDetails.HasBottomSolderMask);
			$('#top-silk-screen .spec-value').text(xmlFile.OrderDetails.HasTopSilkscreen);
			$('#bottom-silk-screen .spec-value').text(xmlFile.OrderDetails.HasBottomSilkscreen);
		} else {
			var orderNumber = xmlFile.OrderDetails.OrderNumber;
			$('#board-specs').prepend('<li id="order-number"><span class="spec-title">Order Number</span><span class="spec-value">' + orderNumber + '</span></li>');
			$('#top-solder-mask .spec-value').text('True');
			$('#bottom-solder-mask .spec-value').text('True');
			$('#top-silk-screen .spec-value').text('True');
			$('#bottom-silk-screen .spec-value').text('False');
		}
    }

    function duplicateXMLVals(xmlFile){
    	$('.layer-count input')
			.val(xmlFile.OrderDetails.LayerCount);

		$('.has-top-silk-screen input')
			.val(xmlFile.OrderDetails.HasTopSilkscreen);

		$('.has-bottom-silk-screen input')
			.val(xmlFile.OrderDetails.HasBottomSilkscreen);

		$('.number-of-holes input')
			.val(xmlFile.OrderDetails.TotalNumberHoles);

		$('.board-width input')
			.val(xmlFile.OrderDetails.MaxDim);

		$('.board-height input')
			.val(xmlFile.OrderDetails.MinDim);

		$('.is-standard-outline input')
			.val(xmlFile.OrderDetails.IsStandardOutline);

		$('.has-top-solder-mask input')
			.val(xmlFile.OrderDetails.HasTopSolderMask);

		$('.has-bottom-solder-mask input')
			.val(xmlFile.OrderDetails.HasBottomSolderMask);

		$('.is-board-askew')
			.val(xmlFile.OrderDetails.IsBoardAskew);

		$('.part-number input')
			.val(xmlFile.OrderDetails.PartNumber);

		$('.revision input')
			.val(xmlFile.OrderDetails.Revision);

		$('.number-of-board-edge-elements')
			.val(xmlFile.OrderDetails.NumberOfBoardEdgeElements);

		$('.order-number')
			.val(xmlFile.OrderDetails.OrderNumber);	
    }

    function silkSolderServiceOptions(xmlFile, mfgData, radioVal){
    
    	if (radioVal == 'Standard MiniBoardPlus (No Mask)' || radioVal == 'StandardPlus (No Mask)'){
    		changeSpecInput('top-silk-screen', false);
    		changeSpecInput('bottom-silk-screen', false);
    		changeSpecInput('top-solder-mask', 'False');
    		changeSpecInput('bottom-solder-mask', 'False');
    	} else {
    		if (isClassic(xmlFile) == true){

    			changeSpecInput('top-silk-screen', 'True');
    			changeSpecInput('bottom-silk-screen', 'False');
    			changeSpecInput('top-solder-mask', 'True');
    			changeSpecInput('bottom-solder-mask', 'True');
    		} else {
    			// console.log('silkSolderServiceOptions Classic is true!');
    			changeSpecInput('top-silk-screen', xmlFile.OrderDetails.HasTopSilkscreen);
    			changeSpecInput('bottom-silk-screen', xmlFile.OrderDetails.HasBottomSilkscreen);
    			changeSpecInput('top-solder-mask', xmlFile.OrderDetails.HasTopSolderMask);
    			changeSpecInput('bottom-solder-mask', xmlFile.OrderDetails.HasBottomSolderMask);
    		}
    	}
    }

    function changeSpecInput(el, bool){
    	var text = '.has-' + el + ' input';
    	var valu = '#' + el + ' .spec-value';
    	$(text).val(ucfirst(bool, true));
    	$(valu).text(bool);
    }

    function ucfirst(str,force){
		str=force ? str.toString().toLowerCase() : str;
		return str.replace(/(\b)([a-zA-Z])/,
		       function(firstLetter){
		          return   firstLetter.toUpperCase();
		       });
    }

    function setQuantityMinMax(mfgData, layerCount, radioVal){
		var leadTime = $('#input_1_4').val();
		// console.log('setQuantityMinMax leadTime  = ' + leadTime);

    	if (typeof radioVal !== 'undefined'){
			var minQuantity = [];
			var maxQuantity = [];
			
			for (var i=mfgData.length-1; i>=0; i--) {
			    tmpService = mfgData[i].Service;
			    tmpLayers = mfgData[i].Layers;
			    tmpLeadTime = mfgData[i].Lead_Time;
			    tmpMin = mfgData[i].Minimum_Qty;
			    tempMax = mfgData[i].Maximum_Qty;
			    
			    if (tmpService == radioVal && tmpLayers == layerCount){
			    	// TO DO: This needs to be refactored
			    	if (leadTime > 0  && tmpLeadTime == leadTime){
						minQuantity[i] = tmpMin;
			    		maxQuantity[i] = tempMax;
					}
					
					if (leadTime < 1){
						minQuantity[i] = tmpMin;
			    		maxQuantity[i] = tempMax;
					}
				}
			}

		    //find min/max quanty values in array
			var min = minQuantity.filter(function(e){return e;});
			var max = maxQuantity.filter(function(e){return e;});

			min = Math.min.apply(Math, min);
			max = Math.max.apply(Math, max);

			$('#input_1_3').attr({"data-min": min, "data-max": max});
		}
	}

	function checkQuantity(quantityField, quantity){
		$(quantityField).css('border-color' , '#f0f0f0');
		$('#input_1_3 + .error').remove();
		if(quantity > 0){
			var quantityMin = parseFloat($(quantityField).attr('data-min')),
				quantityMax = parseFloat($(quantityField).attr('data-max'));
			if(quantity < quantityMin || quantity > quantityMax) {
				$(quantityField).css('border-color' , '#f00');
				var quantityMessage = 'between ' + quantityMin + ' and ' + quantityMax;
				if (quantityMin == quantityMax) {
					quantityMessage = quantityMax;
				}
				$(quantityField).after('<div class="error">Error! Quantity must be ' + quantityMessage +  '</div>');
				disableSubmit();
			}
		}
		// console.log('checkQuantity done!');
	}

	function setLeadTime(mfgData, layerCount, radioVal, quantity){
		var leadTimes = [];
		for (var i=mfgData.length-1; i>=0; i--) {
		    tmpService = mfgData[i].Service;
		    tmpLayers = mfgData[i].Layers;
		    tmpMin = mfgData[i].Minimum_Qty;
		    tempMax = mfgData[i].Maximum_Qty;
		    tempLead = mfgData[i].Lead_Time;
		    if (tmpService == radioVal && tmpLayers == layerCount){		
		    	
		    	leadTimes[i] = tempLead;

		    }
		}
		
		leadTimes = leadTimes.filter(function(e){return e;});
		
		var leadField = $('#input_1_4');
		var leadValue = $(leadField).val();
		
		$(leadField).empty().append('<option value=0></option>');

		$.each(leadTimes, function(index, value) {
			$('<option id="lead-time-' + value + '" value=' + value + '>' + value + ' Day</option>').appendTo(leadField); 
		});

		//re-select previously chosen leadTime value to the closest value
		// define the lead value to select - it may not be available though...
		var goal = leadValue;
		var closest = null;

		// ...so we'll test for the closest value to select just in case
		$.each(leadTimes, function(){
		  if (closest == null || Math.abs(this - goal) < Math.abs(closest - goal)) {
		    closest = this;
		  }
		});

		// the ID to select will be defined as either the previously selected value or the closest approximate
		var leadTimeID = '';
		if (leadValue > 0){
			if (leadValue != closest) {
				leadTimeID = '#lead-time-' + closest;
			} else {
				leadTimeID = '#lead-time-' + leadValue;
			}
			$(leadTimeID).attr('selected', 'selected');
		}	
	}

	function checkLeadTime(mfgData, layerCount, radioVal, leadTimeField, leadValue, quantityField, quantity) {
		
		if (leadValue < 1) {
			console.log('leadValue is less than 1');
		    return;
		} else {

			var minQuantity = [],
				maxQuantity = [],
				leadTimes = [];

			for (var i=mfgData.length-1; i>=0; i--) {
			    tmpService = mfgData[i].Service;
			    tmpLayers = mfgData[i].Layers;
			    tmpMin = mfgData[i].Minimum_Qty;
			    tempMax = mfgData[i].Maximum_Qty;
			    tempLead = mfgData[i].Lead_Time;
			    
			    if (tmpService == radioVal && tmpLayers == layerCount && leadValue > 0 &&tempLead == leadValue){		
					minQuantity[i] = tmpMin;
					maxQuantity[i] = tempMax;
					leadTimes[i] = tempLead;
			    }
			}

			var min = minQuantity.filter(function(e){return e;}),
				max = maxQuantity.filter(function(e){return e;}),
				leadTimes = leadTimes.filter(function(e){return e;});
			
			//to do fix this so it never reports infinity
			min = Math.min.apply(Math, min);
			max = Math.max.apply(Math, max);
			
			$('#input_1_3').attr({"data-min": min, "data-max": max});
			// console.log('checkLeadTime: ' + radioVal);
			
			// set min max values
			setQuantityMinMax(mfgData, layerCount, radioVal)
			// check min max values for errors
			checkQuantity(quantityField, quantity);
		}
		
	}

	function elecTestHandler(){
		var isChecked = document.getElementById('choice_1_8_1').checked;
		if (isChecked){
			$('#electrical-test .spec-value').text("True");
			return true;
		} else {
			$('#electrical-test .spec-value').text("False");
			return false;
		}
	}

	function priceCalculator(
		radioVal,
		quantity, 
		leadValue, 
		elecTestValue, 
		layerCount, 
		minDim, 
		maxDim, 
		boardArea
	){	
		if (quantity == null || quantity == 0 || leadValue == null || leadValue == 0){
			disableSubmit();
			$('.loading-animation').remove();
			return;
		} else {
			// Fixes issue where lead time value was not updating correctly
			leadValue = $('#input_1_4').val();

			var referring_page = window.location.href;
			var quoteValues = {};

			quoteValues['referring_page'] = referring_page;
			quoteValues['service'] = radioVal;
			quoteValues['leadTime'] = leadValue;
			quoteValues['layerCount'] = layerCount;
			quoteValues['quantity'] = quantity;
			quoteValues['boardArea'] = boardArea;
			quoteValues['boardShortSide'] = minDim;
			quoteValues['boardLongSide'] = maxDim;
			quoteValues['electricTest'] = elecTestValue;
			quoteValues['PromoCode'] = "";
			quoteValues['EMailAddress']  = "";
			quoteValues['ShippingServiceDescription'] = "";
			quoteValues['ShippingCity'] = "";
			quoteValues['ShippingZip'] = "";
			quoteValues['ShippingState'] = "";
			quoteValues['ShippingCountry'] = "";
			quoteValues['ShippingAddressLine1'] = "";
			quoteValues['ShippingAddressLine2'] = "";

			var query = $(quoteValues).serializeArray();
				query = JSON.stringify(quoteValues);
				//query = query.replace(/"(\w+)"\s*:/g, '$1:');
			console.log(query);
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
                    processPrice(response, quantity);
            	},
            	error: function (response) {
					console.log('An error occurred: ' + response);
	            }
            });
		}
		
	}

	function processPrice (response, quantity){

		var json = JSON.parse(response),
			pcbPrice = json.CustomerCost,
			eTest = json.ETestCostCustomer,
			total = pcbPrice + eTest,
			quantityInput = document.getElementById('input_1_3'),
			quantOk = quantCheck(quantityInput);

		if (json.hasErrors == false && quantOk == true){

			$('#pcbs .quote-value').text('$' + pcbPrice.toFixed(2));

			if(eTest > 0){
				$('#e-test .quote-value').text('$' + eTest.toFixed(2));
			} else {
				$('#e-test .quote-value').text('$0.00');
			}
			
			$('#total .quote-value, .ginput_total').text('$' + total.toFixed(2));

			$('.loading-animation').remove();

			$('.ginput_total_1').text('$' + total.toFixed(2));
			$('#input_1_36, #input_1_15').val(total);
			if (document.body.classList.contains('pcb-order-form')){
				document.querySelector("button.single_add_to_cart_button").removeAttribute("disabled");
			}
		} else {
			clearQuote();
		}
	}

	function quantCheck(quantityInput){
		var quantity = parseInt(quantityInput.value),
			maxQuant = parseInt(quantityInput.getAttribute('data-max')),
			minQuant = parseInt(quantityInput.getAttribute('data-min'));

		if( 	
				quantity >= minQuant 
			&& 	quantity <= maxQuant 
		)
		{
			// console.log('SUCCESS \n quantity ' + quantity + '\n min ' + minQuant + '\n' + 'max ' + maxQuant);
			return true;
		} else {
			// console.log('FAIL \n quantity ' + quantity + '\n min ' + minQuant + '\n' + 'max ' + maxQuant);
			return false;
			
		}
	}

	function quoteLoading(){
		$('.loading-animation').remove();
		$('#quote-specs').prepend('<div class="loading-animation"><div class="pre-loader"></div></div>');
	}

	function disableSubmit(){
		document.querySelector("button.single_add_to_cart_button").disabled = true;
	}
	
	function clearQuote(){
		disableSubmit();
		document.getElementById("choice_1_8_1").checked = false;
		elecTestHandler();
		$('#pcbs, #e-test, #total').each(function(){
			$(this).find('.quote-value').text('$0.00');
		});
		$('.loading-animation').remove();
	}

	// Restricts input for the given textbox to the given inputFilter.
	function setInputFilter(textbox, inputFilter) {
	  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
	    textbox.oldValue = "";
	    textbox.addEventListener(event, function() {
	      if (inputFilter(this.value)) {
	        this.oldValue = this.value;
	        this.oldSelectionStart = this.selectionStart;
	        this.oldSelectionEnd = this.selectionEnd;
	      } else if (this.hasOwnProperty("oldValue")) {
	        this.value = this.oldValue;
	        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
	      }
	    });
	  });
	}

	// Restrict input to digits and '.' by using a regular expression filter.
	setInputFilter(document.getElementById("input_1_3"), function(value) {
	  return /^\d*\.?\d*$/.test(value);
	});


	// 

})( jQuery );
</script>