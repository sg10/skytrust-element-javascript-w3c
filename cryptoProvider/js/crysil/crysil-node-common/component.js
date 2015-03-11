define(function(require) {

	var $ = require('jQuery');

	var Component = function() {
		if(this instanceof Window) {
			return false;
		}

		return {
			onReceive : function(object) {},
			send : function(to, object) {} 
		};

	};

	return Component;

});