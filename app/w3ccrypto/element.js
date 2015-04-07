define(function(require) {

	// ------- imports	
	
	var Router = require('../common/router');
	var Receiver = require('../w3ccrypto/receiver');
	var Communication = require('../w3ccrypto/communication');
	var $ = require('jQuery');


	return function() {

		// ------- private members

		var components = {};
		var router = new Router(this);
		var iframe_id = "skytrust-iframe";
		// URL relative to caller HTML file
		var IFRAME_SRC = require.toUrl("skytrust-iframe.html"); 


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
		};


		// ------- C'tor

		if(this.window === window) {
			throw Error('Element called statically'); // define exception
		}

		$( document ).ready(function() {
			$('#' + iframe_id).attr('src', IFRAME_SRC);//.src = IFRAME_SRC;
		});

		addComponent('receiver', new Receiver());
		addComponent('communication', new Communication(iframe_id));

		this.operation = components['receiver'].operation;

	};


});