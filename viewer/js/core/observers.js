
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


var viewportListeners = [];
function triggerViewportChange() {
	for (i=0;i<viewportListeners.length;i++) {
	
		viewportListeners[i]();
	}
}
function onViewportChange(callback) {
	viewportListeners.push(callback);
}




