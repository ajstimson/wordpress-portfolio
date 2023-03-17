window.errorData = {};
var errors = 0;


(function(proxied) {
    //Prevents duplicate alerts
    var alerts = 0;
    window.alert = function(e) {

        //increment alerts for counting
        alerts = ++alerts;

        if (alerts < 2) {

            //Reset alerts within a 200ms timeout
            setTimeout(function() {
                console.log('alerts timeout');
                alerts = 0;
                console.log(alerts);
            }, 200);

            //allow alert to be displayed
            return proxied.apply(this, arguments);
        }

        if (alerts > 1) {
            //Reset alerts if number of alerts exceeds one
            alerts = 0;
        }

    };

})(window.alert);

(function($) {

    $(window).load(function() {

        /*

            ===========  *  VARIABLES  *  ===========

        */

        var limitCheckItem = $('.check-limits');
        var requiredInput = $('.gfield_contains_required input');


        /*

            ===========  *  FUNCTIONS  *  ===========

        */

        //run an initial limit check
        initCheckAll(limitCheckItem, requiredInput);

        /*

            ===========  *  ACTIONS  *  ===========

        */

        //When width or pocket depth are changed, check limit for combined width
        $(document).on("change", "#input_2_13, #input_2_26", function(e) {

            initCheckAll($('#input_2_51'));

        });

        // when vision panel position is selected render gate config image
        $(limitCheckItem).on('keyup, focusout, change', function(e) {
            //console.log(e.target);
            // console.table('limitCheckItem', e);
            checkLimitInit(e.target, requiredInput);

        });

        $(document).on("click", '#menu-elevator-footer a', function() {

            var required = checkRequiredFields(requiredInput);
            // console.table([required]);
            requiredTooltipToggle(required);
            if (window.localStorage.guest === 'false') {
                quanityTooltipToggle();
            }
            checkLimitInit(null, requiredInput);
            checkDimensionStackErrors();

            dimensionsStackTooltipToggle();

        });

        //Warn user if navigating away from order form
        var homeURL = window.location.origin;
        $(document).on("click", '.page-template-elevator-form-page a[href="' + homeURL + '"], .page-template-elevator-form-page header li:not(.cart-toggle) a', function(e) {

            var leave = confirm('Are you sure you want to leave? Any unsaved data may be lost.');

            if (leave !== true) {
                e.preventDefault();
            }
        });

        $(document).on("change keyup keydown", requiredInput, function(e) {
            if (window.localStorage.guest === 'false') {
                if (requiredInput[1].value.length < 1) {
                    $('#required-po-tooltip').show();
                } else {
                    $('#required-po-tooltip').hide();
                }
            }

            checkLimitInit(null, requiredInput);

        });

        $(document).on("change keyup keydown", '#footer-quantity', function(e) {
            quanityTooltipToggle();
        });

        $(document).on("change keyup", '.guest-only input', function(e) {
            var required = requestQuoteValidation();
            if (required === true) {
                $('#request-quote button').removeClass('disabled');
            }
            if (required === false) {
                $('#request-quote button').addClass('disabled');
            }
        });

    });

    function requiredTooltipToggle(required) {

        for (i = 0; i < required.length; i++) {

            if (required[i] === true) {

                $('#required-po-tooltip').hide();
                $('#menu-item-1689').removeClass('exception');

                continue;

            } else {

                $('#required-po-tooltip').show();
                $('#menu-item-1689').addClass('exception');

                break;

            }
        }
    }

    function quanityTooltipToggle() {
        var quantity = $('#footer-quantity').val();

        if (quantity < 1 || quantity === null || quantity === undefined) {
            $('#quantity-tooltip').show();
        } else {
            $('#quantity-tooltip').hide();
        }
    }

    function initCheckAll(inputs) {
        $(inputs).each(function(i) {

            checkLimitInit(inputs[i], null);

        });
    }

    function checkLimitInit(input, requiredInput) {
        var error = 0;
        if (input !== null) {

            // console.log(input, requiredInput);
            var name = $(input).parent().parent().find('label').text(),
                min = Number(input.min),
                max = Number(input.max),
                val = Number(input.value);

            setErrorClass();
            enableTotal();

            if (min > val) {

                alert('Error: ' + name + ' value (' + val + ') is too small! Please enter a value between ' + min + ' & ' + max + '.');
                error = 1;
                disableSubmit(name, val, error);

                storeErrorCache(input, name);

                return;
            }

            if (val > max) {
                if ($(input).is('#input_2_51')) {

                    name = 'Combined Width';
                    var pocket = parseFloat($('#input_2_26').val());

                    if (pocket !== 0) {

                        $('#input_2_13, #input_2_26').addClass('error');
                        alert('Error: The combined width of Pocket Depth & Gate Width is too large! Please enter a value between ' + min + ' & ' + max + '.');
                        return;

                    }
                }

                alert('ERROR: ' + name + ' value (' + val + ') is too large! Please enter a value between ' + min + ' & ' + max + '.');
                error = 1;
                disableSubmit(name, val, error);

                storeErrorCache(input, name);

                return;
            }

            checkDimensionStackErrors();

        }

        var requiredError = false;

        if (requiredInput !== null) {

            for (i = 0; i < requiredInput.length; i++) {
                if (requiredInput[i].value === '') {

                    requiredError = true;

                }
            }

        }

        if (requiredError === true) {
            error = 1;
            disableSubmit(null, null, 1);
            return;
        }

        disableSubmit(null, null, error);

    }

    function storeErrorCache(input, name) {
        var content = $(input).parent().parent().parent().data().content;
        errorData[errors] = {
            'content': content,
            'input': input,
            'name': name
        };

        errors++;

        checkDimensionStackErrors();
    }

    function checkDimensionStackErrors() {
        if (errorData !== undefined && Object.keys(errorData).length > 0) {

            for (var [key, item] of Object.entries(errorData)) {

                var tooltipData = item.content,
                    input = item.input,
                    min = Number(input.min),
                    max = Number(input.max),
                    val = Number(input.value),
                    is_error = isThereAnError(min, max, val);

                //if any two inputs match, remove the previous record
                removeDupe(item.name, key);

                if (is_error === true) {

                    //console.log('KEEP', key)

                }

                if (is_error === false) {

                    delete errorData[key];

                }

            }

            dimensionsStackTooltipToggle();

        }
    }

    function isThereAnError(min, max, val) {
        if (val < min) {
            return true;
        } else if (val > max) {
            return true;
        } else {
            return false;
        }
    }

    function removeDupe(term, index) {
        //console.table([index, term]);
        for (var [key, value] of Object.entries(errorData)) {
            if (term === value.name && Number(key) !== Number(index)) {

                // console.table([key, value.name]);

                delete errorData[key];
            }
        }
    }

    function dimensionsStackTooltipToggle() {

        //Hide by default
        $('.el-tooltip.dim-stack').hide().text(' Error');
        $('#menu-elevator-footer li.dimensions-content, #menu-elevator-footer li.stack-content').removeClass('exception');

        if (errorData !== undefined && Object.keys(errorData).length > 0) {

            for (key in errorData) {

                var tooltipData = errorData[key].content,
                    toolTip = $(".el-tooltip[data='" + tooltipData + "']"),
                    footerMenu = $('#menu-elevator-footer .' + tooltipData + '-content');

                $(toolTip).prepend(' ' + errorData[key].name).show();
                $(footerMenu).addClass('exception');

            }

        }

    }

    function checkRequiredFields(requiredInput) {
        var result = [];
        $(requiredInput).each(function(i) {

            var value = $(this).val(),
                parent = $(this).parent(),
                name = $(parent).parent().find('label').text().slice(0, -1);

            // console.table( [i, value, parent, name] );

            if (value === undefined || value === null || value === '') {
                // $(this).addClass('missing-required');
                $(this).css({
                    background: '#f8d6be',
                    border: '2px inset #e2701e'
                });

                result[i] = name;
            } else {

                $(this).css({
                    background: 'transparent',
                    border: 'unset',
                    borderBottom: '1px solid #a2a2a2'
                });

                result[i] = true;
            }
        });

        return result;
    }

    function setErrorClass() {
        //Loop through all check limit fields

        $('.check-limits').each(function() {

            var min = Number($(this).attr('min')),
                max = Number($(this).attr('max')),
                val = Number($(this).val());


            if (val > min || max > val) {

                $(this).removeClass('error');

            }

            if (val < min || val > max) {

                $(this).addClass('error');

            }

        });

    }

    function enableTotal() {
        var errors = $('.check-limits.error'),
            total = $('#text-4 .textwidget');

        if (errors.length === 0) {
            $(total).removeClass('disable-total');
            $('.total-error').remove();

        } else {

            $(total).addClass('disable-total')

            if ($('.total-error').length < 1) {
                $('#text-4 .textwidget').after('<div class="total-error">N/A</div>');
            }
        }
    }

    function disableSubmit(name, val, error) {
        var submit = $('#gform_submit_button_2'),
            save = $('#form-save button');
        var quantity = parseInt($('#footer-quantity').val()),
            quantity = quantity || 0;

        if (quantity === 0) {

            submit.add(save).removeClass('enabled');
            submit.add(save).attr('disabled', 'disabled').addClass('disabled');

        } else {

            if (error === 1) {

                submit.add(save).removeClass('enabled');
                submit.add(save).attr('disabled', 'disabled').addClass('disabled');

            } else {

                submit.add(save).removeClass('disabled');
                submit.add(save).removeAttr("disabled").toggleClass('enabled');

            }

        }

    }

    function requestQuoteValidation() {
        var fields = document.querySelectorAll('.guest-only input'),
            valid = true;

        for (var [key, field] of Object.entries(fields)) {
            if (field.value.length === 0) {
                valid = false;
                break;
            }
        }

        return valid;

    }

})(jQuery);