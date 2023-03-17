(function($) {
    $(window).load(function() {

        /*

            ===========  *  FUNCTIONS  *  ===========

        */

        panelFrameInit();

        /*

            ===========  *  ACTIONS  *  ===========

        */

        // only allow one panel selection at a time (for non-vision panels)
        // and disable side channel selection for alumifold panels
        $(document).on('click', '.panel-item.gate-render .gfield_radio label', function(e) {
            var input = $(this).closest(input);
            $(".panel-item.gate-render .gfield_radio input").not(input).prop("checked", false);

            var src;
            if (e.target.src !== undefined) {
                src = e.target.src;
            } else {
                src = e.target.children[0].src;
            }

            var alumifold = src.includes("alumifold") || src.includes("perforated");

            if (alumifold === true) {
                toggleSideChannel('disable');
            } else {
                toggleSideChannel('enable');
            }

        });

        //If Special Finish is selected toggle input field
        //and toggle rush shipping (disabled if special finsih)
        $(document).on('change', '#field_2_89 input', function() {
            var a = $(this);
            toggleColorType(a);
            toggleRushShipping(a);
        });


    });

    function panelFrameInit() {

        //console.log(getFuncName());

        var swatch = $('.swatch');

        swatchInit();


        // set panel position data
        setPositionData();

        classSet(swatch);

        //add class for new images
        newEraImage();

        additionalClassSet();

        imgData(swatch);

    }

    function swatchInit() {

        //console.log(getFuncName());

        var swatches = $('.swatch label');
        $(swatches).each(function() {

            var attr = $(this).attr('for');
            if (typeof attr !== typeof undefined && attr !== false) {
                var img = swatchImage(this);
                var txt = $(this).siblings('input').val();
                $(this).text(txt);

                $(this).prepend(img);
            }
        });

    }

    function swatchImage(s) {

        //console.log(getFuncName());

        var src = $(s).text(),
            img = '<img class="swatch-image" src="' + src + '">';

        return img;
    }

    function setPositionData() {

        //console.log(getFuncName());

        $('#input_2_37').find('option').each(function() {

            var value = $(this).val(),
                position;

            if ($.isNumeric(value)) {
                position = parseInt(value) + 2;
            }
            if (value === "Center") {
                position = 'center';
            }
            if (value === '1') {
                position = 'right';
            }

            $(this).attr('data-position', position);
        });
    }

    function classSet(s) {

        //console.log(getFuncName());

        $(s).each(function() {
            var family = $(this).find('.gfield_label').text();

            family = format(family);

            var items = $(this).find('.gfield_radio li');

            $(items).each(function() {
                var name = $(this).find('label').text();
                name = format(name);
                $(this).addClass(name + ' ' + family);
            });
        });

    }

    function additionalClassSet() {
        $('#input_2_89 li').addClass('no-gate-render');
    }

    function format(f) {

        //console.log(getFuncName());

        var g = f.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/-+/g, '-').toLowerCase();
        return g;
    }

    function imgData(s) {

        //console.log(getFuncName());

        // TODO: remove start end numbers from getImgArr
        var birchPanels = getImgArr('panels-birch', 'old'),
            cherryPanels = getImgArr('panels-cherry', 'old'),
            acrylicPanels = getImgArr('panels-acrylic-bronze', 'old'),
            bronzePerfPanels = getImgArr('panels-bronze-perforated', 'old'),
            clearPerfPanels = getImgArr('panels-clear-perforated', 'old'),
            chalkPanels = getImgArr('panels-chalk', 'old'),
            whitePanels = getImgArr('panels-white', 'old'),

            hardwoodMahoganyPanels = getImgArr('panels-hardwood-mahogany', 'new'),
            maplePanels = getImgArr('panels-maple', 'new'),
            oakPanels = getImgArr('panels-oak', 'new'),
            walnutPanels = getImgArr('panels-walnut', 'new'),
            vinylMahoganyPanels = getImgArr('panels-vinyl-mahogany', 'new'),
            darkOakPanels = getImgArr('panels-dark-oak', 'new'),
            lightOakPanels = getImgArr('panels-light-oak', 'new'),
            teakPanels = getImgArr('panels-teak', 'new'),
            amethystPanels = getImgArr('panels-amethyst', 'new'),
            rattanPanels = getImgArr('panels-rattan', 'new'),
            tahitiPanels = getImgArr('panels-tahiti', 'new'),
            blackPanels = getImgArr('panels-black', 'new'),
            grayPanels = getImgArr('panels-gray', 'new'),
            tanPanels = getImgArr('panels-tan', 'new'),
            alumifoldBronzePanels = getImgArr('panels-alumifold-bronze', 'new'),
            alumifoldClearPanels = getImgArr('panels-alumifold-clear', 'new'),
            alumifoldGoldPanels = getImgArr('panels-alumifold-gold', 'new'),
            alumifoldPerforatedGoldPanels = getImgArr('panels-alumifold-perforated-gold', 'new'),
            alumifoldPerforatedBlackPanels = getImgArr('panels-alumifold-perforated-black', 'new'),
            alumifoldPerforatedWhitePanels = getImgArr('panels-alumifold-perforated-white', 'new'),
            acrylicSmokePanels = getImgArr('panels-acrylic-smoke', 'new');

        $(s).each(function() {

            var items;

            if ($(this).hasClass('panel-item')) {

                items = $(this).find('.gfield_radio li');

                $(items).each(function() {
                    var $item = $(this);

                    if ($item.hasClass('acrylic-bronze')) {
                        setPanelData(acrylicPanels, $item);
                    }
                    if ($item.hasClass('acrylic-smoke')) {
                        setPanelData(acrylicSmokePanels, $item);
                    }
                    if ($item.hasClass('salmon')) {
                        setPanelData(amethystPanels, $item);
                    }
                    if ($item.hasClass('birch')) {
                        setPanelData(birchPanels, $item);
                    }
                    if ($item.hasClass('black')) {
                        setPanelData(blackPanels, $item);
                    }
                    if ($item.hasClass('bronze') && $item.hasClass('alumifold-solid')) {
                        setPanelData(alumifoldBronzePanels, $item);
                    }
                    if ($item.hasClass('chalk')) {
                        setPanelData(chalkPanels, $item);
                    }
                    if ($item.hasClass('cherry')) {
                        setPanelData(cherryPanels, $item);
                    }
                    if ($item.hasClass('clear') && $item.hasClass('alumifold-solid')) {
                        setPanelData(alumifoldClearPanels, $item);
                    }
                    if ($item.hasClass('gold') && $item.hasClass('alumifold-solid')) {
                        setPanelData(alumifoldGoldPanels, $item);
                    }
                    if ($item.hasClass('gray')) {
                        setPanelData(grayPanels, $item);
                    }
                    if ($item.hasClass('mahogany') && $item.hasClass('natural-hardwood-veneers')) {
                        setPanelData(hardwoodMahoganyPanels, $item);
                    }
                    if ($item.hasClass('mahogany') && $item.hasClass('vinyl-laminate-woodgrains')) {
                        setPanelData(vinylMahoganyPanels, $item);
                    }
                    if ($item.hasClass('maple')) {
                        setPanelData(maplePanels, $item);
                    }
                    if ($item.hasClass('red-oak') || $item.hasClass('natural-oak') || $item.hasClass('alder')) {
                        setPanelData(oakPanels, $item);
                    }
                    if ($item.hasClass('dark-oak')) {
                        setPanelData(darkOakPanels, $item);
                    }
                    if ($item.hasClass('light-oak')) {
                        setPanelData(lightOakPanels, $item);
                    }
                    if ($item.hasClass('perforated-black') || $item.hasClass('alumifold-perforated') && $item.hasClass('black')) {
                        setPanelData(alumifoldPerforatedBlackPanels, $item);
                    }
                    if ($item.hasClass('perforated-bronze') || $item.hasClass('alumifold-perforated') && $item.hasClass('bronze')) {
                        setPanelData(bronzePerfPanels, $item);
                    }
                    if ($item.hasClass('perforated-gold') || $item.hasClass('alumifold-perforated') && $item.hasClass('gold')) {
                        setPanelData(alumifoldPerforatedGoldPanels, $item);
                    }
                    if ($item.hasClass('perforated-silver') || $item.hasClass('alumifold-perforated') && $item.hasClass('clear')) {
                        setPanelData(clearPerfPanels, $item);
                    }
                    if ($item.hasClass('perforated-white') || $item.hasClass('alumifold-perforated') && $item.hasClass('white')) {
                        setPanelData(alumifoldPerforatedWhitePanels, $item);
                    }
                    if ($item.hasClass('rattan')) {
                        setPanelData(rattanPanels, $item);
                    }
                    if ($item.hasClass('tahiti')) {
                        setPanelData(tahitiPanels, $item);
                    }
                    if ($item.hasClass('tan') || $item.hasClass('mdf-no-finish') || $item.hasClass('custom')) {
                        setPanelData(tanPanels, $item);
                    }
                    if ($item.hasClass('teak')) {
                        setPanelData(teakPanels, $item);
                    }
                    if ($item.hasClass('walnut')) {
                        setPanelData(walnutPanels, $item);
                    }
                    if ($item.hasClass('white')) {
                        setPanelData(whitePanels, $item);
                    }
                });
            }
            if ($(this).hasClass('frame-item')) {

                items = $(this).find('.gfield_radio li');

                $(items).each(function() {
                    var $item = $(this);
                    setFrameData($item);
                });
            }
        });
    }

    function getImgArr(type, era) {

        // console.log(getFuncName());

        var url;
        var resolution;

        if (era === 'old') {
            url = '/wp-content/uploads/2019/12/' + type + '-position-';
            resolution = '-397x768';
        }

        if (era === 'new') {
            url = '/wp-content/uploads/2021/04/' + type + '-position-';
            resolution = '-405x768';
        }

        var arr = [];

        for (var i = 1; i <= 10; i++) {
            arr.push(url + i + resolution + '.png');
        }

        return arr;

    }

    function setPanelData(data, el) {

        var length = data.length,
            start = 1,
            input = $(el).find('input');
        for (var i = 0; i < length; i++) {
            var e = start + i;
            $(input).attr('data-panel-position-' + e, data[i]);
        }
    }

    function setFrameData(el) {

        //console.log(getFuncName());
        var res,
            url;

        if ($(el).hasClass("new-era-img")) {
            res = '-405x768',
                url = '/wp-content/uploads/2021/04/';
        } else {
            res = '-397x768',
                url = '/wp-content/uploads/2019/12/';
        }

        var second = getXClass(el, 2),
            actual = second.replace(/^anodized\-/g, '') + res + '.png',
            third = getXClass(el, 3);

        if (testPattern(third, /post/) == true) {
            url = url + 'post-connectors-' + actual;
        }

        if (testPattern(third, /track/) == true) {
            url = url + 'track-' + actual;
        }

        if (testPattern(third, /hinge/) == true) {
            url = url + 'hinge-hardware-' + actual;
        }

        if (testPattern(third, /channel/) == true) {
            url = url + 'side-channel-' + actual;
        }

        var input = $(el).find('input');
        $(input).attr('data-frame-item', url);

    }

    function getXClass(el, position) {

        //console.log(getFuncName());

        return el[0].classList[position];

    }

    function testPattern(a, b) {

        //console.log(getFuncName());

        var exists = b.test(a);
        var result = false;

        if (exists) {
            result = true;
        }

        return result;
    }

    function toggleColorType(selected) {
        var option = $(selected).val();

        if (option === 'Special Finish') {
            $('#field_2_90').css('visibility', 'visible')
                .find('input').prop('disabled', false);
        } else {
            $('#field_2_90').css('visibility', 'hidden')
                .find('input').val('').prop('disabled', true);
        }
    }

    function toggleRushShipping(el) {
        var rush = document.getElementById('choice_2_39_1');

        if (el[0].id === 'choice_2_89_2' && rush.checked === true) {
            var allow = confirm('Rush shipping is not allowed for Special Finish orders. Do you wish to continue?');

            if (allow === false) {
                $('#label_2_89_0').click();
                return;
            } else {
                rush.checked = false;
            }
        }

        if (el[0].id === 'choice_2_89_2') {

            rush.disabled = true;
        }

        if (el[0].id !== 'choice_2_89_2' && document.querySelector('.rush-error') !== null) {

            rush.disabled = false;
        }
    }

    function newEraImage() {
        var newSideChannels = $('#frames-items-right .side-channels .swatch-image[src*="2021"]');
        var otherNewFrameItems = $('#frames-items-right li[class*="powder"], #frames-items-right .lead-post-connector');

        $(newSideChannels).closest('li').addClass('new-era-img');
        $(otherNewFrameItems).addClass('new-era-img');
    }

    function getFuncName() {
        return getFuncName.caller.name
    }

    function toggleSideChannel(state) {
        var target = $('#input_2_34 input');
        if (state === 'disable') {
            $(target).prop('disabled', true).addClass('disabled');
        } else {
            $(target).prop('disabled', false).removeClass('disabled');
        }
    }

})(jQuery);