/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var word_search = {};


word_search._construct=function() {


	text_overlay.onReady(function() {
	
		var searchee = viewer.currentWord();
		if (searchee != null) {
		
			$("#text_overlay").find('.text').each(function() {
			
			
				if ( $(this).text().toLowerCase().indexOf(searchee.toLowerCase()) != -1 ) {
					$(this).addClass('search_hit');
				}
			});
		
		
		}
		
	
	});



}
word_search._construct();
