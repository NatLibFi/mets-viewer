/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var logo_link = {};

logo_link._construct = function() {

	var BASE_PATH = "http://urn.fi/";


	onCoreReady(function() {

		var path;

<<<<<<< HEAD
		if (viewer.itemType() == 'fra') {
			var URN = "URN:NBN:fi-" + viewer.currentItem();
=======
		if (viewer.itemType() == 'fragmenta') {
			var parts = viewer.currentItem().split('/');
			var URN = "URN:NBN:fi-" + parts[parts.length-1].replace('-preservation', "");
>>>>>>> 6433f0837343367f02a282fc284ca626b018b067
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
