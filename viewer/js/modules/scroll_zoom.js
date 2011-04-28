/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var scroll_zoom = {};

scroll_zoom._construct = function() {

	onCoreReady(function() {
		
		if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 	
		$("#viewer").mousewheel(function(e, delta) {
				e.preventDefault();
				e.stopPropagation();
				zoom.zoom(delta);
		});

		$("#text_overlay").mousewheel(function(e, delta) {
				e.preventDefault();
				e.stopPropagation();
				zoom.zoom(delta);
		});
	});
	
	
}
scroll_zoom._construct();
