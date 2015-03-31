define(function(require) {

    // ------- imports  
    
    var $ = require('jQuery');
    var Util = require('../skytrust-element-common/util');


    // ------- private members      

    var Protocol = {};


    // ------- private methods      

    var getKey = function(object, key) {
        var parts = key.split(".");
        var val = object;

        try {
            for(var i=0; i<parts.length; i++) {
                if(!val.hasOwnProperty(key[i])) {
                    throw new Error();
                }
                val = val[key[i]];
            }
        } catch(e) {
            throw new Error("key '"+key+"' does not exist");
        }

        return val;
    }


    var cryptoKeysToSkyTrustKeys = function(objects) {
        if( Object.prototype.toString.call( plainTextData ) !== '[object Array]' ) {
            return cryptoKeyToSkyTrustKey(object);
        }
        else {
            var keys = [];
            for(var i=0; i<objects.length; i++) {
                keys.push(cryptoKeyToSkyTrustKey(objects[i]));
            }
            return keys;
        }
    }

    var cryptoKeyToSkyTrustKey = function(key) {
        var skyTrustKey = { type : key.keyType };

        if(key.keyType == "handle" || key.keyType == "internalCertificate") {
            skyTrustKey.id = key.id,
            skyTrustKey.subId = key.subId
        }
        if(key.keyType == "internalCertificate") {
            skyTrustKey.encodedCertificate = key.encodedCertificate;
        }
        if(key.keyType == "wrappedKey") {
            skyTrustKey.encodedWrappedKey = key.encodedWrappedKey;
        }
        if(key.keyType == "externalCertificate") {
            skyTrustKey.encodedCertificate = key.encodedCertificate;
        }

        return skyTrustKey
    }



    // ------- public methods   
    
    Protocol.getBlankHeader = function() {
        var header = {
            "type" : "standardSkyTrustHeader",
            "commandId" : "",
            "sessionId" : "",
            "path" : [ "java-api-instance" ],
            "protocolVersion" : "2.0" };

        return header;
    };

    Protocol.setBlankHeader = function(object) {
        object.setHeader(Protocol.getBlankHeader());
    }

    Protocol.setDiscoverKeysRequest = function(object) {
        var payload = {
            "type" : "discoverKeysRequest",
            "representation" : "handle"
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    };

    Protocol.setSessionId = function(object, id) {
        if(object.getHeader) {
            var header = object.getHeader();
            header.sessionId = id;
            object.setHeader(header);
        }
        // only header was passed as object
        else {
            object.sessionId = id;
        }
    };

    Protocol.getSessionId = function(object) {
        if(object.getHeader) { // whole object
            return getKey(object.getHeader(), "sessionId");
        }
    };

    Protocol.setUserPasswortAuth = function(object, username, password) {
        var payload = {
            "type": "authChallengeResponse",
            "authInfo": {
                "type": "UserNamePasswordAuthInfo",
                "userName": username,
                "passWord": password } };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setEncryptRequest = function(object, algorithm, key, data) {
        var b64Data = window.btoa(data); // Base64 conversion

        var payload = {
            "type" : "encryptRequest",
                "encryptionKeys" : [ cryptoKeyToSkyTrustKey(key) ],
            "algorithm" : algorithm,
            "plainData" : [ b64Data ]
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setDecryptRequest = function(object, algorithm, key, data) {
        var payload =  {
            "type" : "decryptRequest",
            "decryptionKey" : cryptoKeyToSkyTrustKey(key),
            "algorithm" : algorithm,
            "encryptedData" : [ data ]
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setEncryptCMSRequest = function(object, algorithm, key, data) {
        var b64Data = Util.btoa(data); // Base64 conversion

        var payload = {
            "type" : "encryptCMSRequest",
            "encryptionKeys" : [ cryptoKeyToSkyTrustKey(key) ],
            "algorithm" : algorithm,
            "plainData" : (b64Data[0] ? b64Data : [ b64Data ])
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setDecryptCMSRequest = function(object, algorithm, key, data) {
        var payload =  {
            "type" : "decryptCMSRequest",
            "decryptionKey" : cryptoKeyToSkyTrustKey(key),
            "encryptedCMSData" : (data[0] ? data : [ data ])
            }

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setSignRequest = function(object, algorithm, key, data) {
        var b64Data = Util.btoa(data);

        var payload =  {
                "type" : "signRequest",
                "signatureKey" : cryptoKeyToSkyTrustKey(key),
                "algorithm" : algorithm,
                "hashesToBeSigned" : [ b64Data ]
            };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setGenerateWrappedKeyRequest = 
        function(object, algorithm, encryptionKeys, signingKey, certificateSubject) {

        var payload = {
            "type" : "generateWrappedKeyRequest",
            "keyType" : algorithm,
            "encryptionKeys" : cryptoKeysToSkyTrustKeys(encryptionKeys), // array
            "signingKey" : cryptoKeyToSkyTrustKey(signingKey),
            "certificateSubject" : certificateSubject
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }       
    }

    Protocol.isAuthRequired = function(object) {
        var payload = object.getPayload();

        if(payload && payload.type == "authChallengeRequest") {
            return true;
        }

        return false;
    }

    Protocol.getAuthTypes = function(object) {
        var types = object.getPayload().authTypes;
        var typesArray = [];

        for(var i=0; types && i<types.length; i++) {
            typesArray.push(types[i]['type']);
        }

        return typesArray;
    }

    Protocol.getError = function(object) {
        var payload = object.getPayload();

        if(payload && payload.type == "status") {
            return payload.code;
        }

        return false;
    }

    Protocol.getCommandId = function(object) {
        if(!object.getHeader) {
            return object.commandId;
        }

        return object.getHeader().commandId;
    }

    Protocol.setCommandId = function(object, commandId) {
        if(!object.getHeader) {
            object.commandId = commandId;
        }

        object.getHeader().commandId = commandId;
    }


    // ------- export
    
    return Protocol;   
    


});    