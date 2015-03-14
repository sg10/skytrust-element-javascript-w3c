define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-node-common/component');
	var CryptoObject = require('../skytrust-node-common/crypto-object');
    var Protocol = require('../skytrust-node-common/protocol');
	var Config = require('../config');
	var E = require('../error');


	// ------- private members	

	var self = null;


	// ------- private methods	

    var isValidAlgorithm = function(algorithm, operation) {
        if(!algorithm || typeof algorithm !== "string") {
            console.log("[w3c] algorithm " + algorithm + " is not an instance of string");
            return false;
        }

        if($.inArray(algorithm, Config.algorithms[operation]) === -1) {
            console.log("[w3c] algorithm " + algorithm + " does not support operation '" + operation + "' (and it's complementary operation)");
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

            // normalize!
            if(algorithm.name) {
                algorithm = algorithm.name;
            }

            if( !isValidAlgorithm(algorithm, 'encrypt')) {
                reject(new E.NotSupportedError());
            }
            else if( !isValidData(data)) {
                reject(new E.DataError());
            }

            console.log("[w3c] plaintext data to encrypt: " + data);
    
            var object = new CryptoObject();
            var payload = Protocol.setEncryptRequest(object, algorithm, key.id, key.subId, data);       
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
	}

    var decrypt = function(algorithm, key, data){
        return new Promise(function(resolve, reject){

            // normalize!
            if(algorithm.name) {
                algorithm = algorithm.name;
            }

            if( !isValidAlgorithm(algorithm, 'encrypt')) { // encrypt same as decrypt
                reject(new E.NotSupportedError());
            }
            else if( !isValidData(data)) {
                reject(new E.DataError());
            }

            console.log("[w3c] data to decrypt: " + data);
    
            var object = new CryptoObject();
            var payload = Protocol.setDecryptRequest(object, algorithm, key.id, key.subId, data);       
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
    }

    // TODO: handle only currently
    var discoverKeys = function(){
        return new Promise(function(resolve, reject){

            console.log("[w3c] discover keys");
    
            var object = new CryptoObject();
            var payload = Protocol.setDiscoverKeysRequest(object);       
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
    }


	var operation = {
		encrypt : encrypt,
        decrypt : decrypt,
        discoverKeys : discoverKeys
	};

	var Receiver = function() {
		self = this;

		return $.extend(this, Component);
	};

	Receiver.prototype.onReceive = function(object) {
		console.log('[w3c] received at receiver component');
		console.log(object.json());

        var error = Protocol.getError(object);
        if(error !== false) {
            object.reject(new Error("SkyTrust error code " + error));
        }
        else {
            var payload = object.getPayload();
            var responseType = payload.type;

            // TODO: change to object literal with function pointer

            try { // catch invalid response format
                if("decryptResponse" == responseType) {
                    object.resolve( window.atob(payload.plainData[0]) );
                } 
                else if("encryptResponse" == responseType) {
                    object.resolve( payload.encryptedData[0] );
                }
                else if("discoverKeysResponse" == responseType) {
                    object.resolve( payload.key );
                }
                else {
                    object.reject(new Error("SkyTrust request failed - unknown response type?"));
                }


/*      "encryptCMSResponse" ,
        "exportWrappedKeyResponse" ,
        "generateWrappedKeyResponse" ,
        "getKeyResponse" ,
        "signResponse" , */

            }
            catch(e) {
                object.reject(new Error("invalid response format"));
            }

        }
	};

	Receiver.prototype.operation = operation;


	// ------- export	

	return Receiver;


});