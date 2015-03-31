define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component'); // base
	var CryptoObject = require('../skytrust-element-common/crypto-object');
	var Router = require('../skytrust-element-common/router');
	var Receiver = require('./receiver');
	var Communication = require('./communication');


	// ------- private members	
	
	var components = {};

	var self = null;


	// ------- private methods and classes	
	
	var getNewElementID = function() {
		return "skytrust-element-" + Math.round(Math.random()*1E8); // make unique
	};

	var addComponent = function(name, component) {
		if(components.hasOwnProperty(name)) {
			return false; // already in use
		}

		components[name] = component;

		component.send = function(to, object) {
			self.router.route(name, to, object);
		};
	};


	// ------- public methods

	var Element = function() {
		if(this instanceof Window) {
			throw Error('Element called statically'); // define exception
		}

		self = this;

		self.router = new Router(this);
		self.id = getNewElementID();

		var iframe_id = "skytrust-iframe";
		document.getElementById(iframe_id).src = "js/skytrust-iframe.html?"+iframe_id;

		addComponent('receiver', new Receiver());
		addComponent('communication', new Communication(iframe_id));

		Element.prototype.debugPrintComponents();

		return $.extend(this, {
			id : self.id,
			operation : components['receiver'].operation
		});
	};

	// TODO: remove, only debug
	Element.prototype.debugPrintComponents = function() {
		console.log("[w3c] element components:")
		for(key in components) {
			console.log("[w3c]  - " + key);
		}
	};

	Element.prototype.getComponent = function(name) {
		if(components.hasOwnProperty(name)) {
			return components[name];
		}
		return false;
	}



	// ------- export	

	return Element;


});