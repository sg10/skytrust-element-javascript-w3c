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
		var pendingRequests = {};


		// ------- private methods	

		var addPendingRequest = function(requestObject) {
			var iframe = document.getElementById(iframe_id);

			console.log("[w3c] data to send: ");
			console.log(requestObject.json());

			var url = iframe.src;

			var id = "";
			do {
				id = Math.round(Math.random()*10E5);
			}while(pendingRequests.hasOwnProperty(id));

			requestObject.setRequestID(id);
			pendingRequests[id] = requestObject;

			var jsonData = requestObject.jsonWithRequestID();
			iframe.contentWindow.postMessage(jsonData, "*");

			console.log("[w3c] pending requests: " + Object.keys(pendingRequests).length);
		}

		var popPendingRequest = function(requestID) {
			var obj = pendingRequests[requestID];
			if(pendingRequests[requestID]) {
				delete pendingRequests[requestID];
			}
			return obj;
		}

		var makeIFrameRequest = function(requestObject) {
			console.log("[w3c] sending post message to iframe ...");

			addPendingRequest(requestObject);
		}

		var onPostMessageReceive = function(event) {
	        console.log("[w3c] received post message ...");
        	console.log("[w3c] postMessage origin: " + event.origin);

	        // check origin

	        var dataReceived = JSON.parse(event.data);
	        var requestObject = popPendingRequest(dataReceived.requestID);

	        if(!requestObject) {
				throw new Error("no matching request with ID '" + dataReceived.requestID + "' found!");
	        }

	        requestObject.setPayload(dataReceived.payload);
		   	requestObject.setHeader(dataReceived.header);

        	self.send('receiver', requestObject);
        };



		// ------- public methods

		this.onReceive = function(object) {
			console.log("[w3c] received at communication component");

			Protocol.setBlankHeader(object);

			makeIFrameRequest(object);
		};


		// ------- C'tor

		iframe_id = iframeid;
		window.removeEventListener("message", onPostMessageReceive, false);
		window.addEventListener("message", onPostMessageReceive, false);

	}

	Communication.prototype = Object.create(Component);


	// ------- export

	return Communication;

});