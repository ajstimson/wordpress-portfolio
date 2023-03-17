;(function ($) {
	var url = getParams(window.location.href)
	var request = new Object()

	$(window).load(function () {
		/*

            ===========  *  FUNCTIONS  *  ===========

        */

		// sets the cab height on the dimensions option page
		setDoorCabHeight()

		if (url.itemID != null) {
			// get cart item details from the db &
			// reset the cart item meta on this page
			// fill in relevant data
			getCartItem()

			localStorage.setItem("form-data", "cart-item")
		} else {
			setDefaultState()

			localStorage.setItem("form-data", "default")
		}

		/*

            ===========  *  ACTIONS  *  ===========

        */

		// track previous selections
		var previous

		$("input")
			.on("focus", function () {
				// Store the current value on focus and on change
				previous = this
			})
			.change(function () {
				// Make sure the previous value is updated
				previous = this
			})

		$("label").on("click", function (e) {
			if (this.classList.contains("disabled")) {
				e.preventDefault
				return false
			}
		})

		// when clicking a panel or frame option render gate config image
		$(document).on(
			"change",
			".panel-item .gfield_radio li:not(.no-gate-render) input, .frame-item .gfield_radio input, #vision-selections select",
			function (e) {
				var el = this.closest("li.swatch")

				if (el !== null) {
					var targetClass = "frame-default",
						defaultFrame = el.classList.contains(targetClass)
				} else {
					defaultFrame = false
				}

				renderGate(this, defaultFrame)
			}
		)

		$(".panel-item.gate-render input").click(function () {
			//Disable finish options depending on item clicked
			var a = $(this)

			toggleFinishOptions(a)
		})

		// If country is changed...
		$("#input_2_59").change(function () {})

		// If shipping location is changed re-select shipping zone
		$(document).on(
			"change",
			".address-item.select select, #field_2_56 input",
			function () {
				selectZoneState(getShipToData())
			}
		)

		// When changing Cab Height
		$("#input_2_14").change(function () {
			adjustDoorCabHeight()
		})

		//When selecting Height Option
		$("#input_2_16").change(function () {
			adjustDoorCabHeight()
		})
	})

	function getParams(url) {
		var params = {}
		var parser = document.createElement("a")
		parser.href = url
		var query = parser.search.substring(1)
		var vars = query.split("&")
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=")
			params[pair[0]] = decodeURIComponent(pair[1])
		}
		return params
	}

	function setDefaultState() {
		selectZoneState(defaultAddressData())

		setQuantity()

		setStackState()

		setPanelState()

		renderGate()
	}

	function defaultAddressData() {
		var arr = []
		arr.country = $("#input_2_84").val()
		arr.state = $("#input_2_82").val()

		return arr
	}

	function selectZoneState(arr) {
		var state = arr.state,
			country = arr.country,
			zone = $("#input_2_91"),
			zone1 = $("#choice_2_91_0"),
			zone2 = $("#choice_2_91_1"),
			zone3 = $("#choice_2_91_2")

		// first remove previous selection
		clearZone(zone)

		if (
			(country === "US" && state === "CA") ||
			state === "OR" ||
			state === "WA"
		) {
			zoneAction(zone1)
		} else if (
			country === "US" &&
			state !== "CA" &&
			state !== "OR" &&
			state !== "WA" &&
			state !== "HI" &&
			state !== "AK"
		) {
			zoneAction(zone2)
		} else if (country !== "US" || state === "HI" || state === "AK") {
			zoneAction(zone3)
		} else if (country === "US" && state === "AA") {
			clearZone(zone)
		}

		setConfigShipping()
	}

	function zoneAction(zoneX) {
		// enable all inputs
		$("#input_2_91 input").attr("disabled", false)

		// add class to parent for css highlighting
		$(zoneX).parent().addClass("selected")

		// select zone
		$(zoneX).prop("checked", true)

		// disable all other options to prevent user input
		$("#input_2_91 input:not(:checked)").attr("disabled", true)
		$("#input_2_91 input").addClass("rendered")
	}

	function clearZone(z) {
		$(z)
			.find("li")
			.each(function () {
				$(this).removeClass("selected")
				$(this).prop("checked", false)
			})
	}

	function setConfigShipping() {
		var zone = $("#field_2_91 li.selected input").val(),
			config = $("#input_2_38"),
			note = $(config).siblings()

		$(note).remove()

		config.val("Zone " + zone)

		if (zone === 1 || zone === 2) {
			config.after("<span>Shipping included (FOB Destination)</span>")
		}

		if (zone === 3) {
			config.after(
				"<span>Shipping NOT INCLUDED (FOB Origin—call for quote)</span>"
			)
		}

		// do not allow users to edit fields
		config[0].readOnly = true
	}

	function getShipToData() {
		var arr = []
		arr.country = $("#input_2_59").val()
		arr.state = $("#input_2_66").val()

		return arr
	}

	function setQuantity() {
		$("#input_2_24").val(0)
		$("#footer-quantity").val(0)
	}

	function setStackState() {
		var pocket = $("#input_2_26"),
			direct = $("#input_2_20"),
			double = $("#input_2_46"),
			jambOr = $("#input_2_48")

		$(pocket).val(0)
		$(direct).find('input[value="Left"]').attr("checked", "checked")
		$(double).find('input[value="No"]').attr("checked", "checked")
		$(jambOr).find('input[value="Away"]').attr("checked", "checked")
		$(jambOr).find('input[value="Forward"]').removeAttr("checked")
	}

	function setPanelState() {
		// first clear all previous swatch selections
		clearSwatches()

		// second clear all vision fields
		//clearVisionOptions();

		// third select default set
		selectDefaultSwatches()

		// fourth select default finish
		selectDefaultFinish()

		// fourth select default finish
		selectDefaultVisionInclude()

		// sixth select default closure
		selectDefaultClosure()
	}

	function clearSwatches() {
		var swatch = $(".swatch")

		$(swatch).each(function () {
			var items = $(this).find(".gfield_radio li").find("input")
			$(items).each(function () {
				$(this).prop("checked", false)
			})
		})
	}

	function selectDefaultSwatches() {
		// cherry panel
		$(".cherry.natural-hardwood-veneers input").prop("checked", true)

		// brown post
		$(".brown.lead-post-connector input").prop("checked", true)

		// bronze track
		$(".anodized-bronze.track input").prop("checked", true)

		// bronze hinge hardware
		$(".anodized-bronze.hinge-hardware input").prop("checked", true)

		// bronze side channel
		$(".anodized-bronze.side-channels input").prop("checked", true)
	}

	function selectDefaultFinish() {
		$('#panels-items-right input[value="Clear Finish"]').prop("checked", true)
	}

	function selectDefaultVisionInclude() {
		$("#choice_2_132_1").prop("checked", true)
	}

	function selectDefaultClosure() {
		$(
			'#frames-items-right input[value="Single Magnetic Catch (Standard)"]'
		).prop("checked", true)
	}

	function revealNumberPositionOfPanels() {
		var num = $("#input_2_35")
		var sum = $(num).children("option:selected").val()
		var pos = $("#input_2_37")

		// toggle position field disable
		positionToggle(sum, pos)

		// toggle position options based on 'All'
		positionLimitAll(sum, pos)
	}

	function positionToggle(a, b) {
		if ($.isNumeric(a) || a === "All") {
			$(b).prop("disabled", false)
		} else {
			$(b).prop("selectedIndex", 0).prop("disabled", "disabled")
		}
	}

	function positionLimitAll(a, b) {
		if (a === "All") {
			$(b).val(false)
			$(b).find("option").hide()
		} else {
			$(b).find("option").show()
		}
	}

	function renderGate(el = null, defaultFrame = false) {
		gateLoader(1)

		if (defaultFrame === true) {
			setDefaultFrame(el)
		}

		var target = $("#gate-img"),
			vision = visionArray(),
			panel = $(
				"#panels-items-right li.gate-render .gfield_radio input:checked"
			),
			post = $(".lead-post-connector input:checked"),
			track = $(".track input:checked"),
			hinge = $(".hinge-hardware input:checked"),
			channel = $(".side-channels input:checked")
		;(gateImgArr = gateImgArray(panel, vision, post, track, hinge, channel)),
			(images = gateImagesBuilder(gateImgArr))

		gateAppend(images, target)

		setTimeout(function () {
			gateLoader(0)
		}, 1000)
	}

	function visionArray() {
		var arr = []
		arr.selected = $("#input_2_132 input:checked").val()
		arr.number = $("#input_2_35").val()
		arr.position = $("#input_2_37").val()
		arr.posSelect = $("#input_2_37 option:checked").text()
		arr.material = $("#input_2_133").val()

		return arr
	}

	function setDefaultFrame(el) {
		if (el === null) {
			var panelSelected = $(
				"#panels-items-right .gfield_radio li input:checked"
			)[0].value
		} else {
			panelSelected = el.value
		}
		clearFrameSelection()

		/* The Default Frame array covers the following panel selections:
                Bronze
                Cherry
                Mahogany
                Walnut
                Dark Oak
                Light Oak
                Perforated Bronze
                Teak
                Acrylic Bronze
                Acrylic Clear
                Acrylic Smoke
                ...and any other panel selection not defined below
            !! Frame Array order is Track, Hinge Hardware, Lead Post, Side Channels 
        */
		var frame_arr = [
			"Anodized Bronze",
			"Anodized Bronze",
			"Brown",
			"Anodized Bronze",
		]
		console.log(panelSelected)
		if (
			panelSelected === "Birch" ||
			panelSelected === "Maple" ||
			panelSelected === "Oak" ||
			panelSelected === "Natural Oak" ||
			panelSelected === "Rattan" ||
			panelSelected === "Tan" ||
			panelSelected === "MDF No Finish" ||
			panelSelected === "Tahiti"
		) {
			frame_arr = ["Anodized Bronze", "Anodized Bronze", "Sand", "Sand"]
		}

		if (
			panelSelected === "Chalk" ||
			panelSelected === "Salmon" ||
			panelSelected === "White" ||
			panelSelected === "Perforated White"
		) {
			frame_arr = ["Anodized Silver", "Anodized Silver", "White", "White"]
		}

		if (
			panelSelected === "Acrylic Clear" ||
			panelSelected === "Acrylic Smoke" ||
			panelSelected === "Perforated Silver" ||
			panelSelected === "Gray" ||
			panelSelected === "Clear"
		) {
			frame_arr = [
				"Anodized Silver",
				"Anodized Silver",
				"Gray",
				"Anodized Silver",
			]
		}

		if (panelSelected === "Black" || panelSelected === "Perforated Black") {
			frame_arr = ["Anodized Silver", "Anodized Silver", "Black", "Black"]
		}

		if (panelSelected === "Gold" || panelSelected === "Perforated Gold") {
			frame_arr = ["Anodized Gold", "Anodized Gold", "Gold", "Anodized Gold"]
		}

		frameSelections(frame_arr)
	}

	function frameSelections(selection) {
		$('.track input[value="' + selection[0] + '"]').prop("checked", true)
		$('.hinge-hardware input[value="' + selection[1] + '"]').prop(
			"checked",
			true
		),
			$('.lead-post-connector input[value="' + selection[2] + '"]').prop(
				"checked",
				true
			)
		$('.side-channels input[value="' + selection[3] + '"]').prop(
			"checked",
			true
		)
	}

	function clearFrameSelection() {
		$(".frame-item.swatch input").prop("checked", false)
	}

	function gateImgArray(panel, vision, post, track, hinge, channel) {
		var arr = []

		arr = panelImgArray(panel)

		if (vision.selected === "True") {
			arr1 = visionAdjust(arr, vision)
		}

		var arr2 = []
		arr2.push(frameImgData(channel))
		arr2.push(frameImgData(hinge))
		arr2.push(frameImgData(track))
		arr2.push(frameImgData(post))

		Array.prototype.push.apply(arr, arr2)

		// fix for lack of es6 support in IE 11
		var finalArr = [].concat.apply([], arr)
		// var finalArr = arr.flat();

		return finalArr
	}

	function panelImgArray(panel) {
		var arr = []

		if (panel.val() === "Acrylic Clear") {
			var blank = "&nbsp;"

			arr = [
				blank,
				blank,
				blank,
				blank,
				blank,
				blank,
				blank,
				blank,
				blank,
				blank,
			]
		} else {
			var id = $(panel).attr("id")

			var data = document.getElementById(id).dataset

			for (var i in data) {
				arr.push(data[i])
			}
		}

		return arr
	}

	function visionAdjust(solidPanels, visionPanels) {
		if (
			visionPanels.selected === "True" &&
			visionPanels.number > 0 &&
			visionPanels.position > 0 &&
			visionPanels.material.length > 0
		) {
			var start = parseInt(visionPanels.position),
				stop = start - parseInt(visionPanels.number)

			if (start === 3) {
				stop = parseInt(visionPanels.number) + start
			}

			var imagesToInsert = visionPanelImages(visionPanels, start, stop)

			for (var i = 0; i < imagesToInsert.length; i++) {
				if (imagesToInsert[i] !== undefined) {
					solidPanels[i] = imagesToInsert[i]
				}
			}
		}

		return solidPanels
	}

	function visionPanelImages(visionPanels, start, stop) {
		var array = [],
			positionIndex = 0,
			numberPanels = parseInt(visionPanels.number)

		//TODO Create check for if start === 6 and select option === Center ... start and stop need to be adjusted to start - x where x is number of panels to offset depending on number chosen

		if (visionPanels.posSelect === "Center" && numberPanels > 2) {
			// Adjust start/stop in cases where the number of panels is 3 or 4 and Center is chosen
			// number of panels - number of panels to center (vision panels) / 2 and truncate.
			var middle = Math.round(14 / numberPanels),
				diff = start - middle
			start = start + diff
			stop = stop + diff
		}

		// Create an array of 14 indexes, one for each possible panel position (including frame items)
		for (var i = 0; i < 14; i++) {
			// find the array positions between the start and stop values
			// will return false if position is smaller than start or greater than stop
			var sweetSpot = i.between(start, stop)

			if (sweetSpot === true) {
				var index, panelPosition

				if (start === 3) {
					// 3 is the "Right" panel position, in which case subtract 1 from the index to place vision panels in the right most spot in ascending order
					index = i - 1
					panelPosition = start + positionIndex
				} else {
					// otherwise, subtract the positionIndex from start
					index = i
					panelPosition = start - positionIndex
				}
				positionIndex++

				if (visionPanels.material === "Acrylic Clear") {
					array[index] = "&nbsp"
				} else {
					var image = $(
						'#panels-items-right input[value="' + visionPanels.material + '"]'
					).data("panel-position-" + panelPosition)

					array[index] = image
				}
			} else {
				array[i] = undefined
			}
		}

		return array
	}

	Number.prototype.between = function (a, b) {
		var min = Math.min.apply(Math, [a, b]),
			max = Math.max.apply(Math, [a, b])
		return this >= min && this < max
	}

	function frameImgData(a) {
		var data = $(a).attr("data-frame-item")
		return data
	}

	function gateImagesBuilder(arr) {
		html = ""
		for (var i = 0; i < arr.length; i++) {
			html += "<img "
			if (arr[i] && arr[i].match(/2021/)) {
				html += 'class="new-era-img" '
			}

			if (arr[i] === undefined) {
				html += 'id="config-img-' + i + '" src="&nbsp;"'
			} else {
				html += 'id="config-img-' + i + '" src="' + arr[i] + '"'
			}

			html += ">"
		}

		return html
	}

	function gateAppend(a, t) {
		// Using the DOMParser method rather than just replacing all the images helps avoid jumps or visual glitches
		var parsed = new DOMParser().parseFromString(a, "text/html")
		var newGate = parsed.getElementsByTagName("img")
		var oldGate = document
			.getElementById("gate-img")
			.getElementsByTagName("img")

		if (oldGate.length == 0) {
			// This is the first load, so just append images output
			$(t).append(a)
		} else {
			// loop through oldGate nodes
			var targetClass = "new-era-img"
			for (var i = 0; i < oldGate.length; i++) {
				// compare new and old image src attributes
				if (
					typeof newGate[i] !== "undefined" &&
					oldGate[i].src !== newGate[i].src
				) {
					//new class is needed if using newer images because of a slight resolution difference
					//TODO: find a way to hide the small jump in new images before the targetClass is added to apply a corrective
					if (
						newGate[i].classList.contains(targetClass) &&
						!oldGate[i].classList.contains(targetClass)
					) {
						document.getElementById(oldGate[i].id).classList.add(targetClass)
					}

					// if different, replace src attributes by id
					document.getElementById(oldGate[i].id).src = newGate[i].src

					if (
						!newGate[i].classList.contains(targetClass) &&
						oldGate[i].classList.contains(targetClass)
					) {
						document.getElementById(oldGate[i].id).classList.remove(targetClass)
					}
				}
			}
		}
	}

	function setDoorCabHeight() {
		var door = '<div id="door-height"><p><span></span>"</p></div>',
			cab = '<div id="cab-height"><p>Cab Height <span></span>"</p></div>',
			target = $("#dimension-items-left")

		$(target).append(door, cab)

		adjustDoorCabHeight()
	}

	function adjustDoorCabHeight() {
		var door = $("#door-height span"),
			cab = $("#cab-height span")

		// first clear existing values
		$(door).empty()
		$(cab).empty()

		var height = $("#input_2_14").val(),
			select = $("#input_2_16 option:selected").val(),
			final = parseFloat(height) - (parseFloat(select) + 1.0625)

		$(door).append(final)
		$(cab).append(height)
	}

	function toggleFinishOptions(panel) {
		var parent = $(panel).closest("li"),
			hardwoodVeneer = parent[0].classList.contains("natural-hardwood-veneers"),
			clearFinishOption = $('#field_2_89 input[value="Clear Finish"]'),
			clearFinishLabel = $(clearFinishOption).next("label"),
			unfinishedOption = $('#field_2_89 input[value="Unfinished"]'),
			unfinishedLabel = $(unfinishedOption).next("label"),
			specialFinishOption = $('#field_2_89 input[value="Special Finish"]'),
			specialFinishLabel = $(specialFinishOption).next("label")

		if (hardwoodVeneer === true || panel[0].value === "Custom") {
			finishToggle(specialFinishOption, specialFinishLabel, true)
			finishToggle(clearFinishOption, clearFinishLabel, true)
			finishToggle(unfinishedOption, unfinishedLabel, true)
		} else {
			finishToggle(specialFinishOption, specialFinishLabel, false)
			finishToggle(clearFinishOption, clearFinishLabel, false)
			finishToggle(unfinishedOption, unfinishedLabel, false)
		}

		if (panel[0].value === "Custom" || panel[0].value === "MDF No Finish") {
			toggleSpecialFinish()
		}
	}

	function finishToggle(option, label, state) {
		$(option).prop("checked", state)

		if (state === true) {
			$(label).removeClass("disabled")
			$(option).prop("disabled", false)
		} else {
			$(label).addClass("disabled")
			$(option).attr("disabled", true)
		}
	}

	function toggleSpecialFinish() {
		var sidebar = document.getElementById("options-sidebar")
		$("#label_2_89_2").click()
		$("#input_2_90").focus()
	}

	//AUTOFILL FUNCTIONS

	function getCartItem() {
		;(request.cartItem = url.itemID),
			(request.userID = $(".user_id").text()),
			(request.type = "single")

		request = JSON.stringify(request)

		ajaxCartItem(url.itemID)
	}

	function ajaxCartItem(order) {
		$.ajax({
			type: "POST",
			url: local.ajax_url,
			data: {
				action: "config_retrieval",
				data: order,
			},
			success: function (response) {
				if (response.success === false) {
					var redirect = window.location.host + window.location.pathname
					alert(response.data[0].message)
					window.location.href = redirect
				} else {
					var order = JSON.parse(response)
					if (order.status !== "3") {
						setDefaultState()
						localStorage.setItem("form-data", "default")
					} else {
						resetCartItemMeta(order.cart_item_id)
						autofill(order)
					}

					// empty global formData object
					// formData.cache = {};
				}
			},
			error: function (response) {
				console.error("AJAX ERROR!")
				console.error(response.responseText)
			},
		})
	}

	//TODO: WRITE FUNCTION TO REMOVE STATUS 3

	function resetCartItemMeta(itemID) {
		var target = document.head.querySelector("[property~=cart-item][content]")

		target.content = itemID
	}

	//TODO: this function would be much easier to manage if the input id was stored in json object
	//Then you could loop through
	function autofill(data) {
		// first clear all previous swatch selections
		clearSwatches()

		data = resetPanelNames(data)

		//QUANTITY
		inputFill("#footer-quantity", data.quantity.type, data.quantity.value)

		//ADDRESS
		inputFill("#input_2_2", data.po_number.type, data.po_number.value)
		inputFill("#input_2_3", data.sidemark.type, data.sidemark.value)

		if (data.ship_to_country.value.length > 0) {
			//select "Ship to different address"
			$("#input_2_74 input").click()

			inputFill(
				"#input_2_59",
				data.ship_to_country.type,
				data.ship_to_country.value
			)
			inputFill(
				"#input_2_9",
				data.customer_po_number.type,
				data.customer_po_number.value
			)
			inputFill(
				"#input_2_98",
				data.customer_sidemark.type,
				data.customer_sidemark.value
			)
			inputFill(
				"#input_2_63",
				data.customer_first_name.type,
				data.customer_first_name.value
			)
			inputFill(
				"#input_2_64",
				data.customer_last_name.type,
				data.customer_last_name.value
			)
			inputFill(
				"#input_2_87",
				data.customer_company.type,
				data.customer_company.value
			)
			inputFill(
				"#input_2_52",
				data.ship_to_address.type,
				data.ship_to_address.value
			)
			inputFill(
				"#input_2_53",
				data.apartment_suite_unit_etc.type,
				data.apartment_suite_unit_etc.value
			)
			inputFill("#input_2_54", data.ship_to_city.type, data.ship_to_city.value)
			inputFill(
				"#input_2_56",
				data.state__province__region.type,
				data.state__province__region.value
			)
			inputFill(
				"#input_2_66",
				data.ship_to_state.type,
				data.ship_to_state.value
			)
			inputFill(
				"#input_2_67",
				data.ship_to_region.type,
				data.ship_to_region.value
			)
			inputFill(
				"#input_2_68",
				data.ship_to_province.type,
				data.ship_to_province.value
			)
			inputFill(
				"#input_2_57",
				data.zip__postal_code.type,
				data.zip__postal_code.value
			)
			inputFill(
				"#input_2_85",
				data.customer_phone.type,
				data.customer_phone.value
			)
			inputFill("#input_2_86", data.extension.type, data.extension.value)

			//Switch Zone
			selectZoneState(getShipToData())
		} else {
			//Switch Zone
			selectZoneState(defaultAddressData())
		}

		inputFill(
			"#choice_2_39_1",
			data.rush_shipping.type,
			data.rush_shipping.value
		)

		//DIMENSIONS
		inputFill("#input_2_13", data.gate_width.type, data.gate_width.value)
		inputFill("#input_2_14", data.cab_height.type, data.cab_height.value)
		inputFill(
			"#input_2_16",
			data.height_options.type,
			data.height_options.value
		)
		$("#dim-1 span").text(data.gate_width.value + '"')
		$("#dim-3 span").text(parseFloat(data.number_of_gate_panels.value))

		//STACK
		inputFill(
			"#input_2_20",
			data.stack_direction.type,
			data.stack_direction.value
		)
		inputFill("#input_2_26", data.pocket_depth.type, data.pocket_depth.value)
		inputFill(
			"#input_2_46",
			data.double_ended_gate.type,
			data.double_ended_gate.value
		)
		inputFill(
			"#input_2_48",
			data.change_jamb_orientation.type,
			data.change_jamb_orientation.value
		)

		//PANELS
		inputFill("#input_2_27", data.acrylic.type, data.acrylic.value)
		inputFill(
			"#input_2_131",
			data.alumifold_perforated.type,
			data.alumifold_perforated.value
		)
		inputFill(
			"#input_2_29",
			data.alumifold_solid.type,
			data.alumifold_solid.value
		)
		inputFill(
			"#input_2_28",
			data.natural_hardwood_veneers.type,
			data.natural_hardwood_veneers.value
		)
		inputFill(
			"#input_2_92",
			data.vinyl_laminate_woodgrains.type,
			data.vinyl_laminate_woodgrains.value
		)
		inputFill(
			"#input_2_101",
			data.vinyl_laminate_solid_colors__textures.type,
			data.vinyl_laminate_solid_colors__textures.value
		)
		inputFill("#input_2_102", data.fire_core.type, data.fire_core.value)
		inputFill("#input_2_134", data.custom.type, data.custom.value)

		//CUSTOM FINISH SELECTIONS
		inputFill("#input_2_89", data.finish.type, data.finish.value)
		inputFill(
			"#input_2_90",
			data.enter_type_of_color.type,
			data.enter_type_of_color.value
		)

		//VISION PANEL SELECTIONS
		inputFill(
			"#input_2_132",
			data.include_vision_panels.type,
			data.include_vision_panels.value
		)
		inputFill(
			"#input_2_35",
			data.number_of_vision_panels.type,
			data.number_of_vision_panels.value
		)
		inputFill(
			"#input_2_37",
			data.vision_panel_position.type,
			data.vision_panel_position.value
		)
		inputFill(
			"#input_2_133",
			data.vision_panel_material.type,
			data.vision_panel_material.value
		)

		//FRAME
		inputFill(
			"#input_2_88",
			data.closure_options.type,
			data.closure_options.value
		)
		inputFill(
			"#input_2_31",
			data.lead_post__connector.type,
			data.lead_post__connector.value
		)
		inputFill("#input_2_32", data.track.type, data.track.value)
		inputFill(
			"#input_2_33",
			data.hinge_hardware.type,
			data.hinge_hardware.value
		)
		inputFill("#input_2_34", data.side_channels.type, data.side_channels.value)

		renderGate()
	}

	function resetPanelNames(data) {
		correctPanelName(data.alumifold_perforated.value)
		correctPanelName(data.alumifold_solid.value)
		correctPanelName(data.natural_hardwood_veneers.value)
		correctPanelName(data.vinyl_laminate_woodgrains.value)
		correctPanelName(data.vinyl_laminate_solid_colors__textures.value)
		correctPanelName(data.fire_core.value)
		correctPanelName(data.custom.value)

		return data
	}

	function correctPanelName(items) {
		for (var i = 0; i < items.length; i++) {
			var name = items[i].name
			if (name.indexOf("Perforated") !== -1) {
				items[i].name = name.split(" ").slice(1).join(" ")
			} else if (name.indexOf("Oak") !== -1) {
				items[i].name = name.split(" ").splice(-2).join(" ")
			} else if (name.indexOf("MDF") !== -1) {
				items[i].name = name.split(" ").splice(-3).join(" ")
			} else {
				items[i].name = name.split(" ").splice(-1).join()
			}
		}
		return items
	}

	function inputFill(target, type, value) {
		if (value !== undefined) {
			if (type === "radio") {
				Object.keys(value).forEach(function (key) {
					if (value[key].status === "true") {
						var selected = value[key].name,
							selector = target + ' input[value="' + selected + '"]'
						$(selector).prop("checked", true)
					}
				})
			}
			if (
				type === "number" ||
				type === "text" ||
				type === "email" ||
				type === "textarea"
			) {
				$(target).val(value)
			}
			if (type === "select-one") {
				var selector = target + ' option[value="' + value + '"]'
				$(selector).prop("selected", true)
			}
		} else {
			console.error([target, type, value])
		}
	}

	function findSelectedSwatch() {
		var subjects = $(
				"#input_2_28 input," +
					"#input_2_29 input," +
					"#input_2_92 input" +
					"#input_2_101 input" +
					"#input_2_101 input" +
					"#input_2_102 input"
			),
			selected

		$(subjects).each(function () {
			if (this.checked === true) {
				selected = this.id
			}
		})

		return selected
	}

	function gateLoader(state) {
		$("#gate-loader").remove()

		if (state === 1) {
			$("#gate-img")
				.prepend(
					'<div id="gate-loader" class="lds-ellipsis"><figure><div></div><div></div><div></div><div></div></figure></div>'
				)
				.fadeIn(100)
		}

		if (state === 0) {
			$("#gate-loader").fadeOut(100, function () {
				$("#gate-loader").remove()
			})
		}
	}

	function getFuncName() {
		return getFuncName.caller.name
	}

	//Keep this here to avoid missing addClass methods used above
	document.addEventListener("keydown", function (event) {
		var code = event.keyCode || event.which
		if (code == 13) {
			event.preventDefault()

			var active = document.activeElement,
				next = active.classList.contains("next")

			if (
				active &&
				active.tabIndex === 0 &&
				next === false &&
				active.href === undefined &&
				active.type !== "submit"
			) {
				var focussableElements =
					'div.next, a:not([disabled]), select:not([disabled]), button:not([disabled]), input:not([disabled]):not(.rendered),[tabindex]:not([disabled]):not([tabindex="-1"])'
				var focussable = Array.prototype.filter.call(
					document.activeElement.form.querySelectorAll(focussableElements),
					function (element) {
						//check for visibility while always include the current activeElement
						return (
							element.offsetWidth > 0 ||
							element.offsetHeight > 0 ||
							element === document.activeElement
						)
					}
				)
				var index = focussable.indexOf(active)
				if (index > -1) {
					var nextElement = focussable[index + 1] || focussable[0]
					nextElement.focus()
				}
			}

			if (next === true) {
				active.click()
				document
					.querySelector("#options-sidebar ul.active input:first-of-type")
					.focus()
			}

			if (active.tabIndex === -1) {
				document.querySelector("#options-sidebar ul.active .next").focus()
			}

			if (active.href !== undefined) {
				document
					.querySelector(
						"#options-sidebar ul.active input:not([type=radio]), #options-sidebar ul.active .next"
					)
					.focus()
			}

			if (active.type === "submit") {
				var message = "Are you sure you want to complete your order?"

				if (!confirm(message)) {
					active.blur()
					return false
				} else {
					active.click()
				}
			}
		}
	})
})(jQuery)
