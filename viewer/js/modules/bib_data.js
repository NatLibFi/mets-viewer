/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var bib_data = {};

bib_data._construct = function() {

	var signum;

	function getSignum() {
		return signum;
	}

	this.getSignum = getSignum;

	function buildBibliographicData() {

		$("#bibdata .content").html('');

		var data = viewer.getMets();
		var title_prefix;
		var fields;

		if (viewer.itemType() == 'fragmenta') {
			title_prefix = "Fragmenta membranea - ";
			fields = [
				{
					'tag': 'dc\\:identifier',
					'type': 'signum',
					'desc':'Signum'
				}
				
				,{
					'tag': 'dc\\:creator',
					'desc':'Author'
				}
			
				,{
					'tag': 'dc\\:description',
					'type': 'timing',
					'desc':'Date'
				}
				
			];
			var dc = $(data).find("qdc\\:qualifieddc");
			var $table = $("<table border='0'></table>");
			
			for (var i=0;i<fields.length;i++) {
				$row = $("<tr></tr>");
				
				$(dc).find(fields[i].tag).each(function() {
						
					if ((fields[i].type === undefined) || (fields[i].type == $(this).attr('type'))) {
						$row.append($("<td> </td>"));
						//$row.append($("<td>" +  fields[i].desc + "</td>"));
						$row.append($("<td>" +  $(this).text() + "</td>"));
						
						if (fields[i].tag == 'dc\\:identifier') {
							document.title = title_prefix + $(this).text();
							signum = $(this).text()
						}
					}
				});
				$table.append($row);

			}
		} else {
	
			title_prefix = "Doria - ";
			fields = [
				{
					'tag': 245
					,'subfields': [ {'desc':'Nimeke', 'code': 'a'} ]
				}
				
				,{
					'tag': 100
					,'subfields': [ {'desc':'Tekijä', 'code': 'a'} ]
				}
			
				,{
					'tag': '260'
					,'subfields': [ {'desc':'Vuosi', 'code': 'c'} ]
				}
				
			];
			var marc =	$(data).find("[nodeName='MARC:record']");
			
			var $table = $("<table border='0'></table>");
			
			for (var i=0;i<fields.length;i++) {
				$row = $("<tr></tr>");
				
				
				marc.find("[tag='" + fields[i].tag + "']").each(function() {
				

					if (typeof(fields[i].control) != 'undefined' && fields[i].control) {
					
						
						$row.append($("<td>" +  fields[i].desc + "</td>"));
					
						$row.append($("<td>" +  fields[i].func( $(this).text() ) + "</td>"));
					
					
					} else {				
				
						for (var j=0;j<fields[i].subfields.length;j++) {
			
							var $subfields = $(this).find("[code='"+ fields[i].subfields[j].code +"']");
						
			
							if ($subfields.length) {
			
								$row.append($("<td>" +  fields[i].subfields[j].desc + "</td>"));
				
								$subfields.each(function() {
				
									$row.append($("<td>" +  $(this).text() + "</td>"));
									
									if (fields[i].tag == 245) {
									
										document.title =  title_prefix + $(this).text();
									}
							
								});
							}
						}
					}
				
				});
			
				$table.append($row);
				
			}
		}
		
		$("#bibdata .content").append($table);
	
	
		$(".toc_items").height( $(window).height() - $("#bibdata").height() - $("#logo").height() -60);
	}
	
	this.buildBibliographicData=buildBibliographicData;
	onMetsLoaded(function() {

		bib_data.buildBibliographicData();	

	});
	
}
bib_data._construct();
