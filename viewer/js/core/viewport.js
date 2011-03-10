
var viewport = {};

viewport._construct = function() {
	var x=0;
	var y=0;
	var zoom=1;
	

	function getPosition() {
		return {x: x, y: y };
	};
	
	
	function setPosition(pX,pY) {

		x = pX;
		y = pY;
		triggerViewportChange();
	};

	function getZoom() {
		return zoom;
	};

	function setZoom(pZoom) {

		zoom = pZoom;
		triggerViewportChange();
	
	};

	function setTransform(pX,pY,pZoom) {
		x = pX;
		y = pY;
		zoom = pZoom;
		triggerViewportChange();
	};
	
	function setTransformNoUpdate(pX,pY,pZoom) {
		x = pX;
		y = pY;
		zoom = pZoom;
	}
	
	this.x=x;
	this.y=y;
	this.zoom=zoom;
	this.setTransform=setTransform;
	this.getZoom=getZoom;
	this.setZoom=setZoom;
	this.getPosition=getPosition;
	this.setPosition=setPosition;
	
	this.setTransformNoUpdate=setTransformNoUpdate;
}
viewport._construct();
