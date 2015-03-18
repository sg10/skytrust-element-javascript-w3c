define(function(require) {

	// ------- imports	

	var $ = require('jQuery');


	// ------- public members	

	var Component = function() {
		if(this instanceof Window) {
			return false;
		}

		return {
			// event handler for receiving an object (via router)
			onReceive : function(object) {},

			// send object to another component
			send : function(to, object) {} 
		};

	};


	// ------- export	

	return Component;
});