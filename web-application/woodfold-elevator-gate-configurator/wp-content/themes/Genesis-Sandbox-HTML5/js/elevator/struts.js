;(function ($) {
	$(window).load(function () {
		window.localStorage.setItem("guest", JSON.stringify(guestStatus()))

		//Resets scroll positions for elements that have exceeded height limitations
		window.scrollTo(0, 0)

		$("html,body").css("overflow", "hidden")

		var login = $("#loginform")

		if (login.length === 0) {
			var form = $("#gform_fields_2"),
				footerLi = document.querySelectorAll("#menu-elevator-footer li")

			console.log("ELEVATOR APP VERSION 1.0")

			//place loader
			loader(form)

			// creates config body
			entrySections(form)

			// create wraps for all entry sections
			wrapSections()

			//place each wrap section within main-display or options-sidebar
			designateSections()

			//Creates links to reveal entry content based on class
			setFooterClass(footerLi)

			//Get active menu item
			getActive(footerLi)

			//Get active section content
			getActiveSection(footerLi)

			//Set Height Options Metadata
			heightOptionsData()

			//Set increment for certain inputs
			setIncrements()

			//Set dynamic note for jamb away/forward message under Gate Width
			setJambNote()

			//Create quantity field
			quantityField()

			//Set review id
			reviewSection()

			//all sections are rendered, now apply buttons
			directionalButtons()

			//set main content height
			setContentHeight()

			//set main content height
			setTooltips()

			//move calculations
			setCalcSection()

			//set class for elements to show Calc section
			setCalcSectionClasses()

			//reset element scroll positions
			resetMainOptionScrollPositions()

			//Make directional buttons and radio label buttons focusable
			makeFocusable()

			document.addEventListener(
				"click",
				function (event) {
					// If the clicked element doesn't have the right selector, bail
					if (!event.target.matches("#menu-elevator-footer a")) return

					// Don't follow the link
					event.preventDefault()

					var clicked = event.target.parentNode

					toggleStatus(clicked)
				},
				false
			)

			$(document).on("click", ".directional-buttons .reform", function () {
				toggleStatus(this.dataset.direction)
			})

			window.onresize = function () {
				setContentHeight()
			}

			if (window.localStorage.guest === "true") {
				kickTheStruts()
				var dimensions = document.querySelector("#menu-item-1697 a")
				simulateClick(dimensions)
				setGuestRequired()
			}

			//finally reveal active content (this will need to be moved to the last js file to load)
			hideLoader()
		}
	})

	function guestStatus() {
		var target = document.getElementsByClassName("not-logged-in"),
			guest = false

		if (target.length > 0) {
			guest = true
		}

		return guest
	}

	var simulateClick = function (elem) {
		// Create our event (with options)
		var evt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
		})
		// If cancelled, don't dispatch our event
		var canceled = !elem.dispatchEvent(evt)
	}

	function setGuestRequired() {
		var fields = document.querySelectorAll(".guest-only")

		for (var [key, field] of Object.entries(fields)) {
			var label = field.getElementsByTagName("label"),
				span = document.createElement("span")
			span.classList = "required"
			span.innerHTML = "*"
			if (label[0] !== undefined) {
				label[0].appendChild(span)
			}
		}
	}

	function loader(form) {
		loader = '<div class="load-wrapper"><div class="loader"></div></div>'

		$(form).before(loader)
	}

	function entrySections(form) {
		var html =
			'<li id="main-display" class="entry-section flex-66">' +
			"</li>" +
			'<li id="options-sidebar" class="entry-section flex-33">' +
			"</li>"
		$(form).append(html)
	}

	function wrapSections() {
		var addressL = $(".address-item.left"),
			addressR = $(".address-item.right"),
			dimensionsL = $(".dimension-item.left"),
			dimensionsR = $(".dimension-item.right"),
			stack = $(".stack-item"),
			stackCollapse = $("#field_2_44, #field_2_43"),
			panel = $(".panel-item"),
			vision = $("#field_2_35, #field_2_37, #field_2_133"),
			frame = $(".frame-item"),
			reviewL = $("#field_2_72"),
			reviewR = $(".review-right, .gform_footer")

		$(addressL).wrapAll(
			'<ul id="address-items-left" class="review-active address-content flex-item" data-content="address"/>'
		)
		$(addressR).wrapAll(
			'<ul id="address-items-right" class="review-active address-content flex-item"  data-content="address" />'
		)
		$(dimensionsL).wrapAll(
			'<ul id="dimension-items-left" class="review-active dimensions-content flex-item" />'
		)
		$(dimensionsR).wrapAll(
			'<ul id="dimension-items-right" class="review-active dimensions-content flex-item input-v2"  data-content="dimensions"/>'
		)
		$(stack).wrapAll(
			'<ul id="stack-items-right" class="review-active stack-content flex-item input-v2"  data-content="stack"/>'
		)
		$(stackCollapse).wrapAll('<li id="stack-items-collapse" class="flex-row"/>')
		$(panel).wrapAll(
			'<ul id="panels-items-right" class="review-active panels-content flex-item input-v2"  data-content="panels"/>'
		)
		$(vision).wrapAll('<ul id="vision-selections" class="flex-item">')
		$(frame).wrapAll(
			'<ul id="frames-items-right" class="review-active frames-content flex-item input-v2"  data-content="frames"/>'
		)
		$(reviewL).wrap(
			'<ul id="review-items-left" class="review-active review-content flex-item" data-content="review" />'
		)
		$(reviewR).wrapAll(
			'<ul id="review-items-right" class="review-active review-content flex-item" data-content="review" />'
		)
	}

	function designateSections() {
		var destL = document.getElementById("main-display"),
			destR = document.getElementById("options-sidebar")

		//place address content
		placeInSection(destL, document.getElementById("address-items-left"))
		placeInSection(destR, document.getElementById("address-items-right"))

		//place dimensions content
		placeInSection(destL, document.getElementById("dimension-items-left"))
		placeInSection(destR, document.getElementById("dimension-items-right"))

		//place configurator content
		placeInSection(destL, document.getElementById("configurator"))
		document.getElementById("configurator").classList.add("review-active")

		//place stack content
		placeInSection(destR, document.getElementById("stack-items-right"))

		//place panel content
		placeInSection(destR, document.getElementById("panels-items-right"))

		//place frame content
		placeInSection(destR, document.getElementById("frames-items-right"))

		//place review content
		placeInSection(destL, document.getElementById("review-items-left"))
		placeInSection(destR, document.getElementById("review-items-right"))
	}

	function placeInSection(a, b) {
		a.appendChild(b)
	}

	function setFooterClass(li) {
		li.forEach(function (el) {
			var text = el.textContent,
				attr = text.toLowerCase()
			// el.setAttribute("class", attr + '-content');
			el.setAttribute("class", attr + "-content review-active")
		})
	}

	function getActive(li) {
		var queryString = window.location.search,
			urlParams = new URLSearchParams(queryString),
			activeMenu = urlParams.get("active")

		if (activeMenu === null) {
			//if there is no url parameter
			//set the first menu item as active
			li[0].classList.add("active")
		} else {
			//otherwise loop through and find matching class
			li.forEach(function (el, index, array) {
				if (el.classList.contains(activeMenu)) {
					el.classList.add("active")
				}
			})
		}
	}

	function getActiveSection(li) {
		var reveal,
			sections = document.querySelectorAll(".gform_body .entry-section > *")

		li.forEach(function (el) {
			if (el.classList.contains("active")) {
				reveal = el.classList[0]
			}
		})

		sections.forEach(function (el) {
			if (el.classList.contains(reveal)) {
				el.classList.add("active")
			}
		})
	}

	function reviewSection() {
		var target = $("#review-items-left"),
			save =
				'<p>&#8210; OR &#8210;</p><div id="form-save"><button>Save For Later</button></div>',
			submit = $(".gform_footer")

		if (window.localStorage.guest === "false") {
			$("#review-items-right").append(submit)

			$(submit).after(save)

			$(submit).show()

			$(".review.guest-only").remove()
		}

		if (window.localStorage.guest === "true") {
			$("#field_2_100").after(
				'<div id="request-quote"><button class="pre disabled">Submit Request</button></div>'
			)
		}
	}

	function heightOptionsData() {
		var option1 = $('#input_2_16 option[value=".3125"]'),
			option2 = $('#input_2_16 option[value=".4375"]'),
			option3 = $('#input_2_16 option[value=".8125"]')

		$(option1).attr("data-increase", 0.5)
		$(option2).attr("data-increase", 0.375)
		$(option3).attr("data-increase", 0)
	}

	function setIncrements() {
		$(".increment input").attr("type", "number")
		$(".increment input").attr("step", 0.125)
	}

	function setJambNote() {
		var target = $("#field_2_13 .ginput_container"),
			message =
				'<div id="width-jamb-status" class="instruction">Jamb Orientation: <span></span></div>'
		$(target).append(message)
	}

	function quantityField() {
		var target = $("#text-2 .textwidget"),
			field =
				'<input id="footer-quantity" type="number" class="check-limits trigger-quote">'

		$(target).html(field)

		$("#footer-quantity").val(0)
	}

	function setContentHeight() {
		var height = {}
		height.header = $("header").height()
		height.footer = $("footer").height()
		height.window = window.innerHeight
		height.content = height.window - (height.header + height.footer)

		var content = $(".entry-section")

		$(content).each(function () {
			$(content).height(height.content + "px")
		})
	}

	function setTooltips() {
		$(".footer-wrap").before(
			'<div id="required-po-tooltip" class="el-tooltip"><span>PO Number Required</span></div>'
		)
		$(".footer-wrap").before(
			'<div id="dimensions-tooltip" data="dimensions" class="el-tooltip dim-stack"><span> Error</span></div>'
		)
		$(".footer-wrap").before(
			'<div id="stack-tooltip" data="stack" class="el-tooltip dim-stack"><span>Error</span></div>'
		)
		$(".footer-wrap").before(
			'<div id="quantity-tooltip" data="quantity" class="el-tooltip"><span>Quantity Required</span></div>'
		)
		$(".footer-wrap").before(
			'<div id="vision-panel-number-tooltip" data="vision-panel" class="el-tooltip"><span>Select Number of Vision Panels</span></div>'
		)
	}

	function setCalcSection() {
		var target = $("#field_1_49")

		$(target).insertAfter("#address-items-left")
	}

	function setCalcSectionClasses() {
		var className = "show-calculations"

		$(
			"#menu-elevator-footer .dimensions-content, " +
				'div[data-direction="dimensions-content"], ' +
				"#menu-elevator-footer .stack-content, " +
				'div[data-direction="stack-content"], ' +
				"#menu-elevator-footer .panels-content, " +
				'div[data-direction="panels-content"], ' +
				"#menu-elevator-footer .frames-content," +
				'div[data-direction="frames-content"]'
		).addClass(className)
	}

	function resetMainOptionScrollPositions() {
		var targets = $("#main-display, #options-sidebar")

		//TODO: REMOVE THIS AFTER REMOVING ALL OTHER SCROLL TOP METHODS
		$(targets).each(function () {
			this.scrollTo(0, 0)
			// $(this).scrollTo(0,0);
		})
	}

	function hideLoader() {
		$(".load-wrapper").hide()
	}

	function toggleStatus(clicked) {
		var items = document.querySelectorAll(".review-active"),
			targetClass = clicked

		if (clicked.classList !== undefined) {
			emphasizeQuantityField(clicked)

			targetClass = clicked.classList[0]
		}

		items.forEach(function (el) {
			el.classList.remove("active")
		})

		items.forEach(function (el) {
			if (el.classList.contains(targetClass)) {
				el.classList.add("active")
			}
		})

		toggleSiblingActiveClass(items)
	}

	function emphasizeQuantityField(clicked) {
		var quantContainer = $("#text-2 .textwidget")
		var quantity = $("#footer-quantity").val()
		// console.log(clicked);
		if (clicked.classList.contains("review-content") === true && quantity < 1) {
			$(quantContainer).css("border-color", "#f00")
			$(quantContainer).addClass("pulse")
			setTimeout(function () {
				$(quantContainer).removeClass("pulse")
			}, 250)
		} else {
			$(quantContainer).css("border-color", "#e2701e")
		}
	}

	function toggleSiblingActiveClass(items) {
		items.forEach(function (el) {
			if (el.classList.contains("was-active")) {
				el.classList.remove("was-active")
			}
		})

		$("footer .review-active.active").prevAll().addClass("was-active")
	}

	function directionalButtons() {
		var sections = $("#options-sidebar > ul"),
			contentArr = contentArray(sections)

		$(sections).each(function (i) {
			var previous = contentArr[i - 1],
				next = contentArr[i + 1],
				svg =
					'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path d="M12.969 4.281l11 11 .688.719-.688.719-11 11-1.438-1.438L21.812 16 11.531 5.719z"></path></svg>'

			html = '<li class="directional-buttons gfield gfield_html" />'

			if (previous !== undefined) {
				html += '<div class="direction-wrap back">'
				html += '<div class="direction">Back:</div>'
				html +=
					'<div class="previous reform" data-direction ="' +
					previous +
					'-content">'
				html += svg + "<p>" + previous + "</p></div></div>"
			}

			if (next !== undefined) {
				html += '<div class="direction-wrap forward">'
				html += '<div class="direction">Next:</div>'
				html +=
					'<div class="next reform" data-direction="' + next + '-content">'
				html += "<p>" + next + "</p>" + svg + "</div></div>"
			}

			html += "</li>"

			$(this).append(html)
		})

		$(".previous path").css({ fill: "#333" })
		$(".next path").css({ fill: "#fff" })
	}

	function contentArray(s) {
		var array = []

		$(s).each(function () {
			array.push(this.getAttribute("data-content"))
		})

		return array
	}

	function kickTheStruts() {
		var address = {}
		address.left = document.getElementById("address-items-left")
		address.right = document.getElementById("address-items-right")
		address.footer = document.getElementById("menu-item-1696")

		for (var [key, item] of Object.entries(address)) {
			console.log
			if (item !== null) {
				item.remove()
			}
		}
	}

	function removeURLParameter(url, parameter) {
		//prefer to use l.search if you have a location/link object
		var urlparts = url.split("?")
		if (urlparts.length >= 2) {
			var prefix = encodeURIComponent(parameter) + "="
			var pars = urlparts[1].split(/[&;]/g)

			//reverse iteration as may be destructive
			for (var i = pars.length; i-- > 0; ) {
				//idiom for string.startsWith
				if (pars[i].lastIndexOf(prefix, 0) !== -1) {
					pars.splice(i, 1)
				}
			}

			return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "")
		}
		return url
	}

	function makeFocusable() {
		var next = document.querySelectorAll(".directional-buttons .next")
		for (var i = 0, len = next.length; i < len; i++) {
			next[i].setAttribute("tabindex", "0")
		}
	}
})(jQuery)
