define(function(require) {

	// ------- imports	
	
	var Component = require('../common/component');
	var Protocol = require('../common/protocol');
    var ComObject = require('../common/com-object');


	var Communication = function(iframeid) {

		// ------- private members

		var iframe_id = "";
		var self = this;
		var pendingRequests = {};
		var iFrameLoaded = false;


		// ------- private methods	

        var initPostMessageListener = function() {
            console.log("[w3c   ] init post message listener");

            window.addEventListener("message", onPostMessageReceive, false);
        };

        var newComObject = function(cryptoObject) {
        	var comObject = new ComObject();
        	comObject.type = "request";

			var id = "";
			do {
				id = Math.round(Math.random()*10E5);
			}while(pendingRequests.hasOwnProperty(id));

        	comObject.requestID = id;
        	comObject.data = cryptoObject.comObjectData();
			pendingRequests[id] = cryptoObject; 

			return comObject;    	
        }

        var sendRequestIfReady = function(comObject) {
			var iframe = document.getElementById(iframe_id);

			// IFrame not yet loaded --> wait
			if(iFrameLoaded === false) {
				var interval = window.setInterval(function() {
					if(iFrameLoaded === true) {
						window.clearInterval(interval);
						iframe.contentWindow.postMessage(comObject, "*");
					}
					console.log("[w3c   ] request " + comObject.requestID + ", waiting for IFrame to be loaded");
				}, 500);
			}
			else {
				console.log("[w3c   ] sending request " + comObject.requestID + " to IFrame");
				iframe.contentWindow.postMessage(comObject, "*");
			}

			console.log("[w3c   ] pending requests: " + Object.keys(pendingRequests).length);
        };

		var pushPendingRequest = function(requestObject) {
			console.log("[w3c   ] data to send: ");
			console.log(requestObject);

			var comObject = newComObject(requestObject);

			sendRequestIfReady(comObject);
		};

		var popPendingRequest = function(requestID) {
			var obj = pendingRequests[requestID];
			if(pendingRequests[requestID]) {
				delete pendingRequests[requestID];
			}
			return obj;
		};

		var makeIFrameRequest = function(requestObject) {
			console.log("[w3c   ] sending post message to iframe ...");

			pushPendingRequest(requestObject);
		};

		var onPostMessageReceive = function(event) {
	        console.log("[w3c   ] received post message ...");
        	console.log("[w3c   ] postMessage origin: " + event.origin);
        	console.log("[w3c   ] postMessage data:");
        	console.log(event.data);

	        // TODO: check origin

	        var comObject = event.data;

	        if(!comObject.type) {
	        	// another script might use postMessages
	        	return;
	        }

	        // type: IFrame is initialized
	        if(comObject.type === "hello") {
				console.log("[w3c   ] recevied 'alive-message': IFrame element loaded");
		 		iFrameLoaded = true;
		 		return;
	        }
	        // type: crypto operation
	        else if(comObject.type === "request") {
		        var dataReceived = comObject.data;

		        if(!comObject.requestID || !comObject.data) {
		        	throw new Error("Invalid response from IFrame");
		        	return;
		        }

		        var requestObject = popPendingRequest(comObject.requestID);
		        if(!requestObject) {
					throw new Error("no matching request with ID '" + dataReceived.requestID + "' found!");
		        }

		        requestObject.setPayload(dataReceived.payload);
			   	requestObject.setHeader(dataReceived.header);

	        	self.send('receiver', requestObject);
        	}
        	// type: show/hide authentication iframe (if IFrame isn't in body)
	        else if(comObject.type === "show-auth" && $('#' + iframe_id).parent() !== $('body')) {
        		$('#' + iframe_id).parent().show();
	        }
	        else if(comObject.type === "hide-auth" && $('#' + iframe_id).parent() !== $('body')) {
        		$('#' + iframe_id).parent().hide();
	        }
        };

		// ------- public methods

		this.onReceive = function(cryptoObject) {
			console.log("[w3c   ] received at communication component");

			Protocol.setBlankHeader(cryptoObject);

			makeIFrameRequest(cryptoObject);
		};


		// ------- C'tor

		if(!(this instanceof Communication)) {
			throw new Error("Communication called statically");
		}
		

		iframe_id = iframeid;

		initPostMessageListener();

	};

	Communication.prototype = Object.create(Component);


	// ------- export

	return Communication;

});