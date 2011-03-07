
var panning = false;

onCoreReady(function() {

	$("#viewer").mousedown(function(e) {
		
		if (mouse_mode == 'pan') {
			e.preventDefault();
			panning = true;
		}
	});
	
	$("#viewer").mouseup(function(e) {
		e.preventDefault();
		
		panning = false;
	});
	
	$("#viewer").mouseout(function(e) {
		
		panning = false;
	});
	
	$("#viewer").mousemove(function(e) {

		if (panning) {
		
			oViewportPosition = getViewportPosition();
			
			mouseXdiff = mouseXlast - mouseX;
			mouseYdiff = mouseYlast - mouseY;
			
			oViewportPosition.x -= mouseXdiff / viewport.zoom;
			oViewportPosition.y -= mouseYdiff / viewport.zoom;

			setViewportPosition(oViewportPosition.x, oViewportPosition.y);
			
			
		}
	});

});
	
