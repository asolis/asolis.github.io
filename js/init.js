// JavaScript Document

$(document).ready(function () {
	$('.navbar a').click(core.viewPageSection);
	$('.bibtex').bibtexjs();
	$('.projects').projectsjs();
	$('.things-container a').click(core.downloadResource);
	$('[data-toggle="tooltip"]').tooltip();
	$('a.social[target="download"]').click(core.downloadCV);
	$('a.social[target!="download"]').click(core.viewSocial);
	$('.contact-details a:not(.social)').click(core.viewSocial);
	$('.thesis_item a').click(core.viewPublication);
});

var checkIntroImage = function() {
	var key_h = 0;
	var win = $(window);
	var win_w = win.width();
	var win_h = win.height();
	var img_w = 2800;
	var img_h = 2368;
	var img_h_point = 730;
	var border = 70;
	if (!navigator.userAgent.match(/(iPod|iPhone|iPad)/))
	{
		if ((win_w / win_h) < (img_w / img_h)) {
		  key_h = ((img_h_point * win_h )/ img_h) - border;
		} else {
		  key_h = ((img_h_point * win_w )/ img_w) - border;
		}
	} 
	else 
	{
		key_h = ((img_h_point * win_w )/ img_w) - border;
	}
	$('.intro-section').css('background-position', 'auto ' + (-key_h) +'px' );
	$('.intro-section').css('background-position-y', '' + (-key_h) +'px' );
	
};

$( window ).on( "orientationchange",checkIntroImage);
$(window).load(checkIntroImage);
$(window).resize(checkIntroImage); 

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});


$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top 
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});