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
	
	
	this.reset=reset;
	this.rotateLeft=rotateLeft;
	this.rotateRight=rotateRight;
	this.setRotation=setRotation;
	
}
rotate._construct();
