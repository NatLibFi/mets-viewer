
var ZOOM_SPEED = 1.3;
var ZOOM_MAX = 3;
var ZOOM_MIN = 0.7;
onCoreReady(function() {
	$("#viewer").mousewheel(function(e, delta) {
			e.preventDefault();
			
			var zoomDiff;
			
			var zoomLevel = getViewportZoom();
			

			var preViewportSize = { 
				 width: oViewerSize.width / zoomLevel
				,height: oViewerSize.height / zoomLevel 
			}; 

			if (delta > 0) {
				zoomLevel *= ZOOM_SPEED;
				
			} else {
				zoomLevel /= ZOOM_SPEED;
			}
			
			if (zoomLevel < ZOOM_MIN || zoomLevel > ZOOM_MAX) {
				return;
			}
			
			var mouseMul = {
				 x: oViewerSize.width / mouseX
				,y: oViewerSize.height / mouseY
			}
			
			var postViewportSize = {
				 width: oViewerSize.width / zoomLevel
				,height: oViewerSize.height / zoomLevel
			}; 
	
			var xOffset = (postViewportSize.width - preViewportSize.width) / mouseMul.x;
			var yOffset = (postViewportSize.height - preViewportSize.height) / mouseMul.y;
	
			oViewportPosition = getViewportPosition();
	
			oViewportPosition.x += xOffset;
			oViewportPosition.y += yOffset;
	
			setViewportPositionAndZoom(oViewportPosition.x, oViewportPosition.y, zoomLevel);
	
		
	});
});
