;(function ($) {
	$(window).load(function () {
		/*

            ===========  *  FUNCTIONS  *  ===========

        */

		addressInit()

		/*

            ===========  *  ACTIONS  *  ===========

        */

		var inputs = $("#input_2_56, #input_2_66,#input_2_67,#input_2_68")
		var labels = $(
			"#field_2_66 > label,#field_2_67 > label,#field_2_68 > label"
		)

		document.addEventListener(
			"click",
			function (event) {
				if (!event.target.matches("#choice_2_74_1")) return

				$(event.target).closest(".address-column").toggleClass("alt-shipping")

				countrySelect(inputs, labels)
			},
			false
		)

		countrySelect(inputs, labels)
	})

	function addressInit() {
		columnWrap()

		fillAccountInfo()

		zoneFixes()
	}

	function columnWrap() {
		var left = $("#address-items-left > li:not(.customer)"),
			right = $("#address-items-left > li.customer")

		left.add(right).wrapAll('<ul class="address-columns" />')
		$(left).wrapAll('<li class="address-column" />')
		$(right).wrapAll('<li class="address-column" />')
	}

	function fillAccountInfo() {
		var data = $("#user-data"),
			arr

		if (data.length > 0) {
			arr = accountArr(data)

			$("#input_2_1").val(arr.user_company).addClass("rendered")
			$("#input_2_60").val(arr.user_first).addClass("rendered")
			$("#input_2_61").val(arr.user_last).addClass("rendered")
			//Allow email to be edited
			$("#input_2_6").val(arr.user_email)
			$("#input_2_76").val(arr.user_phone).addClass("rendered")
			$("#input_2_77").val(arr.user_extension).addClass("rendered")
			$("#input_2_79").val(arr.user_street_address).addClass("rendered")
			$("#input_2_80").val(arr.user_street_address_2).addClass("rendered")
			$("#input_2_81").val(arr.user_city).addClass("rendered")
			$("#input_2_82").val(arr.user_state).addClass("rendered")
			$("#input_2_83").val(arr.user_zip).addClass("rendered")
			$("#input_2_84")
				.val(arr.user_country === "United States" ? "US" : arr.user_country)
				.addClass("rendered")

			renderFocus()
		}
	}

	function accountArr(d) {
		var arr = []
		$(d)
			.find("li")
			.each(function () {
				var key = $(this).attr("class"),
					val = $(this).text()

				arr[key] = val
			})
		return arr
	}

	function renderFocus() {
		$(".rendered")
			.addClass("active-input has-val")
			.parent()
			.parent()
			.addClass("verified")

		$(".rendered").each(function () {
			$(this).attr("readonly", "readonly")
		})
		// document.querySelectorAll('.rendered').setAttribute('readonly', 'readonly');
	}

	function countrySelect(inputs, labels) {
		var select = $("#input_2_59"),
			country = countryList()

		inputs.add(labels).hide()

		selectLoop(select, country)

		$(select).val("US")

		setSubdivision(inputs, labels)
	}

	function countryList() {
		var arr = {
			US: "United States",
			USO: "United States Outlying Area",
			CA: "Canada",
			MX: "Mexico",
			XX: "-------------",
			AF: "Afghanistan",
			AL: "Albania",
			DZ: "Algeria",
			AS: "American Samoa",
			AD: "Andorra",
			AO: "Angola",
			AI: "Anguilla",
			AQ: "Antarctica",
			AG: "Antigua and Barbuda",
			AR: "Argentina",
			AM: "Armenia",
			AW: "Aruba",
			AU: "Australia",
			AT: "Austria",
			AZ: "Azerbaijan",
			BS: "Bahamas",
			BH: "Bahrain",
			BD: "Bangladesh",
			BB: "Barbados",
			BY: "Belarus",
			BE: "Belgium",
			BZ: "Belize",
			BJ: "Benin",
			BM: "Bermuda",
			BT: "Bhutan",
			BO: "Bolivia",
			BA: "Bosnia and Herzegovina",
			BW: "Botswana",
			BV: "Bouvet Island",
			BR: "Brazil",
			BQ: "British Antarctic Territory",
			IO: "British Indian Ocean Territory",
			VG: "British Virgin Islands",
			BN: "Brunei",
			BG: "Bulgaria",
			BF: "Burkina Faso",
			BI: "Burundi",
			KH: "Cambodia",
			CM: "Cameroon",
			CT: "Canton and Enderbury Islands",
			CV: "Cape Verde",
			KY: "Cayman Islands",
			CF: "Central African Republic",
			TD: "Chad",
			CL: "Chile",
			CN: "China",
			CX: "Christmas Island",
			CC: "Cocos [Keeling] Islands",
			CO: "Colombia",
			KM: "Comoros",
			CG: "Congo - Brazzaville",
			CD: "Congo - Kinshasa",
			CK: "Cook Islands",
			CR: "Costa Rica",
			HR: "Croatia",
			CU: "Cuba",
			CY: "Cyprus",
			CZ: "Czech Republic",
			CI: "Côte d’Ivoire",
			DK: "Denmark",
			DJ: "Djibouti",
			DM: "Dominica",
			DO: "Dominican Republic",
			NQ: "Dronning Maud Land",
			DD: "East Germany",
			EC: "Ecuador",
			EG: "Egypt",
			SV: "El Salvador",
			GQ: "Equatorial Guinea",
			ER: "Eritrea",
			EE: "Estonia",
			ET: "Ethiopia",
			FK: "Falkland Islands",
			FO: "Faroe Islands",
			FJ: "Fiji",
			FI: "Finland",
			FR: "France",
			GF: "French Guiana",
			PF: "French Polynesia",
			TF: "French Southern Territories",
			FQ: "French Southern and Antarctic Territories",
			GA: "Gabon",
			GM: "Gambia",
			GE: "Georgia",
			DE: "Germany",
			GH: "Ghana",
			GI: "Gibraltar",
			GR: "Greece",
			GL: "Greenland",
			GD: "Grenada",
			GP: "Guadeloupe",
			GU: "Guam",
			GT: "Guatemala",
			GG: "Guernsey",
			GN: "Guinea",
			GW: "Guinea-Bissau",
			GY: "Guyana",
			HT: "Haiti",
			HM: "Heard Island and McDonald Islands",
			HN: "Honduras",
			HK: "Hong Kong SAR China",
			HU: "Hungary",
			IS: "Iceland",
			IN: "India",
			ID: "Indonesia",
			IR: "Iran",
			IQ: "Iraq",
			IE: "Ireland",
			IM: "Isle of Man",
			IL: "Israel",
			IT: "Italy",
			JM: "Jamaica",
			JP: "Japan",
			JE: "Jersey",
			JT: "Johnston Island",
			JO: "Jordan",
			KZ: "Kazakhstan",
			KE: "Kenya",
			KI: "Kiribati",
			KW: "Kuwait",
			KG: "Kyrgyzstan",
			LA: "Laos",
			LV: "Latvia",
			LB: "Lebanon",
			LS: "Lesotho",
			LR: "Liberia",
			LY: "Libya",
			LI: "Liechtenstein",
			LT: "Lithuania",
			LU: "Luxembourg",
			MO: "Macau SAR China",
			MK: "Macedonia",
			MG: "Madagascar",
			MW: "Malawi",
			MY: "Malaysia",
			MV: "Maldives",
			ML: "Mali",
			MT: "Malta",
			MH: "Marshall Islands",
			MQ: "Martinique",
			MR: "Mauritania",
			MU: "Mauritius",
			YT: "Mayotte",
			FX: "Metropolitan France",
			FM: "Micronesia",
			MI: "Midway Islands",
			MD: "Moldova",
			MC: "Monaco",
			MN: "Mongolia",
			ME: "Montenegro",
			MS: "Montserrat",
			MA: "Morocco",
			MZ: "Mozambique",
			MM: "Myanmar [Burma]",
			NA: "Namibia",
			NR: "Nauru",
			NP: "Nepal",
			NL: "Netherlands",
			AN: "Netherlands Antilles",
			NT: "Neutral Zone",
			NC: "New Caledonia",
			NZ: "New Zealand",
			NI: "Nicaragua",
			NE: "Niger",
			NG: "Nigeria",
			NU: "Niue",
			NF: "Norfolk Island",
			KP: "North Korea",
			VD: "North Vietnam",
			MP: "Northern Mariana Islands",
			NO: "Norway",
			OM: "Oman",
			PC: "Pacific Islands Trust Territory",
			PK: "Pakistan",
			PW: "Palau",
			PS: "Palestinian Territories",
			PA: "Panama",
			PZ: "Panama Canal Zone",
			PG: "Papua New Guinea",
			PY: "Paraguay",
			YD: "Peoples Democratic Republic of Yemen",
			PE: "Peru",
			PH: "Philippines",
			PN: "Pitcairn Islands",
			PL: "Poland",
			PT: "Portugal",
			PR: "Puerto Rico",
			QA: "Qatar",
			RO: "Romania",
			RU: "Russia",
			RW: "Rwanda",
			RE: "Réunion",
			BL: "Saint Barthélemy",
			SH: "Saint Helena",
			KN: "Saint Kitts and Nevis",
			LC: "Saint Lucia",
			MF: "Saint Martin",
			PM: "Saint Pierre and Miquelon",
			VC: "Saint Vincent and the Grenadines",
			WS: "Samoa",
			SM: "San Marino",
			SA: "Saudi Arabia",
			SN: "Senegal",
			RS: "Serbia",
			CS: "Serbia and Montenegro",
			SC: "Seychelles",
			SL: "Sierra Leone",
			SG: "Singapore",
			SK: "Slovakia",
			SI: "Slovenia",
			SB: "Solomon Islands",
			SO: "Somalia",
			ZA: "South Africa",
			GS: "South Georgia and the South Sandwich Islands",
			KR: "South Korea",
			ES: "Spain",
			LK: "Sri Lanka",
			SD: "Sudan",
			SR: "Suriname",
			SJ: "Svalbard and Jan Mayen",
			SZ: "Swaziland",
			SE: "Sweden",
			CH: "Switzerland",
			SY: "Syria",
			ST: "São Tomé and Príncipe",
			TW: "Taiwan",
			TJ: "Tajikistan",
			TZ: "Tanzania",
			TH: "Thailand",
			TL: "Timor-Leste",
			TG: "Togo",
			TK: "Tokelau",
			TO: "Tonga",
			TT: "Trinidad and Tobago",
			TN: "Tunisia",
			TR: "Turkey",
			TM: "Turkmenistan",
			TC: "Turks and Caicos Islands",
			TV: "Tuvalu",
			UM: "U.S. Minor Outlying Islands",
			PU: "U.S. Miscellaneous Pacific Islands",
			VI: "U.S. Virgin Islands",
			UG: "Uganda",
			UA: "Ukraine",
			SU: "Union of Soviet Socialist Republics",
			AE: "United Arab Emirates",
			GB: "United Kingdom",
			UY: "Uruguay",
			UZ: "Uzbekistan",
			VU: "Vanuatu",
			VA: "Vatican City",
			VE: "Venezuela",
			VN: "Vietnam",
			WK: "Wake Island",
			WF: "Wallis and Futuna",
			EH: "Western Sahara",
			YE: "Yemen",
			ZM: "Zambia",
			ZW: "Zimbabwe",
			AX: "Åland Islands",
		}

		return arr
	}

	function selectLoop(el, arr) {
		el.empty()
		for (var key in arr) {
			var option = document.createElement("option")
			option.text = arr[key]
			option.value = key

			el.append(option)
		}
	}

	function setSubdivision(inputs, labels) {
		var value = $("#input_2_59").val(),
			state = $("#input_2_66"),
			region = $("#input_2_67"),
			province = $("#input_2_68"),
			list

		inputs.add(labels).hide()

		if (value === "US") {
			list = usStateList()

			selectLoop(state, list)

			$("#input_2_66").show().prop("disabled", false)
			displayLabel(labels[0])
		} else if (value === "USO") {
			list = usoList()

			selectLoop(region, list)

			$("#input_2_67").show().prop("disabled", false)
			displayLabel(labels[1])
		} else if (value === "CA") {
			list = provinceList()

			selectLoop(province, list)

			$("#input_2_68").show().prop("disabled", false)
			displayLabel(labels[2])
		} else if (value === "MX") {
			list = mxStateList()

			selectLoop(state, list)

			$("#input_2_66").show().prop("disabled", false)
			$(displayLabel(labels[0]))
		} else {
			$("#input_2_56").show()
		}
	}

	function displayLabel(label) {
		var parent = $(label).parent()

		$(".address-item").removeClass("flex-select")

		$(parent).addClass("flex-select")

		$(label).show()
	}

	function usStateList() {
		var arr = {
			AA: "",
			AL: "Alabama",
			AK: "Alaska",
			AZ: "Arizona",
			AR: "Arkansas",
			CA: "California",
			CO: "Colorado",
			CT: "Connecticut",
			DE: "Delaware",
			DC: "District of Columbia",
			FL: "Florida",
			GA: "Georgia",
			HI: "Hawaii",
			ID: "Idaho",
			IL: "Illinois",
			IN: "Indiana",
			IA: "Iowa",
			KS: "Kansas",
			KY: "Kentucky",
			LA: "Louisiana",
			ME: "Maine",
			MD: "Maryland",
			MA: "Massachusetts",
			MI: "Michigan",
			Mn: "Minnesota",
			MS: "Mississippi",
			MO: "Missouri",
			MT: "Montana",
			NE: "Nebraska",
			NV: "Nevada",
			NH: "New Hampshire",
			NJ: "New Jersey",
			NM: "New Mexico",
			NY: "New York",
			NC: "North Carolina",
			ND: "North Dakota",
			OH: "Ohio",
			OK: "Oklahoma",
			OR: "Oregon",
			PA: "Pennsylvania",
			RI: "Rhode Island",
			SC: "South Carolina",
			SD: "South Dakota",
			TN: "Tennessee",
			TX: "Texas",
			UT: "Utah",
			VT: "Vermont",
			VA: "Virginia",
			WA: "Washington",
			WV: "West Virginia",
			WI: "Wisconsin",
			WY: "Wyoming",
		}

		return arr
	}

	function usoList() {
		var arr = {
			AA: "",
			AS: "American Samoa",
			FM: "Federated States of Micronesia",
			GU: "Guam",
			MH: "Marshall Islands",
			MP: "Northern Mariana Islands",
			PR: "Puerto Rico",
			PW: "Palau",
			VI: "U.S. Virgin Islands",
			UM: "U.S. Minor Outlying Islands",
		}

		return arr
	}

	function provinceList() {
		var arr = {
			AA: "",
			NL: "Newfoundland and Labrador",
			PE: "Prince Edward Island",
			NS: "Nova Scotia",
			NB: "New Brunswick",
			QC: "Quebec",
			ON: "Ontario",
			MB: "Manitoba",
			SK: "Saskatchewan",
			AB: "Alberta",
			BC: "British Columbia",
			YT: "Yukon",
			NT: "Northwest",
			NU: "Nunavut",
		}
		return arr
	}

	function mxStateList() {
		var arr = {
			AA: "",
			CMX: "Ciudad de México",
			AGU: "Aguascalientes",
			BCN: "Baja California",
			BCS: "Baja California Sur",
			CAM: "Campeche",
			COA: "Coahuila",
			COL: "Colima",
			CHP: "Chiapas",
			CHH: "Chihuahua",
			DUR: "Durango",
			GUA: "Guanajuato",
			GRO: "Guerrero",
			HID: "Hidalgo",
			JAL: "Jalisco",
			MEX: "México",
			MIC: "Michoacán",
			MOR: "Morelos",
			NAY: "Nayarit",
			NLE: "Nuevo León",
			OAX: "Oaxaca",
			PUE: "Puebla",
			QUE: "Querétaro",
			ROO: "Quintana Roo",
			SLP: "San Luis Potosí",
			SIN: "Sinaloa",
			SON: "Sonora",
			TAB: "Tabasco",
			TAM: "Tamaulipas",
			TLA: "Tlaxcala",
			VER: "Veracruz",
			YUC: "Yucatán",
			ZAC: "Zacatecas",
		}
		return arr
	}

	function zoneFixes() {
		targets = $('#input_2_91 label:not("#label_2_91_2")')

		$(targets).each(function () {
			var str = $(this).text(),
				zone = str.slice(0, 6),
				text = str.split(zone)[1]

			$(this).html("<span>" + zone + "</span>" + text)
		})

		var NET = $("#label_2_91_2"),
			zone = NET.text().slice(0, 4),
			text = NET.text().split(zone)[1]

		$(NET).html("<span>" + zone + "</span>" + text)
	}
})(jQuery)
