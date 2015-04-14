define(function(require) {

    // ------- imports  
    
    var Util = require('../common/util');
    var $ = require('jQuery');


    // ------- private members      

    var Protocol = {};


    // ------- private methods      

    var getKey = function(cryptoObject, key) {
        var parts = key.split(".");
        var val = cryptoObject;

        try {
            for(var i=0; i<parts.length; i++) {
                if(!val.hasOwnProperty(key[i])) {
                    throw new Error(); // jump to catch
                }
                val = val[key[i]];
            }
        } catch(e) {
            throw new SkyError(0, "key '"+key+"' does not exist");
        }

        return val;
    };


    var cryptoKeysToSkyTrustKeys = function(cryptoObjects) {

        if( Object.prototype.toString.call( cryptoObjects ) !== '[object Array]' ) {
            return cryptoKeyToSkyTrustKey(cryptoObjects);
        }
        else {
            var keys = [];
            for(var i=0; i<cryptoObjects.length; i++) {
                keys.push(cryptoKeyToSkyTrustKey(cryptoObjects[i]));
            }
            return keys;
        }
    };

    var cryptoKeyToSkyTrustKey = function(key) {
        if(key == null || !key.keyType) {
            return null;
        }

        var skyTrustKey = { type : key.keyType };

        if(key.keyType === "handle" || key.keyType === "internalCertificate") {
            skyTrustKey.id = key.id;
            skyTrustKey.subId = key.subId;
        }
        if(key.keyType === "internalCertificate") {
            skyTrustKey.encodedCertificate = key.encodedCertificate;
        }
        if(key.keyType === "wrappedKey") {
            skyTrustKey.encodedWrappedKey = key.encodedWrappedKey;
        }
        if(key.keyType === "externalCertificate") {
            skyTrustKey.encodedCertificate = key.encodedCertificate;
        }

        return skyTrustKey;
    };


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

    Protocol.setBlankHeader = function(cryptoObject) {
        cryptoObject.setHeader(Protocol.getBlankHeader());
    };

    Protocol.setDiscoverKeysRequest = function(cryptoObject, fetchCertificates) {
        var payload = {
            "type" : "discoverKeysRequest",
            "representation" : ((fetchCertificates === true) ? "certificate" : "handle")
        };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setSessionId = function(cryptoObject, id) {
        if(cryptoObject.getHeader) {
            var header = cryptoObject.getHeader();
            header.sessionId = id;
            cryptoObject.setHeader(header);
        }
        // only header was passed as object
        else {
            cryptoObject.sessionId = id;
        }
    };

    Protocol.getSessionId = function(cryptoObject) {
        if(cryptoObject.getHeader) { // whole cryptoObject
            return getKey(cryptoObject.getHeader(), "sessionId");
        }
    };

    Protocol.setUserPasswortAuth = function(cryptoObject, username, password) {
        var payload = {
            "type": "authChallengeResponse",
            "authInfo": {
                "type": "UserNamePasswordAuthInfo",
                "userName": username,
                "passWord": password } };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setEncryptRequest = function(cryptoObject, algorithm, key, data) {
        var b64Data = Util.arrayBufferToBase64(data); // Base64 conversion

        var payload = {
            "type" : "encryptRequest",
            "encryptionKeys" : [ cryptoKeyToSkyTrustKey(key) ],
            "algorithm" : algorithm,
            "plainData" : [ b64Data ]
        };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setDecryptRequest = function(cryptoObject, algorithm, key, data) {
        var b64Data = Util.arrayBufferToBase64(data);

        var payload =  {
            "type" : "decryptRequest",
            "decryptionKey" : cryptoKeyToSkyTrustKey(key),
            "algorithm" : algorithm,
            "encryptedData" : [ b64Data ]
        };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setEncryptCMSRequest = function(cryptoObject, algorithm, keyArray, dataArray) {
        var b64Data = Util.arrayBufferToBase64_array(dataArray);
        var keys = [];
        $.each(keyArray, function(k, v) {
            keys.push(cryptoKeyToSkyTrustKey(v));
        });

        var payload = {
            "type" : "encryptCMSRequest",
            "encryptionKeys" : keys,
            "algorithm" : algorithm,
            "plainData" : b64Data // array
        };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setDecryptCMSRequest = function(cryptoObject, algorithm, key, dataArray) {
        var b64Data = Util.arrayBufferToBase64_array(dataArray);

        var payload =  {
            "type" : "decryptCMSRequest",
            "decryptionKey" : cryptoKeyToSkyTrustKey(key),
            "encryptedCMSData" : b64Data // array
        };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setSignRequest = function(cryptoObject, algorithm, key, data) {
        var b64Data = Util.arrayBufferToBase64(data);

        var payload =  {
                "type" : "signRequest",
                "signatureKey" : cryptoKeyToSkyTrustKey(key),
                "algorithm" : algorithm,
                "hashesToBeSigned" : [ b64Data ]
            };

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.setGenerateWrappedKeyRequest = 
        function(cryptoObject, algorithm, encryptionKeys, signingKey, certificateSubject) {

        var skyTrustSigningKey = cryptoKeyToSkyTrustKey(signingKey);

        var payload = {
            "type" : "generateWrappedKeyRequest",
            "encryptionKeys" : cryptoKeysToSkyTrustKeys(encryptionKeys), // array
            "keyType" : algorithm,
            "certificateSubject" : certificateSubject
        };

        if(skyTrustSigningKey != null) {
            payload.signingKey = skyTrustSigningKey;
        }

        if(cryptoObject.setPayload) {
            cryptoObject.setPayload(payload);
        }
    };

    Protocol.isAuthRequired = function(cryptoObject) {
        var payload = cryptoObject.getPayload();

        if(payload && payload.type === "authChallengeRequest") {
            return true;
        }

        return false;
    };

    Protocol.getAuthTypes = function(cryptoObject) {
        var types = cryptoObject.getPayload().authTypes;
        var typesArray = [];

        for(var i=0; types && i<types.length; i++) {
            typesArray.push(types[i]['type']);
        }

        return typesArray;
    };

    Protocol.getError = function(cryptoObject) {
        var payload = cryptoObject.getPayload();

        if(payload && payload.type === "status") {
            return payload.code;
        }

        return false;
    };

    Protocol.getCommandId = function(cryptoObject) {
        if(!cryptoObject.getHeader) {
            return cryptoObject.commandId;
        }

        return cryptoObject.getHeader().commandId;
    };

    Protocol.setCommandId = function(cryptoObject, commandId) {
        if(!cryptoObject.getHeader) {
            cryptoObject.commandId = commandId;
        }

        cryptoObject.getHeader().commandId = commandId;
    };


    Protocol.supportedAlgorithms = {
            // encrypt+decrypt
            "encrypt":    [  "RSA-OAEP", "RSAES-PKCS1-v1_5", "RSAES-RAW"  ],
            "sign":       [  "RSASSA-PKCS1-v1_5-SHA-1", "RSASSA-PKCS1-v1_5-SHA-224", 
                             "RSASSA-PKCS1-v1_5-SHA-256", "RSASSA-PKCS1-v1_5-SHA-512"  ],
            // encrypt+decrypt CMS
            "cms":        [  "CMS-AES-128-CBC", "CMS-AES-192-CBC", "CMS-AES-256-CBC", 
                             "CMS-AES-128-GCM", "CMS-AES-192-GCM", "CMS-AES-256-GCM", 
                             "CMS-AES-128-CCM", "CMS-AES-192-CCM", "CMS-AES-256-CCM"  ],
            "wrapped":    [  "RSA-2048", "RSA-4096" ]
    };

    // ------- export
    
    return Protocol;   
    


});    