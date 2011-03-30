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

word_search._construct = function() {


	var SEARCH_API = "http://s1.doria.fi/viewer/search/acerbi_search.cgi";


	onCoreReady(function() {
	
		$('#search button').click(function() {
			$('#search_results').html('');
			$('#search_results').html('<img src="img/loader.gif"/ alt="searching">');
			
			var query = "mode=json&text=" + escape($('#search input').val()) + "&book=" + viewer.currentItem();
			
			$.post(SEARCH_API, query, function(data, status, xhr) {
			
				data = JSON.parse(data);
				$('#search_results').html('');
	
				if (data.hits.length) {
				
					for (var i=0;i<data.hits.length;i++) {
						console.log(data.hits[i]);
						
						page = parsePageNumberFromID(data.hits[i].id);
						$result = $("<a>" + data.hits[i].content + " (" + page +")" + "</a>");
						$result.attr('href','#page=' +page +'#word='+data.hits[i].content);
		
						$('#search_results').append($result);
					}
				} else {
					$('#search_results').append("No hits");
				}
				
			
			
			});
			
	
		
		});
		
		$('#search input').change(function() {
			$('#search button').trigger('click');
		});
	

	});

	function parsePageNumberFromID(idString) {
	
		var matches = idString.match(/P(\d+)_ST\d+/);
		if (matches.length > 1) {
			return matches[1];
		}
		return null;
	}


	//highlight
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

