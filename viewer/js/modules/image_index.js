/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var image_index = {};

image_index._construct = function() {

	
	function buildImageIndex() {
		
		$("#imageindex .content_items").html('');

		$.get(viewer.getPackagePath() + "imageIndex.xml", function(data) {
	
			$(data).find("anon").each(function() {

	
				file = $(this).find('imagename').first().text();
				page = $(this).find('pagenumber').first().text();
				$imgLink = $("<a href='#page="+page+"'></a>");
				$img = $("<img src='"+viewer.getPackagePath() + file+"'/ >");
				$img.width(200);
				$img.css('margin-bottom', '10px');
				$imgLink.attr('page', page);
				$imgLink.append($img);
			
			
				$img.ready(function() {
					$("#imageindex .content_items").append($imgLink);
		
				});

			});

		});
	}
	
	this.buildImageIndex=buildImageIndex;
	
	onCoreReady(function() {
		$("#imageindex").toggle();
		image_index.buildImageIndex();	
		$('#imageindex_toggle').click(function() {
			$("#imageindex").toggle('fast','swing');
		});
			
	});
	
}
image_index._construct();
