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

	

	var Element = function() {

		// ------- private members

		var router = null;
		var components = {};

		
		// ------- private methods	
		
		var addComponent = function(name, component) {
			// already in use?
			if(components.hasOwnProperty(name)) {
				return false;
			}

			components[name] = component;

			component.send = function(to, object) {
				router.route(name, to, object);
			};
		};


		// ------- public members

		this.operation = null;		


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

		router = new Router(this);

		addComponent('receiver', new Receiver());
		addComponent('actorplus', new ActorPlus());
		addComponent('authentication', new Authentication());
		addComponent('communication', new Communication());

		this.operation = components['receiver'].operation;
	}


	return Element;


});