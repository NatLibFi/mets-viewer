/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var zoom = {};

zoom._construct = function() {

	var ZOOM_SPEED = 1.2;
	var ZOOM_MAX = 3;
	var ZOOM_MIN = 0.7;
	
	function reset() {
		viewport.reset();
		
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
			
				if (zoomLevel < ZOOM_MIN || zoomLevel > ZOOM_MAX) {
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
			
				if (zoomLevel < ZOOM_MIN || zoomLevel > ZOOM_MAX) {
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
