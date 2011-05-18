/*!
 * Mets viewer
 *
 * Copyright 2011, the National Library of Finland
 * Licensed under the 2-clause FreeBSD licence.
 * See the LICENSE file in the root directory of this application.
 *
 * Author: Pasi Tuominen
 */
 
var rotate = {};

rotate._construct = function() {

	var animater;
	
	function reset() {
		viewport.setRotation(0);
	}
	
	function setRotation(angle) {
		viewport.setRotation(angle);
	}
	
	function rotateLeft() {
		viewport.setRotation(viewport.getRotation() - 90);
	
	}
	
	function rotateRight() {
		viewport.setRotation(viewport.getRotation() + 90);
	}
	
	function smoothRotateRight() {
		
		if (animater !== undefined) {
			clearInterval(animater);
		}
	
		animater = setInterval(wrapper(), 5);
		
	}
	
	function wrapper() {
		var target = viewport.getRotation() + 90;
		var a = new Date();
		last = a.getTime();
		return function rotanim() {
			animate(2, target);
		}
	}
	var last;
	
	function animate(step, target) {
		var a = new Date();
	//	console.log(a.getTime() - last + "ms -> " + 1000/(a.getTime() - last) +"fps");
		last = a.getTime();
		var now = viewport.getRotation();
		var newAngle = now + step;
		
		viewport.setRotation(newAngle);
		
		if (newAngle == target) {
			clearInterval(animater);
		} 
		
	}
	
	
	
	this.reset=reset;
	this.rotateLeft=rotateLeft;
	this.rotateRight=rotateRight;
	this.setRotation=setRotation;
	
	this.smoothRotateRight=smoothRotateRight;
	
}
rotate._construct();
