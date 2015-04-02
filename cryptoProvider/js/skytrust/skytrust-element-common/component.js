define(function(require) {

	// ------- imports	

	var $ = require('jQuery');


	// ------- C'tor

	var Component = function() {
		if(this instanceof Window) {
			return false;
		}
	};


	// ------- private/"protected" methods	

	// send object to another component
	Component.prototype.send = function(to, object) {};


	// ------- public methods	

	// event handler for receiving an object (via router)
	Component.prototype.onReceive = function(object) {};




	// ------- export	

	return Component;
});