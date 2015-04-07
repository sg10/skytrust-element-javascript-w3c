define(function(require) {

	// ------- imports	
	
	var Router = require('../common/router');
	var Receiver = require('../iframe/receiver');
	var Authentication = require('../iframe/authentication');
	var Communication = require('../iframe/communication');

	

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
		};


		// ------- C'tor

		if(this.window === window) {
			throw Error('Element called statically'); // define exception
		}

		router = new Router(this);

		addComponent('receiver', new Receiver());
		addComponent('authentication', new Authentication());
		addComponent('communication', new Communication());

		this.operation = components['receiver'].operation;
	};


	return Element;


});