/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var zoom = {};

zoom._construct = function() {

	var ZOOM_SPEED = 1.2;
	var ZOOM_MAX = 3;
	var ZOOM_MIN = 0.7;
	
	function reset() {
	
			var zoomLevel = 1;

			var images = viewer.getImages();
			totalPagesWidth = 0;
			totalPagesHeight = 0;
			for (i=0;i<images.length;i++) {
			
				var image = $('body').data(images[i].img);
			
				totalPagesWidth += image.width;
				totalPagesHeight += image.height;
				
				
			}
		
			//Center the page(s)
			if (viewport.getViewMode == viewport.MODE_DUAL_PAGE && images.length > 1) {
				viewportStartX = 0; 
			} else {
				viewportStartX = ($("#viewer").width() - $("#viewer").height() * (totalPagesWidth / totalPagesHeight)) / 2;
			}
			
		
			
			
			viewport.setTransform(viewportStartX, 0, zoomLevel);
	}
	
	function centeredZoom(delta) {
	
	
				var zoomLevel = viewport.getZoom();
	
				var preViewportSize = { 
					 width: viewer.getSize().width / zoomLevel
					,height: viewer.getSize().height / zoomLevel 
				}; 

				if (delta > 0) {
					zoomLevel *= ZOOM_SPEED;
				
				} else {
					zoomLevel /= ZOOM_SPEED;
				}
			
				if (zoomLevel < ZOOM_MIN || zoomLevel > ZOOM_MAX) {
					return;
				}
			
				var mouseMul = {
					 x: 2
					,y: 2
				}
			
				var postViewportSize = {
					 width: viewer.getSize().width / zoomLevel
					,height: viewer.getSize().height / zoomLevel
				}; 
	
				var xOffset = (postViewportSize.width - preViewportSize.width) / mouseMul.x;
				var yOffset = (postViewportSize.height - preViewportSize.height) / mouseMul.y;
	
				oViewportPosition = viewport.getPosition(); 
	
				oViewportPosition.x += xOffset;
				oViewportPosition.y += yOffset;
	
				viewport.setTransform(oViewportPosition.x, oViewportPosition.y, zoomLevel);
	
	}
	
	function zoom(delta) {
	
				var zoomLevel = viewport.getZoom();
	
				var preViewportSize = { 
					 width: viewer.getSize().width / zoomLevel
					,height: viewer.getSize().height / zoomLevel 
				}; 

				if (delta > 0) {
					zoomLevel *= ZOOM_SPEED;
				
				} else {
					zoomLevel /= ZOOM_SPEED;
				}
			
				if (zoomLevel < ZOOM_MIN || zoomLevel > ZOOM_MAX) {
					return;
				}
			
				var mouseMul = {
					 x: viewer.getSize().width / viewer.getMousePosition().x
					,y: viewer.getSize().height / viewer.getMousePosition().y
				}
			
				var postViewportSize = {
					 width: viewer.getSize().width / zoomLevel
					,height: viewer.getSize().height / zoomLevel
				}; 
	
				var xOffset = (postViewportSize.width - preViewportSize.width) / mouseMul.x;
				var yOffset = (postViewportSize.height - preViewportSize.height) / mouseMul.y;
	
				oViewportPosition = viewport.getPosition(); 
	
				oViewportPosition.x += xOffset;
				oViewportPosition.y += yOffset;
	
				viewport.setTransform(oViewportPosition.x, oViewportPosition.y, zoomLevel);
	
	}
	
	this.centeredZoom=centeredZoom;
	this.zoom=zoom;
	this.reset=reset;
}
zoom._construct();
