window.formData = {}
;(function ($) {
	$(window).load(function () {
		var url = getParams(window.location.href)

		/*

             ===========  *  FUNCTIONS  *  ===========

         */

		initReview()

		//Uncomment function below to auto fill form for testing
		// fillForm();

		/*

            ===========  *  ACTIONS  *  ===========

        */

		$(document).on(
			"change focus keyup",
			"#gform_2 input, #gform_2 select, #input_2_100, #footer-quantity",
			function () {
				initReview()
			}
		)

		$(document).on(
			"click",
			"#request-quote button.pre:not(.disabled)",
			function () {
				removeExtraStuff()
				addGuestData()
				ajaxCall("request_quote_email")
			}
		)

		$(document).on(
			"click",
			"#generate-pdf, #request-quote button.post",
			function () {
				ajaxCall("guest_config_pdf")
			}
		)

		$(document).on("click", "#quote-modal .close", function () {
			$("#quote-modal").hide()
		})

		// if we have a url param, wait to init the review until the fields are auto filled
		if (url.itemID != null) {
			// Quote is the last field to update, so wait for it and then init review
			var quoteField = document.querySelector("#text-4 .textwidget")
			// setup a mutation observer to watch for changes to the quote field (which is actually a div)
			var observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					//remove dollar sign from value
					var quoteValue = parseFloat(
						mutation.target.innerHTML.replace("$", "")
					)
					if (quoteValue > 0) {
						initReview()
					}
				})
			})
			observer.observe(quoteField, {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true,
			})

			// console.log(quoteValue)

			// setTimeout(initReview, 3400)
		}
	})

	function fillForm() {
		var fields = ["#input_2_138", "#input_2_142", "#input_2_100"]

		for (var i = 0; i < fields.length; i++) {
			var el = $(fields[i])
			// var randoString = (Math.random() + 1).toString(36).substring(5);

			$(el).val("TEST DELETE")
		}

		$("#input_2_137").val("test@example.com")
		$("#input_2_139").val("5552225555")
	}

	function initReview() {
		//Set timeout to adjust for slow calculations
		setTimeout(reviewDataObj, 400)
	}

	function reviewDataObj() {
		var parameter = window.location.search

		if (localStorage.guest === false) {
			var values = valuesSet()
		}
		//IF we are editing an order and the quantity and quote are empty, keep refreshing the formData object
		if (parameter !== "" && values === false) {
			initReview()
		}
		var review = $("#gform_2 li.review:not(.guest-only)"),
			obj = {}

		$(review).each(function (index) {
			var label = formatObjNames($(this).children("label").text())
			var input = $(this).find("input, textarea,select")
			var type = input[0].type,
				value

			if (
				type === "text" ||
				type === "number" ||
				type === "email" ||
				type === "textarea"
			) {
				value = $(input).val().replace(/"/g, "")
			} else if (type === "select-one") {
				value = $(input).find("option:selected").val()
			} else if (type === "checkbox") {
				value = $(input).prop("checked")
			} else if (type === "radio") {
				value = radioReviewData(this)
			} else {
				console.error($(input).attr("name") + " has an invalid type!")
			}

			obj[label] = { type: type, value: value }
		})

		if (window.localStorage.guest === "false") {
			cullCustomerData(obj)
		}

		obj.custom.value[0].name = "Custom"

		obj = addStaticData(obj)

		setReviewHTML(obj)

		// empty global formData object
		formData.cache = {}
		// update global formData object
		formData.cache = obj
	}

	function radioReviewData(el) {
		var obj = {},
			inputs = $(el).find(".gfield_radio li")

		for (var i = 0; i < inputs.length; i++) {
			var itemName = inputs[i].children[1].textContent,
				input = inputs[i].children[0],
				status = $(input).is(":checked")

			obj[i] = { name: itemName, status: status }
		}

		return obj
	}

	$.fn.ignore = function (sel) {
		return this.clone()
			.find(sel || ">*")
			.remove()
			.end()
	}

	function formatObjNames(txt) {
		// TODO: THESE CAN BE COMBINED TO A SINGLE LINE
		// remove symbols and excess whitespace
		txt = txt.replace(/[^a-zA-Z0-9 ]/g, "").trim()
		// replace whitespace with underscore
		txt = txt.replace(/ /g, "_")
		// replace double quotes
		txt = txt.replace('"', "")
		// lowercase
		txt = txt.toLowerCase()

		return txt
	}

	function cullCustomerData(obj) {
		if (obj.ship_to_a_different_address.value === false) {
			obj.ship_to_state.value = ""
			obj.ship_to_country.value = ""
		}
	}

	function addStaticData(obj) {
		var calculations = $("#gform_2 div#field_1_49"),
			fullWidth = $(calculations).find("#dim-1"),
			fullTitle = formatObjNames($(fullWidth).ignore("span").text()),
			numGates = $(calculations).find("#dim-3"),
			numTitle = formatObjNames($(numGates).ignore("span").text()),
			stackCollapse = $("#stackCollapsedSize").text().replace('"', ""),
			stackTitle = formatObjNames($(".stack-collapse-text-left").text()),
			wallToLead = $("#wallToLeadPostClearance").text().replace('"', ""),
			wallToLeadTitle = formatObjNames($(".stack-collapse-text-right").text()),
			// doorHeight = $('#cab-height span').text(),
			doorHeight = $("#input_2_14").val(),
			// doorHeightTitle = formatObjNames($('#cab-height').ignore("span").text()),
			doorHeightTitle = $("#field_2_14 label").text(),
			quote = FormData.quote,
			note = $("#input_2_100").val(),
			quantity = $("#footer-quantity").val()

		obj[fullTitle] = {
			value: $(fullTitle).find("span").text(),
		}

		obj[numTitle] = {
			value: formatObjNames($(numGates).find("span").text()),
		}

		obj[stackTitle] = {
			value: stackCollapse,
		}

		obj[wallToLeadTitle] = {
			value: wallToLead,
		}

		obj[doorHeightTitle] = {
			value: doorHeight,
		}

		obj["order_notes"] = {
			value: note,
		}

		obj["quote"] = {
			value: quote,
		}

		obj.quantity = {
			value: quantity,
			type: "number",
		}

		return obj
	}

	function setReviewHTML(obj) {
		var target = $("#review-content"),
			config = reviewConfigHTML(obj)

		$(target).empty()
		if (window.localStorage.guest === "false") {
			var address = reviewAddressHTML(obj)

			$(target).append(address).append(config)
		} else {
			$(target).append(config)
		}
	}

	function reviewAddressHTML(obj) {
		var html

		html =
			'<ul class="your-address">' +
			"<li><strong>Your Info</strong></li>" +
			"<li>" +
			obj.company.value +
			"</li>" +
			"<li>" +
			obj.first_name.value +
			" " +
			obj.last_name.value +
			"</li>" +
			"<li>" +
			obj.phone.value +
			" " +
			obj.ext.value +
			"</li>" +
			"<li>" +
			obj.email.value +
			"</li>" +
			"<li>" +
			obj.street_address.value +
			"</li>" +
			"<li>" +
			obj.street_address_2.value +
			"</li>" +
			"<li>" +
			obj.city.value +
			", " +
			obj.state.value +
			" " +
			obj.country.value +
			"</li>"

		if (
			obj.customer_company.value.length > 0 ||
			obj.customer_first_name.value.length > 0 ||
			obj.customer_last_name.value.length > 0
		) {
			html +=
				'<ul class="customer-address">' +
				"<li><strong>Customer Address</strong></li>" +
				"<li>" +
				obj.customer_company.value +
				"</li>" +
				"<li>" +
				obj.customer_first_name.value +
				" " +
				obj.customer_last_name.value +
				"</li>" +
				"<li>" +
				obj.customer_po_number.value +
				"</li>" +
				"<li>" +
				obj.customer_phone.value +
				" " +
				obj.extension.value +
				"</li>" +
				"<li>" +
				obj.ship_to_address.value +
				"</li>" +
				"<li>" +
				obj.apartment_suite_unit_etc.value +
				"</li>" +
				"<li>" +
				obj.ship_to_city.value +
				", " +
				obj.state__province__region.value +
				" " +
				obj.ship_to_state.value +
				" " +
				obj.ship_to_region.value +
				" " +
				obj.ship_to_province.value +
				" " +
				obj.ship_to_country.value +
				"</li>" +
				"<li>" +
				obj.zip__postal_code.value +
				"</li>" +
				"</ul>"
		}
		html +=
			"</ul>" +
			'<ul class="order-details">' +
			"<li><strong>Order Details</strong></li>" +
			"<li>P.O. Number: " +
			obj.po_number.value +
			"</li>" +
			"<li>Sidemark: " +
			obj.sidemark.value +
			"</li>" +
			"<li>Pricing Zone: " +
			obj.shipping.value +
			"</li>" +
			"</ul>"

		return html
	}

	function reviewConfigHTML(obj) {
		var html = '<ul class="config-details">'
		html += "<li><strong>Gate Configuration Details</strong></li>"

		var quote = "$" + obj.quote.value.toFixed(2)

		if ($("#choice_2_134_0").is(":checked")) {
			quote =
				"Woodfold will contact you with a quote after completing this order"
		}

		if (obj.vision_panel_position.value !== "false") {
			obj.vision_panel_position.value = $("#input_2_37 option:checked").text()
		}

		html += configDataList(
			"Cab Width",
			obj.gate_width.type,
			obj.gate_width.value
		)

		html += configDataList(
			"Number of Gate Panels",
			"text",
			obj.number_of_gate_panels.value
		)

		html += configRadioItem("Double Ended Gate", obj.double_ended_gate.value)

		html += configRadioItem("Stack Direction", obj.stack_direction.value)

		html += configDataList(
			"Pocket Depth",
			obj.pocket_depth.type,
			obj.pocket_depth.value
		)

		html += configRadioItem(
			"Jamb Orientation",
			obj.change_jamb_orientation.value
		)

		html += configDataList(
			"Full Opening Width",
			"text",
			obj.full_opening_width.value
		)

		html += configDataList(
			"Stack Collapsed Size",
			"text",
			obj.stack_collapsed_size.value
		)

		html += configDataList(
			"Wall to Lead Post Clearance",
			"text",
			obj.wall_to_lead_post_clearance.value
		)

		html += configDataList("Height", obj.cab_height.type, obj.cab_height.value)

		html += configDataList(
			"Height Option",
			obj.height_options.type,
			obj.height_options.value
		)

		html += configRadioItem(
			"Vision Panel Choice",
			obj.include_vision_panels.value
		)

		html += configDataList(
			"Number of Vision Panels",
			obj.number_of_vision_panels.type,
			obj.number_of_vision_panels.value
		)

		html += configDataList(
			"Vision Panel Location",
			obj.vision_panel_position.type,
			obj.vision_panel_position.value
		)

		html += configDataList(
			"Vision Panel Material",
			obj.vision_panel_material.type,
			obj.vision_panel_material.value
		)

		var panelArr = []
		panelArr["_"] = obj.acrylic.value
		panelArr["Alumifold"] = obj.alumifold_perforated.value
		panelArr["Natural Hardwood Veneers"] = obj.natural_hardwood_veneers.value
		panelArr["Vinyl Laminate Woodgrains"] = obj.vinyl_laminate_woodgrains.value
		panelArr["Vinyl Laminate Solid"] =
			obj.vinyl_laminate_solid_colors__textures.value
		panelArr["Alumifold Solid"] = obj.alumifold_solid.value
		panelArr["Fire Core"] = obj.fire_core.value
		panelArr["__"] = obj.custom.value

		html += panelSelection("Panel Selection", panelArr)

		html += configRadioItem("Panel Finish", obj.finish.value)

		html += configDataList(
			"Special Finish Color Info",
			obj.enter_type_of_color.type,
			obj.enter_type_of_color.value
		)

		html += configRadioItem(
			"Lead Post and Panel Connector Choice",
			obj.lead_post__connector.value
		)

		html += configRadioItem("Track Choice", obj.track.value)

		html += configRadioItem("Hinge Hardware", obj.hinge_hardware.value)

		html += configRadioItem("Side Channels", obj.side_channels.value)

		html += configRadioItem("Closure Option", obj.closure_options.value)

		//only show the following items if user logged in
		if (window.guest === false) {
			html += configDataList("Quantity", obj.quantity.type, obj.quantity.value)

			html += configDataList(
				"Rush Order",
				obj.rush_shipping.type,
				obj.rush_shipping.value
			)

			html += configDataList("Price", "text", quote)
		}

		html += "</ul>"

		html = html.replace("undefined", "")

		return html
	}

	function configDataList(str, type, value) {
		var html = "<li>"

		if (
			type === "text" ||
			type === "number" ||
			type === "email" ||
			type === "textarea"
		) {
			if (value === "" || value === "0") {
				return " "
			} else {
				html += str + ": " + value
			}
		}

		if (type === "select-one") {
			if (value === "AA" || value === "false" || value === "") {
				return " "
			} else {
				html += str + ": " + value
			}
		}

		html += "</li>"

		return html
	}

	function configRadioItem(str, obj) {
		var html = ""

		for (var i in obj) {
			if (obj[i].status === true) {
				html += "<li>" + str + ": " + obj[i].name + "</li>"

				return html
			}
		}

		// return nothing if all options are false
		return html
	}

	function panelSelection(str, array) {
		array = prependCategoryNames(array)

		var html

		for (var i in array) {
			html += configRadioItem(str, array[i]).replace(/_ /g, "")
		}

		return html
	}

	function prependCategoryNames(array) {
		for (var i in array) {
			var category = i

			var data = array[i]
			for (var e in data) {
				category = category.replace("_", "")
				data[e].name = category + " " + data[e].name
				data[e].name = data[e].name.trimStart()
			}
		}
		return array
	}

	function removeExtraStuff() {
		delete formData.cache.shipping
		delete formData.cache.quantity
		delete formData.cache.quote
	}

	function addGuestData() {
		var targets = $(".guest-only input"),
			guestData = {}

		$(targets).each(function () {
			var label = $(this).parent().parent().find("label").text().slice(0, -1)
			var val = $(this).val()

			guestData[label] = val
		})

		formData.cache["guest"] = guestData
	}

	function ajaxCall(action) {
		var data = window.formData.cache
		$.ajax({
			type: "POST",
			url: local.ajax_url,
			data: {
				action: action,
				data: data,
			},
			success: function (response) {
				if (response.success !== true) {
					console.error(response)
					alert("An error occurred. Please try submitting your request again.")
				}

				if (action === "request_quote_email" && response.success === true) {
					$("#request-quote button")
						.removeClass("pre")
						.addClass("post")
						.text("Download PDF")
					$("#request-quote button").after(
						'<button class="reload" onClick="window.location.reload();">Create New Quote</button>'
					)
					quotePDFModal()
				}

				if (action === "guest_config_pdf" && response.success === true) {
					generateQuotePDF(JSON.parse(response.data))
				}
			},
		})
	}

	function quotePDFModal() {
		//reset modal
		$("#quote-modal").remove()

		//build HTML
		var modalHTML =
			'<div class="modal" id="quote-modal" tabindex="-1" role="dialog" aria-labelledby="quote-modalLabel" style="padding-right: 15px; display: block;">'
		modalHTML += '<div class="modal-dialog" role="document">'
		modalHTML += '<div class="modal-content">'
		modalHTML += '<div class="modal-header">'
		modalHTML +=
			'<h5 class="modal-title" id="quote-modalLabel">Quote Request</h5>'
		modalHTML +=
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
		modalHTML += '<span aria-hidden="true">×</span>'
		modalHTML += "</button>"
		modalHTML += "</div>" // end modal header
		modalHTML += '<div class="modal-body">'
		modalHTML +=
			"<p>Your request has been recieved. You will be contacted shortly</p>"
		modalHTML += '<p><button id="generate-pdf">Download PDF</button></p>'
		modalHTML += "</div>" // end modal body
		modalHTML += "</div>" // end modal content
		modalHTML += "</div>" // end modal dialog
		modalHTML += "</div>" // end modal

		//add to document and show
		$("body").append(modalHTML)
		$("#quote-modal").addClass("show")
	}

	function generateQuotePDF(quoteData) {
		var guestData = formData.cache["guest"]
		var pdf = new jsPDF()

		pdf.setProperties({
			title: "Gate: Series 1600",
			author: "Woodfold",
		})

		var width = pdf.internal.pageSize.width
		var height = pdf.internal.pageSize.height
		var line = 5.2

		// Font sizes
		var font = {}
		font.large = 18.5
		font.medium = 16
		font.normal = 12
		font.small = 9

		// Document margins
		var margin = {}
		margin.top = height * 0.08
		margin.bottom = height - margin.top + 5
		margin.left = width * 0.1
		margin.right = width - margin.left

		var addressColumn1 = margin.left + 15
		var addressColumn2 = margin.right - 60

		var img = new Image()
		img.src = headerImageBase64()

		pdf.setFont("helvetica", "bold")
		pdf.addImage(img, "png", margin.left, margin.top - 12, 42, 15.3)

		pdf.setFontSize(font.large)
		pdf.text("Gate: Series 1600", addressColumn2 - 6, margin.top - 1.5)
		pdf.line(margin.left, margin.top + line, margin.right, margin.top + line)

		pdf.setFontSize(font.large)

		pdf.text("Quote Requested", 70, 45, {
			align: "center",
		})

		pdf.setFontSize(font.normal)

		var date = new Date()
		var usDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
		var finalPosition = 65

		pdf.text("Date Requested:\r\n ", addressColumn2, finalPosition)
		pdf.setFont("helvetica", "normal")
		pdf.text(usDate, addressColumn2, 70.75, {
			align: "right",
		})

		pdf.setFont("helvetica", "bold")
		pdf.text("Contact Details:", addressColumn1, finalPosition)

		var i = 0
		pdf.setFont("helvetica", "normal")
		for (var key in guestData) {
			var top = 70.75

			if (i > 0) {
				adj = i * line
				top = top + adj
			}

			if (guestData.hasOwnProperty(key)) {
				pdf.text(guestData[key], addressColumn1, top)
			}

			finalPosition = top

			i++
		}

		pdf.setFont("helvetica", "bold")
		pdf.setFontSize(font.medium)
		pdf.text("Configuration Details", margin.left, finalPosition + line * 3)

		finalPosition = finalPosition + line * 3.15

		pdf.setFont("helvetica", "normal")
		pdf.setFontSize(font.normal)

		//Configuration Table
		var config_columns = ["Feature", "Value"]
		var config_data = quoteData
		var config_rows = []

		for (var key in config_data) {
			var temp = [key, config_data[key]]
			config_rows.push(temp)
		}

		pdf.autoTable(config_columns, config_rows, {
			startY: finalPosition + line,
			margin: {
				left: margin.left,
				top: 0,
			},
			styles: {
				cellPadding: 10,
				columnWidth: 85,
				font: "helvetica",
				lineWidth: 1,
				overflow: "linebreak",
				rowHeight: 8,
				valign: "middle",
			},
			headerStyles: {
				fillColor: [226, 112, 30],
				textColor: [255, 255, 255],
			},
		})

		//console.log('finalposition AFTER table', finalPosition);

		pdf.line(
			margin.left,
			margin.bottom - 10,
			margin.right + 2,
			margin.bottom - 10
		)
		pdf.setFontSize(font.small)

		var footerDate =
			date.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			}) +
			" " +
			usDate +
			" (" +
			Intl.DateTimeFormat().resolvedOptions().timeZone +
			")"

		pdf.setFontType("bold")
		pdf.text("Quote Generated: ", margin.left, margin.bottom)
		pdf.setFontType("normal")
		pdf.text(footerDate, margin.left + 33, margin.bottom)

		pdf.setFontType("bold")
		pdf.text("Call Woodfold: ", margin.right - 50, margin.bottom)

		pdf.setTextColor(226, 112, 30)
		pdf.text("503.357.7181", margin.right - 22, margin.bottom)
		pdf.save("series-1600-quote-" + usDate + "_" + date.getTime() + ".pdf")
	}

	function valuesSet() {
		var isReady = false
		if (!formData.cache) {
			return isReady
		}
		if (formData.cache.quantity.value === "0") {
			return isReady
		}
		if (formData.cache.quote.value < 1) {
			return isReady
		}

		return true
	}

	function getFuncName() {
		return getFuncName.caller.name
	}

	function headerImageBase64() {
		return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABmCAYAAAAQ0Y6JAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABCFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjVEMjA4OTI0OTNCRkRCMTE5MTRBODU5MEQzMTUwOEM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhEQUU1NEUxREQxQTExRTY5RDZGRTBEM0UxQTAyODVFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhEQUU1NEUwREQxQTExRTY5RDZGRTBEM0UxQTAyODVFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MGUyNGU3NTgtMjY5Mi00ZjU2LThkZjItM2YwYjdiNTk5NTAyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpk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"
	}

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
})(jQuery)
