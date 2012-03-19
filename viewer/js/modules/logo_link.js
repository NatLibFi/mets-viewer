/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var logo_link = {};

logo_link._construct = function() {

	var BASE_PATH = "http://urn.fi/";


	onCoreReady(function() {

		var path;

		if (viewer.itemType() == 'fragmenta') {
			var URN = "URN:NBN:fi-" + viewer.currentItem();
			path = BASE_PATH + URN;
		} else {
			path = BASE_PATH + viewer.currentItem();
		}
		
		$link = $('<a></a>');
		$link.attr('href', path);

		$('#logo img').wrap($link);
		
	
		
		
	});


}
logo_link._construct();
