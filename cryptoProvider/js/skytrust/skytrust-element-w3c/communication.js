define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component');
	var CryptoObject = require('../skytrust-element-common/crypto-object');
	var Protocol = require('../skytrust-element-common/protocol');

    var Config = require('../config');


	var Communication = function(iframeid) {

		// ------- private members

		var iframe_id = "";
		var self = this;


		// ------- private methods	

		var makeIFrameRequest = function(requestObject) {
			console.log("[w3c] sending post message to iframe ...");

			var iframe = document.getElementById(iframe_id);

			console.log("[w3c] data to send: ");
			console.log(requestObject.json());

			var url = iframe.src;
			iframe.contentWindow.postMessage(requestObject.json(), "*");

			// problem: multiple 
			window.removeEventListener("message", onPostMessageReceive, false);

			var onPostMessageReceive = function(event) {
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

		this.onReceive = function(object) {
			console.log("[w3c] received at communication component");

			Protocol.setBlankHeader(object);

			makeIFrameRequest(object);
		};


		// ------- C'tor

		iframe_id = iframeid;

	}

	Communication.prototype = Object.create(Component);


	// ------- export

	return Communication;

});