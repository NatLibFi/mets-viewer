
var lastWordSize = 100;


var pageXML = {};

onImageReady(function() {

	loadTexts(currentPage4());

});

onViewportChange(function() {

	loadTexts(currentPage4());

});



function loadTexts(num) {
	if (pageXML[num] == undefined) {
	
	
		$.get( sDataPath + num + '.xml', function(data) {
		
			$page = $(data).find('Page').first();
			oPageSize = { height: $page.attr('HEIGHT'), width:  $page.attr('WIDTH') };
			
			oScale = {
				 width: oImageSize.width / oPageSize.width 
				,height:  oImageSize.height / oPageSize.height
			}
			triggerScaleReady();
			
			pageXML[num] = {
				"data": data
				,"scale": oScale
			};
			
		
			
			renderText(pageXML[num].data);
			
		
		});
	
	} else {
	
			oScale = pageXML[num].scale;
			
			
			
			
			renderText(pageXML[num].data);
			
	}



}





var timer;

function renderText(data) {

	$("#viewer").html('');
	
	if ($("#viewer").css('cursor') != 'wait') {
		preCursor = $("#viewer").css('cursor');
	
		if (preCursor == 'text') {
			$("#viewer").css('cursor', 'wait');
		}
	}
		
	if (timer != undefined) {
		clearTimeout(timer);
	}
	timer = setTimeout(function() {
	
		$(data).find('String').each(function() {
		
			render_string($(this));
		
		});
		
		$("#viewer").css('cursor', preCursor);
		$("#viewer span").css('cursor', preCursor);
		
	}, 1500);
	
}

function render_string($oString) {

	oViewportPosition = getViewportPosition();

	var left = $oString.attr('HPOS') * oScale.width * oImageSize.scale + oViewportPosition.x + oImageSize.left;
	var top = $oString.attr('VPOS')  * oScale.height * oImageSize.scale + oViewportPosition.y + oImageSize.top;
	
	
	bounds = getViewerSize();
	
	
	//Dont create stringelements if they're out of bounds
	if (left < 0 || left > bounds.width ||
		top < 0 || top > bounds.height) {

		return;
	}


	
	
	var width = $oString.attr('WIDTH') * oScale.width * oImageSize.scale;
	var height = $oString.attr('HEIGHT') * oScale.height * oImageSize.scale;
	
	var content = $oString.attr('CONTENT');
	var fontFace = "Times New Roman"; 
	
	//Create boundingBox
	var $bb = $("<span class='boundingbox'></span>");
	//Content
	var $content = $("<span class='text'>"+ content +"<span>");
	
	$bb.append($content);
	
	$bb.css('position', 'absolute');
	$bb.css('width', width);
	$bb.css('height', height);
	$bb.css('top', top);
	$bb.css('left', left);
	$bb.css('line-height', height + "px");
	
	
	
	$("#viewer").append($bb);
	
	resize_text($bb);
}

function resize_text($bb) {

		var fontSize = lastWordSize;
		var innerText = $bb.find('.text');
		var maxWidth = $bb.width();
		innerText.css('font-size', fontSize);
		textWidth = innerText.width();
	
		if (textWidth > maxWidth) {
	
			do {
				innerText.css('font-size', fontSize);
			   
				textWidth = innerText.width();
				fontSize = fontSize - 1;

			 } while (textWidth > maxWidth && fontSize > 3);

		} else {
			do {
				innerText.css('font-size', fontSize);
			   
				textWidth = innerText.width();
				fontSize = fontSize + 1;

			 } while (textWidth < maxWidth && fontSize < 100);
		
		}

		lastWordSize = fontSize;
}
