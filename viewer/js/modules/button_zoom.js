/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var button_zoom = {};

button_zoom._construct = function() {

	var ZOOM_IN = 1;
	var ZOOM_OUT = -1;
	
	
	onCoreReady(function() {
		
		if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 	var $zoomPanel = $("<div></div>");
	 	$zoomPanel.css('float', 'left');
	 	$zoomPanel.css('margin-left', '20px');
	 	$zoomPanel.css('margin-top', '6px');
	 	$zoomPanel.css('line-height', '0px');
	 	
	 	$zoomInButton = $("<img src='img/zoom_in.png' alt='zoom in' />");
	 	$zoomOutButton = $("<img src='img/zoom_out.png' alt='zoom out' />");
	 	$zoomFitButton = $("<img src='img/zoom_fit.png' alt='fit to screen' />");
	 	
	 	$zoomFitButton.css('margin-right', '5px');
	 	$zoomInButton.css('margin-right', '5px');
	 	$zoomOutButton.css('margin-right', '5px');
	 	
	 	$zoomPanel.append($zoomFitButton);
	 	$zoomPanel.append($zoomInButton);
	 	$zoomPanel.append($zoomOutButton);
	 	
	 	
	 	$zoomInButton.click(function() {
	 		zoom.centeredZoom(ZOOM_IN);
	 	});
	 	$zoomOutButton.click(function() {
	 		zoom.centeredZoom(ZOOM_OUT);
	 	});
	 	$zoomFitButton.click(function() {
	 		zoom.reset();
	 	});
	 	
	 	
	 	$("#toolbar").after($zoomPanel);
	 	
	
	});
	
	
}
button_zoom._construct();
