/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var keyboard_shortcuts = {};

keyboard_shortcuts._construct = function() {

	var key = {left: 37, up: 38, right: 39, down: 40};

	
	onCoreReady(function() {

		
		$(document).keydown(function(e) {
		
			var code = e.keyCode || e.which;
			
			if (code == key.left) {
				e.preventDefault();
				page_changer.prev();
			
			}
			if (code == key.right) {
				e.preventDefault();
				page_changer.next();
			}
		
		});
		
		
		

	});
}
keyboard_shortcuts._construct();
