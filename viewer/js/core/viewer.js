
var viewer = {};


viewer._construct=function() {


	var sDataPath = "/mets_viewer/packages/";
	var scalingFactor;
	var images = [];
	var oViewerSize;

	var mouse_mode = "pan";
	
	var mouseX;
	var mouseY;
	var mouseXlast;
	var mouseYlast;
	
	
	onSmallImageReady(redrawCanvas);
	onImageReady(redrawCanvas);
	onViewportChange(redrawCanvas);

	function redrawCanvas() {

		var canvas = document.getElementById("viewer");

		if (!canvas.getContext) { 
			alert("Selain ei tue canvasta"); 
			return;
		}

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);  

		ctx.save();
	
		var maxHeight=0;
		for (var i=0;i<images.length;i++) {
	
			maxHeight = (images[i].img.height > maxHeight) ? images[i].img.height : maxHeight;
		}
	
	
		ctx.translate(viewport.x * viewport.zoom, viewport.y * viewport.zoom);

		scalingFactor = oViewerSize.height / maxHeight * viewport.zoom;
		ctx.scale(scalingFactor, scalingFactor);
	


		for (var i=0;i<images.length;i++) {
		
			ctx.drawImage(images[i].img, images[i].xOffset, images[i].yOffset);
		
		}

		ctx.restore();
	
	}


	function getPackagePath() {

		return sDataPath;
	}

	function currentPage() {
			var pagehashPattern = new RegExp('#page=(\\d+)','gi');

			var matches = pagehashPattern.exec(window.location.hash);
			if (matches == null) {
				return 1;
			}
			if (matches.length > 1) {
				return parseInt(matches[1], 10);
			}
		
			return null;
	}

	function currentPage4() {
		num = "" + currentPage();
		while (num.length < 4) {
			num = "0" + num;
		}
		return num;
	}

	var mouseX, mouseY, mouseXlast, mouseYlast;


	$(document).ready(function() {
		oViewerSize = {width: $('#viewer').width(), height: $('#viewer').height()};
	
		$(window).bind('hashchange', function() {

			loadPage(currentPage());
			triggerPagechange();
		
		});


		page = $.query.get('page') || 1;
		sDataPath += $.query.get('item') + "/";

		loadPage(page);
	
		//tell registered modules that the core is ready.
		triggerCoreReady();
	

		$("#viewer").mousemove(function(e) {

			mouseXlast = mouseX || 0;
			mouseYlast = mouseY || 0;
		
			mouseX = e.pageX - $(this).offset().left;
			mouseY = e.pageY - $(this).offset().top;

		});
	
	});





	function loadPage(num) {
		num = "" + num;
		while (num.length < 4) {
			num = "0" + num;
		}
	
		$("#viewer").empty();

		loadImage(num);	
	}


	function getViewerSize() {

		fWidth = $("#viewer").width();
		fHeight = $("#viewer").height();
		return { width: fWidth, height: fHeight };
	}




	function loadImage(num) {

		smallImage = new Image();
		smallImage.src= sDataPath + "small-" + num + ".jpg";

		$(smallImage).load(function() {


			oImageSize = { width: smallImage.width, height: smallImage.height, ratio: smallImage.width / smallImage.height };
			
			images = [];
			images.push({img: smallImage, xOffset: 0, yOffset: 0, size: oImageSize, type: 'small'});

			elemWidth = $("#viewer").width();
			elemHeight = $("#viewer").height();
			var w = elemHeight * oImageSize.ratio;
			oImageSize.left = (elemWidth-w)/2;
			oImageSize.top = 0;
			
			oImageSize.scale = w / oImageSize.width;
	
	
			totalPagesWidth = 0;
			totalPagesHeight = 0;
			for (i=0;i<images.length;i++) {
				totalPagesWidth += images[i].img.width;
				totalPagesHeight += images[i].img.height;
			}
		
			//Center the page(s)
			viewportStartX = ($("#viewer").width() - $("#viewer").height() * (totalPagesWidth / totalPagesHeight)) / 2;
		
			viewport.setTransform(viewportStartX,0,1);
	
			triggerSmallImageReady();
		
			bgImage = new Image();
			bgImage.src= sDataPath + num + ".jpg";

		
			$(bgImage).load(function() {

				
		
				oImageSize = { width: bgImage.width, height: bgImage.height, ratio: bgImage.width / bgImage.height};


				elemWidth = $("#viewer").width();
				elemHeight = $("#viewer").height();
				var w = elemHeight * oImageSize.ratio;
				oImageSize.left = (elemWidth-w)/2;
				oImageSize.top = 0;
			
				oImageSize.scale = w / oImageSize.width;
	
	
				images = [];
				images.push({img: bgImage, xOffset: 0, yOffset: 0, size: oImageSize, type: 'large'});
				triggerImageReady();
		
			});
		
		
		});
	}


	$(document).ready(function() {
		$("#pan").click(function() { setmode(this); });
		$("#select").click(function() { setmode(this); });
	});

	function setmode(item) {

		mode = $(item).attr('id');
	
		$(item).addClass('selected');

		mouse_mode = mode;
		if (mode == 'pan') {
			$("#select").removeClass('selected');
			$("#viewer").css('cursor', 'default');
			$("#text_overlay span").css('cursor', 'default');
		}

		if (mode == 'select') {
			$("#pan").removeClass('selected');
			$("#viewer").css('cursor', 'text');
			$("#text_overlay span").css('cursor', 'text');
		}
	
	}
	function getMouseMode() {
		return mouse_mode;
	}

	function getPageImages() {
		return images;
	}
	function getSize() {
		return oViewerSize;
	}
	function getMousePosition() {
		return {x: mouseX,y: mouseY};
	}
	function getLastMousePosition() {
		return {x: mouseXlast,y: mouseYlast};
	}
	
	this.loadPage=loadPage;
	this.getMouseMode=getMouseMode;
	this.getMousePosition=getMousePosition;
	this.getLastMousePosition=getLastMousePosition;
	this.getSize=getSize;
	this.getPageImages=getPageImages;
	this.getPackagePath=getPackagePath;
	this.currentPage=currentPage;
	this.currentPage4=currentPage4;
	
}
viewer._construct();

