
onCoreReady(function() {
	buildIndex();

});


function buildIndex() {

	$("#index .content_items").html('');

	$.get(sDataPath + "mets.xml", function(data) {
	
		$(data).find("div[TYPE='CHAPTER']").each(function() {
		
			label = $(this).attr('LABEL');
			
			$file = $(this).find('area[FILEID]').first();
	
			page = fileIDToPageNum ( $file.attr('FILEID') );
			debuglog(page);
			
			if (page != null) {
				$li = $("<li></li>");
				$a = $("<a page='"+page+"' href='#page="+page+"'>"+ label +"</a>");
				$li.append($a);
				$("#index .content_items").append($li);
				
				$a.click(function() {
					num = $(this).attr('page');
					while (num.length < 4) {
						num = "0" + num;
					}
					loadPage(num);
				
				});
			}
		});
		
	
	});

}
