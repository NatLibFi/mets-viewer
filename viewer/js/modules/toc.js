/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var toc = {};

toc._construct = function() {

	function buildIndex() {

		$("#sidebar_content .toc_items").html('');

		$.get(viewer.getPackagePath() + "mets.xml", function(data) {
	
			$(data).find("div[TYPE='CHAPTER']").each(function() {
		
				label = $(this).attr('LABEL');
			
				$file = $(this).find('area[FILEID]').first();
	
				page = fileIDToPageNum ( $file.attr('FILEID') );
	
				if (page != null) {
					$li = $("<li></li>");
					$a = $("<a page='"+page+"' href='#page="+page+"'>"+ label +"</a>");
					$li.append($a);
					$("#sidebar_content .toc_items").append($li);
					
					
					
					$("#sidebar_content").height(
						$("#sidebar_content .toc_items").height() + $("#bibdata").height() + 10
					);
				
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
		$("#sidebar_content").resizable();

		$('#sidebar_toggle').click(function() {
			$("#sidebar_content").toggle('fast', 'swing');
		});


	});
}
toc._construct();




