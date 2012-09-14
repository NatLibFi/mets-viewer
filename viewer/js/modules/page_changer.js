/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen, Juho Vuori
 */
 
var page_changer = {};

page_changer._construct = function() {

	var count;
	var pageChangeTimeout;

	function pageCount() {
		return count;
	}
	this.pageCount = pageCount;

	function buildPageChanger() {

		$("#pages").html('');
		data = viewer.getMets();
		
		if (viewer.itemType() == 'fragmenta') {
			count = $(data).find("[TYPE=\"PAGE\"][CONTENTIDS]").length;
		} else {
			count = $(data).find("file[MIMETYPE='text/xml']").length;
		}


		$prev = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-w'></span></a>");
		$next = $("<a class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-e'></span></a>");
	
		$pageChanger = $("<input id='pageChanger' type='text'></input'>");
		$pageChanger.val(viewer.currentPage());
		
		$lastPage = $("<span class='lastpage'></span>");
		$lastPage.html("/ " + count);
		
		onPageChanged(function() {
			$("#pageChanger").val(viewer.currentPage());
		});
		$pageChanger.keyup(function(event) {
			if (pageChangeTimeout != undefined) {
				clearTimeout(pageChangeTimeout);
			}
			pageChangeTimeout = setTimeout(function() {
		
				var newPage = $pageChanger.val();
				if (newPage < 1) newPage = 1;
				if (newPage > count) newPage = count;
				
				location.href = '#page='+newPage;
			
			
			}, 1000);
	
	
		});
	

		$('#pages').append($prev);
		$('#pages').append($pageChanger);
		$('#pages').append($lastPage);
		$('#pages').append($next);
	
	
	
		$next.click(function() {
			next();
		});
	
		$prev.click(function() {
			prev();
		});
	
		$('#pages a').hover(
			function() {
				$(this).addClass('ui-state-hover');
			},
			function() {
				$(this).removeClass('ui-state-hover');
			});

	}
	
	function next() {
		if (viewer.getViewMode() == viewer.MODE_DUAL_PAGE) {
			newPage = viewer.currentPage()+2;
			if (newPage > count) newPage--;
			if (newPage > count) return;
			
		} else {
			newPage = viewer.currentPage()+1;
			if (newPage > count) return;
		}

		location.href = '#page='+newPage;
	}
	
	function prev() {
		if (viewer.getViewMode() == viewer.MODE_DUAL_PAGE) {
			newPage = viewer.currentPage()-2;
			if (newPage < 0) newPage++;
			if (newPage < 0) return;
			
		} else {
			newPage = viewer.currentPage()-1;
			if (newPage < 1) return;
		}
	
		location.href = '#page='+newPage;
	}
	
	
	this.next=next;
	this.prev=prev;
	this.buildPageChanger = buildPageChanger;
	
	onMetsLoaded(function() {

		page_changer.buildPageChanger();

	});
}
page_changer._construct();

