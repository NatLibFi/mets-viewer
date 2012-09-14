/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var print = {};

print._construct = function() {

	onImageReady(function() {
	
		$("#print .metadata").html($("#bibdata").html());
		
		var urn = "http://urn.fi/" + viewer.currentItem();
		var pages = viewer.getCurrentPagesInt();
		
		
		$("#print .metadata tbody").append($("<tr><td>Linkki</td><td>"+urn+"</td></tr>"));
		
		
		if (pages.length > 1) {
			$("#print .metadata tbody").append($("<tr><td>Sivut</td><td>"+pages[0]+","+pages[1]+"</td></tr>"));
		} else {
			$("#print .metadata tbody").append($("<tr><td>Sivu</td><td>"+pages[0]+"</td></tr>"));
		}
		
		var canvas = document.getElementById("viewer");
		var context = canvas.getContext("2d");
		var img  = canvas.toDataURL("image/png");

		$("#print .image").html('<img src="'+img+'"/>');
	});
	
	
	
}
print._construct();
