define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component');
	var CryptoObject = require('../skytrust-element-common/crypto-object');
	var Protocol = require('../skytrust-element-common/protocol');

    var Config = require('../config');


	// ------- private members	

	var self = null;
	var onPostMessageReceive = null;


	// ------- private methods	

	var makeIFrameRequest = function(requestObject) {
		console.log("[w3c] sending post message to iframe [" + self.iframe_id + "] ...");

		var iframe = document.getElementById(self.iframe_id);

		console.log("[w3c] data to send: ");
		console.log(requestObject.json());

		var url = iframe.src;
		iframe.contentWindow.postMessage(requestObject.json(), "*");

		// problem: multiple 
		window.removeEventListener("message", onPostMessageReceive, false);

		onPostMessageReceive = function(event) {
	        console.log("[w3c] received post message ...");
        	console.log("[w3c] postMessage origin: " + event.origin);

	        // check origin

	        var dataReceived = JSON.parse(event.data);

	        requestObject.setPayload(dataReceived.payload);
		   	requestObject.setHeader(dataReceived.header);

        	self.send('receiver', requestObject);
        };

		window.addEventListener("message", onPostMessageReceive, false);

	}

	// ------- public methods

	var onReceive = function(object) {
		console.log("[w3c] received at communication component");

		Protocol.setBlankHeader(object);

		makeIFrameRequest(object);
	};


	var Communication = function(iframe_id) {
		self = this;

		this.iframe_id = iframe_id;

		// initPostMessageListener();

		return $.extend(this, Component, {
			onReceive: onReceive
		});
	};



	// ------- export	

	return Communication;


});