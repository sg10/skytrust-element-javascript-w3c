define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component');
	var CryptoObject = require('../skytrust-element-common/crypto-object');
    var Config = require('../config');
    var Protocol = require('../skytrust-element-common/protocol');


	// ------- private members	

	var self = null;
	var sessionId = "";


	// ------- private methods	

	var makeServerRequest = function(requestObject) {
		var jsonRequest = requestObject.json();

        // AJAX REQUEST
        $.ajax({
            url: Config.server,
            method: 'post',
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            data: jsonRequest })
                .done(function(dataReceived) {
                    handleServerResponse(dataReceived, requestObject, jsonRequest)
                })
                .fail(function(jqXHR) {
                    console.log("[iframe] request error")
                    self.send('receiver', requestObject);
                });
	};

    var handleServerResponse = function(dataReceived, requestObject, jsonRequest) {
        console.log("[iframe] ajax response received")

        var responseObject = requestObject;
        responseObject.setHeader(dataReceived.header);

        // set session ID for this SkyTrust element if it has changed
        var responseSessionId = responseObject.getHeader().sessionId;
        if(sessionId !== responseSessionId) {
            console.log("[iframe] setting session ID: " + sessionId);
            sessionId = responseSessionId;
        }

        // Authentication: enter username/password
        if(Protocol.isAuthRequired(responseObject)) {
            var authTypes = Protocol.getAuthTypes(responseObject);

            // username password authentication
            if($.inArray("authChallengeRequest", authTypes)) {
                self.send('authentication', responseObject);
            }
            else {
                // TODO: error handling other auth methods
            }
        }
        // Authentication: sent credentials were incorrect
        else if(Protocol.getError(responseObject) == "609") {
            console.log("[iframe] wrong username/password");
            // keep command id!
            var commandId = Protocol.getCommandId(JSON.parse(jsonRequest).header);
            console.log("header command id: " + commandId);
            Protocol.setCommandId(responseObject, commandId);
            self.send('authentication', responseObject);
        }
        // correct result
        else {
            requestObject.setPayload(dataReceived.payload);
            requestObject.setHeader(dataReceived.header);

            self.send('receiver', requestObject);
        }
    }


	// ------- public methods

	var onReceive = function(object) {
		console.log("[iframe] received at communication component");

		if(object.getHeader() === null) {
			var header = Protocol.getBlankHeader();
			console.log("[iframe] header was blank, setting new header");
			object.setHeader(header);
		}

		Protocol.setSessionId(object, sessionId);

		makeServerRequest(object);
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