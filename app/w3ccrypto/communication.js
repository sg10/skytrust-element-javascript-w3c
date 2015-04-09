define(function(require) {

	// ------- imports	
	
	var Component = require('../common/component');
	var Protocol = require('../common/protocol');


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

		var addPendingRequest = function(requestObject) {
			var iframe = document.getElementById(iframe_id);

			console.log("[w3c   ] data to send: ");
			console.log(requestObject.jsonInternal().substr(0,1000));

			var id = "";
			do {
				id = Math.round(Math.random()*10E5);
			}while(pendingRequests.hasOwnProperty(id));

			requestObject.setRequestID(id);
			pendingRequests[id] = requestObject;

			var jsonData = requestObject.jsonInternal();
			
			// IFrame not yet loaded --> wait
			if(iFrameLoaded === false) {
				var interval = window.setInterval(function() {
					if(iFrameLoaded === true) {
						window.clearInterval(interval);
						iframe.contentWindow.postMessage(jsonData, "*");
					}
					console.log("[w3c   ] request " + id + ", waiting for IFrame to be loaded");
				}, 500);
			}
			else {
				iframe.contentWindow.postMessage(jsonData, "*");
			}

			console.log("[w3c   ] pending requests: " + Object.keys(pendingRequests).length);
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

			addPendingRequest(requestObject);
		};

		var onPostMessageReceive = function(event) {
	        console.log("[w3c   ] received post message ...");
        	console.log("[w3c   ] postMessage origin: " + event.origin);
        	console.log("[w3c   ] postMessage data:");
        	console.log((event.data + "").substr(0,1000));

        	// "hello" request? (on init)
        	if(event.data === "hello-skytrust") {
				console.log("[w3c   ] recevied 'alive-message': SkyTrust IFrame element loaded");
		 		iFrameLoaded = true;
		 		return;
        	}

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
			console.log("[w3c   ] received at communication component");

			Protocol.setBlankHeader(object);

			makeIFrameRequest(object);
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