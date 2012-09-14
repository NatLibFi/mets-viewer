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

	function zeroPad(num,count) {
		var numZeropad = num + '';
		while(numZeropad.length < count) {
			numZeropad = "0" + numZeropad;
		}
		return numZeropad;
	}

	function updateSavePageLink() {
		var tail_page = "/"+prefix+'-'+num+'.tif?sequence='+viewer.currentPage();
		var href_page = base_path + tail_page 
		$("#save_page a").attr('href',href_page);
	}

	var base_path = "/bitstream/handle/" + viewer.getHandle();
	var signum = bib_data.getSignum();
	var prefix = (signum==null) && ('_') || (signum.replace(/\./g,'_'));
	var num = zeroPad(viewer.currentPage(),4);
	var tail_pdf = "/"+prefix+".pdf?sequence="+(page_changer.pageCount()+1);
	var href_pdf = base_path + tail_pdf;
	var href_back_to_metadata = '/handle/' + viewer.getHandle();
	
	var back_to_metadata = $('<div class="linkbutton"><a href="'+href_back_to_metadata+'"><img src="img/f.png" />Item metadata view</a></div>');
	$('#bibdata').append(back_to_metadata);

	var save_pdf = $('<div class="linkbutton" id="save_pdf"><a href="'+href_pdf+'"><img src="img/pdf.png" />Save whole document</a></div>');
	$('#bibdata').append(save_pdf);

	var save_page = $('<div class="linkbutton" id="save_page"><a href=""><img src="img/tiff.png" />Save current page</a></div>');
	$('#bibdata').append(save_page);
	updateSavePageLink();
	onPageChanged(updateSavePageLink);

}

onMetsLoaded(function () {
	if (viewer.getHandle()) {
		save_files._construct();
	}
});
