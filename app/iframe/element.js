define(function(require) {

	// ------- imports	
	
	var Router = require('../common/router');
	var Receiver = require('../iframe/receiver');
	var Authentication = require('../iframe/authentication');
	var Communication = require('../iframe/communication');
	var $ = require("jQuery");
	var Config = require("../skytrust-config");

	

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

			component.send = function(to, cryptoObject) {
				router.route(name, to, cryptoObject);
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
		};


		// ------- C'tor

		if(!(this instanceof Element)) {
			throw new Error('Element called statically'); // define exception
		}

		router = new Router(this);

		addComponent('receiver', new Receiver());
		addComponent('authentication', new Authentication(this));
		addComponent('communication', new Communication());

		this.parentAuthHandler = {
			show: components['receiver'].sendShowAuth,
			hide: components['receiver'].sendHideAuth
		};

        $('#loginserver').val(Config.server);
	};


	return Element;


});