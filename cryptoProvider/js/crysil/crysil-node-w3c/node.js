define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../crysil-node-common/component'); // base
	var CryptoObject = require('../crysil-node-common/crypto-object');
	var Router = require('../crysil-node-common/router');
	var Receiver = require('./receiver');
	var Communication = require('./communication');


	// ------- private members	
	
	var components = {};

	var self = null;


	// ------- private methods and classes	
	
	var getNewNodeID = function() {
		return "crysil-node-" + Math.round(Math.random()*1E8); // make unique
	};

	var createIFrame = function() {
		var iframe_id = "";
		do {
			iframe_id = "crysil-iframe-" + Math.round(Math.random()*1E8);
		} while($("#" + iframe_id).length > 0);

		$("body").append("<iframe src=\"js/iframe.html?"+iframe_id+"\" id=\""+iframe_id+"\" class=\"crysil-iframe\"></iframe>");

		return iframe_id;
	}


	// ------- public methods

	var Node = function() {
		if(this instanceof Window) {
			throw Error('Node called statically'); // define exception
		}

		self = this;

		self.router = new Router(this);
		self.id = getNewNodeID();

		self.iframe_id = createIFrame();

		addComponent('receiver', new Receiver());
		addComponent('communication', new Communication(self.iframe_id));

		Node.prototype.debugPrintComponents();

		return $.extend(this, {
			id : self.id,
			operation : components['receiver'].operation
		});
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

	Node.prototype.debugPrintComponents = function() {
		console.log("[w3c] node components:")
		for(key in components) {
			console.log("[w3c]  - " + key);
		}
	};

	Node.prototype.getReceiver = function() {
		return components['receiver'];
	};

	Node.prototype.getComponent = function(name) {
		if(components.hasOwnProperty(name)) {
			return components[name];
		}
		return false;
	}



	// ------- export	

	return Node;


});