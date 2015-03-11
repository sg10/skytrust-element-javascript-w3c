define(function(require) {

    // ------- imports  
    
    var $ = require('jQuery');


    // ------- private members      


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
    
    var getBlankHeader = function() {
        return {
            "type" : "standardSkyTrustHeader",
            "commandId" : "",
            "sessionId" : "",
            "path" : [ "java-api-instance" ],
            "protocolVersion" : "2.0" };
    };

    var setBlankHeader = function(object) {
        object.header = getBlankHeader();
    }

    var setSessionId = function(object, id) {
        if(object.getHeader) { // whole object
            var header = object.getHeader();
            header.sessionId = id;
            object.setHeader(header);
        }
        else {
            object.sessionId = id;
        }
    };

    var getSessionId = function(object) {
        if(object.getHeader) { // whole object
            return getKey(object.getHeader(), "sessionId");
        }
        else {
            return getKey(object, "sessionId");
        }
    };

    var setUserPasswortAuth = function(object, username, password) {
        var payload = {
            "type": "authChallengeResponse",
            "authInfo": {
                "type": "UserNamePasswordAuthInfo",
                "userName": username,
                "passWord": password } };

        if(object.setPayload) {
            object.setPayload(payload);
        }
        else {
            throw Error("not supported yet"); // not a whole object, payload only
        }
    }

    var setEncryptRequest = function(object, algorithm, id, subId, data) {
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
        else {
            throw Error("not supported yet"); // not a whole object, payload only
        }
    }

    var setDecryptRequest = function(object, algorithm, id, subId, data) {
        var payload =  {
            "type" : "decryptRequest",
            "decryptionKey" : {
                "type" : "handle",
                "id" : "leaf",
                "subId" : "122"
            },
            "algorithm" : algorithm,
            "encryptedData" : [ data ]
  }

        if(object.setPayload) {
            object.setPayload(payload);
        }
        else {
            throw Error("not supported yet"); // not a whole object, payload only
        }
    }


    var isAuthRequired = function(object) {
        var payload = object.getPayload();

        if(payload && payload.type == "authChallengeRequest") {
            return true;
        }

        return false;
    }

    var getAuthTypes = function(object) {
        var types = object.getPayload().authTypes;
        var typesArray = [];

        for(var i=0; types && i<types.length; i++) {
            typesArray.push(types[i]['type']);
        }

        return typesArray;
    }

    var getError = function(object) {
        var payload = object.getPayload();

        if(payload && payload.type == "status") {
            return payload.code;
        }

        return false;
    }

    // ------- export
    
    return {
        getBlankHeader : getBlankHeader,
        setBlankHeader : setBlankHeader,

        setUserPasswortAuth : setUserPasswortAuth,

        setSessionId : setSessionId,
        getSessionId : getSessionId,

        setEncryptRequest : setEncryptRequest,
        setDecryptRequest : setDecryptRequest,

        isAuthRequired : isAuthRequired,
        getAuthTypes : getAuthTypes,

        getError : getError,
    };   
    


});    