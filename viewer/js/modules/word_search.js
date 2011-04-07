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
			$('#search_results').html('<img src="img/loader.gif" alt="searching"/>');
			
			var query = "mode=json&text=" + $('#search input').val() + "&book=" + viewer.currentItem();
			
			$.post(SEARCH_API, query, function(data, status, xhr) {
			
				data = JSON.parse(data);
				console.log(data);
				$('#search_results').html('');
				
				var hitCount = 0;
				for (hitStr in data.hits) {
					
					var hits = data.hits[hitStr];
					for (var i=0;i<hits.length;i++) {
					
						var hit = hits[i];
				
						hitCount++;
						page = parsePageNumberFromID(hit.id);
						$result = $("<a>" + hit.content + " (" + page +")" + "</a>");
						$result.attr('href','#page=' +page +'#word='+hit.content);
						
		
						$('#search_results').append($result);
					}
				}
				if (hitCount == 0) {
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

