/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var viewport = {};

viewport._construct = function() {
	var x=0;
	var y=0;
	var rotation=0;
	var zoom=1;
	var viewportListeners = [];
	
	
	function triggerViewportChange() {
		for (var i=0;i<viewportListeners.length;i++) {
	
			viewportListeners[i]();
		}
	}
	function onViewportChange(callback) {
		viewportListeners.push(callback);
	}
	
	
	

	function getPosition() {
		return {x: x, y: y };
	}
	
	
	function setPosition(pX,pY) {

		x = pX;
		y = pY;
		triggerViewportChange();
	}

	function getZoom() {
		return zoom;
	}

	function setZoom(pZoom) {

		zoom = pZoom;
		triggerViewportChange();
	
	}

	function setTransform(pX,pY,pZoom) {
		x = pX;
		y = pY;
		zoom = pZoom;
		triggerViewportChange();
	}
	
	function setTransformNoUpdate(pX,pY,pZoom) {
		x = pX;
		y = pY;
		zoom = pZoom;
	}
	
	function setRotation(angle) {
		angle = (angle + 360) % 360;
		rotation=angle;
		triggerViewportChange();
	}
	
	function getRotation() {
		return rotation;
	}
	
	function reset(update) {
	
		
			var images = viewer.getImages();
			totalPagesWidth = 0;
			totalPagesHeight = 0;
			for (i=0;i<images.length;i++) {
			
				var image = $('body').data(images[i].img);
				totalPagesWidth += image.width;
				totalPagesHeight = (totalPagesHeight > image.height) ? totalPagesHeight : image.height;
	
			}
			
		
			// Center the page(s)
			if (viewport.getViewMode == viewport.MODE_DUAL_PAGE && images.length > 1) {
			
				var mRealWidth = $("#viewer").height() * (totalPagesWidth / totalPagesHeight);
				
				if (mRealWidth < ($("#viewer").width() - 3)) { //3=threshold
					
					viewportStartX = ($("#viewer").width() - mRealWidth) / 2;
					viewportStartY = 0;
				
				} else {
			
			
					viewportStartX = 0; 
					var mRealHeight = $("#viewer").width() / totalPagesWidth * totalPagesHeight;
					viewportStartY = ($("#viewer").height() - mRealHeight) / 2;	
				}
			} else {
				viewportStartX = ($("#viewer").width() - $("#viewer").height() * (totalPagesWidth / totalPagesHeight)) / 2;
				viewportStartY = 0;
			}
			
		if (update && update === false) {
			viewport.setTransformNoUpdate(viewportStartX, viewportStartY, 1);
		} else {
			
			viewport.setTransform(viewportStartX, viewportStartY, 1);
		
		}
	}
	
	
	
	
	this.onViewportChange=onViewportChange;
	this.triggerViewportChange=triggerViewportChange;

	this.x=x;
	this.y=y;
	this.zoom=zoom;
	this.setTransform=setTransform;
	this.getZoom=getZoom;
	this.setZoom=setZoom;
	this.getPosition=getPosition;
	this.setPosition=setPosition;
	this.reset=reset;
	this.setTransformNoUpdate=setTransformNoUpdate;

	this.setRotation=setRotation;
	this.getRotation=getRotation;
	
	
};

viewport._construct();
