
var ZOOM_SPEED = 1.2;

onCoreReady(function() {
	$("#viewer").mousewheel(function(e, delta) {
			e.preventDefault();
			
			var zoomDiff;
			
			var zoomLevel = getViewportZoom();
			

			console.log(oViewerSize);
		
			var preViewportSize = { 
				 width: oViewerSize.width / zoomLevel
				,height: oViewerSize.height / zoomLevel 
			}; 

		
			if (delta > 0) {
				zoomLevel *= ZOOM_SPEED;
				
			} else {
				zoomLevel /= ZOOM_SPEED;
			
			}
			
			var XYKerroin = {
				 x: oViewerSize.width / mouseX
				,y: oViewerSize.height / mouseY
			}
			
			var postViewportSize = {
				 width: oViewerSize.width / zoomLevel
				,height: oViewerSize.height / zoomLevel
			}; 
	
			console.log("mousepos " + mouseX + "," + mouseY);
			console.log(preViewportSize);
			console.log(postViewportSize);
			
			var xOffset = (postViewportSize.width - preViewportSize.width) / XYKerroin.x;
			var yOffset = (postViewportSize.height - preViewportSize.height) / XYKerroin.y;

			
			console.log(xOffset + "," + yOffset);
			
			oViewportPosition = getViewportPosition();
		
			oViewportPosition.x += (postViewportSize.width - preViewportSize.width) / 2 * scalingFactor;
			
			//oViewportPosition.x += xOffset;
			//oViewportPosition.y += yOffset;
	
			setViewportPositionAndZoom(oViewportPosition.x, oViewportPosition.y, zoomLevel);
	
		
	});
});
