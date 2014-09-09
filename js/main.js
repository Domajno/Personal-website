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
	
	// Download website content
	$.getJSON('content/content.json', function(content) {
		
		// Save metadata
		metadata = content.metadata;
		$('#text').html(metadata.intro);
		
		// Add tag checkboxes
		var checkboxes = '<ul><li><input type="checkbox" /> Filter:</li>';
		Object.keys(metadata.tags).forEach(function (t) {
			checkboxes += '<li><input type="checkbox" value="' + t + '"/>' + metadata.tags[t] + '</li>';
		});
		checkboxes += '</ul>'
		$('#filter').html(checkboxes);
		
		// Render etries as windows
		var entries = '';
		content.entries.forEach(function (e) {
			entries += '<div class="entry" data-tags="' + e.tags + '">';
			entries += 		'<div class="window">'
			entries += 			'<div class="overlay">'
			var tags = ''
			e.tags.forEach(function (t) { tags += '<a href="#" class="tag">' + metadata.tags[t] + '</a>';})
			entries += 				tags
			if(e.internal_link || e.external_link) entries += 				'<br/><br/><br/><a href="' + (e.internal_link || e.external_link)  + '"  target="_blank" class="tag">See the project</a>'
			entries += 			'</div>'
			entries += 			'<div class="buttons" style="background: #E4E2D6 url(' + metadata.img_dir + e.img_small + ') no-repeat top left">'
			
			entries += 				'</div>'												
			entries += 		'</div>';
			entries += 		'<div class="title-bar">'+ e.title +'</div>';
			entries += 		'<div class="description" style="display: none;">' + e.description + '</div>';
			entries += '</div>';
		});
		$('#content').html(entries);
		
		$('#header, #content').bind('click', function () {
			fadeText(this, metadata.intro);
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