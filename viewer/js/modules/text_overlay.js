
var text_overlay = {};

text_overlay._construct=function() {
	//wait TEXT_LOAD_DELAY ms before (re-)rendering texts after viewport move/zoom
	var TEXT_LOAD_DELAY = 1500;

	var lastWordSize = 100;
	var cache = {};
	var textLoadDelayer;
	var cursor;
	
	var textOverlayReadyListeners = [];
	

	function triggerTextOverlayReady() {
		for (i=0;i<textOverlayReadyListeners.length;i++) {
			textOverlayReadyListeners[i]();
		}
	}

	function onReady(callback) {
		textOverlayReadyListeners.push(callback);
	}

	
	function loadTexts(num) {
	 	$("#text_overlay span").remove();
	 	
	 	var imageData = viewer.getPageImages()[0];
	 	if (imageData.type == 'small') {
	 		return;
	 	}
	 
		if (cache[num] === undefined) {

			$.get( viewer.getPackagePath() + num + '.xml', function(data) {
		
				$page = $(data).find('Page').first();
				oPageSize = { height: $page.attr('HEIGHT'), width:  $page.attr('WIDTH') };
	
				oScale = {
					 width:  imageData.size.width / oPageSize.width * imageData.size.scale
					,height: imageData.size.height / oPageSize.height * imageData.size.scale
				}
				
				triggerScaleReady();
			
				cache[num] = {
					"data": data
					,"scale": oScale
				};
			
				renderText(cache[num].data, cache[num].scale);

			});
	
		} else {

				renderText(cache[num].data, cache[num].scale);
		}
	}


	function renderText(data, oScale) {
		
	
		if ($("#viewer").css('cursor') != 'wait') {
			preCursor = $("#viewer").css('cursor');
	
			if (preCursor == 'text') {
				$("#viewer").css('cursor', 'wait');
			}
		}
		
		if (textLoadDelayer != undefined) {
			clearTimeout(textLoadDelayer);

		}
		
		textLoadDelayer = setTimeout(function() {
			$(data).find('String').each(function() {
		
				render_string($(this), oScale);
		
			});
		
			
			$("#viewer").css('cursor', preCursor);
			$("#text_overlay span").css('cursor', preCursor);
			triggerTextOverlayReady();
			
		}, TEXT_LOAD_DELAY);
	
	}

	function render_string($oString, oScale) {
	
		oViewportPosition = viewport.getPosition();
		var left = parseInt($oString.attr('HPOS'), 10) * oScale.width * viewport.getZoom();
		var top =  parseInt($oString.attr('VPOS'), 10) * oScale.height * viewport.getZoom();
		
		left +=  oViewportPosition.x * viewport.getZoom();
		top +=  oViewportPosition.y * viewport.getZoom();
		
		var width = $oString.attr('WIDTH') * oScale.width * viewport.getZoom();
		var height = $oString.attr('HEIGHT') * oScale.height * viewport.getZoom();
	

		oViewerSize = viewer.getSize();
		
		//Dont create stringelements if they're out of bounds
		if (left < 0 || left+width > oViewerSize.width ||
			top < 0 || top+height > oViewerSize.height) {

			return;
		}


		var content = $oString.attr('CONTENT');
		var fontFace = "Times New Roman"; 
	
		//BoundingBox
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
		$bb.css('z-index', 2);
		
		$("#text_overlay").append($bb);
	
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
	
	
	
	onImageReady(function() {
		loadTexts(viewer.currentPage4());
	});

	onViewportChange(function() {
		loadTexts(viewer.currentPage4());
	});
	
	this.onReady=onReady;
	
}
text_overlay._construct();
