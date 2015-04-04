define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');
	var CryptoObject = require('../skytrust-element-common/crypto-object');


	var Router = function(e) {
		// ------- private members

		var element = "";


		// ------- public methods

		this.route = function(from, to, object) {
			console.log("[common][router]  FROM=" + from + " TO=" + to);

			if(!(object instanceof CryptoObject)) {
				throw new Error("Router can only transmit instances of CryptoObject");
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


		// ------- C'tor

		if(this instanceof Window) {
			throw Error('Router called statically'); // define exception
		}

		element = e;
	}



	// ------- export	

	return Router;

});