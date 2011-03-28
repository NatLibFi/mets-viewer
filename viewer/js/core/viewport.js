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
	
	this.setTransformNoUpdate=setTransformNoUpdate;
};

viewport._construct();
