define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component'); // base
	var CryptoObject = require('../skytrust-element-common/crypto-object');
	var Router = require('../skytrust-element-common/router');
	var Receiver = require('./receiver');
	var Communication = require('./communication');


	return function() {

		// ------- private members

		var components = {};
		var router = new Router(this);
		var iframe_id = "skytrust-iframe";


		// ------- private methods
		
		var addComponent = function(name, component) {
			if(components.hasOwnProperty(name)) {
				return false; // already in use
			}

			components[name] = component;

			component.send = function(to, object) {
				router.route(name, to, object);
			};
		};


		// ------- public members

		this.operation = {};


		// ------- public methods

		this.getComponent = function(name) {
			if(components.hasOwnProperty(name)) {
				return components[name];
			}

			return false;
		}


		// ------- C'tor

		if(this instanceof Window) {
			throw Error('Element called statically'); // define exception
		}

		document.getElementById(iframe_id).src = "js/skytrust-iframe.html";

		addComponent('receiver', new Receiver());
		addComponent('communication', new Communication(iframe_id));

		this.operation = components['receiver'].operation;

	}


});