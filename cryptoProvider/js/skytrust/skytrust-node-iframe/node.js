define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-node-common/component'); // base
	var CryptoObject = require('../skytrust-node-common/crypto-object');
	var Router = require('../skytrust-node-common/router');
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

	var getNewNodeID = function() {
		return "skytrust-node-" + Math.round(Math.random()*1E8); // make unique
	};


	// ------- public methods

	var Node = function() {
		if(this instanceof Window) {
			throw Error('Node called statically'); // define exception
		}

		self = this;

		self.router = new Router(this);
		self.id = getNewNodeID();

		addComponent('receiver', new Receiver());
		addComponent('actorplus', new ActorPlus());
		addComponent('authentication', new Authentication());
		addComponent('communication', new Communication());

		Node.prototype.debugPrintComponents();

		return $.extend(this, {
			id : self.id,
			operation : components['receiver'].operation
		});
	};

	Node.prototype.getComponent = function(name) {
		if(components.hasOwnProperty(name)) {
			return components[name];
		}
		return false;
	}

	Node.prototype.debugPrintComponents = function() {
		console.log("[iframe] node components:")
		for(key in components) {
			console.log("[iframe]  - " + key);
		}
	};

	Node.prototype.getReceiver = function() {
		return components['receiver'];
	};


	// ------- export	

	return Node;


});