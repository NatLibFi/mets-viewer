
var imgIndexReady = false;


onCoreReady(function() {
	buildImageIndex();		
});


function buildImageIndex() {
	if (imgIndexReady) {
		return;
	}
	
	$("#imageindex .content_items").html('');

	$.get(sDataPath + "imageIndex.xml", function(data) {
	
		$(data).find("anon").each(function() {

	
			file = $(this).find('imagename').first().text();
			page = $(this).find('pagenumber').first().text();
			$imgLink = $("<a href='#page="+page+"'></a>");
			$img = $("<img src='"+sDataPath + file+"'/ >");
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
					loadPage(num);
				
				});
				
				
			});

		});
		
		imgIndexReady = true;
	});

}
