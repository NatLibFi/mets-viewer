/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var bib_data = {};

bib_data._construct = function() {

	var title_prefix = "Doria - ";

	var fields = [
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

	function buildBibliographicData() {
		
		$("#bibdata .content").html('');

		$.get(viewer.getPackagePath() + "mets.xml", function(data) {
	
			
			var $marc =	$(data).find("[nodeName='MARC:record']");
			
			var $table = $("<table border='0'></table>");
			
			for (var i=0;i<fields.length;i++) {
				$row = $("<tr></tr>");
				
				
				$marc.find("[tag='" + fields[i].tag + "']").each(function() {
				

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
			
			$("#bibdata .content").append($table);
		
		
			$(".toc_items").height( $(window).height() - $("#bibdata").height() - $("#logo").height() -60);
		});
	}
	
	
	function parseYear(data) {
		//TODO: this works only for the common case
		//Specification: http://www.kansalliskirjasto.fi/extra/marc21/bib/008.htm
		return data.substr(7,4);
	
	}
	
	
	
	this.buildBibliographicData=buildBibliographicData;
	
	onCoreReady(function() {

		bib_data.buildBibliographicData();	
			
		
		
		
	});
	
}
bib_data._construct();
