define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-node-common/component');
	var CryptoObject = require('../skytrust-node-common/crypto-object');
	var Config = require('../config');
	var E = require('../error');


	// ------- private members	

	var self = null;


	// ------- private methods	

    var initPostMessageListener = function() {
        console.log("[iframe] init post message listener (iframe)");

        window.addEventListener("message", onReceivePostMessage, false);
    };


    var onReceivePostMessage = function(event) {
        console.log("[iframe] received post message ...");

        // check origin

        var dataReceived = JSON.parse(event.data);

        var object = new CryptoObject(dataReceived.payload);
        console.log("[iframe] data received post message");
        console.log(dataReceived);
        object.setHeader(dataReceived.header);

        object.resolve = function() {
            console.log("[iframe] sending post message back ...");
            event.source.postMessage(this.json(), "*"); // remove *
        };

        object.reject = function(error) {
            console.log("[iframe] sending post message back ...");
            object.payload.nodeError = error.toString(); // make skytrust protocol conform
            event.source.postMessage(this.json(), "*"); // remove *
        };

        self.send('communication', object);
    }

	// ------- public methods

	var Receiver = function() {
		self = this;

        initPostMessageListener();

		return $.extend(this, Component);
	};

	Receiver.prototype.onReceive = function(object) {
		console.log('[iframe] received at receiver component');
		console.log(JSON.parse(object.json()));


        object.resolve();
	};


	// ------- export	

	return Receiver;


});