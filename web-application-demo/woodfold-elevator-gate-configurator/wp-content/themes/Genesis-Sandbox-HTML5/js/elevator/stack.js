(function($) {

    var $width_min = 20.75,
        $width_max = 64.75,
        $pocket_max = 12,
        $height_min = 76,
        $height_max = 97,
        $quantity_max = 75;


    $(window).load(function() {

        /*

            ===========  *  FUNCTIONS  *  ===========

        */

        /* stackInit
            1) Creates stack images 
            2) Reveals stack image based on Gate Count 
            3) Sets default stack state 
        */
        stackInit();

        /* Calculates 
            1) Open Width 
            2) Number of Panels 
            3) Stack Collapse Size 
            4) Wall to Lead
        */
        gateCalcInit();

        // Set min max values for specific fields
        limitSet();

        /*

            ===========  *  ACTIONS  *  ===========

        */

        // When changing stack option
        $(document).on("click change touchend keyup", "#input_2_13, #input_2_26, #stack-items-right input", function(e) {

            gateCalcInit();

        });

        $(document).on("change")

        // When clicking on dimensions or stack footer links
        $(document).on("click", "#menu-elevator-footer li, .directional-buttons .reform", function() {
            if (this.classList.contains('show-calculations') === true) {
                $('#field_1_49').show();
            } else {
                $('#field_1_49').hide();
            }
        });

        var a;

        // When clicking on Stack Direction
        $('#input_2_20 input').click(function() {
            a = $(this);
            flipConfig(a);
        });

        //IF double gate is selected or Gate Width or Pocket Width changes
        $(document).on("change", "#field_2_46 input, #input_2_13, #input_2_26", function() {
            //override jamb hold class and change jamb forward/away status
            toggleJambState();

        });

        $(document).on("change", "#field_2_46 input", function() {

            doubleGateChanges();

        });

        //TODO: review if this anon func is still needed
        $('#field_2_48 input').click(function() {
            a = $(this);
            setJambHold(a);
        });

        //Combine Gate Width and Pocket Width values for better error reporting
        $(document).on('click change keyup', '#input_2_13, #input_2_26', function() {
            //console.log('click change keyup #input_2_13 #input_2_26... widthPocketSum(a) & setJambState');
            var a = $(this);
            widthPocketSum(a);
            setJambState();
        });

    });

    function stackInit() {

        // Builds stack image display
        stackImgInit();
        showStackImgs();

    }

    function gateCalcInit() {
        setOpenWidth();
        setNumGates();
        // setDoorHeight();
        setStackCollapse();
        setWallToLead();
        //console.log('gateCalcInit --> setJambState');
        setJambState();
    }


    function setOpenWidth() {
        var target = $('#dim-1 span'),
            base = $('#input_2_13').val(),
            input = $('#input_2_51'),
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

    function setNumGates() {
        var target = $('#dim-3 span'),
            input = $('#input_2_50'),
            base = 4,
            open = $('#input_2_51').val(),
            dubGate = $('#input_2_46 input:checked').val(),
            jamb = $('#input_2_48 input:checked').val();

        var debug = {};
        debug.open_width = open;
        debug.double_gate = dubGate;
        debug.jamb_state = jamb;
        // console.table(debug);

        var final = calculateGates(open, base, dubGate, jamb);

        // console.log('final ' + final);

        $(target).empty();

        $(input).val(final);
        $(target).append(final);

        //console.log('setNumGates --> jambStateUpdate');

        jambStateUpdate(final);

        showStackImgs();
    }

    function calculateGates(open, base, dubGate, jamb) {

        open = Number(open);
        base = Number(base);

        var previous = Number($('#dim-3 span').text());

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
                //Return gate count to previous state
                num = previous;

                alert('Double Ended Gate Width cannot exceed 52"');

                //make sure Double Gate stays false
                $('#choice_2_46_1').click();

                //end function
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

            // console.log('calculateGates ---> forwardOrAway  BEFORE checking for jamb-hold');
            // console.warn(jambState);

            if ($('#field_2_48 input').hasClass('jamb-hold')) {
                var jambShouldBe = jambState,
                    jambIs = $('input.jamb-hold').val();

                if (jambShouldBe !== jambIs && num < 16) {
                    num = num + 1;
                }
                if (jambShouldBe !== jambIs && num === 16) {
                    num = 16;
                    alert('Maximum number of panels (16) already reached. Please reduce ');
                }
            } else {
                setJamb(num);
            }
        }

        return num;
    }

    function forwardOrAway(num) {
        var jamb = 'Away';
        if (num % 2 == 0) {
            jamb = 'Forward'
        }

        return jamb;
    }

    function setJamb(num) {
        var forward = $('#choice_2_48_0'),
            away = $('#choice_2_48_1'),
            jambState = forwardOrAway(num);

        // console.log(num);
        // console.log(jambState);

        if (jambState === 'Forward') {
            $(away).prop("checked", false);
            $(forward).prop("checked", true);
        } else {
            $(away).prop("checked", true);
            $(forward).prop("checked", false);
        }
    }

    function setJambState() {
        var gateCount = parseInt($('#dim-3 span').text(), 10);

        //console.log('setJambState --> jambStateUpdate');

        jambStateUpdate(gateCount);

    }

    function jambStateUpdate(num) {

        var state = forwardOrAway(num);

        $("#width-jamb-status span").fadeOut(function() {
            $(this).text(state).fadeIn('fast');
        });

        setJamb(num);
    }

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

    function setWallToLead() {
        var target = $('#wallToLeadPostClearance'),
            width = $('#input_2_13').val(),
            pocket = $('#input_2_26').val(),
            stack = $('#stackCollapsedSize span').text(),
            // stack = parseInt(stack),
            num = Number(width) - Number(stack);

        if ($.isNumeric(pocket) && pocket > 0) {
            num = num + Number(pocket);
        }
        // first clear existing values
        $(target).empty();

        $(target).append(num + '"');

    }

    function stackImgInit() {
        var panelImgSection = $('#field_2_43'),
            collapseImgSection = $('#field_2_44');


        stackImgArray(panelImgSection);
        stackImgArray(collapseImgSection);
    }

    function stackImgArray(el) {

        var str = el[0].innerText,
            txt = str.split("\n"),
            ext = '.png',
            arr = [];

        for (var i = 0; i < txt.length; i++) {
            arr.push(txt[i] + ext);
        }

        renderStackImgs(el, arr);
    }

    function renderStackImgs(el, arr) {
        var data = '';
        for (var i = 0; i < arr.length; i++) {
            data += '<div data-stack-img="' + arr[i] + '"></div>';
        }

        var html = stackImgHTML(el[0].id, data);

        document.getElementById(el[0].id).innerHTML = html;
    }

    function stackImgHTML(id, d) {
        var label = '',
            wrap = '';

        if (id === 'field_2_43') {
            label = 'Gate Open';
            wrap = 'stack-open-wrap';
        }
        if (id === 'field_2_44') {
            label = 'Gate Collapsed';
            wrap = 'stack-collapsed-wrap';
        }

        var html = '<label class="gfield_label">' + label + '</label>';
        html += '<div class="ginput_container ginput_container_number">';
        html += '<div id="' + wrap + '">';
        html += d;
        html += '</div></div>';

        return html;
    }

    function showStackImgs() {
        var num = $('#dim-3 span').text(),
            dbl = $('#field_2_46 input:checked').val(),
            url = '/wp-content/uploads/2020/01/';

        showStackOpen(num, dbl, url);
        showStackCollapse(num, dbl, url);

    }

    function showStackOpen(num, dbl, url) {

        var set = $('#stack-open-wrap div');

        $(set).each(function() {

            var data = $(this).data('stack-img'),
                sNum = data.match(/\d+/),
                doub = data.match(/double/),
                img = '';

            if (sNum[0] === num) {
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

    function showStackCollapse(num, dbl, url) {

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

    function flipConfig(a) {
        var val = a[0].value,
            img = $('#gate-img'),
            stL = $('#stack-left-cont'),
            stR = $('.stack-right-container'),
            st1 = $('#stack-collapsed-wrap img'),
            st2 = $('#stack-open-wrap img');

        if (val === 'Left') {
            // flip gate image
            $(img).css('transform', 'scaleX(1)');

            // 
            flipLeft(st1, st2);

            // flip stack/post clearance measurments
            if (stL.prev().is(stR)) {
                $(stL).after(stR);
            }

        } else {
            // flip gate image
            $(img).css('transform', 'scaleX(-1)');

            // 
            flipRight(st1, st2);

            // flip stack/post clearance measurments
            if (stL.next().is(stR)) {
                $(stL).before(stR);
            }

        }
    }

    function flipLeft(a, b) {
        var target = $.merge(a, b).parent().parent();

        $(target).find('div').each(function() {
            $(this).removeClass('right').addClass('left');
        });

    }

    function flipRight(a, b) {
        var target = $.merge(a, b).parent().parent();

        $(target).find('div').each(function() {
            $(this).removeClass('left').addClass('right');
        });
    }

    function toggleJambState() {

        //First remove jamb-hold class
        $('#field_2_48 input').removeClass('jamb-hold');

        // Get number of gates and set jamb state
        var num = parseFloat($('div[name="number-of-gate-panels"] span').text());

        setJamb(num);

    }

    function doubleGateChanges() {
        var jambInput = $('#field_2_48 input');

        doubleGateTrue = $('#choice_2_46_0').is(':checked');

        if (doubleGateTrue === true) {
            //deselect forward away
            $(jambInput).prop("checked", false);
            $(jambInput).prop("checked", false);
            //disable the selection of forward/away
            $(jambInput).attr('disabled', true);

            //change appearance of these targets
            $(jambInput).css('opacity', '.2');
            $(jambInput).parent().addClass('disabled');

            //hide gate open image
            document.getElementById('stack-open-wrap').style.opacity = 0;

            //break function
            return;

        }

        if (doubleGateTrue === false) {
            //enable the selection of forward/away
            $(jambInput).attr('disabled', false);
            //restore appearance
            $(jambInput).css('opacity', '1');
            $(jambInput).parent().removeClass('disabled');

            //show gate open image
            document.getElementById('stack-open-wrap').style.opacity = 1;

        }

        return;
    }

    function setJambHold(a) {
        $('#field_2_48 input').removeClass('jamb-hold');
        $(a).addClass('jamb-hold');
    }

    function limitSet() {
        var width = $('#input_2_13'),
            height = $('#input_2_14'),
            pocket = $('#input_2_26'),
            combinedWidth = $('#input_2_51'),
            quant = $('#input_2_24'),
            quant2 = $('#footer-quantity'),
            wPSum = $('#input_2_45');

        setMinMax(width, $width_min, $width_max);
        setMinMax(wPSum, $width_min, $width_max);
        setMinMax(combinedWidth, 0, $width_max);
        setMinMax(height, $height_min, $height_max);
        setMinMax(pocket, 0, $pocket_max);
        setMinMax(quant, 0, $quantity_max);
        setMinMax(quant2, 0, $quantity_max);
    }

    function setMinMax(el, min, max) {
        $(el).attr('min', min);
        $(el).attr('max', max);
        $(el).addClass('check-limits');

        inputMinMax(el);

    }

    function inputMinMax(el) {

        var max = parseInt($(el).attr('max'));
        var min = parseInt($(el).attr('min'));

        if ($(el).val() > max) {

            $(el).val(max);

        } else if ($(el).val() < min) {

            $(el).val(min);
        }
    }

    function widthPocketSum(a) {
        var width = a[0].value,
            pocket = $('#input_2_26').val();

        if (!$.isNumeric(pocket)) {
            pocket = 0;
        }

        var sum = Number(width) + Number(pocket),
            target = $('#input_2_45');

        $(target).val(sum);

        //combinedLimit(sum);
    }


})(jQuery);