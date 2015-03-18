define(function(require) {

    // ------- imports  
    
    var $ = require('jQuery');


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


    // ------- public methods   
    
    Protocol.getBlankHeader = function() {
        return {
            "type" : "standardSkyTrustHeader",
            "commandId" : "",
            "sessionId" : "",
            "path" : [ "java-api-instance" ],
            "protocolVersion" : "2.0" };
    };

    Protocol.setBlankHeader = function(object) {
        object.header = Protocol.getBlankHeader();
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

    Protocol.setEncryptRequest = function(object, algorithm, id, subId, data) {
        var b64Data = window.btoa(data); // Base64 conversion

        var payload = {
            "type" : "encryptRequest",
                "encryptionKeys" : [ {
                    "type" : "handle",
                    "id" : id,
                    "subId" : subId
                } ],
            "algorithm" : algorithm,
            "plainData" : [ b64Data ]
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setDecryptRequest = function(object, algorithm, id, subId, data) {
        var payload =  {
            "type" : "decryptRequest",
            "decryptionKey" : {
                "type" : "handle",
                "id" : id,
                "subId" : subId
            },
            "algorithm" : algorithm,
            "encryptedData" : [ data ]
        };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setEncryptCMSRequest = function(object, algorithm, id, subId, data) {
        var b64Data = window.btoa(data); // Base64 conversion

        var payload = {
            "type" : "encryptCMSRequest",
            "encryptionKeys" : [ {
                "type" : "handle",
                "id" : id,
                "subId" : subId
                } ],
            "algorithm" : algorithm,
            "plainData" : [ b64Data ]
            };

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setDecryptCMSRequest = function(object, algorithm, id, subId, data) {
        var payload =  {
            "type" : "decryptCMSRequest",
            "decryptionKey" : {
                "type" : "handle",
                "id" : id,
                "subId" : subId
            },
            "encryptedCMSData" : [ data ]
            }

        if(object.setPayload) {
            object.setPayload(payload);
        }
    }

    Protocol.setSignRequest = function(object, algorithm, id, subId, data) {
        var b64Data = window.btoa(data);

        var payload =  {
                "type" : "signRequest",
                "signatureKey" : {
                    "type" : "handle",
                    "id" : id,
                    "subId" : subId
                },
                "algorithm" : algorithm,
                "hashesToBeSigned" : [ b64Data ]
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