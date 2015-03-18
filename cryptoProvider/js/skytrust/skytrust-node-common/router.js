define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');
	var CryptoObject = require('../skytrust-element-common/crypto-object');


	// ------- private members	

	var self = this;
	var element = null;


	// ------- private methods	



	// ------- public methods

	var Router = function(n) {
		element = n;

		if(this instanceof Window) {
			throw Error('Router called statically'); // define exception
		}
	}

	Router.prototype.route = function(from, to, object) {
		console.log("[iframe][router]  FROM=" + from + " TO=" + to);

		if(!(object instanceof CryptoObject)) {
			throw new Error("Router can only transmit CryptoObjects");
		}

		if(element.getComponent(to) === false) {
			throw new Error("Router, receiver: no component named " + to);
		}

		if(element.getComponent(from) === false) {
			throw new Error("Router, sender: no component named " + from);
		}

		if(!element.getComponent(to).onReceive) {
			throw new Error("Router: onReceive() method not defined");
		}

		element.getComponent(to).onReceive(object);
	};


	// ------- export	

	return Router;

});