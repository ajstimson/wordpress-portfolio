<?php

/**
* Template Name: Primary Page Template
*/
 
/* 

    VARS

*/   

$field = get_fields();
$case_type = $field['case_type'];

if (!empty($field['client_enrollment_link'])){

    $enrollment_button = '<a href="' . $field['client_enrollment_link'] . '" class="button enrollment-button">Enroll Now</a>';

} else {

    $enrollment_button = '';

}

$marquee_type = $field['marquee_type'];

if ( $marquee_type  === 'productV1' || $marquee_type  === 'productV2' ){
    $marquee_background = '/wp-content/uploads/2020/07/MarqueeFull-ConnectedDotsPattern-1920x700-1.png';
}
if ( $marquee_type  === 'productV1' ){
    $marquee_image = '/wp-content/uploads/2020/07/product-hero-v1.png';
}
if ( $marquee_type  === 'productV2' ){
    $marquee_image = '/wp-content/uploads/2020/07/product-hero-v2.png';
}
if ($marquee_type  === 'lifestyle'){
    $marquee_background = '/wp-content/uploads/2020/07/white-gradient.svg';
    $marquee_image = '/wp-content/uploads/2020/07/lifestyle-hero-full.jpg';
}   
if ($marquee_type  === 'geometric'){
    $marquee_background = '/wp-content/uploads/2020/07/BreachMicro_PatternHero_1920x391.jpg';
}

// echo '<pre>';
// print_r( $field );
// echo '</pre>';

add_filter( 'language_attributes', 'add_js_class_to_html_tag', 10, 2 );
/**
 * Add 'no-js' class to <html> tag in order to work with Modernizr.
 *
 * (Modernizr will change class to 'js' if JavaScript is supported).
 *
 * @since 1.0.0
 *
 * @param string $output A space-separated list of language attributes.
 * @param string $doctype The type of html document (xhtml|html).
 *
 * @return string $output A space-separated list of language attributes.
 */

function add_js_class_to_html_tag( $output, $doctype ) {
	if ( 'html' !== $doctype ) {
		return $output;
	}

	$output .= ' class=" js"';

	return $output;
}

add_filter( 'body_class','body_classes' );

function body_classes( $classes ) {
 
    $classes[] = 'front-page';
    $classes[] = 'page';
    $classes[] = 'js';
    $classes[] = 'theme-genesis';
     
    return $classes;
     
}

add_filter( 'body_class', 'remove_body_class', 10, 2 );
function remove_body_class( $wp_classes, $extra_classes)
{
    // List of the only WP generated classes that are not allowed
    $blacklist = array( 'no-js' );
    
    $wp_classes = array_diff( $wp_classes, $blacklist );

    // Add the extra classes back untouched
    return array_merge( $wp_classes, (array) $extra_classes );
}

add_action( 'wp_print_styles', 'remove_assets', PHP_INT_MAX );
function remove_assets() {
    //wp_dequeue_script('corporate-pro-menus');
    //wp_deregister_script('corporate-pro-menus');
}

remove_theme_support( 'genesis-inpost-layouts' );
remove_theme_support( 'genesis-menus' );


$hooks = array(
    'genesis_before',
    'genesis_before_loop',
    'genesis_markup',
    'genesis_markup_site-container',
    'genesis_attr_site-container',
    'genesis_attr_site-container_output',
    'genesis_markup_site-container_open',
    'genesis_markup_site-container_close',
    'genesis_markup_site-container_content',
    'genesis_before_header',
    'genesis_skip_links_output',
    'genesis_header_markup_open',
    'genesis_before_title_area',
    'genesis_after_title_area',
    'genesis_header',
    'genesis_header_markup_close',
    'genesis_after_header_wrap',
    'genesis_after_header',
    'genesis_do_nav',
    'genesis_attr_site-inner',
    'genesis_attr_site-inner_output',
    'genesis_before_content_sidebar_wrap',
    'genesis_markup_hero-section',
    'genesis_attr_hero-section',
    'genesis_attr_hero-section_output',
    'genesis_markup_hero-section_open',
    'genesis_markup_hero-section_close',
    'genesis_markup_hero-section_content',
    'corporate_custom_header',
    'corporate_hero_section',
    'genesis_before_endwhile',
    'genesis_entry_header',
    'genesis_before_entry',
    'genesis_attr_entry-content',
    'genesis_attr_entry-content_output',
    'genesis_markup_entry-content_open',
    'genesis_markup_entry-content_close',
    'genesis_markup_entry-content_content',
    'genesis_entry_content',
    'genesis_markup_close',
    'genesis_after_entry_content',
    'genesis_after_endwhile',
    'genesis_do_post_content',
    'genesis_post_content',
    'the_title',
    'the_content',
    'genesis_post_title_text',
    'genesis_pre_get_option_semantic_headings',
    'genesis_entry_title_wrap',
    'genesis_markup_entry-title',
    'genesis_attr_entry-title',
    'genesis_attr_entry-title_output',
    'genesis_markup_entry-title_open',
    'genesis_markup_entry-title_close',
    'genesis_markup_entry-title_content',
    'genesis_markup_close',
    'genesis_post_title_output',
    'genesis_footer',
    'genesis_after'
);

foreach ( $hooks as $hook ) {
    remove_all_actions( $hook );
}

add_filter( 'genesis_markup_site-inner', '__return_null' );
add_filter( 'genesis_markup_content-sidebar-wrap_output', '__return_false' );
add_filter( 'genesis_markup_content', '__return_null' );
add_filter('genesis_markup_content-sidebar-wrap_content', '__return_null');
add_filter( 'genesis_markup_entry_content', '__return_null');
add_filter( 'genesis_markup_content-sidebar-wrap', '__return_null' );


// $debug_tags = array();
// add_action( 'all', function ( $tag ) {
//     global $debug_tags;
//     if ( in_array( $tag, $debug_tags ) ) {
//         return;
//     }
//     echo "<pre>" . $tag . "</pre>";
//     $debug_tags[] = $tag;
    
// } );


add_action( 'get_header', 'password_protected' );
function password_protected() {

if ( post_password_required() ) {

    echo '<style>';
    echo form_style();
    echo '</style>';

    echo '<img src="/wp-content/uploads/2020/06/my-id-care-logo.svg" alt="MyIDCare">';
    echo get_the_password_form();

    exit;

    }
}

function form_style(){
    $css = '
            body{ 
                display: flex;
                height: 100vh;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: Helvetica, Arial, sans-serif;
                font-size: calc(0.75em + 1vmin);
            }
            img{
                min-width: 320px;
            }
            form{
                text-align: center;
            }
            p {
                max-width: 24rem;
                line-height: 1.75;
            }
            input {
                display: block;
                margin: 5% auto;
                border: 2px solid #00c496;
                border-radius: 1rem;
                line-height: 3em;
            }

            input[type="password"]:focus {
                outline: none;
            }

            input[type="password"] {
                padding: 0 5%;
            }

            input[type="submit"] {
                background: #00c496;
                text-transform: uppercase;
                color: #fff;
                font-weight: 700;
                padding: 0 3.333333em;
                transition: all 0.3s ease;
                min-height: 3em;
                min-width: 220px;
            }

            input[type="submit"]:hover {
                background-color: #fff;
                color: #00c496;
            }
            ';
    
    return $css;
}

genesis();

?>

<?php 
    
    /* 
    
    PHP FUNCTIONS

    */   
    
    function slugify($text){
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
        
            return 'n-a';

        }

        return $text;
    }

    function multi_menu($field){
        $multi_class = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children scroll-to">';
        $menu_link = '<a href="#faq" class="sf-with-ul">FAQ</a>';
        $sub_menu_toggle = '<button class="sub-menu-toggle" aria-expanded="false" aria-pressed="false"><span class="screen-reader-text">FAQ Sections</span></button>';
        $sub_menu_open = '<ul class="sub-menu">';
        $sub_menu_content = '';
        $sub_menu_close = '</ul>';

        for($i = 0; $i < count( $field['faq_multi_sections'] ); ++$i) {
            $sub_menu_anchor = slugify($field['faq_multi_sections'][$i]['section_title']);
            $sub_menu_content .=    '<li class="menu-item sub-menu-item menu-item-type-post_type menu-item-object-page">' . 
                                    '<a href="#' . $sub_menu_anchor . '">' . 
                                    $field['faq_multi_sections'][$i]['section_title'] . '</a></li>';

        }

        return $multi_class . $menu_link . $sub_menu_toggle . $sub_menu_open . $sub_menu_content . $sub_menu_close;

    }

    function press_release_content($pr_array){
        $pr = '';
        for($i = 0; $i < count( $pr_array ); ++$i) {
            $date = '<span class="release-date">'. $pr_array[$i]['entry_date'] . ' — </span>';
            $content = $pr_array[$i]['entry_content'];
            $start = strpos($content, '<p>');

            if (!empty($pr_array[$i]['entry_date'])){

                $release = substr($content, 0, $start+3) . $date . substr($content, $start+3);

            } else {

                $release = $content;
            }
            

            $pr .=   '<hr class="section-seperator">' . $release;

        }

        return $pr;
    }

    function enrollment_cards($enrollment_array){
        $cards = '<ul class="flex-parent enrollment-cards">';

        for($i = 0; $i < count( $enrollment_array ); ++$i) {

            $cards .=   '<li class="card-item flex-child">' .
                        ' <div class="card-content">' . 
                        '<img class="icon" src="' . $enrollment_array[$i]['icon'] .'" />' .
                        '<p class="card-title">'. $enrollment_array[$i]['enrollment_right_title'] . '</p>' . 
                        '<p class="card-text">'. $enrollment_array[$i]['enrollment_right_p'] . '</p>' .
                        '</div></li>';

        }

        $cards .= '</ul>';

        return $cards;
    }

    function faq_sections($type, $faq_array){

        $faqs = '';
        //type 1 = multi
        if ( $type === 1 ){

            for($i = 0; $i < count( $faq_array ); ++$i) {

                $faqs .=   '<ul id="' . slugify($faq_array[$i]['section_title']) . '" class="faq-section flex-child flex-column-' . $faq_array[$i]['section_width'] . '">' .
                                '<li class="section-title"><p class="section-title">' . $faq_array[$i]['section_title'] . '</p></li>' .
                                '<li class="section-seperator"><hr></li>' . 
                                '<ul class="faq-items">';
                
                for($j = 0; $j < count( $faq_array[$i]['faq_items'] ); ++$j) {
                    $faq_sub_array = $faq_array[$i]['faq_items'][$j];
                    $faqs .=    '<ul class="faq-item accordion-toggle">' .
                                    '<li class="faq-question"><a href="#content-' . $i . '-' . $j . '" class="accordion-toggle">' . $faq_sub_array['question_text'] . '</a></li>' .
                                    '<li id="content-'. $i . '-' . $j . '" class="faq-answer accordion-content"><p>' . $faq_sub_array['answer_text'] . '</p></li>' .
                                '</ul>';
                }
                
                $faqs .=    '</ul></ul>';
    
            }

        } else {

            $faqs .= '<ul class="faq-section flex-column-full">';

            
            for($i = 0; $i < count( $faq_array ); ++$i) {

                $faqs .=    '<ul class="faq-item accordion-toggle">' . 
                                '<li class="faq-question"><a href="#content-' . $i . '" class="accordion-toggle">' . $faq_array[$i]['faq_single_question'] . '</a></li>' .
                                '<li id="content-'. $i . '" class="faq-answer accordion-content"><p>' . $faq_array[$i]['faq_single_answer'] . '</p></li>' . 
                            '</ul>';

            }

            $faqs .= '</ul>';

        }

        return $faqs;

    }

    function additional_resources_section($ar_array){
        $ar = '<h2>Additional Resources</h2>';

        for($i = 0; $i < count( $ar_array ); ++$i) {

            $ar .=  '<ul class="ar-section flex-column-full">' .
                        '<li class="section-title"><p class="section-title">' . $ar_array[$i]['additional_info_title'] . '</p></li>' .
                        '<li class="section-seperator"><hr></li>' .
                        '<li class="section-content">' . $ar_array[$i]['additional_info_content'] . '</li>' .
                    '</ul>';
            
        }

        return $ar;
    }

?>

<script type="text/javascript" src="https://www.bugherd.com/sidebarv2.js?apikey=fjfdndb3esqjo7rmpxo6lw" async="true"></script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KZF4FNH');</script>
<!-- End Google Tag Manager --> 
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KZF4FNH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) --> 
<div id="top" class="site-container" id="top">
    <ul class="genesis-skip-link"><li><a href="#genesis-mobile-nav-primary" class="screen-reader-shortcut"> Skip to primary navigation</a></li><li><a href="#genesis-content" class="screen-reader-shortcut"> Skip to main content</a></li><li><a href="#genesis-footer-widgets" class="screen-reader-shortcut"> Skip to footer</a></li></ul>
    <div id="page-<?php echo slugify($case_type); ?>" class="<?php echo 'branded-' . $field['branded'];?>">
        <header id="primary-header" class="site-header" itemscope="" itemtype="https://schema.org/WPHeader">
            <div class="wrap">
                <div class="title-area" itemscope="itemscope" itemtype="http://schema.org/Organization">

                    <?php 

                        if ( $field['branded'] === true) {

                            echo '<a href="#" class="custom-logo-link" rel="home">';
                            echo '<img src="/wp-content/uploads/2020/06/my-id-care-logo.svg" class="custom-logo" alt="MyIDCare">';
                            echo '</a>';

                        }

                    ?>

                    <p class="site-title hidden" itemprop="name"><?php printf( get_bloginfo ( 'name' ) ); ?></p>

                    <p class="site-description hidden"><?php printf( get_bloginfo ( 'description' ) ); ?></p>

                </div>

                <button class="menu-toggle" aria-expanded="false" aria-pressed="false" id="genesis-mobile-nav-primary"><span></span></button>
            
                <nav class="nav-primary genesis-responsive-menu" aria-label="Main" id="genesis-nav-primary">
                    <div class="wrap">
                        <ul id="menu-header-menu" class="menu genesis-nav-menu menu-primary js-superfish sf-js-enabled sf-arrows">
                        
                            <li class="menu-item menu-item-type-post_type menu-item-object-page scroll-to">
                                <a href="#marquee">Home</a>
                            </li>
                            <?php if ( $field['display_enrollment'] === true): ?>
                            <li class="menu-item menu-item-type-post_type menu-item-object-page scroll-to">
                                <a href="#enrollment">Enrollment</a>
                            </li>

                            <?php endif; ?>
                            
                            <?php if ( $field['display_faq'] === true ): ?>
                                    
                                    <?php if ( $field['faq_section_type'] === 'multi'):
                                        
                                            echo multi_menu($field);
                                    
                                        else:
                                        
                                            echo '<li class="menu-item menu-item-type-post_type menu-item-object-page scroll-to">'; 
                                            echo '<a href="#faq">FAQ</a> </li>';

                                        endif;   
                                    ?>
                                
                            <?php endif; ?>

                            <?php if ( $field['display_additional_resources'] === true ):

                                echo '<li class="menu-item menu-item-type-post_type menu-item-object-page">'; 
                                echo '<a href="#additional-resources">Additional Resources</a> </li>';

                            endif; ?>

                        </ul>
                    </div>
                </nav>

                <?php if ( $field['display_enrollment'] === true): ?>
                                    
                    <div class="widget-area header-widget-area">
                        <section class="widget_text widget widget_custom_html">
                            <div class="widget_text widget-wrap">
                                <div class="textwidget custom-html-widget">

                                    <?php echo $enrollment_button; ?>

                                </div>
                            </div>
                        </section>
                    </div>

                <?php endif; ?>
                
            </div>
        </header>
        <div class="site-inner">
            <main class="content" id="genesis-content">
                <div id="marquee" class="front-page-widget <?php echo $marquee_type; ?> front-page-1 menu-trigger" data-background="<?php echo $marquee_background; ?>">
                    <?php if ($marquee_type === 'lifestyle'): ?>
                        <div class="background">
                            
                        </div>
                    <?php endif; ?>
                    <div class="wrap">
                        <section class="flex-parent flex-row">
                            <div class="marquee-item flex-child">
                            <?php if (!empty($field['client_logo'])): ?>
                                <div class="logo-wrap">
                                    <img  class="marquee-logo" src="<?php echo $field['client_logo']; ?>" />
                                </div>
                            <?php else: ?>
                                <div class="no-logo">
                                </div>
                            <? endif; ?>
                            
                            <h1><?php echo $field['marquee_title']; ?></h1>
                                
                                <?php if ( !empty($field['marquee_paragraph']) ): ?>

                                    <p><?php echo $field['marquee_paragraph']; ?></p>
                                
                                <?php endif; ?>

                                <div class="marquee-buttons">
                                   <?php 

                                    if ( $field['display_enrollment'] === true){
                                        echo $enrollment_button;
                                    }

                                    if ( $field['display_faq'] === true ){
                                        echo '<a href="#faq" class="button scroll-to">Frequently Asked Questions</a>';
                                    }

                                    ?>
                                </div>
                            </div>

                            <div class="marquee-item flex-child">

                                <?php if (!empty($marquee_image) && $marquee_type != 'lifestyle'): ?>
                                   
                                    <img src="<?php echo $marquee_image;?>" />

                                <?php endif; ?>

                            </div>

                        </section>
                    </div>
                   
                </div>

                <?php if ( $field['display_press_release'] === true ): ?>

                <div id="press-release" class="front-page-widget front-page-0">
                    <div class="wrap">
                        <h2>Notice of Data Breach</h2>
                        <?php echo press_release_content($field['press_release']); ?>
                    </div>
                </div>

                <?php endif; ?>

                <?php if ( $field['display_enrollment'] === true): ?>

                <div id="enrollment" class="front-page-widget front-page-2 menu-trigger" data-menu-trigger="Enrollment">
                    <div class="wrap">
                        <section class="flex-parent">
                            <div class="enrollment-cta flex-child">
                                
                                <h2><?php echo $field['enrollment_left_column'][0]['enrollment_left_title']; ?></h2>
                                
                                <p><?php echo $field['enrollment_left_column'][0]['enrollment_left_p']; ?></p>
                                
                                <?php echo $enrollment_button; ?>

                            </div>

                            <div class="enrollment-cards flex-child">
                            
                                <?php echo enrollment_cards($field['enrollment_right_column']); ?>
                            
                            </div>

                        </section>
                    </div>
                </div>

                <?php endif; ?>
                
                <?php if ( $field['display_faq'] === true): ?>
                    
                    <div id="faq" class="front-page-widget front-page-3 menu-trigger" data-menu-trigger="FAQ">
                        <div class="wrap">
                            <h2>Frequently Asked Questions</h2>
                            <?php if ( $field['faq_section_type'] === 'multi'):
                                    
                                    echo '<div class="flex-parent">';
                                    echo faq_sections(1, $field['faq_multi_sections']);
                                    echo '</div>';
                            
                                else:
                                
                                    echo faq_sections(0, $field['faq_single_section']); 

                                endif;

                            ?>
                        </div>
                    </div>

                <?php endif; ?>

                <?php if ( $field['display_additional_resources'] === true ): ?>

                <div id="additional-resources" class="front-page-widget front-page-4" data-menu-trigger="Additional Resources">
                    <div class="wrap">
                        <?php echo additional_resources_section($field['additional_resources']); ?>
                    </div>
                </div>

                <?php endif; ?>

            </main>
        </div>
        <footer class="site-footer">

        <?php if ( $field['display_enrollment'] === true && !empty($field['cta']) ):?>
            
            <div class="before-footer widget-area">
                <div class="wrap">
                    <section id="custom_html-16" class="widget_text widget widget_custom_html full-width first">
                        <div class="widget_text widget-wrap">
                            <div class="textwidget custom-html-widget">
                                <h5><?php echo $field['cta'][0]['cta_title'] ?></h5>
                                <p class="aligncenter"><?php echo $field['cta'][0]['cta_text'] ?></p>
                                <div class="textwidget custom-html-widget">
                                    <?php echo $enrollment_button; ?>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <?php endif; ?>

            <div class="footer-widgets" id="genesis-footer-widgets">
                <h2 class="genesis-sidebar-title screen-reader-text">Footer</h2>
                <div class="wrap">
                    <div class="flex-parent">
                        <?php if ( !empty($field['footer']) ):?>
                            <?php if ( !empty($field['footer'][0]['logo']) ):?>
   
                            <img src="<?php echo $field['footer'][0]['logo']; ?>" class="footer-logo">

                            <?php endif; ?>

                            <p class="footer-contact"><?php echo $field['footer'][0]['contact_us']; ?></p>

                        <?php endif; ?>

                        <?php
                            echo wp_nav_menu('Footer');
                        ?>

                    </div>
                </div>
            </div>
            <div class="footer-credits widget-area">
                <div class="wrap">
                        <?php

                            dynamic_sidebar('footer-credits');
                            
                        ?>
                </div>
            </div>
        </footer>

            <!--                async js             -->

        <script>

            // TODO: Move to separate file

            /* 
            
                ACTIONS
            
            */

            var container = document.getElementsByClassName('site-container');
            var element = container[0];

            // Remove elements we couldn't remove with filters
            document.body.removeChild(element);

            // Add active menu state when page first loads
            checkForELementInView();

            
            /* 
            
                EVENT LISTENERS 
            
            */

            // TODO: FIND A BETTER SCRIPT TO REPLACE PHONE LINKS
            // convert all telephone numbers to clickable tel links
            // https://stackoverflow.com/a/31657906
            // document.addEventListener('click', function(e) { 
            //     e = e || window.event; 
            //     var target = e.target || e.srcElement; target.innerHTML = target.innerHTML.replace(/(([\d|\(][\d\-.\)\s]*){9,})/g, '<a _was_replaced="true" href="tel://$1">$1</a>'); 
            //     if (!target.getAttribute("_was_replaced")) {
            //         console.log('anonymous function');
            //         console.log(e);
            //         e.preventDefault(); 
            //     } 
            // }, true);
            
            
            // Trigger accordion toggle on click
            document.addEventListener('click', function (event) {
                
                accordionToggle(event);
                
            });

            // Reveal Additional Resources content on click
            document.addEventListener('click', function (event) {

                additionalResourcesToggle(event);

            });

            var menu = document.getElementById('genesis-nav-primary');

            // Reveal Additional Resources content on click
            document.addEventListener('click', function (event) {

                toggleMobileMenu(event, menu);

            });

            document.addEventListener('click', function (event) {

                deactivateMobileMenu(event, menu);

            });
            
            // While scrolling toggle active menu state
            window.addEventListener('scroll', function() {

                checkForELementInView();

            });

            // Get array of menu header links
            var menuItems = document.querySelectorAll('.scroll-to a');
            
            // Loop through array and run smooth scroll function on click
            for (var i = 0; i < menuItems.length; i++) {
                menuItems[i].addEventListener('click', function (e) {
                    smoothScroll(e, null);
                });
            }

            setMarqueeBackground();
            
            // window.addEventListener('resize', setMarqueeBackground);

            /* 
            
                MOBILE 
            
            */

            var width = window.innerWidth;

            if(width < 895){

                mobileEnrollmentButton();

                document.getElementById('genesis-nav-primary').classList.add('mobile-nav-primary');

            }

            /* 
            
                FUNCTIONS
            
            */

            function setMarqueeBackground(){
                
                // var w = window.innerWidth;

                var marquee = document.getElementById('marquee'),
                    background = marquee.dataset.background;

                if ( marquee.classList.contains('lifestyle') ){
                } else {
                    marquee.style.backgroundImage = 'url(' + background + ')'; 
                }

            }

            function accordionToggle(e){
                //Bail if our clicked element doesn't have the right class
                if (!e.target.classList.contains('accordion-toggle')) 
                return;

                var content;

                if (e.target.classList.contains('faq-item')){

                    content = e.target.lastChild;

                } else {

                    content = document.querySelector(e.target.hash);

                }              

                //bail if there is no content   
                if (!content) return;

                var parent = content.parentElement;
                    
                // Prevent default link behavior
                e.preventDefault();
                    
                // If the content is already expanded, collapse it and quit
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    parent.classList.remove('expanded');
                    return;
                }
                    
                // Get all open accordion content, loop through them and close
                var accordions = document.querySelectorAll('.accordion-content.active');
                for (var i = 0; i < accordions.length; i++) {
                    accordions[i].classList.remove('active');
                    accordions[i].parentNode.classList.remove('expanded');
                }
            
                // Toggle our content
                parent.classList.toggle('expanded');
                content.classList.toggle('active');

                if (parent.classList.contains('expanded')){
                    smoothScroll(e, content);
                }
            }

            function additionalResourcesToggle(e){

                //Bail if our the link target is undefined doesn't have the right class
                if ( e.target.text === undefined || e.target.text.indexOf('Additional Resources') === -1 ) return;   

                    
                // /!== -1
                
                //find the content by using the anchor target as an id
                var content = document.querySelector(e.target.hash);
                
                //Bail if there is no content
                if (!content) return;

                // Prevent default link behavior
                e.preventDefault();

                // Reveal content
                content.style.display = "block";

                // Scroll to content
                content.scrollIntoView({
                    behavior: 'smooth'
                });

                //toggle active class for main nav
                content.classList.add('menu-trigger');
                checkForELementInView();

            }

            function checkForELementInView() {

                var targets = document.querySelectorAll('.menu-trigger');

                for (i = 0; i < targets.length; ++i) {
                    var bounding = targets[i].getBoundingClientRect();
                    var active = checkViewport(targets[i], bounding);

                    if ( active !== false ){
                        
                        triggerMenuActive(targets[i].dataset.menuTrigger);
                        
                    }

                }

            }
            
            function checkViewport(el, bounding){
                var elHeight = el.offsetHeight;
                var elWidth = el.offsetWidth;

                if ( bounding.top >= -elHeight 
                        && bounding.left >= -elWidth
                        && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + elWidth
                        && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + elHeight) {

                    return el;

                } else {

                    return false;
                }

            }

            function triggerMenuActive(menuText){
                var menus = document.querySelectorAll("#menu-header-menu .menu-item a"),
                    found,
                    remove;

                for (var i = 0; i < menus.length; i++) {
                    if (menus[i].textContent == menuText) {
                        found = menus[i];
                    } else {
                        menus[i].parentElement.classList.remove('active');
                    }
                }

                if(found !== undefined){
                    found.parentElement.classList.add('active');
                }
                
            }

            function mobileEnrollmentButton(){
                var menu = document.getElementById('menu-header-menu'),
                    headerBtn = document.querySelector('#primary-header .button')
                    enrollmentBtn = document.querySelector('#enrollment .button'),
                    cards = document.querySelector('.enrollment-cards');
                
                menu.appendChild(headerBtn);
                cards.appendChild(enrollmentBtn);
            }

            function toggleMobileMenu(e, menu){
                var target = e.target;
                
                //Bail if our clicked element doesn't have the right id
                if (target.id !== 'genesis-mobile-nav-primary') return;

                menuToggle(target, menu);
                    
            }

            function menuToggle(target, menu){
                // Toggle menu icon animation
                target.classList.toggle('activated');
                // Toggle 
                menu.classList.toggle('activated');
            }

            function deactivateMobileMenu(e, menu){
                var parent = e.target.offsetParent;
                var subMenu = parent.classList[1];

                if (parent.classList.contains('scroll-to') || parent.classList.contains('sub-menu-item')){

                    var target = document.getElementById('genesis-mobile-nav-primary');
                    menuToggle(target, menu);
                
                } else {

                    return;

                };

            }

            function smoothScroll(e, content){

                var id, el, yOffset;
                
                if (content !== null){

                    el = content.parentNode;
                
                } else {

                    e.preventDefault();

                    id = e.target.href.split('#')[1];
                    el = document.getElementById(id);
                    
                }

                var yOffset = -100,
                    y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;


                window.scrollTo({top: y, behavior: 'smooth'});
               
            }

        </script>
    </div>
</div>