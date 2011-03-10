
var pan = {};

pan._construct = function() {

	var panning = false;

	onCoreReady(function() {

		if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 	
		$("#text_overlay").mousedown(function(e) {

			if (viewer.getMouseMode() == 'pan') {
				e.preventDefault();
				panning = true;
			}
		});
		
		
		$("#viewer").mousedown(function(e) {
			if (viewer.getMouseMode() == 'pan') {
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
	
				oViewportPosition = viewport.getPosition();
				
			
				mouseXdiff = viewer.getLastMousePosition().x - viewer.getMousePosition().x;
				mouseYdiff = viewer.getLastMousePosition().y - viewer.getMousePosition().y;
			
				oViewportPosition.x -= mouseXdiff / viewport.getZoom();
				oViewportPosition.y -= mouseYdiff / viewport.getZoom();

				viewport.setPosition(oViewportPosition.x, oViewportPosition.y);
			
			
			}
		});

	});
	
}
pan._construct();

