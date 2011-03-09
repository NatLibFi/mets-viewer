
var viewport = {};

viewport._construct = function() {
	var x=0;
	var y=0;
	var zoom=1;
	

	function getPosition() {

		return {x: viewport.x, y: viewport.y };
	};
	
	
	function setPosition(x,y) {

		viewport.x = x;
		viewport.y = y;
		triggerViewportChange();
	};

	function getZoom() {
		return viewport.zoom;
	};

	function setZoom(zoom) {

		viewport.zoom = zoom;
		triggerViewportChange();
	
	};

	function setTransform(x,y,zoom) {
		viewport.x = x;
		viewport.y = y;
		viewport.zoom = zoom;
		triggerViewportChange();
	};
	

	this.setTransform=setTransform;
	this.getZoom=getZoom;
	this.setZoom=setZoom;
	this.getPosition=getPosition;
	this.setPosition=setPosition;
}
viewport._construct();
