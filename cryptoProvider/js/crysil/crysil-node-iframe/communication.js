define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../crysil-node-common/component');
	var CryptoObject = require('../crysil-node-common/crypto-object');
    var Config = require('../config');
    var Protocol = require('../crysil-node-common/protocol');


	// ------- private members	

	var self = null;
	var sessionId = "";


	// ------- private methods	

	var makeRequest = function(requestObject) {
		var encryptRequest = requestObject.json();

        $.ajax({
            url: Config.server,
            method: 'post',
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            data: encryptRequest })
                .done(function(dataReceived) {

                    // TODO: validate result structure
                    
                    console.log("[iframe] ajax response received")

                    // use new?!
			        var responseObject = new CryptoObject(dataReceived.payload);
			        responseObject.setHeader(dataReceived.header);
			        responseObject.resolve = requestObject.resolve;
			        responseObject.reject = requestObject.reject;

			        // set session ID for this node if it has changed
			        var responseSessionId = responseObject.getHeader().sessionId;
			        if(sessionId !== responseSessionId) {
	                    console.log("[iframe] setting session ID: " + sessionId);
	                    sessionId = responseSessionId;
			        }

			        if(Protocol.isAuthRequired(responseObject)) {
			        	var authTypes = Protocol.getAuthTypes(responseObject);

				        // username password authentication
			        	if($.inArray("authChallengeRequest", authTypes)) {
			        		self.send('authentication', responseObject);
			        	}
			        }
			        else {
				        requestObject.setPayload(dataReceived.payload);
				        requestObject.setHeader(dataReceived.header);

			        	self.send('receiver', requestObject);
			        }
                });
	};


	// ------- public methods

	var onReceive = function(object) {
		console.log("[iframe] received at communication component");

		if(object.getHeader() === null) {
			var header = Protocol.getBlankHeader();
			console.log("[iframe] header was blank, setting new header");
			object.setHeader(header);
		}

		Protocol.setSessionId(object, sessionId);

		makeRequest(object);
	};


	var Communication = function() {
		self = this;

		return $.extend(this, Component, {
			onReceive: onReceive
		});
	};


	// ------- export	

	return Communication;


});