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

	var self=this;

	//wait TEXT_LOAD_DELAY ms before (re-)rendering texts after viewport move/zoom
	var TEXT_LOAD_DELAY = 1500;

	var MAX_WORD_SIZE = 70;
	var lastWordSize = 70;
	var cache = {};
	var textLoadDelayer;
	var cursor;
	
	var textOverlayReadyListeners = [];
	
	var renderTimer;
	var oScale;
	var imageData;
	var stringBuffer;
	var RENDER_GROUP_SIZE = 10;
	
	function triggerTextOverlayReady() {
		for (i=0;i<textOverlayReadyListeners.length;i++) {
			textOverlayReadyListeners[i]();
		}
	}

	function onReady(callback) {
		textOverlayReadyListeners.push(callback);
	}

	
	function loadTexts() {
	
		$("#text_overlay span").remove();
		 	
	 	
	 	if (textLoadDelayer != undefined) {
			clearTimeout(textLoadDelayer);
		}
		
		 if (renderTimer != undefined) {
			clearTimeout(renderTimer);
		}


		if (viewport.getRotation() != 0) {
			//should probably disable text overlay altogether if the viewport is not straight.
			return;
		}
		
		var pages = viewer.getCurrentPages();
		
		
		var num;
		
		if (viewer.getViewMode() == viewer.MODE_DUAL_PAGE) {
		
	 		
	 	} else {
	 		num = viewer.currentPage4();
	 	}
		
		textLoadDelayer = setTimeout(function() {
				
		 	var imageData = viewer.getPageImages();
		 	if (imageData.length == 0 || imageData[0].type == 'small') {
		 		return;
		 	}
	
		 
		 
		 	if ($("#viewer").css('cursor') != 'wait') {
				preCursor = $("#viewer").css('cursor');
	
				if (preCursor == 'text') {
					$("#viewer").css('cursor', 'wait');
				}
			}
		
		
		 	self.stringBuffer = [];
		 	pagesToRender = pages.length;
		 	
		 	
		 	for (var i=0; i< pages.length;i++) {
		 	
		 		var num = pages[i];
		 
				if (cache[num] === undefined) {

					$.get( viewer.getPackagePath() + num + '.xml', wrapper(num, imageData[i]));
					
				} else {

						fillBuffer(cache[num].data, cache[num].scale, imageData[i]);
				}
			}
			
		}, TEXT_LOAD_DELAY);
	}
	
	function wrapper(num, imageData) {
		return function(data, status) {
		
			$page = $(data).find('Page').first();
			oPageSize = { height: $page.attr('HEIGHT'), width: $page.attr('WIDTH') };
		
						oScale = {
							 width:  imageData.size.width / oPageSize.width * imageData.size.scale
							,height: imageData.size.height / oPageSize.height * imageData.size.scale
						};
						
						
						oScale.ratio = imageData.size.ratio;
		
						triggerScaleReady();
		
						cache[num] = {
							 "data": data
							,"scale": oScale
						};
				
						fillBuffer(cache[num].data, cache[num].scale, imageData);
		}
	}

	


	function fillBuffer(data, oScale, imageData) {
		

		$(data).find('String').each(function() {
		
			self.stringBuffer.push({string: $(this), scale: oScale, imageData: imageData });
		
		});
		
		pagesToRender--;
	
		if (pagesToRender == 0) {
			render_buffer();
		}
	}
	
	
	function render_buffer() {
		
		var strCount = (self.stringBuffer.length < RENDER_GROUP_SIZE) ? self.stringBuffer.length : RENDER_GROUP_SIZE;
		
		for (var i=0;i<strCount;i++) {
			
			render_string(self.stringBuffer.shift());
		
		}
	
		if (strCount >= RENDER_GROUP_SIZE) {
		
			renderTimer = setTimeout(render_buffer, 50);
	
		} else {
		
			$("#viewer").css('cursor', preCursor);
			$("#text_overlay span").css('cursor', preCursor);
			triggerTextOverlayReady();
		
		}
	
	}

	function render_string(oItem) {
	
		var $oString = oItem.string;	
		var oScale = oItem.scale;
		var imageData = oItem.imageData;
		oViewerSize = viewer.getSize();


		if (viewer.getViewMode() == viewer.MODE_DUAL_PAGE) {
	
			
			var images = viewer.getImages();
			var maxHeight=0;
			for (var i=0;i<images.length;i++) {
	
				var image_tmp = $('body').data(images[i].img);
				maxHeight = (image_tmp.height > maxHeight) ? image_tmp.height : maxHeight;
			}
		
			var totalWidth=0;
			for (var i=0;i<images.length;i++) {
	
				var image_tmp = $('body').data(images[i].img);
				totalWidth += (image_tmp.width > totalWidth) ? image_tmp.width : totalWidth;
			}
		
	
			//determine whether the pages are fit to viewer by width or scale
			//widthlimit
			wViewerScale = (oViewerSize.width) / imageData.size.width / imageData.size.scale / 2;
		
			//heightlimit
			hViewerScale = (oViewerSize.height) / imageData.size.height / imageData.size.scale;
		
			viewerScale = (wViewerScale < hViewerScale) ? wViewerScale : hViewerScale;
		
		} else {
	
			viewerScale = (oViewerSize.height) / imageData.size.height / imageData.size.scale;
		}
		
		oViewportPosition = viewport.getPosition();
		
			
		var left = parseInt($oString.attr('HPOS'), 10) * oScale.width * viewport.getZoom() * viewerScale;
		var top =  parseInt($oString.attr('VPOS'), 10) * oScale.height * viewport.getZoom() * viewerScale;
		
		left += oViewportPosition.x * viewport.getZoom();
		top +=  oViewportPosition.y * viewport.getZoom();
		
		left += oScale.width * viewport.getZoom() * viewerScale * imageData.xOffset / (oScale.width / imageData.size.scale);
		top  += oScale.height * viewport.getZoom() * viewerScale * imageData.yOffset / (oScale.height / imageData.size.scale);
		
		
		
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
		var $content = $("<span class='text'><span>");
		$content.text(content);
	
		if (viewer.getMode() == "select") {
			$content.css('color', 'rgba(0,0,0,1)');
		} else {
			$content.css('color', 'rgba(0,0,0,0)');
		}
		
		
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
		$content.text(content+" ");
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

				 } while (textWidth < maxWidth && fontSize < MAX_WORD_SIZE);
		
			}

			lastWordSize = fontSize;
	}
	
	
	
	onImageReady(function() {
	 	if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 
		loadTexts();
		
	});

	viewport.onViewportChange(function() {
	 	if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 		
		
		loadTexts();
		
	});
	
	this.onReady=onReady;
	onCoreReady(function() {

	 	pan_mode = $('<div id="pan_select" class="icon_pan ui-corner-left"></div>');
		$('#toolbar').append(pan_mode);
	});

}

text_overlay._construct();
