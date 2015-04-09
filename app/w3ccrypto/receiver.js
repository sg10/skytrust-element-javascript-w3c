define(function(require) {

    // ------- imports  
    
    var Component = require('../common/component');
    var CryptoObject = require('../common/crypto-object');
    var Protocol = require('../common/protocol');
    var Config = require('../skytrust-config');
    var Util = require('../common/util');
    var E = require('../common/error');
    var CryptoKey = require('../common/key');


    var Receiver = function() {

	    // ------- private members	

        var self = this;


	    // ------- private methods	

        var normalizeAlgorithm = function(algorithm, operation) {
            var algo = algorithm.name ? algorithm.name : algorithm;
            algo = ("" + algo).toLowerCase();

            var op = ("" + operation).toLowerCase();

            // for decrypt are the same operations available
            var opConfig = (op === "decrypt") ? "encrypt" : op;

            var algorithmsForOperation = Protocol.supportedAlgorithms[opConfig];

            var algoConfig = Util.inArray(algo, algorithmsForOperation);

            if(!algorithmsForOperation || !algoConfig) {
                throw new E.NotSupportedError(algo);
            }

            return algoConfig;
        };


        // for all requests that have "algorithm, key, data" as input
        var createSimpleRequestPromise = function(protocolFunction, algorithmType, 
            algorithm, cryptoKey, data) {

            if($.isArray(cryptoKey)) {
                $.each(cryptoKey, function(k, value) {
                    if(!(value instanceof CryptoKey)) {
                        return Util.rejectedPromise(new E.KeyError("not an array"));
                    }
                });
            }
            else if(!(cryptoKey instanceof CryptoKey)) {
                return Util.rejectedPromise(new E.KeyError());
            }

            if($.isArray(data)) {
                $.each(data, function(k, value) {
                    if(!(value instanceof ArrayBuffer) && !Util.isArrayBufferView(value)) {
                        return Util.rejectedPromise(new E.DataError("Data is not a valid ArrayBuffer/ArrayBufferView array"));
                    }
                });
            }
            else if(!(data instanceof ArrayBuffer) && !Util.isArrayBufferView(data)) {
                return Util.rejectedPromise(new E.DataError("Data is not a valid ArrayBuffer/ArrayBufferView"));
            }


            try {
                algorithm = normalizeAlgorithm(algorithm, algorithmType);
            } catch(e) {
                return Util.rejectedPromise(e);
            }

            return new Promise(function(resolve, reject){
                var object = new CryptoObject();
                protocolFunction(object, algorithm, cryptoKey, data);       
                object.resolve = resolve;
                object.reject = reject;

                self.send('communication', object);
            });
        };


        var operations =  {

            encrypt : {
                request : function(algorithm, key, data){
                    if(!$.isArray(key)) return Util.rejectedPromise(new E.KeyError("Key can't be an array"));
                    if(!$.isArray(data)) return Util.rejectedPromise(new E.DataError("Data can't to be an array"));

                    return createSimpleRequestPromise(
                        Protocol.setEncryptRequest, "encrypt",
                        algorithm, key, Util.copyOf(data));
                },
                response : function(object, payload) {
                    if( payload.encryptedData[0] && payload.encryptedData[0][0] ) {
                        object.resolve( Util.base64ToArrayBuffer(payload.encryptedData[0][0]) );
                    }
                    else {
                        object.rejected( new E.SkyTrustError(object.getErrorCode()) );
                    }
                }
            },

            decrypt : {
                request : function(algorithm, key, data){
                    if(!$.isArray(key)) return Util.rejectedPromise(new E.KeyError("Key can't be an array"));
                    if(!$.isArray(data)) return Util.rejectedPromise(new E.DataError("Data can't to be an array"));

                    return createSimpleRequestPromise(
                        Protocol.setDecryptRequest, "decrypt",
                        algorithm, key, Util.copyOf(data));
                },
                response : function(object, payload) {
                    object.resolve( Util.base64ToArrayBuffer(payload.plainData[0]) );
                }
            },

            sign : {
                request : function(algorithm, key, data){
                    if(!$.isArray(key)) return Util.rejectedPromise(new E.KeyError("Key can't be an array"));
                    if(!$.isArray(data)) return Util.rejectedPromise(new E.DataError("Data can't to be an array"));

                    return createSimpleRequestPromise(
                        Protocol.setSignRequest, "sign",
                        algorithm, key, Util.copyOf(data));
                },
                response : function(object, payload) {
                    object.resolve( Util.base64ToArrayBuffer(payload.signedHashes[0]) );
                }
            },

            encryptCMS : {
                request : function(algorithm, key, data){
                    if(!$.isArray(key)) return Util.rejectedPromise(new E.KeyError("Key has to be an array"));
                    if(!$.isArray(data)) return Util.rejectedPromise(new E.DataError("Data has to be an array"));

                    return createSimpleRequestPromise(
                        Protocol.setEncryptCMSRequest, "cms",
                        algorithm, key, Util.copyOf(data));
                },
                response : function(object, payload) {
                    object.resolve( Util.base64ToArrayBuffer_array(payload.encryptedCMSData) ); // ARRAY
                }
            },

            decryptCMS : {
                request : function(algorithm, key, data){
                    if($.isArray(key)) return Util.rejectedPromise(new E.KeyError("Key can't be an array"));
                    if(!$.isArray(data)) return Util.rejectedPromise(new E.DataError("Data has to be an array"));

                    return createSimpleRequestPromise(
                        Protocol.setDecryptCMSRequest, "cms",
                        algorithm, key, Util.copyOf(data));
                },
                response : function(object, payload) {
                    object.resolve( Util.base64ToArrayBuffer_array(payload.plainData) ); // ARRAY
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
                        keys.push(new CryptoKey("handle", keyData));
                    }

                    object.resolve(keys);
                }
            },

            generateWrappedKey : {
                request : function(algorithm, encryptionKeys, signingKey, certificateSubject) {
                    var certificateSubject2 = Util.copyOf(certificateSubject);

                    try {
                        algorithm = normalizeAlgorithm(algorithm, "wrapped");
                    } catch(e) {
                        return rejectedPromise(e);
                    }

                    return new Promise(function(resolve, reject) {
                        var object = new CryptoObject();
                        Protocol.setGenerateWrappedKeyRequest(object, algorithm,
                            encryptionKeys, signingKey, certificateSubject2);

                        object.resolve = resolve;
                        object.reject = reject;

                        self.send('communication', object);
                    });
                },
                response : function(object, payload) {
                    // payload object's keys matches the ones CryptoKey needs
                    var key = new CryptoKey("wrappedKey", payload);
                    object.resolve( key );
                }
            },

            exportKey : function(format, key) {
                return new Promise(function(resolve, reject) {
                    if(!(key instanceof CryptoKey)) {
                        reject(new E.KeyError(key));
                    }

                    if(key.extractable !== true) {
                        reject(new E.InvalidAccessError());
                    }

                    if(format === "wrapped") {
                        resolve({
                            encodedWrappedKey : key.encodedWrappedKey,
                            encodedX509Certificate : key.encodedX509Certificate
                        });
                    }
                    else if(format === "x509") {
                        resolve({
                            encodedCertificate : key.encodedCertificate
                        });
                    }
                    else {
                        reject(new Error("invalid export format"));
                    }
                });
            },

            importKey : function(format, keyData) {
                var keyData2 = Util.copyOf(keyData);

                return new Promise(function(resolve, reject) {
                    var keyTypes = { // mapping format --> keyType
                        "x509" : "externalCertificate",
                        "id" : "handle",
                        "wrapped" : "wrappedKey"
                    };

                    if(keyTypes.hasOwnProperty(format)) {
                        var cryptoKey = new CryptoKey(keyTypes[format], keyData);
                        resolve(cryptoKey);
                    }
                    else {
                        reject(new E.NotSupportedError(format));
                    }
                });
            }

        };


        // ------- public methods

    	this.onReceive = function(object) {
    		console.log('[w3c   ] received at receiver component');
    		console.log(object.jsonInternal().substr(0,1000));

            var error = Protocol.getError(object);
            if(error !== false) {
                object.reject(new Error("SkyTrust/HTTP error code " + error));
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


    };

    Receiver.prototype = Object.create(Component);


    // ------- export

    return Receiver;


});