var viewport = {x: 0, y: 0, zoom: 1};

function getViewportPosition() {

	return {x: viewport.x, y: viewport.y };
}

function setViewportPosition(x,y) {

	viewport.x = x;
	viewport.y = y;
	triggerViewportChange();
}

function getViewportZoom() {
	return viewport.zoom;
}

function setViewportZoom(zoom) {

	viewport.zoom = zoom;
	triggerViewportChange();
	
}

function setViewportPositionAndZoom(x,y,zoom) {
	viewport.x = x;
	viewport.y = y;
	viewport.zoom = zoom;
	triggerViewportChange();
}
