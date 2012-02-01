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

	var self=this;

	var myHandle;
	var myItemType;
	var sDataPath;
	var scalingFactor;
	var images = [];
	var oViewerSize = { width: 300, height: 300 };

	var mouse_mode = "pan";
	
	var mouseX;
	var mouseY;
	var mouseXlast;
	var mouseYlast;
	
	var largeImageTimeout;
	
	//0 = single_page, 1 = dual_page
	var MODE_SINGLE_PAGE = 0;
	var MODE_DUAL_PAGE = 1;
	
	this.MODE_DUAL_PAGE=MODE_DUAL_PAGE;
	this.MODE_SINGLE_PAGE=MODE_SINGLE_PAGE;
	
	
	var viewerMode = MODE_SINGLE_PAGE;

	function refreshCanvasSize() {
		
		var canvas = document.getElementById("viewer");
		
		if (canvas.getContext) { 
			canvas.width=oViewerSize.width;
			canvas.height=oViewerSize.height;
		} 
		$('#text_overlay').width(oViewerSize.width + "px");
		$('#text_overlay').height(oViewerSize.height + "px");
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
		
		var totalWidth=0;
		for (var i=0;i<images.length;i++) {
	
			var image_tmp = $('body').data(images[i].img);
			totalWidth += (image_tmp.width > totalWidth) ? image_tmp.width : totalWidth;
		}
		
		
		var vp = viewport.getPosition();
	
		ctx.translate(vp.x * viewport.getZoom(), vp.y * viewport.getZoom());

		var heightSF = oViewerSize.height / maxHeight * viewport.getZoom();
		var widthSF =  oViewerSize.width / totalWidth * viewport.getZoom();

		scalingFactor = (heightSF < widthSF) ? heightSF : widthSF; 

		ctx.scale(scalingFactor, scalingFactor);
	

		for (var i=0;i<images.length;i++) {
		
		
			var image_tmp = $('body').data(images[i].img);
	
			ctx.save();
			ctx.translate(totalWidth/2,maxHeight/2);
			ctx.rotate(Math.PI / 180 * viewport.getRotation());
		
			ctx.drawImage(image_tmp, images[i].xOffset - totalWidth/2, images[i].yOffset - maxHeight/2);
			ctx.restore();
		
			if (mouse_mode == 'select') { 
				ctx.fillStyle = "rgba(255,255,255,0.5)";
				var oSize = images[i].size;
				ctx.fillRect(images[i].xOffset, images[i].yOffset, oSize.width, oSize.height);
		
			}
		
		}

		ctx.restore();
		
		
	
	}


	function getMetsPath() {

		return metsFilePath;
	}

	function getPackagePath() {

		return sDataPath;
	}

	function currentItem() {
		return $.query.get('item');
	}
	
	function itemType() {
		return myItemType;
	}
	
	function getHandle() {
		return myHandle;
	}
	
	function getAccessImagePath(num) {
		if (itemType() == 'fragmenta') {
			return sDataPath + "access_img/img" + num + "-access.jpg";
		} else {
			return sDataPath + "" + num + ".jpg";
		}
	}

	function getThumbImagePath(num) {
		if (itemType() == 'fragmenta') {
			return sDataPath + "thumb_img/img" + num + "-thumb.jpg";
		} else {
			return sDataPath + "small-" + num + ".jpg";
		}
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

		$("#viewer").empty();
	
	
		if (viewerMode == MODE_DUAL_PAGE) {
			num -= num%2;
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
		
		
			var numStr2 = "" + (num+1);
			while (numStr2.length < 4) {
				numStr2 = "0" + numStr2;
			}
			loadImage(numStr, numStr2);	
		} else {
		
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
			loadImage(numStr);	
		}
	

	}


	function getViewerSize() {

		var fWidth = $("#viewer").width();
		var fHeight = $("#viewer").height();
		return { width: fWidth, height: fHeight };
	}


	var imageCount;

	function smallImageReady() {
	
		self.imageCount--;
	
		if (self.imageCount == 0) {
		
			if (images[0].order != 0 && images.length > 1) {
				var tmp = images[0];
				images[0] = images[1];
				images[1] = tmp;
			}
		
			if (viewerMode == 1 && images.length > 1) {
				var image = $('body').data(images[0].img);
				images[0].xOffset = 0; //-(image.width);
				
				var image2 =  $('body').data(images[1].img);
				images[1].xOffset = image.width;
			}
			
			
			viewport.reset(false);
			
			triggerSmallImageReady();
			
			
		
		}
		
	}

	function largeImageReady() {
	
		self.imageCount--;
		if (self.imageCount == 0) {
		
			if (images[0].order != 0 && images.length > 1) {
				var tmp = images[0];
				images[0] = images[1];
				images[1] = tmp;
			}
			if (viewerMode == 1 && images.length > 1) {
				var image = $('body').data(images[0].img);
				images[0].xOffset = 0; //-(image.width);
				
				var image2 =  $('body').data(images[1].img);
				images[1].xOffset = image.width;
			}
			
			triggerImageReady();
		}
	};

	

	function loadImage(num, num2) {
		
		for (key in $('body').data()) {
			$('body').removeData(key);
		}
		
		
		if (!num2) {
			var num2 = null;
		}
	
		var leftSmallImage = new Image();
		leftSmallImage.src= getThumbImagePath(num);

		if (num2 != null) {
			var rightSmallImage = new Image();
			rightSmallImage.src= getThumbImagePath(num2)
		}
		
		delete(images);
		images = [];
		
		
		if (viewerMode == 1 && num2 != null) {
		  self.imageCount = 2;
		} else {
		  self.imageCount = 1;
		}



		$(leftSmallImage).load(function() {
			$('body').data(leftSmallImage.src, leftSmallImage);
			
			var oImageSize = { 
				width: leftSmallImage.width, 
				height: leftSmallImage.height, 
				ratio: leftSmallImage.width / leftSmallImage.height 
			};

			var elemWidth = $("#viewer").width();
			var elemHeight = $("#viewer").height();
			var w = elemHeight * oImageSize.ratio;
			oImageSize.left = (elemWidth-w)/2;
			oImageSize.top = 0;
			
			oImageSize.scale = w / oImageSize.width;
		
			images.push( { 
				order: 0,
				img: leftSmallImage.src, 
				xOffset: 0, 
				yOffset: 0, 
				size: oImageSize, type: 'small'
			} );
	
			smallImageReady();
		}).error(function() {
				smallImageReady();
		});
			
		
		if (viewerMode == 1 && num2 != null) {
			$(rightSmallImage).load(function() {
				$('body').data(rightSmallImage.src, rightSmallImage);
			
				var oImageSize = { 
					width: rightSmallImage.width, 
					height: rightSmallImage.height, 
					ratio: rightSmallImage.width / rightSmallImage.height 
				};
		
				var elemWidth = $("#viewer").width();
				var elemHeight = $("#viewer").height();
				var w = elemHeight * oImageSize.ratio;
				oImageSize.left = (elemWidth-w) / 2;
				oImageSize.top = 0;
			
				oImageSize.scale = w / oImageSize.width;
			
				images.push( { 
					order: 1,
					img: rightSmallImage.src, 
					xOffset: 0, 
					yOffset: 0, 
					size: oImageSize, type: 'small'
				} );
	
				smallImageReady();
			}).error(function() {
				smallImageReady();
			});
		}
	
	}


	function loadBigImages() {

		var num = currentPage();

		if (viewerMode == MODE_DUAL_PAGE) {
			num -= num%2;
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
	
			var numStr2 = "" + (num+1);
			while (numStr2.length < 4) {
				numStr2 = "0" + numStr2;
			}
			
			num = numStr;
			num2 = numStr2;
			
		} else {
		
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
			
			num = numStr;
			num2 = null;
		}
		
		var leftImage = new Image();
		leftImage.src= getAccessImagePath(num);
	
		if (num2 != null) {
			var rightImage = new Image();
			rightImage.src= getAccessImagePath(num2);
		}
		images = [];
		if (viewerMode == 1 && num2 != null) {
		  self.imageCount = 2;
		} else {
		  self.imageCount = 1;
		}

		$(leftImage).load(function() {

				$('body').data(leftImage.src, leftImage);
		
				oImageSize = { 
					width: leftImage.width, 
					height: leftImage.height, 
					ratio: leftImage.width / leftImage.height
				};

				var elemWidth = $("#viewer").width();
				var elemHeight = $("#viewer").height();
				var w = elemHeight * oImageSize.ratio;
				
				oImageSize.left = (elemWidth-w)/2;
				oImageSize.top = 0;
			
				oImageSize.scale = w / oImageSize.width;
	
				images.push({order: 0, img: leftImage.src, xOffset: 0, yOffset: 0, size: oImageSize, type: 'large'});
		
			
				largeImageReady();
				
		}).error(function() {
			if (window.console && console.log) console.log("Left Image error");
			largeImageReady();
		});
		
		$(rightImage).load(function() {

				$('body').data(rightImage.src, rightImage);
		
				oImageSize = { width: rightImage.width, height: rightImage.height, ratio: rightImage.width / rightImage.height};


				elemWidth = $("#viewer").width();
				elemHeight = $("#viewer").height();
				var w = elemHeight * oImageSize.ratio;
				oImageSize.left = (elemWidth-w)/2;
				oImageSize.top = 0;
			
				oImageSize.scale = w / oImageSize.width;
	
				images.push({order: 1, img: rightImage.src, xOffset: 0, yOffset: 0, size: oImageSize, type: 'large'});
		
				largeImageReady();
				
		
		}).error(function() {
				if (window.console && console.log) console.log("Right Image error");
				largeImageReady();
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
	
	
	function togglePageMode() {

		
		if (viewerMode == MODE_DUAL_PAGE) {
			$("#page_mode").removeClass('icon_page_mode_dual');
			$("#page_mode").addClass('icon_page_mode_single');
			viewerMode = MODE_SINGLE_PAGE;
		} else if (viewerMode == MODE_SINGLE_PAGE) {
			$("#page_mode").addClass('icon_page_mode_dual');
			$("#page_mode").removeClass('icon_page_mode_single');
			viewerMode = MODE_DUAL_PAGE;
		}
		loadPage(currentPage());

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
	
	function getCurrentPagesInt() {
	
		var num = currentPage();
	
		if (viewerMode == MODE_DUAL_PAGE) {
			num -= num%2;
			
			return [num, num+1];
		}
		return [num];
		
	}
	
	function getCurrentPages() {
	
		var num = currentPage();
	
		if (viewerMode == MODE_DUAL_PAGE) {
			num -= num%2;
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
		
		
			var numStr2 = "" + (num+1);
			while (numStr2.length < 4) {
				numStr2 = "0" + numStr2;
			}
			return [numStr, numStr2];	
		} else {
		
			var numStr = "" + num;
			while (numStr.length < 4) {
				numStr = "0" + numStr;
			}
			return [numStr];	
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
	this.getMetsPath=getMetsPath;
	this.currentPage=currentPage;
	this.currentPage4=currentPage4;
	this.getCurrentPages=getCurrentPages;
	this.getCurrentPagesInt=getCurrentPagesInt;
	this.isCanvasSupported=isCanvasSupported;
	this.onSizeChange=onSizeChange;
	this.currentItem=currentItem;
	this.itemType=itemType;
	this.getHandle=getHandle;
	this.getThumbImagePath=getThumbImagePath;
	this.getAccessImagePath=getAccessImagePath;
	
	this.getMode=getMode;
	this.getViewMode=function() { return viewerMode; };
		
	
	onSmallImageReady(redrawCanvas);
	onSmallImageReady(function() {
		if (largeImageTimeout != undefined) {
			clearTimeout(largeImageTimeout);
		}
		largeImageTimeout = setTimeout(loadBigImages, 500);
	});
	
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
		  		width: $('#text_overlay').width() - 6, 
		  		height: $(window).height() - $("#topbar").height() - 6
		};
		
		refreshCanvasSize();
		
		
		$(window).bind('hashchange', function() {

			loadPage(currentPage());
			triggerPagechange();
		
		});

		myHandle = $.query.get('handle');
		var itemString = $.query.get('item');
		var logoHref = $('#logo img').attr('src');
		if (logoHref == 'img/logo-fra.png') {
			myItemType = 'fragmenta';
			sDataPath = "/packages/" + itemString + "/";
			metsFilePath = sDataPath + itemString + '-METS.xml';
		} else {
			myItemType = 'doria';
			sDataPath = "/viewer/prod/packages/" + itemString + "/";
			metsFilePath = sDataPath + 'mets.xml';
		}


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
		
		if (viewer.isCanvasSupported()) {
			$("#page_mode").css('display','block');
			$("#page_mode").click(function() { togglePageMode(); });
	 	}
	 	
		
	
	});
	
	
}
viewer._construct();

