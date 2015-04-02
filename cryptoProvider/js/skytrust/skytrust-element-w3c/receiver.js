define(function(require) {

    // ------- imports  
    
    var $ = require('jQuery');

    var Component = require('../skytrust-element-common/component');
    var CryptoObject = require('../skytrust-element-common/crypto-object');
    var Protocol = require('../skytrust-element-common/protocol');
    var Config = require('../config');
    var Util = require('../skytrust-element-common/util')
    var E = require('../error');
    var CryptoKey = require('../key');

    var Receiver = function() {

	   // ------- private members	

       var self = this;

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


        var operations =  {

            encrypt : {
                request : function(algorithm, key, data){
                    return createSimpleRequestPromise(
                        Protocol.setEncryptRequest, "encrypt",
                        algorithm, key, data);
                },
                response : function(object, payload) {
                    object.resolve( payload.encryptedData[0] );
                }
            },

            decrypt : {
                request : function(algorithm, key, data){
                    return createSimpleRequestPromise(
                        Protocol.setDecryptRequest, "encrypt",
                        algorithm, key, data);
                },
                response : function(object, payload) {
                    object.resolve( window.atob(payload.plainData[0]) );
                }
            },

            sign : {
                request : function(algorithm, key, data){
                    return createSimpleRequestPromise(
                        Protocol.setSignRequest, "sign",
                        algorithm, key, data);
                },
                response : function(object, payload) {
                    object.resolve( payload.signedHashes[0] );
                }
            },

            encryptCMS : {
                request : function(algorithm, key, data){
                    return createSimpleRequestPromise(
                        Protocol.setEncryptCMSRequest, "cms",
                        algorithm, key, data);
                },
                response : function(object, payload) {
                    object.resolve( payload.encryptedCMSData );
                }
            },

            decryptCMS : {
                request : function(algorithm, key, data){
                    return createSimpleRequestPromise(
                        Protocol.setDecryptCMSRequest, "cms",
                        algorithm, key, data);
                },
                response : function(object, payload) {
                    object.resolve( Util.atob(payload.plainData) );
                }
            },

            discoverKeys : {
                request : function(){
                    return new Promise(function(resolve, reject){
                        var object = new CryptoObject();
                        Protocol.setDiscoverKeysRequest(object);       
                        object.resolve = resolve;
                        object.reject = reject;

                        self.send('communication', object);
                    });
                },
                response : function(object, payload) {
                    var result = payload.key;

                    var keys = []; // for CryptoObjects
                    for(var i=0; i<result.length; i++) {
                        var keyData = { id : result[i].id, subId : result[i].subId };
                        keys.push(new CryptoKey.create(null, null, "handle", keyData));
                    }

                    object.resolve(keys);
                }
            },

            generateWrappedKey : {
                request : function(algorithm, extractable, keyUsages, encryptionKeys, signingKey, certificateSubject) {
                    return new Promise(function(resolve, reject) {
                        // normalize!
                        if(algorithm.name) {
                            algorithm = algorithm.name;
                        }

                        var object = new CryptoObject();
                        Protocol.setGenerateWrappedKeyRequest(object, algorithm,
                            encryptionKeys, signingKey, certificateSubject);

                        object.resolve = resolve;
                        object.reject = reject;

                        self.send('communication', object);
                    });
                },
                response : function(object, payload) {
                    var key = new CryptoKey.create("?", "?", "wrappedKey", payload);
                    object.resolve( key );
                }
            },

            exportKey : function(format, key) {
                return new Promise(function(resolve, reject) {
                    if(key.extractable !== true) {
                        reject(new E.InvalidAccessError());
                    }

                    if(format == "x509") {
                        resolve({
                            key : key.encodedWrappedKey,
                            certificate : key.encodedX509Certificate
                        });
                    }
                    else {
                        reject(new Error("export format has to be x509"));
                    }
                });
            },

            importKey : function(format, keyData, algorithm, extractable, keyUsages) {
                return new Promise(function(resolve, reject) {
                    if(format == "x509") {
                        
                    }
                    else if(format == "id") {

                    }
                });
            }

        };


        // public methods

    	this.onReceive = function(object) {
    		console.log('[w3c] received at receiver component');
    		console.log(object.json());

            var error = Protocol.getError(object);
            if(error !== false) {
                object.reject(new Error("SkyTrust error code " + error));
            }
            else {
                var payload = object.getPayload();
                var responseType = payload.type;

                var responseFunctions = {
                    "decryptResponse" : operations.decrypt.response,
                    "encryptResponse" : operations.encrypt.response,
                    "signResponse" : operations.sign.response,
                    "encryptCMSResponse" : operations.encryptCMS.response,
                    "decryptCMSResponse" : operations.decryptCMS.response,
                    "discoverKeysResponse" : operations.discoverKeys.response,
                    "generateWrappedKeyResponse" : operations.generateWrappedKey.response
                };

                try { 
                    responseFunctions[responseType](object, payload);
                }
                catch(e) {
                    object.reject(e);
                }

            }
    	};

    	this.operation = {
            encrypt : operations.encrypt.request,
            decrypt : operations.decrypt.request,
            sign : operations.sign.request,
            encryptCMS : operations.encryptCMS.request,
            decryptCMS : operations.decryptCMS.request,
            discoverKeys : operations.discoverKeys.request,
            generateWrappedKey : operations.generateWrappedKey.request,
            exportKey : operations.exportKey,
            importKey : operations.importKey,
        };


        console.log("C'tor!")

    };

    Receiver.prototype = Object.create(Component);


    // ------- export

    return Receiver;


});