/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
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
		return { x:x, y:y };
	}
	
	
	function setPosition(pX,pY,update) {

		x = pX;
		y = pY;
                if (update != false) { triggerViewportChange(); }
	}

	function getZoom() {
		return zoom;
	}

	function setZoom(pZoom,update) {

		zoom = pZoom;
                if (update != false) { triggerViewportChange(); }
	}

	function setTransform(pX,pY,pZoom,update) {
                setPosition(pX,pY,false);
		setZoom(pZoom,update)
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
			viewport.setTransformUpdate(viewportStartX, viewportStartY, 1, false);
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

	this.setRotation=setRotation;
	this.getRotation=getRotation;
	
	
};

viewport._construct();
