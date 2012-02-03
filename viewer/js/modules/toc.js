/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var toc = {};

toc._construct = function() {

	function buildIndex() {

		$("#toc_items").html('');

		data = viewer.getMets();
		var chapterCount = 0;
		if (viewer.itemType() == 'fragmenta') {
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
					if (viewer.itemType() == 'fragmenta') {
						a = $("<a page='"+page+"' href='#page="+page+"'><img src=\"" + viewer.getPackagePath() + "thumb_img/" + label +"-thumb.jpg\" /></a>");
					} else {
						a = $("<a page='"+page+"' href='#page="+page+"'>"+ label +"</a>");
					}
					$li.append(a);
					$("#toc_items").append($li);

					chapterCount++;
			
				}
			}
			
			
		});
		
		if (chapterCount == 0) {
			$("#toc_items").append($("<span class='empty_toc'>Ei sisällysluetteloa</span>"));
		}

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

	function setTocSize() {
		// FIXME: This works, but relays on #bibdata, #toc_header and #logo to
		// already have been rendered to their final size.
		$("#toc_items").height($(window).height() - $('#toc_items').offset().top);
	}
	onMetsLoaded(function() {
		toc.buildIndex();
		setTocSize();
		$(window).resize(setTocSize);
	});
}
toc._construct();




