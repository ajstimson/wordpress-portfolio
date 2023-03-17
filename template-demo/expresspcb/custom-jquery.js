/**
 * Custom jQuery
 */

jQuery(document).ready(function( $ ) {

	var plus = $('a.no-priv-user.plus');
	var classic = $('a.no-priv-user.classic');

	if(classic){
		$(classic).each(function(i) {
			i = i+1;
			$(this).addClass("wow-modal-id-1");
			$(this).attr("id", 'classic-button-' + i);
		});
	}

	if(plus){
		$(plus).each(function(i) {
			i = i+1;
			$(this).addClass("wow-modal-id-2");
			$(this).attr("id", 'plus-button-' + i);
		});
	}

	var slide = $('#front-page-10 figure');

	$(slide).each(function( index ) {
		var name = $(this).find('.su-post-title').text();
		$(this).find('.su-post-title').remove();
		$(this).find('.su-post-comments-link').remove();
		$(this).find('.su-post-excerpt p').after('<h5>' + name + '</h5>');
	});

	var $window = $(window);
	var width = $window.width();
	
	getMainNavRight(width);
	
	$('.mc4wp-form input[type="submit"]').click(function() {
		$(this).closest('.wow-modal-window').addClass('active');
		window.XMLHttpRequest = newXHR;
	});

	$('.mw-close-btn').click(function() {
		$(this).closest('.wow-modal-window').removeClass('active');
	});
	
	$(window).on('load', function(){
		// if on order form, disable submit button
		var form = document.getElementById('product-12464');
		if (document.body.classList.contains('pcb-order-form') && typeof(form) != 'undefined' && form != null){
			document.querySelector("button.single_add_to_cart_button").disabled = true;
		}
		$window = $(window);
		width = $window.width();
		
		getMainNavRight(width);

		if (width < 769 && width > 640){
			var boxHeights = [];
			var ulHeights = [];
			var box = $('#front-page-2 .one-third');
			if ($(box)){
				$(box).each(function( index ) {
					var boxH = $(this).outerHeight();
					var ulH = $(this).find('ul').outerHeight();
					boxHeights.push(boxH);
					ulHeights.push(ulH);
				});

				var boxHighest = Math.max.apply(Math,boxHeights);
				var ulHighest = Math.max.apply(Math,ulHeights);

				$(box).each(function( index ) {
					var bh = $(this).outerHeight();
					var uh = $(this).find('ul').outerHeight();
					if(bh < boxHighest){
						$(this).css('min-height', boxHighest + 'px');
					}
					if (uh < ulHighest) {
						$(this).find('ul').css('min-height', ulHighest + 'px');
					}
				});

			}	
		}

		if (width < 641){
			$('.footer-widgets-1').appendTo('.footer-widgets-3');
		}

		// Set min-height to make columns equal length 
		var pItem = $('.post-166 .one-half h4 + p');
	    var ulItem = $('.post-166 .one-half ul');
	    setEqualHeight(ulItem);
	    setEqualHeight(pItem);

	    // Set min height on video tutorial headers
	    var hItem = $('.post-13947 .has-2-columns h3');
	    setEqualHeight(hItem);

	});

	$(window).resize(function(){
	   if($(window).width()!= width){
	   		width = $(window).width();
			getMainNavRight(width);
	   }
	});

	function setEqualHeight(item){
		var wHeights = $(item).map(function (){
	        return $(this).height();
	    }).get(),
	    maxPHeight = Math.max.apply(null, wHeights);

	    $(item).each(function( index ){
	        var currWH = $(this).height();
	        if (currWH < maxPHeight) {
	            $(this).css( {	'min-height': maxPHeight + 'px'});
			}
		});
	}
	
	function getMainNavRight(width){
		if (width > 896){
			// e.g. wWidth 1400
			if('#genesis-nav-primary.nav-primary-visible'){
				$('#genesis-nav-primary').removeClass('nav-primary-visible');
			}	
			$('#genesis-nav-primary').addClass('nav-primary-visible');
		} else {
			$('#genesis-nav-primary').removeClass('nav-primary-visible');
		}
	}

	var oldXHR = window.XMLHttpRequest;

	function newXHR() {
	    var realXHR = new oldXHR();
	    realXHR.addEventListener("readystatechange", function() {
	        if(realXHR.readyState==4){
	            // alert('request finished and response is ready');
	            var response = JSON.parse(realXHR.response);
	            console.log(response);
	            if (response.error && response.error.errors[0] == 'already_subscribed'){
	            	var el = document.querySelector('.active .mc4wp-form-fields');
	            	hideEl(el);
	            	document.querySelector('.active .mc4wp-response').classList.add('outer-wrap');
	            }
	        }
	    }, false);
	    return realXHR;
	}

	function hideEl(elem){
		// Hide element
		var hide = function (elem) {
			elem.style.display = 'none';
		};

		// If the element is visible, hide it
		if (window.getComputedStyle(elem).display === 'block') {
			hide(elem);
			return;
		}
	}
	
});