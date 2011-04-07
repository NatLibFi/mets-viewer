/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
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
		 	
		 	
	 	if (textLoadDelayer != undefined) {
			clearTimeout(textLoadDelayer);
			console.log("Rendering reset");
		}
		
		textLoadDelayer = setTimeout(function() {
			
		 	
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
					oScale.ratio = imageData.size.ratio;
				
					triggerScaleReady();
			
					cache[num] = {
						"data": data
						,"scale": oScale
					};
			
					renderText(cache[num].data, cache[num].scale, imageData);

				});
	
			} else {

					renderText(cache[num].data, cache[num].scale, imageData);
			}
		}, TEXT_LOAD_DELAY);
	}


	function renderText(data, oScale, imageData) {
		
	
		if ($("#viewer").css('cursor') != 'wait') {
			preCursor = $("#viewer").css('cursor');
	
			if (preCursor == 'text') {
				$("#viewer").css('cursor', 'wait');
			}
		}
		
	
		console.log("rendering");
			$(data).find('String').each(function() {
		
				render_string($(this), oScale, imageData);
		
			});
		
			
			$("#viewer").css('cursor', preCursor);
			$("#text_overlay span").css('cursor', preCursor);
			triggerTextOverlayReady();
			
		
	
	}

	function render_string($oString, oScale, imageData) {
	
		oViewerSize = viewer.getSize();

		viewerScale = (oViewerSize.height) / imageData.size.height / imageData.size.scale;
	
		oViewportPosition = viewport.getPosition();
		var left = parseInt($oString.attr('HPOS'), 10) * oScale.width * viewport.getZoom() * viewerScale;
		var top =  parseInt($oString.attr('VPOS'), 10) * oScale.height * viewport.getZoom() * viewerScale;
		
		left +=  oViewportPosition.x * viewport.getZoom();
		top +=  oViewportPosition.y * viewport.getZoom();
		
		var width = $oString.attr('WIDTH') * oScale.width * viewport.getZoom() * viewerScale;
		var height = $oString.attr('HEIGHT') * oScale.height * viewport.getZoom() * viewerScale;
	

		
		
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
	 	if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
		loadTexts(viewer.currentPage4());
	});

	viewport.onViewportChange(function() {
	 	if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 		
		
		loadTexts(viewer.currentPage4());
	});
	
	this.onReady=onReady;
	
}
text_overlay._construct();
