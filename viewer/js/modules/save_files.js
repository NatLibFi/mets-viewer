/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Juho Vuori
 */
 
var save_files = {};

save_files._construct = function() {

	var BASE_PATH = "http://dspacer-jv-kktest/bitstream/handle/";

	console.log("x:" + page_changer.pageCount());

	function zeroPad(num,count) {
		var numZeropad = num + '';
		while(numZeropad.length < count) {
			numZeropad = "0" + numZeropad;
		}
		return numZeropad;
	}

	var parts = viewer.currentItem().split('/');
	var URN = "URN:NBN:fi-" + parts[parts.length-1].replace('-preservation', "");
	var tail_page = "/img"+zeroPad(viewer.currentPage(),4)+"-access.jpg?sequence="+viewer.currentPage();
	var tail_pdf = "/"+parts[parts.length-1]+"-pdf001.pdf?sequence="+page_changer.pageCount();
	// BUG: pageCount works only after page changer has loaded mets.
	var href_pdf = BASE_PATH + viewer.getHandle() + tail_pdf;
	var href_page = BASE_PATH + viewer.getHandle() + tail_page 
	
	save_pdf = $('<div id="save_pdf"><a href="'+href_pdf+'"><img src="img/pdf.png" />Save whole document</a></div>');
	save_page = $('<div id="save_page"><a href="'+href_page+'"><img src="img/tiff.png" />Save current page</a></div>');
	$('#bibdata').append(save_pdf);
	$('#bibdata').append(save_page);
	// TODO: much
	onPageChanged(function() {
		tail_page = "/img"+zeroPad(viewer.currentPage(),4)+"-access.jpg?sequence="+viewer.currentPage();
		href_page = BASE_PATH + viewer.getHandle() + tail_page 
		$("#save_page a").attr('href',href_page);
	});


}

onCoreReady(function () {
	if (viewer.getHandle()) {
		save_files._construct();
	}
});
