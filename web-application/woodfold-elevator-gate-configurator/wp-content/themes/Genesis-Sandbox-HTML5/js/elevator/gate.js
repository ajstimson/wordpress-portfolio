(function($) {
    $(window).load(function() {

    });

    function configInit() {
        // Builds the right and left column config blocks
        //buildConfigBlocks();

        // Builds Stack, Panel, and Frame slides
        // slideBuilder();

        // Set right config height based on slide height
        //slideParentFix();


        // Set min max values for specific fields
        limitSet();

        // Calculates 1) Open Width 2) Number of Panels 3) Stack Collapse Size 4) Wall to Lead
        gateCalcInit();

        // Create gate animation in left config block
        gateImgInit();

        // Sets stack width area to width of gate
        stackContainerWidth();

        // Set right config height based on slide height
        gateImageHeightFix();

        // Set all quote calculation elements
        quoteElems();

    }

    function gateCalcInit() {
        setOpenWidth();
        // setJambed();
        setNumGates();
        // setDoorHeight();
        setStackCollapse();
        setWallToLead();
    }

    function setOpenWidth() {
        var target = $('#dim-1 span'),
            input = $('#input_2_51'),
            base = $('#input_2_13').val(),
            final;

        // first clear existing values
        $(target).empty();

        var pocket = $('#input_2_26').val();

        // next check if for pocket depth
        if ($.isNumeric(pocket)) {
            final = Number(base) + Number(pocket);

        } else {
            final = base;
        }

        $(target).append(final + '"');
        $(input).val(final);
    }

    function gateImgInit() {
        var swatch = $('.swatch');

        classSet(swatch);
        additionalClassSet();
        //imgData(swatch);
        //setDefaultImg(swatch);
    }

    function classSet(swatch) {

        $(swatch).each(function() {
            var groupName = $(this).find('.gfield_label').text();

            groupName = format(groupName);

            var swatchButtons = $(this).find('.gfield_radio li');

            $(swatchButtons).each(function() {

                var name = $(this).find('label').text();
                name = format(name);

                $(this).addClass(name + ' ' + groupName);

            });
        });

    }

    function additionalClassSet() {
        $('.acrylic-perforated-vision-panels').addClass('no-gate-render');
        $('#input_2_89 li').addClass('no-gate-render');
    }

    //BEHAVIOR(?)
    function setStackCollapse() {
        var target = $('#stackCollapsedSize'),
            num = 6.4375,
            gates = $('#input_2_50').val(),
            pocket = $('#input_2_26').val(),
            dubg = $('#input_2_46 input:checked').val();

        // first clear existing values
        $(target).empty();

        if (dubg === 'Yes') {
            num = 8.5;
            if (gates == 8) {
                num = 9.25;
            }
            if (gates == 10) {
                num = 10;
            }
            if (gates == 12) {
                num = 10.75;
            }
        } else {
            // TO DO: Convert this into an algorithm
            if (gates == 7) {
                num = 6.4375;
            }
            if (gates == 8) {
                num = 6.875; //.4375
            }
            if (gates == 9) {
                num = 7.3125; //.4375
            }
            if (gates == 10) {
                num = 7.6875; //.375
            }
            if (gates == 11) {
                num = 8.1250; //.4375
            }
            if (gates == 12) {
                num = 8.5625; //.4375
            }
            if (gates == 13) {
                num = 9; //.4375
            }
            if (gates == 14) {
                num = 9.3750; //.375
            }
            if (gates == 15) {
                num = 9.8125; //.4375
            }
            if (gates == 16) {
                num = 10.25; //.4375
            }
        }

        $(target).append('<span>' + num + '</span>"');

    }

    //BEHAVIOR(?)
    function setWallToLead() {
        var target = $('#wallToLeadPostClearance'),
            cab = $('#input_2_13').val(),
            pocket = $('#input_2_26').val(),
            stack = $('#stackCollapsedSize span').text(),
            // stack = parseInt(stack),
            num = Number(cab) - Number(stack);

        if ($.isNumeric(pocket) && pocket > 0) {
            num = num + Number(pocket);
        }
        // first clear existing values
        $(target).empty();

        $(target).append(num + '"');

    }

    // function setDoorHeight() {
    //     var target = $('#cab-height span');

    //     // first clear existing values
    //     $(target).empty();

    //     var height = $('#input_2_14').val(),
    //         select = $('#input_2_16').val(),
    //         upperV = 1.0625,
    //         final = parseFloat(height) - parseFloat(select) - upperV;
    //     $(target).append(final);
    // }

    function setNumGates() {
        var target = $('#dim-3 span'),
            input = $('#input_2_50'),
            base = 4,
            open = $('#input_2_51').val(),
            dubGate = $('#input_2_46 input:checked').val(),
            jamb = $('#input_2_48 input:checked').val();

        var final = calculateGates(open, base, dubGate, jamb);

        $(target).empty();

        $(input).val(final);
        $(target).append(final);

        show_stack_imgs();
    }

    function calculateGates(open, base, dubGate, jamb) {

        open = Number(open);
        base = Number(base);

        var jambState,
            num = 0,
            message;

        // if double gate selected
        if (dubGate === 'Yes') {
            if (open <= 30.5) {
                num = 6;
            }
            if (open > 30.5 && open <= 38.5) {
                num = 8;
            }
            if (open > 38.5 && open <= 45.5) {
                num = 10;
            }
            if (open > 45.5 && open <= 52) {
                num = 12;
            }
            if (open > 52) {
                num = 12;
                message = 'Double Ended Gate Width cannot exceed 52"';
                errorHandler(message, 3);
                return num;
            }
        } else {

            if (open <= $width_min) {
                num = 4;
            }
            if (open > $width_min && open <= 24.5) {
                num = 5;
            }
            if (open > 24.5 && open <= 28.25) {
                num = 6;
            }
            if (open > 28.25 && open <= 32) {
                num = 7;
            }
            if (open > 32 && open <= 35.75) {
                num = 8;
            }
            if (open > 35.75 && open <= 39.5) {
                num = 9;
            }
            if (open > 39.5 && open <= 43.25) {
                num = 10;
            }
            if (open > 43.25 && open <= 47) {
                num = 11;
            }
            if (open > 47 && open <= 49.75) {
                num = 12;
            }
            if (open > 49.75 && open <= 53.5) {
                num = 13;
            }
            if (open > 53.5 && open <= 57.25) {
                num = 14;
            }
            if (open > 57.25 && open <= 61) {
                num = 15;
            }
            if (open > 61 && open <= $width_max) {
                num = 16;
            }

            jambState = forwardOrAway(num);

            if ($('#field_2_48 input').hasClass('jamb-hold')) {
                var jambShouldBe = jambState,
                    jambIs = $('input.jamb-hold').val();

                if (jambShouldBe !== jambIs && num < 16) {
                    num = num + 1;
                }
                if (jambShouldBe !== jambIs && num === 16) {
                    num = 16;
                    message = 'Maximum number of panels (16) already reached';
                    errorHandler(message, 3);
                }
            } else {
                setJamb(num);
            }
        }

        return num;
    }
    //BEHAVIOR
    function forwardOrAway(num) {
        var jamb = 'Away';
        if (num % 2 == 0) {
            jamb = 'Forward'
        }

        return jamb;
    }
    //BEHAVIOR(?)
    function setJamb(num) {
        var forward = $('#choice_2_48_0'),
            away = $('choice_2_48_1'),
            jambState = forwardOrAway(num);

        if (jambState === 'Forward') {
            $(away).prop("checked", false);
            $(forward).prop("checked", true);
        } else {
            $(away).prop("checked", true);
            $(forward).prop("checked", false);
        }
    }

    function show_stack_imgs() {
        var num = $('#dim-3 span').text(),
            dbl = $('#field_2_46 input:checked').val(),
            url = '/wp-content/uploads/2020/01/';

        stack_show_open(num, dbl, url);
        show_stack_collapse(num, dbl, url);

    }

    function stack_show_open(num, dbl, url) {

        var set = $('#stack-open-wrap div');

        $(set).each(function() {

            var data = $(this).data('stack-img'),
                sNum = data.match(/\d+/),
                doub = data.match(/double/),
                img = '';

            if (sNum != null && sNum[0] === num) {
                if (dbl === 'Yes' && doub != null && doub.length !== 0) {
                    img = '<img src="' + url + data + '" />';
                } else {
                    img = '<img src="' + url + data + '" />';
                }

                stackImgClean(this, set, img);
                removePrevious(set, img);
                $(this).html(img);
                $(this).find('img').css({
                    'visibility': 'visible',
                    'height': 'auto',
                    'opacity': '1'
                });
            }
        });
    }

    function show_stack_collapse(num, dbl, url) {

        var set = $('#stack-collapsed-wrap div'),
            isE = isEven(parseInt(num)),
            img = '',
            name = '';

        if (dbl === 'Yes') {
            name = 'stack-collapsed-double-end.png';
            img = '<img src="' + url + name + '" />';
            findCollapse(set, name, img);
        } else
        if (isE === true) {
            name = 'stack-collapsed-even.png';
            img = '<img src="' + url + name + '" />';
            findCollapse(set, name, img);
        } else {
            name = 'stack-collapsed-odd.png';
            img = '<img src="' + url + name + '" />';
            findCollapse(set, name, img);
        }
    }

    var isEven = function(a) {
        return (a % 2 == 0) ? true : false;
    };

    function findCollapse(set, name, img) {
        var el = $(set).parent().find("[data-stack-img='" + name + "']");
        stackImgClean(el, set, img);
    }

    function stackImgClean(el, set, img) {

        removePrevious(set, img);

        $(el).html(img);
        $(el).find('img').css({
            'visibility': 'visible',
            'height': 'auto',
            'opacity': '1'
        });
    }

    function removePrevious(set, img) {

        $(set).each(function() {
            var prior = $(this).find('img'),
                prSrc = $(prior).attr("src"),
                nwSrc = $(img).attr("src");
            if (prSrc !== nwSrc) {
                $(prior).remove();
            }
        });
    }

    // function setJambed() {
    //     var target = $('#dim-2 span');

    //     // first clear existing values
    //     $(target).empty();

    //     if ($('#choice_2_48_0').is(':checked')) {
    //         $(target).append('Forward');
    //     } else {
    //         $(target).append('Away');
    //     }
    // }

})(jQuery);