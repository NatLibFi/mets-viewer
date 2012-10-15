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
                $toc_items=$("#toc_items");
		$toc_items.html('');

		var data = viewer.getMets();
                var chapterCount = 0;
                if (viewer.itemType() == 'doria') {
                        var pagesString = '[TYPE="CHAPTER"]';
                        var pageString = 'LABEL';
                } else {
                        var pagesString = '[TYPE="PAGE"][CONTENTIDS]';
                        var pageString = 'ID';
                }
                $(data).find(pagesString).each(function() {

			var label = $(this).attr(pageString);
			if (label !== undefined) {

                                var $a;
                                var $img;
                                var $li;
				var $file = $(this).find('[FILEID]').first();

				var page = fileIDToPageNum ( $file.attr('FILEID') );

				if (page != null) {
					$li = $("<li></li>");
                                        $a = $("<a page='"+page+"' href='#page="+page+"' />");

					if (viewer.itemType() == 'doria') {
                                            $a.text(label);
					} else {
                                                $img = $('<img class="lazy" />')
                                                $img.attr('data-original', viewer.getPackagePath() + "thumb_img/" + label +"-thumb.jpg");
                                                $a.append($img);
					}
					$li.append($a);
                                        $toc_items.append($li);

					chapterCount++;
			
				}
			}
			
			
		});
                $toc_items.find('.lazy').lazyload({
                    container: $toc_items
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

	function setTocSize() {
		// FIXME: This works, but relays on #bibdata, #toc_header and #logo to
		// already have been rendered to their final size.
                var $ti = $("#toc_items");
		$ti.height($(window).height() - $ti.offset().top);
                $ti.scroll(); // trigger scroll to make laze toc work.

	}
	onMetsLoaded(function() {
		buildIndex();
		setTocSize();
		$(window).resize(setTocSize);
	});
}
toc._construct();




