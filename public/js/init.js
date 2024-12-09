jQuery(document).ready(function(){

	"use strict";
		
	/*** Svg ***/
	
	function perker_svg(){
		
	jQuery('img.svg').each(function(){
		
		var jQueryimg 		= jQuery(this);
		var imgClass		= jQueryimg.attr('class');
		var imgURL			= jQueryimg.attr('src');

		jQuery.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var jQuerysvg = jQuery(data).find('svg');

			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				jQuerysvg = jQuerysvg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			jQuerysvg = jQuerysvg.removeAttr('xmlns:a');

			// Replace image with new SVG
			jQueryimg.replaceWith(jQuerysvg);

		}, 'xml');

	});
}
perker_svg();
	
	/*** Progress ***/
	
	function tdProgress(container){
		
		container.find('.progress_inner').each(function(i) {
			var progress 		= jQuery(this);
			var pValue 			= parseInt(progress.data('value'), 10);
			var pColor			= progress.data('color');
			var pBarWrap 		= progress.find('.bar');
			var pBar 			= progress.find('.bar_in');
			pBar.css({width:pValue+'%', backgroundColor:pColor});
			setTimeout(function(){pBarWrap.addClass('open');},(i*300));
		});
	}

		jQuery('.perker_progress').each(function() {
			
			var pWrap 			= jQuery(this);
			pWrap.waypoint({handler: function(){tdProgress(pWrap);},offset:'90%'});	
		});
	
	/*** Images ***/
	
	function perker_images(){
		
	var data			= jQuery('*[data-img-url]');
	
	data.each(function(){
		var element		= jQuery(this);
		var url			= element.data('img-url');
		element.css({backgroundImage: 'url('+url+')'});
	});
}
perker_images();
	
	/*** Hero Height ***/
	
	function perker_hero_height(){
		
	var WH		= jQuery(window).height();
	var hero	= jQuery('.perker_hero_wrap');
		
	hero.css({height:WH});
}
perker_hero_height();	
	
	/*** About Top ***/
	
	function perker_about_top(){
		
	var hero	= jQuery('.perker_hero_wrap').height();
	var about	= jQuery('#about');
		
	about.css({marginTop:hero});
}
perker_about_top();	
	
	/*** Menu Backgound ***/
	
	function perker_menu_bg(){
	jQuery(window).on('scroll',function(){
		var WinOffset		= jQuery(window).scrollTop();
		var topBar			= jQuery('.perker_topbar');
		if(WinOffset >= 500){
			topBar.addClass('animate');
		}else{
			topBar.removeClass('animate');
		}
	});
}
perker_menu_bg();
	
	/*** Mobile Menu ***/
	
	function perker_mobile_menu(){
		
	var trigger			= jQuery('.perker_topbar .trigger');
	var triggerMenu		= jQuery('.perker_topbar .trigger .menu');
	var triggerClose	= jQuery('.perker_topbar .trigger .close');
	var dropdown		= jQuery('.perker_topbar .dropdown');
	
	trigger.on('click',function(){
		var element	= jQuery(this);
		if(element.hasClass('opened')){
			element.removeClass('opened');
			triggerMenu.removeClass('opened');
			triggerClose.removeClass('opened');
			dropdown.slideUp();
		}else{
			element.addClass('opened');
			triggerMenu.addClass('opened');
			triggerClose.addClass('opened');
			dropdown.slideDown();
		}
		return false;
	});
}
perker_mobile_menu();	
	
	/*** Anchor ***/
	
	function perker_anchor(){
	
	jQuery('.perker_topbar .menu ul li a,.perker_topbar .dropdown .main ul li a').off().on('click',function(e){
		e.stopPropagation();
		var element = jQuery(this);
		var url			= element.attr('href');
		if(url !== '#' && url.charAt(0) === '#'){
			$('html, body').animate({
				scrollTop: $(url).offset().top-85
			}, 1000);
		}
		return false;
	});
}
perker_anchor();
	
	/*** Appear ***/
	
	function perker_appear(){
		
	var div		= jQuery('.perker_appear');
	
	div.each(function(){
		
		var element	= jQuery(this);
		
		element.waypoint({
			handler:function(){
				element.addClass('load');
			},
			offset:"60%"
		});
		
	});
	
}
perker_appear();
	
	function perker_popup(){
	
		jQuery('.gallery_zoom').each(function() { // the containers for all your galleries
			jQuery(this).magnificPopup({
				delegate: 'a.zoom', // the selector for gallery item
				type: 'image',
				gallery: {
				  enabled:true
				},
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});

		});
	}
	perker_popup();
	
	/*** Ripple ***/
	
	function perker_ripple(){
		
		jQuery('#ripple').ripples({
				resolution: 500,
				dropRadius: 20,
				perturbance: 0.04
			});
	}
	perker_ripple();
	
	/*** Video ***/
	
	$(".youtube-bg").mb_YTPlayer();
	
	/*** Glitch ***/
	
	$(".glitch").mgGlitch({
		destroy: false,
		glitch: true,
		scale: true,
		blend: true,
		blendModeType: "hue",
		glitch1TimeMin: 200,
		glitch1TimeMax: 400,
		glitch2TimeMin: 10,
		glitch2TimeMax: 100
	});
	
	/*** Hero Effect ***/
	
	function perker_hero_effect(){
		
	jQuery(window).on('scroll',function(){
		var currentScroll		= window.pageYOffset;
		jQuery(".perker_hero_wrap,.glitch").css({'transform': 'scale('+(100 - currentScroll/100)/99+')','opacity' : (1 - (currentScroll/20) / 15)});
	});
	
}
	
	/*** Preloader ***/
	
	function perker_preloader(){
		
	var mainPreloader	 = $(".perker_loader-wrapper .loader");
	var WinWidth 		 = $(window).width();
    var WinHeight		 = $(window).height();
    var zero = 0;

    mainPreloader.css({
        top: WinHeight / 2 - 2.5,
        left: WinWidth / 2 - 200
    });

    do {
        mainPreloader.animate({
            width: zero
        }, 10);
        zero += 3;
    } while (zero <= 400);
    if (zero === 402) {
        mainPreloader.animate({
            left: 0,
            width: '100%'
        });
        mainPreloader.animate({
            top: '0',
            height: '100vh'
        });
    }
		
    setTimeout(function() {
        $(".perker_loader-wrapper").fadeOut('fast');
        (mainPreloader).fadeOut('fast');
    }, 4500);
}
	jQuery(window).on('scroll',function(){
		perker_hero_effect();
	});

	jQuery(window).on('resize',function(){
		perker_hero_height();
	});

	jQuery(window).load('body', function(){
		setTimeout(function(){perker_preloader();},1000);
		setTimeout(function(){jQuery('.perker_hero_wrap .hero_texts,.perker_hero_wrap_video .hero_texts').addClass('animate');},6000);
	});
});