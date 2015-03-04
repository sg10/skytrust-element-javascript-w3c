define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('./component'); // base
	var Receiver = require('./receiver');
	var Authentication = require('./authentication');
	var ActorPlus = require('./actorplus');
	var Communication = require('./communication');
	var CryptoObject = require('./crypto-object');


	// ------- private members	
	
	var components = {};

	// var routingHistory = {};

	var self = null;

	// var transactions = {};


	// ------- private methods and classes	
	
	var Router = function() {
		if(this instanceof Window) {
			throw Error('Node called statically'); // define exception
		}

		return {
			route : Router.prototype.route
		};
	};

	Router.prototype.route = function(from, to, object) {
		console.log(" | routing: from=" + from + " to=" + to);

		if(!(object instanceof CryptoObject)) {
			throw new Error("Router can only transmit CryptoObjects");
		}

		if(!components.hasOwnProperty(to)) {
			throw new Error("Router, receiver: no component named " + to);
		}

		if(!components.hasOwnProperty(from)) {
			throw new Error("Router, sender: no component named " + from);
		}

		if(!components[to].onReceive) {
			throw new Error("Router: onReceive() method not defined");
		}

		// object.setTransaction(from, to, getNewTransactionID());

		components[to].onReceive(object);
	};

/*	var RoutingHistory = function() {
		var transactions = {};

		var get = function(from, to, id) {
			routeString = from + "-" + to;

			if(id == null) {
				do { 
					id = Math.round(Math.random()*1E8); 
				} while(transactions[id]);

				transactions[id] = routeString;
			}
			else {
				if(transactions[id] === routeString) {
					delete transactions[id];
				}
			}

			if(id == null) {
				throw new Error("error accessing routing history");
			}

			console.log("transactions history: ");
			console.log(transactions);

			return id;
		};

		return {
			get : get
		};
	};*/

	var getNewNodeID = function() {
		return "crysil-node-" + Math.round(Math.random()*1E8); // make unique
	};


/*	var getNewTransactionID = function() {
		var id;
		do {
			id = Math.round(Math.random()*1E10);
		} while(transactions[id] === true);

		return id;
	};*/


	// ------- public methods

	var Node = function() {
		if(this instanceof Window) {
			throw Error('Node called statically'); // define exception
		}

		self = this;

		this.id = "";
		this.router = null;

		var this1 = this;

		Node.prototype.init.call(self);

		return $.extend(this, {
			debugPrintComponents : Node.prototype.debugPrintComponents,
			id : this1.id,
			operation : components['receiver'].operation
		});
	};

	// private?
	Node.prototype.addComponent = function(name, component) {
		if(components.hasOwnProperty(name)) {
			return false; // already in use
		}

		components[name] = component;

		component.send = function(to, object) {
			router.route(name, to, object);
		};
	};

	Node.prototype.debugPrintComponents = function() {
		console.log("node components:")
		for(key in components) {
			console.log(" - " + key);
		}
	};

	Node.prototype.doSomething = function() {
		components['authentication'].doSomething();
	};

	Node.prototype.init = function() {
		router = new Router();
		id = getNewNodeID();

		Node.prototype.addComponent('receiver', new Receiver());
		Node.prototype.addComponent('actorplus', new ActorPlus());
		Node.prototype.addComponent('communication', new Communication());
		Node.prototype.addComponent('authentication', new Authentication());
	};

	Node.prototype.getReceiver = function() {
		return components['receiver'];
	};


	// ------- export	

	return Node;


});