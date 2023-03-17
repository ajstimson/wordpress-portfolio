;(function ($) {
	$(window).load(function () {
		//cache quote value so it can be accessed across files
		window.quote = {}

		/*

            ===========  *  FUNCTIONS  *  ===========

        */

		quantityHandler()

		quoteElems()

		var url = getParams(window.location.href)

		if (url.itemID != undefined) {
			setTimeout(calculateQuote, 3000)
		}

		/*

            ===========  *  ACTIONS  *  ===========

        */
		//If quantity is changed, mirror quantity in form field and calculate quote
		$(document).on("change keyup", "#footer-quantity", function () {
			quantityHandler()
		})

		// cases for calculating quotes
		// if any trigger-quote element changes
		$(document).on("change", ".trigger-quote", function () {
			calculateQuote()
		})

		// if vision panels are cleared
		$(document).on("click", "#clear-button button", function () {
			calculateQuote()
		})

		// if gate width, height, pocket depth, or quantity are keyed
		$(document).on(
			"keyup",
			"#input_2_13, #input_2_14, #input_2_26, #input_2_24",
			function () {
				calculateQuote()
			}
		)

		// end cases
	})

	function quantityHandler() {
		var formQuantity = $("#input_2_24"),
			footerQuanti = $("#footer-quantity")

		$(formQuantity).val(footerQuanti.val())

		if (footerQuanti.val() > 0) {
			$(footerQuanti).parent().css("border-color", "#e2701e")
		}

		calculateQuote()
	}

	function quoteElems() {
		//all elements that need to trigger a quote calculation
		var country = $("#input_2_59"),
			state = $("#input_2_66"),
			zone = $("#input_2_91 input"),
			width = $("#input_2_13"),
			pocketWidth = $("#input_2_26"),
			height = $("#input_2_14"),
			heightOptions = $("#input_2_16"),
			doubleEndGate = $("#input_2_46 input"),
			jambOrientation = $("#input_2_48"),
			panelSwatches = $('#panels-items-right input[type="radio"]'),
			numberOfPanels = $("#input_2_35"),
			panelPosition = $("#input_2_37"),
			visionToggle = $('#input_2_132 input[type="radio"]'),
			visionMaterial = $("#input_2_133"),
			panelFinish = $("#input_2_89"),
			frameSwatches = $('#frames-items-right input[type="radio"]'),
			quantity = $("#input_2_24"),
			rushShipping = $("#choice_2_39_1")

		$(country).addClass("trigger-quote")
		$(state).addClass("trigger-quote")
		$(zone).addClass("trigger-quote")
		$(width).addClass("trigger-quote")
		$(pocketWidth).addClass("trigger-quote")
		$(height).addClass("trigger-quote")
		$(heightOptions).addClass("trigger-quote")
		$(doubleEndGate).addClass("trigger-quote")
		$(jambOrientation).addClass("trigger-quote")
		$(panelSwatches).addClass("trigger-quote")
		$(numberOfPanels).addClass("trigger-quote")
		$(panelPosition).addClass("trigger-quote")
		$(visionToggle).addClass("trigger-quote")
		$(visionMaterial).addClass("trigger-quote")
		$(panelFinish).addClass("trigger-quote")
		$(frameSwatches).addClass("trigger-quote")
		$(quantity).addClass("trigger-quote")
		$(rushShipping).addClass("trigger-quote")
	}

	function calculateQuote() {
		calcLoader()
		setTimeout(calc, 300)
	}

	function calc() {
		// console.log(getFuncName());

		/* 

            Create arrays for configuration factors and prices

        */
		var factor = factorArray()

		var price = priceArray(factor.height)

		/* 
            TODO: DELETE BELOW
            Add $2 per panel if height exceeds 80

        */

		// if (factor.height > 80) {
		//     factor.baseQuote = factor.panelCount * price.exceeds8;
		// }

		/* 

            VISION PANEL CALCULATIONS

        */
		if (factor.visionPanelSelect === true) {
			var visionPrices

			if (factor.visionMaterial.match("Acrylic") !== null) {
				visionPrices = price.acrylic
			}

			if (factor.visionMaterial.match("Perforated") !== null) {
				visionPrices = price.alumifoldPerforated
			}

			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.visionPanelCount,
				visionPrices
			)

			//finally make sure to subtract vision panel count from total panel count
			factor.panelCount = factor.panelCount - factor.visionPanelCount
		}

		/* 

            NON-VISION PANEL CALCULATIONS

        */

		if (factor.acrylic === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.acrylic
			)
		}

		if (factor.birchOak === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.birchOak
			)
		}

		if (factor.alderMapleMahogany === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.alderMapleMahogany
			)
		}

		if (factor.cherryWalnut === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.cherryWalnut
			)
		}

		if (
			factor.vinylWoodgrain === true ||
			factor.vinylSolid === true ||
			factor.mdfNoFinish === true
		) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.vinylWoodgrain
			)
		}

		if (factor.alumifoldSolid === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.alumifoldSolid
			)
		}

		if (factor.perforated === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.alumifoldPerforated
			)
		}

		if (factor.fireCore === true) {
			factor.baseQuote = panelCalc(
				factor.baseQuote,
				factor.zone,
				factor.panelCount,
				price.fireCore
			)
		}

		/* 

            ADDITIONAL FACTORS
            *special flinish
            *double gate
            *rush
            *gold material upcharge
            *powder coating charge

        */

		//Check finish
		if (factor.finish === "Special Finish") {
			factor.baseQuote = factor.baseQuote + price.finish
		}

		//Check if gold is used in frame or panels
		if (factor.goldUpcharge === true) {
			factor.baseQuote =
				factor.baseQuote + factor.baseQuote * price.goldUpcharge
		}

		//Check if frame item with powder coating was selected
		if (factor.powderCoatCharge === true) {
			factor.baseQuote = factor.baseQuote + price.powderCoated
		}

		//Check if double gate selected
		if (factor.doubleGateCharge === true) {
			factor.baseQuote = factor.baseQuote + price.doubleGateCharge
		}

		//Check rush status
		// TODO: add check for special finish (rush is not available in such cases)

		//Get quantity

		if (factor.quantity > 0) {
			factor.baseQuote = factor.baseQuote * factor.quantity
		} else {
			factor.baseQuote = 0
		}

		if (factor.rush.is(":checked")) {
			factor.baseQuote = factor.baseQuote + price.rush
		}

		// if quote process is not complete, reset to 0
		if (isNaN(parseFloat(factor.baseQuote))) {
			factor.baseQuote = 0
		}

		//override quote value is Custom panel is selected
		if ($("#choice_2_134_0").is(":checked")) {
			factor.baseQuote = 0
		}

		FormData.quote = factor.baseQuote

		updateQuoteFields(factor.baseQuote)

		// console.log(factor.baseQuote);
	}

	function isChecked(el, arr, vision = false) {
		var inputs = $(el),
			checkd = false

		//Handles hardwood groupings
		if (arr !== undefined && arr.length > 1) {
			for (var i = 0; i < arr.length; i++) {
				$(inputs).each(function () {
					var value = $(this).val()

					if ($(this).is(":checked") && value === arr[i]) {
						checkd = true
					}
				})
			}
		}

		//if vision is selected check that all other vision panel fields are selected
		if (vision === true) {
			var numberPanels = $("#input_2_35").val(),
				visionPosition = $("#input_2_37").val()
			visionMaterial = $("#input_2_133").val()

			if (
				numberPanels !== "false" &&
				visionPosition !== "false" &&
				visionMaterial !== "false"
			) {
				checkd = true
			}
		}

		if (arr === undefined && vision !== true) {
			$(inputs).each(function () {
				if ($(this).is(":checked")) {
					checkd = true
				}
			})
		}

		return checkd
	}

	function factorArray() {
		var factor = {}

		factor.zone = parseInt($("#input_2_91 input:checked").val(), 10)
		factor.height = parseFloat($("#input_2_14").val())
		factor.panelCount = parseInt($("#dim-3 span").text(), 10)
		factor.finish = $("#field_2_89 input:checked").val()
		factor.rush = $("#choice_2_39_1")
		factor.quantity = $("#footer-quantity").val()

		//isChecked parameters are field, array (in the case of hardwood groupings), & vision
		factor.acrylic = isChecked("#field_2_27 input")
		factor.perforated = isChecked("#field_2_131 input")
		factor.birchOakArr = ["Birch", "Oak", "Red Oak"]
		factor.birchOak = isChecked("#field_2_28 input", factor.birchOakArr)
		factor.alderMapleMahoganyArr = ["Alder", "Maple", "Mahogany"]
		factor.alderMapleMahogany = isChecked(
			"#field_2_28 input",
			factor.alderMapleMahoganyArr
		)
		factor.cherryWalnutArr = ["Cherry", "Walnut"]
		factor.cherryWalnut = isChecked("#field_2_28 input", factor.cherryWalnutArr)
		factor.mdfNoFinish = isChecked("#choice_2_28_6")
		factor.vinylWoodgrain = isChecked("#field_2_92 input")
		factor.vinylSolid = isChecked("#field_2_101 input")
		factor.alumifoldSolid = isChecked("#field_2_29 input")
		factor.fireCore = isChecked("#field_2_102 input")
		factor.goldUpcharge = isItem("gold")
		factor.doubleGateCharge = isChecked("#field_2_46 input#choice_2_46_0")
		factor.powderCoatCharge = isItem("powder")
		factor.visionPanelSelect = isChecked(
			"#input_2_132 input#choice_2_132_0",
			undefined,
			true
		)
		factor.visionPanelCount = parseFloat($("#input_2_35").val())
		factor.visionMaterial = $("#input_2_133").val()
		factor.baseQuote = 0

		// console.table(factor)
		return factor
	}

	function priceArray(height) {
		var price = {}

		price.acrylic = processPrices($("#input_2_125"), "array")
		price.birchOak = processPrices($("#input_2_121"), "array")
		price.alderMapleMahogany = processPrices($("#input_2_127"), "array")
		price.cherryWalnut = processPrices($("#input_2_126"), "array")
		price.vinylWoodgrain = processPrices($("#input_2_122"), "array")
		price.alumifoldSolid = processPrices($("#input_2_123"), "array")
		price.alumifoldPerforated = processPrices($("#input_2_124"), "array")
		price.fireCore = processPrices($("#input_2_120"), "array")

		//If heigt exceeds 8' update price
		if (height > 80) {
			price.birchOak = processPrices($("#input_2_143"), "array")
			price.alderMapleMahogany = processPrices($("#input_2_144"), "array")
			price.cherryWalnut = processPrices($("#input_2_145"), "array")
			price.acrylic = processPrices($("#input_2_146"), "array")
			price.alumifoldPerforated = processPrices($("#input_2_147"), "array")
			price.alumifoldSolid = processPrices($("#input_2_148"), "array")
			price.vinylWoodgrain = processPrices($("#input_2_149"), "array")
			price.fireCore = processPrices($("#input_2_150"), "array")
		}

		price.finish = processPrices($("#input_2_119"), "single")
		price.goldUpcharge = processPrices($("#input_2_129"), "single")
		price.doubleGateCharge = processPrices($("#input_2_128"), "single")
		price.rush = processPrices($("#input_2_130"), "single")
		// price.exceeds8 = processPrices($('#input_2_116'), 'single');
		price.powderCoated = processPrices($("#input_2_135"), "single")

		return price
	}

	function processPrices(el, type) {
		var values

		if (el === undefined) {
			console.error("Could not find price data")
			if (type === "array") {
				value = [0, 0, 0]
			} else {
				value = 0
			}
		}

		if (type === "array") {
			values = el[0].value.replace(" ", "").split(",")

			for (var i = 0; i < values.length; i++) {
				values[i] = +values[i]
			}
		} else {
			values = parseFloat(el[0].value)
		}

		return values
	}

	// function isGold(){
	//     var gold = $('input[value*="gold" i]');
	//     var isGold = false;
	//     $(gold).each(function(){
	//         var status = isChecked(this);
	//         if (status === true){
	//             isGold = status;
	//             return false;
	//         }
	//     });

	//     return isGold;
	// }

	function isItem(term) {
		var item = $('input[value*="' + term + '" i]'),
			isItem = false

		$(item).each(function () {
			var status = isChecked(this)
			if (status === true) {
				isItem = status
				return false
			}
		})

		return isItem
	}

	function panelCalc(baseQuote, zone, count, price) {
		var quote
		//Zone 1 is OR,CA,WA
		//Zone 2 is all other US States NOT HI or AK
		//Zone 3 is International, HI and AK
		if (zone === 1) {
			quote = price[1] * count
		}
		if (zone === 2) {
			quote = price[2] * count
		}
		if (zone === 3) {
			quote = price[0] * count
		}

		quote = quote + baseQuote

		return quote
	}

	function updateQuoteFields(baseQuote) {
		var footerQuote = $("#text-4 .textwidget"),
			formQuote = $(".quote-feature"),
			quote = baseQuote.toFixed(2),
			quoteAmount = "$" + quote

		$(footerQuote).html(quoteAmount)
		$(formQuote).val(quoteAmount)
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

	function calcLoader() {
		$("#text-4 .textwidget").html(
			'<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
		)
	}

	function getFuncName() {
		return getFuncName.caller.name
	}
})(jQuery)
