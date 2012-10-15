/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var scroll_pan = {};

scroll_pan._construct = function() {

	var SCROLL_SPEED = 30;

	onCoreReady(function() {
		
		if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 	
                function scroll_cb(e, delta) {
				e.preventDefault();
				e.stopPropagation();
	
				oViewportPosition = viewport.getPosition();
				if (delta > 0) {
					oViewportPosition.y += SCROLL_SPEED;
				} else {
					oViewportPosition.y -= SCROLL_SPEED;
				}
				viewport.setPosition(oViewportPosition.x, oViewportPosition.y);
		}

		$("#viewer").mousewheel(scroll_cb);
		$("#text_overlay").mousewheel(scroll_cb);
	});
	
	
}
scroll_pan._construct();
