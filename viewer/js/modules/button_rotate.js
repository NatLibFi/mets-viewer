/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var button_rotate = {};

button_rotate._construct = function() {

	var ZOOM_IN = 1;
	var ZOOM_OUT = -1;
	
	
	onCoreReady(function() {
		
		if (!viewer.isCanvasSupported()) {
	 		return;
	 	}
	 	
	 	var $rotatePanel = $("<div></div>");
	 	$rotatePanel.css('float', 'left');
	 	$rotatePanel.css('margin-left', '20px');
	 	$rotatePanel.css('margin-top', '6px');
	 	$rotatePanel.css('line-height', '0px');
	 	
	 	$rotateLeftButton = $("<img src='img/left.png' alt='rotate left' />");
	 	$rotateRightButton = $("<img src='img/right.png' alt='rotate right' />");
	 	
	 	$rotateLeftButton.css('margin-right', '5px');
	 	$rotateRightButton.css('margin-right', '5px');
	 	
	 	$rotatePanel.append($rotateLeftButton);
	 	$rotatePanel.append($rotateRightButton);
	 	
	 	
	 	$rotateLeftButton.click(function() {
	 		rotate.rotateLeft();
	 	});
	 	$rotateRightButton.click(function() {
	 		rotate.rotateRight();
	 	});
	 
	 	$("#toolbar").after($rotatePanel);
	 	
	
	});
	
	
}
button_rotate._construct();
