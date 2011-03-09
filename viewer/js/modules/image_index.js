
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
			
					$imgLink.click(function() {
						num = $(this).attr('page');
						while (num.length < 4) {
							num = "0" + num;
						}
						viewer.loadPage(num);
				
					});
				
				
				});

			});

		});
	}
	
	this.buildImageIndex=buildImageIndex;
	
	onCoreReady(function() {
		image_index.buildImageIndex();		
	});
	
}
image_index._construct();
