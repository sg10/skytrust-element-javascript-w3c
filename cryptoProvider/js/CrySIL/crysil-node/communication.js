define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('./component');
	var CryptoObject = require('./crypto-object');
    var Config = require('../config');


	// ------- private members	

	var self = null;


	// ------- private methods	

	var makeRequest = function(object) {
		var encryptRequest = object.json();

        $.ajax({
            url: Config.server,
            method: 'post',
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            data: encryptRequest })
                .done(function(result) {
                    // validate result structure
                    
                    console.log("--- AJAX RESPONSE ---")
                    console.log(result);

                    // check if successful request or error
                    // (-> authentication or receiver)

                    object.setPayload(result.payload);
                    object.setHeader(result.header);

                    self.send('receiver', object);
                });
	};


	// ------- public methods

	var onReceive = function(object) {
		console.log("received at communication component");

		object.setHeader({
            "type" : "standardSkyTrustHeader",
            "commandId" : "",
            "sessionId" : "",
            "path" : [ "java-api-instance" ],
            "protocolVersion" : "2.0" });

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