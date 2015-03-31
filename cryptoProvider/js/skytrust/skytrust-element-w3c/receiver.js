define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component');
	var CryptoObject = require('../skytrust-element-common/crypto-object');
    var Protocol = require('../skytrust-element-common/protocol');
	var Config = require('../config');
    var Util = require('../skytrust-element-common/util')
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

    // for all requests that have "algorithm, key, data" as input
    var createSimpleRequestPromise = function(protocolFunction, algorithmType, 
        algorithm, key, data) {

        return new Promise(function(resolve, reject){

            // normalize!
            if(algorithm.name) {
                algorithm = algorithm.name;
            }

            if( !isValidAlgorithm(algorithm, algorithmType)) {
                reject(new E.NotSupportedError());
            }

            var object = new CryptoObject();
            var payload = protocolFunction(object, algorithm, key, data);       
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
    }

	// ------- public methods

	var encrypt = function(algorithm, key, data){
        console.log("[w3c] plaintext data to encrypt: " + data);

        return createSimpleRequestPromise(
            Protocol.setEncryptRequest, 
            "encrypt",
            algorithm, key, data);
	}

    var decrypt = function(algorithm, key, data){
        console.log("[w3c] data to decrypt: " + data);

        return createSimpleRequestPromise(
            Protocol.setDecryptRequest, 
            "encrypt",
            algorithm, key, data);
    }

    var sign = function(algorithm, key, data){
        console.log("[w3c] data to sign: " + data);

        return createSimpleRequestPromise(
            Protocol.setSignRequest, 
            "sign",
            algorithm, key, data);
    }

    var encryptCMS = function(algorithm, key, data){
        console.log("[w3c] plaintext data to encrypt (CMS): " + data);

        return createSimpleRequestPromise(
            Protocol.setEncryptCMSRequest, 
            "cms",
            algorithm, key, data);
    }

    var decryptCMS = function(algorithm, key, data){
        console.log("[w3c] data to decrypt (CMS): " + data);

        return createSimpleRequestPromise(
            Protocol.setDecryptCMSRequest, 
            "cms",
            algorithm, key, data);
    }

    // TODO?: only "handle" currently
    var discoverKeys = function(){
        return new Promise(function(resolve, reject){
            console.log("[w3c] discover keys");
    
            var object = new CryptoObject();
            Protocol.setDiscoverKeysRequest(object);       
            object.resolve = resolve;
            object.reject = reject;

            self.send('communication', object);
        });
    }

    var generateWrappedKey = function(algorithm, encryptionKeys, signingKey, certificateSubject) {
        return new Promise(function(resolve, reject) {
            console.log("[w3c] wrapped key request");

            var object = new CryptoObject();
            Protocol.setGenerateWrappedKeyRequest(object, 
                algorithm.name, encryptionKeys, signingKey, certificateSubject);
        });
    }


	var operation = {
		encrypt : encrypt,
        decrypt : decrypt,
        sign : sign,
        encryptCMS : encryptCMS,
        decryptCMS : decryptCMS,
        discoverKeys : discoverKeys,
        generateWrappedKey : generateWrappedKey
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
                else if("signResponse" == responseType) {
                    object.resolve( payload.signedHashes[0] );
                }
                else if("encryptCMSResponse" == responseType) {
                    object.resolve( payload.encryptedCMSData );
                }
                else if("decryptCMSResponse" == responseType) {
                    object.resolve( Util.atob(payload.plainData) );
                }
                else if("discoverKeysResponse" == responseType) {
                    object.resolve( payload.key );
                }
                else {
                    object.reject(new Error("SkyTrust request failed - unknown response type? No data?"));
                }


/*      "exportWrappedKeyResponse" ,
        "generateWrappedKeyResponse" ,
        "getKeyResponse" */

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