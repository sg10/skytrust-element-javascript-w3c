define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component'); // base
	var CryptoObject = require('../skytrust-element-common/crypto-object');
	var Router = require('../skytrust-element-common/router');
	var Receiver = require('./receiver');
	var ActorPlus = require('./actorplus');
	var Authentication = require('./authentication');
	var Communication = require('./communication');


	// ------- private members	
	
	var components = {};

	var self = null;


	// ------- private methods	
	
	var addComponent = function(name, component) {
		if(components.hasOwnProperty(name)) {
			return false; // already in use
		}

		components[name] = component;

		component.send = function(to, object) {
			self.router.route(name, to, object);
		};
	};

	var getNewElementID = function() {
		return "skytrust-element-" + Math.round(Math.random()*1E8); // make unique
	};


	// ------- public methods

	var Element = function() {
		if(this instanceof Window) {
			throw Error('Element called statically'); // define exception
		}

		self = this;

		self.router = new Router(this);
		self.id = getNewElementID();

		addComponent('receiver', new Receiver());
		addComponent('actorplus', new ActorPlus());
		addComponent('authentication', new Authentication());
		addComponent('communication', new Communication());

		Element.prototype.debugPrintComponents();

		return $.extend(this, {
			id : self.id,
			operation : components['receiver'].operation
		});
	};


	// TODO: remove, only debug
	Element.prototype.getComponent = function(name) {
		if(components.hasOwnProperty(name)) {
			return components[name];
		}
		return false;
	}

	Element.prototype.debugPrintComponents = function() {
		console.log("[iframe] element components:")
		for(key in components) {
			console.log("[iframe]  - " + key);
		}
	};


	// ------- export	

	return Element;


});