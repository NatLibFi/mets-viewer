
var pageChangeTimeout;

onCoreReady(function() {

	buildPageChanger();

});


function buildPageChanger() {
	var lastPage = 20;
	
	
	$("#pages").html('');

	$.get(sDataPath + "mets.xml", function(data) {
	
		count = $(data).find("file[MIMETYPE='text/xml']").length;
		
	
		$first = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-arrowthickstop-1-w'></span></a>");
		$last = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-arrowthickstop-1-e'></span></a>");
		
		$prev = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-w'></span></a>");
		$next = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-e'></span></a>");
		
		$pageChanger = $("<input id='pageChanger' type='text'></input'>");
		$pageChanger.val(currentPage());
		
		onPageChanged(function() {
			$("#pageChanger").val(currentPage());
		});
		$pageChanger.keyup(function(event) {
			if (pageChangeTimeout != undefined) {
				clearTimeout(pageChangeTimeout);
			}
			pageChangeTimeout = setTimeout(function() {
			
				var newPage = $pageChanger.val();
				if (newPage > 0 && newPage <= count) {
				
					location.href = '#page='+newPage;
				
				}
			
			}, 1000);
		
		
		});
		
		$('#pages').append($first);
		$('#pages').append($prev);
		$('#pages').append($pageChanger);
		$('#pages').append($next);
		$('#pages').append($last);
		
		$first.attr('href','#page=1');
		$last.attr('href','#page='+count);
		
		$next.click(function() {
			newPage = currentPage()+1;
			if (newPage > count) {
				return;
			}
			location.href = '#page='+newPage;
		});
		
		$prev.click(function() {
			newPage = currentPage()-1;
			if (newPage < 1) {
				return;
			}
			location.href = '#page='+newPage;
		});
		
		$('#pages a').hover(
			function() {
				$(this).addClass('ui-state-hover');
			},
			function() {
				$(this).removeClass('ui-state-hover');
			});
		});
	


}
