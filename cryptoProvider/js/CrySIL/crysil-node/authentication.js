define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('./component');


	// ------- private members	



	// ------- private methods	



	// ------- public methods



	// ------- export	

	return function() {

		var doSomething = function() {
			this.send('receiver', {myData:'bullshit text'});
		};

		return $.extend(this, Component, {
			doSomething : doSomething
		});
	};


});