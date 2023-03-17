// ************************************************
//
// Shopping Cart API
// Author: Burlaka Dmytro
// Customized by: Andrew Stimson
// Example: https://codepen.io/Dimasion/pen/oBoqBM
// Dependencies: Bootstrap 4.0, Tether.js
//
// ************************************************

;(function ($) {
	$(window).load(function () {
		var url = getParams(window.location.href)

		var userID = document.head.querySelector(
			"[property~=user-id][content]"
		).content

		cartInit()

		function cartInit() {
			cartMeta()
			cartSession()
			cartLoading()
			modalPlaced()
			getCartContents()
			// TO DO: Check that all items in cart have the same cart hash value as the current meta item
			// IF NOT: Clear all items of cart without mismatched cart hash
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

		//PURPOSE:
		// THIS RESETS CART ITEM ID META WHEN USER COPIES ORDER
		function cartMeta() {
			var cartItemID = document.head.querySelector(
				"[property~=cart-item][content]"
			).content

			if (url.itemID === undefined) {
				ajaxCall("POST", "check_item_id", null, cartItemID)
			}
		}

		function cartSession() {
			var sessionCookie = getCookie("session")

			if (sessionCookie == undefined) {
				document.cookie = "session=" + randomToken(9)
			}

			var sessionMeta = document.createElement("meta")
			sessionMeta.setAttribute("property", "cart-hash")
			sessionMeta.content = getCookie("session")
			document.getElementsByTagName("head")[0].appendChild(sessionMeta)
		}

		function getCookie(name) {
			var value = `; ${document.cookie}`

			var parts = value.split(`; ${name}=`)

			if (parts.length === 2) return parts.pop().split(";").shift()
		}

		function randomToken(length) {
			var result = ""
			var characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			var charactersLength = characters.length
			for (var i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				)
			}
			return result
		}

		function cartLoading() {
			var space = $("#menu-item-1694 a"),
				width = $(space).width()

			// set fixed width
			$(space).width(width + "px")

			// replace html with loader
			loadingAnimation(space)

			setTimeout(function () {
				cartPlace(space, width)
			}, 3000)
		}

		//TODO: could be combined with wholePageLoader
		//handles cart loading animation within cart modal
		function cartModalLoader(state) {
			var target = $("#cart .modal-body"),
				loader =
					'<div id="cart-modal-loader" class="load-wrapper"><div class="loader"></div></div>'

			if (state === "start") {
				$(target).prepend(loader)
			} else {
				$("#cart-modal-loader").remove()
			}
		}

		function loadingAnimation(el) {
			$(el)
				.addClass("cart-loader")
				.html(
					'<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
				)
		}

		function cartItemsLoading(status) {
			if (status === "on") {
				$("#cart .show-cart tbody").html(
					'<tr id="pre-loader" colspan="10"><td colspan="10"><div class="pulsate-css"></div></td></tr>'
				)
			}

			if (status === "off") {
				$("#pre-loader").remove()
			}
		}

		function cartPlace(horse, w) {
			$(horse).parent().addClass("cart-toggle")

			var cart = cartHTML()
			$(horse).replaceWith(cart)
		}

		function cartHTML() {
			var count = sessionStorage.count

			if (count == undefined) {
				count = 0
			}

			var html = '<a data-toggle="modal" data-target="#cart">Cart '
			html += ' (<span class="total-count">' + count + "</span>)</a>"

			return html
		}

		function modalPlaced() {
			var modal = modalHTML(),
				appnd

			if ($("body.profile-php").length !== 0) {
				appnd = $("#wpwrap")
			} else {
				appnd = $(".site-inner")
			}
			appnd.prepend(modal)
		}

		function modalHTML() {
			var html =
				'<div class="modal" id="cart" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">'
			html += '<div class="modal-dialog modal-lg" role="document">'
			html += '<div class="modal-content"><div class="modal-header">'
			html += '<h5 class="modal-title">Elevator Gate Configurations</h5>'
			html +=
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
			html += '<span aria-hidden="true">&times;</span>'
			html += "</button></div>"
			html +=
				'<div class="modal-body"><table class="show-cart table" cellspacing="0">'
			html += "</table>"
			html += '<div>Cart Total: $<span class="total-cart"></span></div>'
			html += "</div>"
			html += '<div class="modal-footer">'
			html +=
				'<button type="button" class="btn btn-secondary clear-cart">Clear Cart</button>'
			html +=
				'<button type="button" class="btn btn-secondary new-order" onclick="window.location.href = `/elevator/order-form/`;">Create New Order</button>'
			html +=
				'<a href="/success/" class="btn btn-primary complete-order">Complete Order</a>'
			html += "</div></div></div></div>"
			html +=
				'<div class="modal" id="exampleM" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">'
			html += '<div class="modal-dialog modal-lg" role="document">'
			html += '<div class="modal-content"><div class="modal-header">'
			html += '<h5 class="modal-title">Order Detail</h5>'
			html +=
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
			html += '<span aria-hidden="true">&times;</span>'
			html += "</button></div>"
			html += '<div class="modal-body"><div class="cart-data">'
			html += "</div>"
			html += '<div class="modal-footer">'
			html += "</div></div></div></div>"
			return html
		}

		function cartTableHeader() {
			var thead = " <thead><tr>"
			thead += '<th class="product-remove">&nbsp;</th>'
			thead += '<th class="product-po-number">PO Number</th>'
			thead += '<th class="product-details">Details</th>'
			thead += '<th class="product-quantity">Quantity</th>'
			thead += '<th class="product-price">Quote</th>'
			thead += '<th class="product-options">Options</th>'
			thead += "</tr></thead>"

			return thead
		}

		function getCartContents() {
			// Clear cart contents
			shoppingCart.clearCart()

			var user = document.head.querySelector("[property~=user-id][content]")

			if (user !== null) {
				user = user.content
				ajaxCall("POST", "get_cart_contents", null, user)
			}
		}

		function stockCart(cartItems) {
			if (cartItems.length > 0) {
				for (var i = 0; i < cartItems.length; i++) {
					var cartItem = JSON.parse(cartItems[i].el_item_data)

					shoppingCart.addItemToCart(
						cartItem.po_number.value,
						Number(cartItem.quote.value),
						Number(cartItem.quantity.value),
						cartItem.cart_item_id,
						(json = JSON.stringify(cartItem))
					)
				}

				displayCart(cartItem.cart_item_id)
			} else {
				// Clear cart contents
				shoppingCart.clearCart()
				displayCart()
			}

			if (cartItems.length > 3) {
				$(".modal#cart").css("overflow-y", "scroll")
			} else {
				$(".modal#cart").css("overflow-y", "hidden")
			}
		}

		function displayCart(itemID) {
			var cartArray = shoppingCart.listCart(),
				output = cartTableHeader()

			output += "<tbody>"

			// TODO: Create default message for empty cart
			for (var i in cartArray) {
				output += '<tr class="cart-item">'
				output += "<td>"
				output +=
					'<button class="delete-item input-group-addon btn btn-primary"'
				output += ' data-name="' + cartArray[i].name + '"'
				output += ' data-item="' + cartArray[i].itemID + '">X</button>'
				output += "</td><td>"
				output += cartArray[i].name
				output += '</td><td class="item-details">'
				output += itemDetails(cartArray[i].json)
				output += "</td><td>"
				output += cartArray[i].quantity
				output += "</td><td>"
				output +=
					"$<span>" + parseFloat(cartArray[i].price).toFixed(2) + "</span>"
				output += "</td><td>"
				output += cartItemOptions(cartArray[i])
				output +=
					'</td><td id="' +
					cartArray[i].itemID +
					'" class="order-item-json" style="display:none">'
				output += cartArray[i].json
				output += "</td>"
				output += "</tr>"
			}

			output += "</tbody>"

			$(".show-cart").html(output)
			$(".total-cart").html(shoppingCart.totalCart().toFixed(2))

			// this is empty right now
			$(".total-count").html(sessionStorage.count)

			setTimeout(function () {
				wholePageLoader("end")
			}, 2500)
		}

		function itemDetails(json) {
			json = JSON.parse(json)
			var html = "<ul>"
			html += "<li>"
			html += "Gate Width: " + json.gate_width.value
			html += "</li><li>"
			html += "Cab Height: " + json.cab_height.value
			html += "</li><li>"
			html += "Panel Count: " + json.number_of_gate_panels.value
			html += "</li><li>"
			html +=
				'<button type="button" class="btn btn-primary Click-btnas" data-toggle="modal" data-target="#exampleM">See More...</button>'
			html += "</li></ul>"

			var htmls = "<ul>"
			htmls += "<li>P.O. Number: " + json.po_number.value + "</li>"
			htmls += "<li>Sidemark: " + json.sidemark.value + "</li>"
			htmls += "<li>Pricing Zone: " + json.shipping.value + "</li>"
			htmls += "<li>"
			htmls += "Gate Width: " + json.gate_width.value
			htmls += "</li><li>"
			htmls += "Cab Height: " + json.cab_height.value
			htmls += "</li><li>"
			htmls += "Panel Count: " + json.number_of_gate_panels.value

			htmls +=
				"</li><li>Price (USD): $" +
				parseFloat(json.quote.value).toFixed(2) +
				"</li></ul>"
			$(".cart-data").html(htmls)
			return html
		}

		function cartItemOptions(arr) {
			//itemDetails(cartArray[i].json)
			var session = document.head.querySelector(
				"[property~=cart-hash][content]"
			).content
			json = arr.json

			var html = '<ul class="cart-item-options">'
			html += "<li>"
			html += '<button class="copy-item input-group-addon"'
			html += ' data-name="' + arr.name + '"'
			html += ' data-item="' + arr.itemID + '">Copy</button>'
			html += "</li>"
			html += "<li>"
			html += '<button type="button" class="edit-cart-item" '
			html += 'data-session="' + session + '" '
			html += 'data-item="' + arr.itemID + '">'
			html += "Edit</button>"
			html += "</li>"
			html += "<li>"
			html += '<button class="save-cart-item" '
			html += 'data-session="' + session + '" '
			html += 'data-item="' + arr.itemID + '">'
			html += "Save</button>"
			html += "</li>"
			html += "</ul>"

			return html
		}

		// *****************************************
		// Triggers / Events
		// *****************************************

		// Show modal
		$(".cart-toggle").click(function () {
			wholePageLoader("start")
			displayCart()
		})

		// Add item
		$("#gform_2").submit(function (event) {
			event.preventDefault()
			wholePageLoader("start")
			var $form = $(this),
				order = window.formData.cache,
				userID = document.head.querySelector(
					"[property~=user-id][content]"
				).content,
				itemID = document.head.querySelector(
					"[property~=cart-item][content]"
				).content,
				sessionID = document.head.querySelector(
					"[property~=cart-hash][content]"
				).content,
				url = $form.attr("action")

			order.user_id = userID
			order.session_id = sessionID
			order.cart_item_id = itemID
			order.status = 0

			cartLoading()

			json = JSON.stringify(order)
			ajaxCall("POST", "insert_order", null, order)
		})

		$(document).on("click", "#form-save button", function (e) {
			e.preventDefault()

			wholePageLoader("start")

			var order = formData.cache,
				userID = document.head.querySelector(
					"[property~=user-id][content]"
				).content,
				itemID = document.head.querySelector(
					"[property~=cart-item][content]"
				).content,
				sessionID = document.head.querySelector(
					"[property~=cart-hash][content]"
				).content

			order.user_id = userID
			order.session_id = sessionID
			order.cart_item_id = itemID
			order.status = 2

			json = JSON.stringify(order)

			ajaxCall("POST", "save_form_item", null, order)
		})

		$(document).on("click", ".add-to-cart, .copy-item", function (e) {
			if (this.classList.contains("add-to-cart") === true) {
				wholePageLoader("start")
			} else {
				cartModalLoader("start")
				setTimeout(function () {
					cartModalLoader("end")
				}, 3000)
			}
			e.preventDefault()
			cartLoading()
			duplicateOrder(this)
		})

		$(document).on("click", ".delete-item", function (e) {
			e.preventDefault()
			cartModalLoader("start")

			deleteItem(this)

			setTimeout(function () {
				cartModalLoader("end")
			}, 3000)
		})

		$(document).on("click", ".edit-cart-item", function (e) {
			var item = {}
			item.id = $(this).data("item")

			var json = JSON.parse($("#" + item.id).html())
			json.status = 3

			item.order = json

			ajaxCall("POST", "edit_cart_item", null, item)
		})

		$(document).on("click", ".save-cart-item", function (e) {
			var item = {}
			item.oldID = $(this).data("item")

			var json = JSON.parse($("#" + item.oldID).html())
			json.status = 2
			// json.cart_item_id = document.head.querySelector("[property~=secondary-cart-item][content]").content;

			item.order = json

			ajaxCall("POST", "save_cart_item", null, item)
		})

		// Clear items
		$(".clear-cart").click(function () {
			var removeAll = confirm(
				"Are you sure you want to delete the cart's contents?"
			)
			if (removeAll == true) {
				cartModalLoader("start")
				cartLoading()
				clearCart()
				setTimeout(function () {
					cartModalLoader("end")
				}, 3000)
			} else {
				return false
			}
		})

		$(".complete-order").click(function (e) {
			e.preventDefault()
			cartModalLoader("start")

			var orders = {},
				els = $("button.copy-item"),
				count = $("#cart .cart-item").length,
				i = 0,
				orders = {}

			$(els).each(function () {
				var id = $(this).data("item")

				ajaxCall("POST", "config_retrieval", "update_status", id)

				orders[i] = id

				i++

				if (count === i) {
					var query = ""
					var num = 1
					for (item in orders) {
						query += "&order_" + num + "=" + orders[item]
						num++
					}

					setTimeout(function () {
						cartModalLoader("end")
						window.location.href = "/user-dashboard/?status=success" + query
					}, 3000)
				}
			})
		})

		function duplicateOrder(el) {
			//Get previous item ID
			var item_id = $(el).data("item")
			//Reset item ID
			ajaxCall("GET", "get_salt", "config_retrieval", item_id)
		}

		function ajaxCall(method, action, progression, data) {
			$.ajax({
				type: method,
				url: local.ajax_url,
				data: {
					action: action,
					data: data,
				},
				success: function (response) {
					if (action === "config_retrieval" && progression === null) {
						var order = JSON.parse(response)

						createNewOrder(order)
					}

					if (action === "config_retrieval" && progression !== null) {
						var order = JSON.parse(response)
						updateStatus(response, progression)
					}

					if (action === "insert_order") {
						getCartContents()

						//Clear url params
						window.history.pushState(
							{},
							document.title,
							"/" + window.location.pathname.split("/")[1] + "/"
						)

						setTimeout(function () {
							$("#cart").modal()
						}, 3000)
					}

					if (action === "check_item_id") {
						if (response === "1") {
							newHash = randomToken(18)
							document.head.querySelector(
								"[property~=cart-item][content]"
							).content = newHash
						}
					}

					if (action === "get_salt") {
						cartItem = response.substring(0, 18)
						document.head.querySelector(
							"[property~=cart-item][content]"
						).content = cartItem

						//Get order data
						ajaxCall("POST", "config_retrieval", null, data)
					}

					if (action === "get_cart_contents") {
						stockCart(JSON.parse(response))
					}

					if (action === "save_cart_item") {
						var returned = JSON.parse(response)

						if (returned.status === "2") {
							var el = $(".save-cart-item[data-item=" + data.oldID + "]")

							savedConfirmation(el)

							setTimeout(function () {
								cartItemsLoading("on")
							}, 1500)

							setTimeout(function () {
								getCartContents()
								cartItemsLoading("off")
							}, 2000)
						}
					}

					if (action === "save_form_item") {
						if (response === "1") {
							//reset item id
							document.head.querySelector(
								"[property~=cart-item][content]"
							).content = randomToken(18)

							var el = $("#form-save button")

							savedConfirmation(el)

							wholePageLoader("end")
						} else {
							alert("Could not save configuration. Please try again")

							wholePageLoader("end")
						}
					}

					if (action === "delete_item") {
						getCartContents()
					}

					if (action === "update_status") {
						if (response === 0) {
							alert(
								"There was a problem submitting your order. Please try again."
							)
							cartModalLoader("end")
						} else {
							setTimeout(function () {
								cartModalLoader("end")
							}, 3000)
						}
					}

					if (action === "edit_cart_item") {
						if (response === 0) {
							alert(
								"There was a problem retrieving this order. Please try refreshing the page."
							)
						} else {
							getCartContents()
							window.location.replace("/elevator/order-form/?itemID=" + data.id)
						}
					}
				},
			})
		}

		function savedConfirmation(el) {
			var check = '<i class="fa fa-check"></i>'

			$(el).addClass("saved").html(check)

			var message = 'Configuration saved! Click "OK" to proceed to Dashboard'
			var url = "/elevator/user-dashboard/"

			if (!confirm(message)) {
				//Reload page
				location.reload()
			} else {
				//Redirect to dashboard
				window.location.href = url
			}
		}

		function createNewOrder(order) {
			var newItemID = document.head.querySelector(
				"[property~=cart-item][content]"
			).content

			order.cart_item_id = newItemID
			order.status = 0

			ajaxCall("POST", "insert_order", null, order)
		}

		function deleteItem(item) {
			//Get previous item ID
			var item_id = $(item).data("item")

			ajaxCall("POST", "delete_item", null, item_id)
		}

		function clearCart() {
			var items = $(".input-group-addon.delete-item")
			cartModalLoader("start")
			$(items).each(function () {
				deleteItem(this)
			})
			setTimeout(function () {
				cartModalLoader("end")
			}, 3000)
		}

		function updateStatus(json, ajax) {
			cartModalLoader("start")
			order = JSON.parse(json)
			order.status = 1

			ajaxCall("POST", ajax, null, order)
		}

		function wholePageLoader(state) {
			var target = $(".site-inner > .wrap"),
				loader =
					'<div id="whole-page-loader" class="load-wrapper"><div class="loader"></div></div>'
			if (state === "start") {
				$(target).prepend(loader)
			} else {
				$("#whole-page-loader").remove()
			}
		}

		$(".clear-data").click(function () {
			shoppingCart.clearCart()
			displayCart()
		})

		// move this to shoppingCart obj eventually
		function saveItem(el) {
			$(el).removeClass("cart-loader")
			$(el).css("background-color", "green").html("Saved!")
		}

		$(".show-cart").on("click", ".item-details a", function (event) {
			event.preventDefault()

			var accordion = $(this)

			$(accordion).html("Coming Soon...")

			setTimeout(function () {
				$(accordion).html("See More...")
			}, 1000)
		})
	}) //end window load function
})(jQuery)

var shoppingCart = (function () {
	// =============================
	// Private methods and propeties
	// =============================

	cart = []

	// Constructor
	function Item(name, price, quantity, itemID, json) {
		this.name = name
		this.price = price
		this.quantity = quantity
		this.itemID = itemID
		this.json = json
	}

	// Save cart
	function saveCart() {
		sessionStorage.setItem("shoppingCart", JSON.stringify(cart))
		sessionStorage.setItem("count", cart.length)
	}

	// Load cart
	function loadCart() {
		cart = JSON.parse(sessionStorage.getItem("shoppingCart"))
	}

	function countDuplicates(name) {
		var count = 1

		for (var item in cart) {
			if (cart[item].name === name) {
				count = count++
			}
		}

		return count
	}

	function cloneObj(obj) {
		if (null == obj || "object" != typeof obj) return obj

		var copy = obj.constructor()

		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
		}

		return copy
	}

	if (sessionStorage.getItem("shoppingCart") != null) {
		loadCart()
	}

	// =============================
	// Public methods and propeties
	// =============================
	var obj = {}

	// Add to cart
	obj.addItemToCart = function (name, price, quantity, itemID, json) {
		var item = new Item(name, price, quantity, itemID, json)
		cart.push(item)
		saveCart()
	}

	obj.duplicateItemInCart = function (name) {
		name = $.trim(name)

		for (var item in cart) {
			if (cart[item].name === name) {
				var clone = cloneObj(cart[item])

				cart.push(clone)

				saveCart()

				break
			}
		}
	}

	// Remove item from cart
	obj.removeItemFromCart = function (name) {
		var message = "Are you sure you want to delete this item from the cart?"

		if (!confirm(message)) {
			return false
		} else {
			name = $.trim(name)

			for (var item in cart) {
				if (cart[item].name === name) {
					cart.splice(item, 1)
					break
				}
			}

			saveCart()
		}
	}

	// Clear cart
	obj.clearCart = function () {
		//var message = 'Are you sure you want to clear all cart items?';

		//if (!confirm(message)) {
		// return false;
		//} else {
		cart = []
		saveCart()
		//}
	}

	// Total cart
	obj.totalCart = function () {
		var totalCart = 0

		for (var item in cart) {
			totalCart += cart[item].price
		}

		return Number(totalCart)
	}

	// List cart
	obj.listCart = function () {
		var cartCopy = []
		for (i in cart) {
			item = cart[i]
			itemCopy = {}
			for (p in item) {
				itemCopy[p] = item[p]
			}
			itemCopy.total = Number(item.price)
			cartCopy.push(itemCopy)
		}

		return cartCopy
	}

	obj.editItem = function (session, id) {
		id = $.trim(id)

		for (var item in cart) {
			if (cart[item].itemID === id) {
				cart.splice(item, 1)

				saveCart()

				var url = "/elevator/order-form/?session=" + session + "&itemID=" + id

				window.location.href = url
			}
		}
	}

	return obj
})()
