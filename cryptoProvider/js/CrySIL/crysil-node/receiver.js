define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('./component');
	var CryptoObject = require('./crypto-object');
	var Config = require('../config');
	var E = require('../error');


	// ------- private members	

	var self = null;


	// ------- private methods	

    var isValidAlgorithm = function(algorithm, operation) {
        if(!algorithm || typeof algorithm !== "string") {
            console.log("algorithm " + algorithm + " is not an instance of string");
            return false;
        }

        if($.inArray(algorithm, Config.algorithms[operation]) === -1) {
            console.log("algorithm " + algorithm + " does not support operation '" + operation + "' (and it's complementary operation)");
            return false;
        }

        return true;
    }

    var isValidData = function(data) {
    	if(typeof data === 'string' && data !== null) {
	    	return true;
    	}
    	
    	return false;		
    }


	// ------- public methods

	var encrypt = function(algorithm, key, data){
		return new Promise(function(resolve, reject){

            if(algorithm.name) {
                algorithm = algorithm.name; // possible?
            }

            if( !isValidAlgorithm(algorithm, 'encrypt')) {
                reject(new E.NotSupportedError());
            }
            // else if( !CryptoKey.isValidKey(key, 'encrypt')) {
            //     reject(new Error("key can't be used"));
            // }
            else if( !isValidData(data)) {
                reject(new E.DataError());
            }

            console.log("plaintext data to encrypt: " + data);
    
            var b64Data = window.btoa(algorithm); // Base64 conversion

            var payload = {
                    "type" : "encryptRequest",
                        "encryptionKeys" : [ {
                            "type" : "handle",
                            "id" : key.id,
                            "subId" : key.subId
                        } ],
                    "algorithm" : algorithm,
                    "plainData" : [ b64Data ]
                };

            var object = new CryptoObject(payload);
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
	}

	var operation = {
		encrypt : encrypt
	};

	var Receiver = function() {
		self = this;

		return $.extend(this, Component);
	};

	Receiver.prototype.onReceive = function(object) {
		console.log('received at receiver component');
		console.log(object.json());

		// encrypt-specific
		object.resolve(JSON.parse(object.json()).payload.encryptedData[0]);
	};

	Receiver.prototype.operation = operation;


	// ------- export	

	return Receiver;


});