var metadata;

$(function () {
	/// Initialization function - binds event with buttons and prepare the stage
	
	/// React to the screen size change
	$(window).bind('resize', adjustMainMenu);
	adjustMainMenu();
	
	$('#menu a').bind('click', function () {
		$('#header').removeClass('projects blog tags aboutme');
		$('#header').addClass($(this).attr('class'));
	});
	
	// Show/hide filters window
	$('#contacts-menu-btn').bind('click', function () {
		if ($('#contacts').css('display') === 'none') {
			$('#contacts').slideDown();
			$(this).addClass('active');
		} else {
			$('#contacts').slideUp(400, function () { $('#contacts-menu-btn').removeClass('active'); });			
		}
	});	
	
	// Send email
	$('#email').bind('click', function () {
		window.open('mailto:dominikcyg+w' + String.fromCharCode(64) + 'gmail.com');
	});	
	
	$('#header, #content').bind('click', function () {
		fadeText(this, intro);
		$( 'div.window' ).removeClass('selected');			
	});
		
	$('.entry').bind('click', function (event) {			
		fadeText(this, $(this).find('.description').html());
		$( 'div.window' ).removeClass('selected');
		$( this ).find( 'div.window' ).addClass('selected');
		event.stopPropagation();
		//return false;
	});
});

function fadeText(containter, newText) {
	var oldText = $('#text').html();
	if (newText !== oldText) {
		$("#text").fadeOut("fast", function() {
		  $('#text').html(newText);
		}).fadeIn("fast");
	}
}

function adjustMainMenu () {
	if($( window ).width() < 810) {
			$('body').addClass('narrow');
		} else {
			$('body').removeClass('narrow');
	}
	$('#content').css('height', ($(window).height()- parseInt($('#text').css('margin-top')) - parseInt($('#text').css('height')) - 10 ))
}