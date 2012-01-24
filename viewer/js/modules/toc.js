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

		$.get(viewer.getMetsPath(), function(data) {
			var chapterCount = 0;
			if (viewer.itemType() == 'fra') {
				pagesString = '[TYPE="PAGE"][CONTENTIDS]';
				pageString = 'ID';
			} else {
				pagesString = '[TYPE="CHAPTER"]';
				pageString = 'LABEL';
			}
			$(data).find(pagesString).each(function() {

				label = $(this).attr(pageString);
				if (label !== undefined) {

					$file = $(this).find('[FILEID]').first();
	
					page = fileIDToPageNum ( $file.attr('FILEID') );
	
					if (page != null) {
						$li = $("<li></li>");
						if (viewer.itemType() == 'fra') {
							a = $("<a page='"+page+"' href='#page="+page+"'><img src=\"" + viewer.getPackagePath() + "thumb_img/" + label +"-thumb.jpg\" /></a>");
						} else {
							a = $("<a page='"+page+"' href='#page="+page+"'>"+ label +"</a>");
						}
						$li.append(a);
						$("#sidebar_content .toc_items").append($li);
	
						chapterCount++;
				
					}
				}
				
				
			});
			
			if (chapterCount == 0) {
				$("#sidebar_content .toc_items").append($("<span class='empty_toc'>Ei sisällysluetteloa</span>"));
			}
			
			
	
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
	
		$(".toc_items").height( $(window).height() - $("#bibdata").height() - $("#logo").height());

	});
}
toc._construct();




