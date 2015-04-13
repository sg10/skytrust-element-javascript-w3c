define(function(require) {

	// ------- imports	
	
	var Router = require('../common/router');
	var Receiver = require('../w3ccrypto/receiver');
	var Communication = require('../w3ccrypto/communication');
	var Config = require('../skytrust-config')
	var $ = require('jQuery');



	var Element = function() {

		// ------- private members

		var components = {};
		var router = new Router(this);
		var iframe_id = "skytrust-iframe";
		var IFRAME_SRC = Config.iFrameSrc; 
		var iframe_loaded = false;

		// ------- private methods
		
		var addComponent = function(name, component) {
			if(components.hasOwnProperty(name)) {
				return false; // already in use
			}

			components[name] = component;

			component.send = function(to, cryptoObject) {
				router.route(name, to, cryptoObject);
			};
		};

		var initIFrame = function() {
			var iFrameContainer = $('#' + Config.iFrameContainerID);

			var iframe = $("<iframe src=\"about:blank\" id=\"skytrust-iframe\">");
			if(iFrameContainer.length) {
				iFrameContainer.append(iframe);
			}
			else {
				$('body').append(iframe);
			}

			$( document ).ready(function() {
				console.log("[w3c   ] loading iframe target ...");
				$('#' + iframe_id).attr('src', IFRAME_SRC);
			});
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

		if(!(this instanceof Element)) {
			throw new Error('Element called statically'); // define exception
		}

		initIFrame();

		addComponent('receiver', new Receiver());
		addComponent('communication', new Communication(iframe_id));

		this.operation = components['receiver'].operation;

	};
	


	// ------ export

	return Element;


});