/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
var viewer = {};


viewer._construct=function() {


	var sDataPath = "/viewer/prod/packages/";
	var scalingFactor;
	var images = [];
	var oViewerSize = { width: 700, height: 700 };

	var mouse_mode = "pan";
	
	var mouseX;
	var mouseY;
	var mouseXlast;
	var mouseYlast;

	function refreshCanvasSize() {
		
		var canvas = document.getElementById("viewer");
		if (canvas.getContext) { 
			canvas.width=oViewerSize.width;
			canvas.height=oViewerSize.height;
		} 
		$('#text_overlay').width(oViewerSize.width);
		$('#text_overlay').height(oViewerSize.height);
	}
	
	function redrawCanvas() {

		var canvas = document.getElementById("viewer");

		if (!canvas.getContext) { 
		
			var image = $('body').data(images[0].img);
	
			image.height = oViewerSize.height;
			image.width = oViewerSize.height * images[0].size.ratio;
	
			$("#nocanvas").html( image );
			
			
			
			return;
		}

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);  

		refreshCanvasSize();

		ctx.save();
	
		var maxHeight=0;
		for (var i=0;i<images.length;i++) {
	
			var image_tmp = $('body').data(images[i].img);
			maxHeight = (image_tmp.height > maxHeight) ? image_tmp.height : maxHeight;
		}
	
		var vp = viewport.getPosition();
	
		ctx.translate(vp.x * viewport.getZoom(), vp.y * viewport.getZoom());

		scalingFactor = oViewerSize.height / maxHeight * viewport.getZoom();
	
		ctx.scale(scalingFactor, scalingFactor);
	
	
	

		for (var i=0;i<images.length;i++) {
		
		
			var image_tmp = $('body').data(images[i].img);
	
			ctx.drawImage(image_tmp, images[i].xOffset, images[i].yOffset);
		
		
			if (mouse_mode == 'select') { 
				ctx.fillStyle = "rgba(255,255,255,0.5)";
				var oSize = images[i].size;
				ctx.fillRect(images[i].xOffset, images[i].yOffset, oSize.width, oSize.height);
		
			}
		
		}

		ctx.restore();
	
	}


	function getPackagePath() {

		return sDataPath;
	}

	function currentItem() {
		return $.query.get('item');
	}
	

	function currentWord() {
		var wordhashPattern = new RegExp('#word=(.+)','gi');

		var matches = wordhashPattern.exec(window.location.hash);
	
		if (matches === null) {
			return null;
		}
		if (matches.length > 1) {
			return matches[1];
		}
		
		return null;
	
	}

	function currentPage() {
			var pagehashPattern = new RegExp('#page=(\\d+)','gi');

			var matches = pagehashPattern.exec(window.location.hash);
			if (matches === null) {
				return 1;
			}
			if (matches.length > 1) {
				return parseInt(matches[1], 10);
			}
		
			return null;
	}

	function currentPage4() {
		var num = "" + currentPage();
		while (num.length < 4) {
			num = "0" + num;
		}
		return num;
	}


	function loadPage(num) {
		var num = "" + num;
		while (num.length < 4) {
			num = "0" + num;
		}
	

		$("#viewer").empty();

		loadImage(num);	
	}


	function getViewerSize() {

		var fWidth = $("#viewer").width();
		var fHeight = $("#viewer").height();
		return { width: fWidth, height: fHeight };
	}


	function loadImage(num) {

		var a = new Date();
	
		var smallImage = new Image();
		smallImage.src= sDataPath + "small-" + num + ".jpg" + "?" + a.getTime();

	
		$(smallImage).load(function() {
			$('body').data(smallImage.src, smallImage);
			
			var oImageSize = { 
				width: smallImage.width, 
				height: smallImage.height, 
				ratio: smallImage.width / smallImage.height 
			};
		
			images = [];
	
			images.push( { 
				img: smallImage.src, 
				xOffset: 0, 
				yOffset: 0, 
				size: oImageSize, type: 'small'
			} );
	
			
			var elemWidth = $("#viewer").width();
			var elemHeight = $("#viewer").height();
			var w = elemHeight * oImageSize.ratio;
			oImageSize.left = (elemWidth-w)/2;
			oImageSize.top = 0;
			
			oImageSize.scale = w / oImageSize.width;
	
	
			totalPagesWidth = 0;
			totalPagesHeight = 0;
			for (i=0;i<images.length;i++) {
			
				var image = $('body').data(images[i].img);
			
				totalPagesWidth += image.width;
				totalPagesHeight += image.height;
				
				
			}
		
			//Center the page(s)
			viewportStartX = ($("#viewer").width() - $("#viewer").height() * (totalPagesWidth / totalPagesHeight)) / 2;
	
		
			viewport.setTransformNoUpdate(viewportStartX,0,1);
			
		
			triggerSmallImageReady();
		
			bgImage = new Image();
			bgImage.src= sDataPath + num + ".jpg" + "?" + a.getTime();

		
			$(bgImage).load(function() {

				$('body').data(bgImage.src, bgImage);
		
				oImageSize = { width: bgImage.width, height: bgImage.height, ratio: bgImage.width / bgImage.height};


				elemWidth = $("#viewer").width();
				elemHeight = $("#viewer").height();
				var w = elemHeight * oImageSize.ratio;
				oImageSize.left = (elemWidth-w)/2;
				oImageSize.top = 0;
			
				oImageSize.scale = w / oImageSize.width;
	
	
				images = [];
				images.push({img: bgImage.src, xOffset: 0, yOffset: 0, size: oImageSize, type: 'large'});
		
			
				triggerImageReady();
		
			});
		
		
		});

	}


	function toggleMode() {


		if (mouse_mode == 'pan') {
		  mouse_mode = 'select';
		} else {
		  mouse_mode = 'pan';
		}
		
		
		if (mouse_mode == 'pan') {
			$("#pan_select").removeClass('icon_select');
			$("#pan_select").addClass('icon_pan');
			$("#viewer").css('cursor', 'default');
			$("#text_overlay span").css('cursor', 'default');
			$(".text").css('color', 'rgba(0,0,0,0)');
		}

		if (mouse_mode == 'select') {
			$("#pan_select").addClass('icon_select');
			$("#pan_select").removeClass('icon_pan');
			$("#viewer").css('cursor', 'text');
			$("#text_overlay span").css('cursor', 'text');
			$(".text").css('color', 'rgba(0,0,0,1)');
		}
		
		redrawCanvas();
	
	}
	
	var viewerSizeChangeListeners = [];
	

	function triggerSizeChange() {
		for (i=0;i<viewerSizeChangeListeners.length;i++) {
			viewerSizeChangeListeners[i]();
		}
	}

	function onSizeChange(callback) {
		viewerSizeChangeListeners.push(callback);
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
	function isCanvasSupported() {
		var canvas = document.getElementById("viewer");
		return (canvas.getContext) ? true : false;
	}
	
	function getImages() {
		return images;
	}
	
	function getMode() {
		return mouse_mode;
	}
	
	this.getImages=getImages;
	
	this.currentWord=currentWord;
	this.loadPage=loadPage;
	this.getMouseMode=getMouseMode;
	this.getMousePosition=getMousePosition;
	this.getLastMousePosition=getLastMousePosition;
	this.getSize=getSize;
	this.getPageImages=getPageImages;
	this.getPackagePath=getPackagePath;
	this.currentPage=currentPage;
	this.currentPage4=currentPage4;
	this.isCanvasSupported=isCanvasSupported;
	this.onSizeChange=onSizeChange;
	this.currentItem=currentItem;
	
	this.getMode=getMode;
		
		
	onSmallImageReady(redrawCanvas);
	onImageReady(redrawCanvas);
	viewport.onViewportChange(redrawCanvas);


	$(document).ready(function() {

		if (!isCanvasSupported()) {
			$("#message").fadeIn("slow");
			$("#message a.close-notify").click(function() {
				$("#message").fadeOut("slow");
				return false;
			});
			
			
			$("#toolbar").hide();
		}


		oViewerSize = {
		  		width: $('#text_overlay').width(), 
		  		height: $('#text_overlay').height()
		};

		refreshCanvasSize();
		
		
		$(window).bind('hashchange', function() {

			loadPage(currentPage());
			triggerPagechange();
		
		});

		sDataPath += $.query.get('item') + "/";

		loadPage(currentPage());
	
		//tell registered modules that the core is ready.
		triggerCoreReady();
	

		$("#viewer").mousemove(function(e) {

			mouseXlast = mouseX || 0;
			mouseYlast = mouseY || 0;
		
			mouseX = e.pageX - $(this).offset().left;
			mouseY = e.pageY - $(this).offset().top;

		});

		$("#text_overlay").resizable({ 
		  resize: function(event, ui) {
		  	oViewerSize = {
		  		width: $('#text_overlay').width(), 
		  		height: $('#text_overlay').height()
		  	};
		  	triggerSizeChange();
		  	redrawCanvas();
		  }
		});
		
		$("#pan_select").click(function() { toggleMode(); });
	
	});
	
	
}
viewer._construct();

