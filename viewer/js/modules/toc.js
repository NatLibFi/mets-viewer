var toc = {};

toc._construct = function() {

	function buildIndex() {

		$("#index .content_items").html('');

		$.get(viewer.getPackagePath() + "mets.xml", function(data) {
	
			$(data).find("div[TYPE='CHAPTER']").each(function() {
		
				label = $(this).attr('LABEL');
			
				$file = $(this).find('area[FILEID]').first();
	
				page = fileIDToPageNum ( $file.attr('FILEID') );
	
				if (page != null) {
					$li = $("<li></li>");
					$a = $("<a page='"+page+"' href='#page="+page+"'>"+ label +"</a>");
					$li.append($a);
					$("#index .content_items").append($li);
					$("#index").height($("#index .content_items").height());
					$a.click(function() {
						num = $(this).attr('page');
						while (num.length < 4) {
							num = "0" + num;
						}
						viewer.loadPage(num);
				
					});
				}
			});
		
	
		});

	};


	function fileIDToPageNum(sFileID) {


		var re = new RegExp("(\\d+)","gi");

		var match = re.exec(sFileID);
	
		if (match[1] != undefined) {
			return parseInt(match[1],10);
		}

		return null;
	};

	toc.buildIndex=buildIndex;


	onCoreReady(function() {
		toc.buildIndex();
		$("#index").resizable();

		$('#toc_toggle').click(function() {
			$("#index").toggle('fast', 'swing');
		});


	});
}
toc._construct();




