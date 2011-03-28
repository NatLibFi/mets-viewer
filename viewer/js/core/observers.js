/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var pagechangeListeners = [];
function triggerPagechange() {
	for (i=0;i<pagechangeListeners.length;i++) {
	
		pagechangeListeners[i]();
	}
}

function onPageChanged(callback) {
	pagechangeListeners.push(callback);
}



var scaleListeners = [];
function triggerScaleReady() {
	for (i=0;i<scaleListeners.length;i++) {
	
		scaleListeners[i]();
	}
}
function onScaleReady(callback) {
	scaleListeners.push(callback);
}


var coreReadyListeners = [];
function triggerCoreReady() {
	for (i=0;i<coreReadyListeners.length;i++) {
	
		coreReadyListeners[i]();
	}
}

function onCoreReady(callback) {
	coreReadyListeners.push(callback);
}


var smallImageReadyListeners = [];
function triggerSmallImageReady() {
	for (i=0;i<smallImageReadyListeners.length;i++) {
	
		smallImageReadyListeners[i]();
	}
}
function onSmallImageReady(callback) {
	scaleListeners.push(callback);
}

var imageReadyListeners = [];
function triggerImageReady() {
	for (i=0;i<imageReadyListeners.length;i++) {
	
		imageReadyListeners[i]();
	}
}
function onImageReady(callback) {
	imageReadyListeners.push(callback);
}







