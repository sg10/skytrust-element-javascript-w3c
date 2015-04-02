define(function(require) {

	var $ = require('jQuery');


    var CryptoKey = function(algo, usages, keyType, keyData) {

    	// SkyTrust specific
        Object.defineProperty(this, "keyType", {value: keyType});

        if(keyType == "handle" || keyType == "internalCertificate") {
            Object.defineProperty(this, "id", {value: keyData.id});
            Object.defineProperty(this, "subId", {value: keyData.subId});

            if(keyType == "internalCertificate") {
                Object.defineProperty(this, "encodedCertificate", {value: keyData.encodedCertificate});
            }

            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: false});
        }
        else if(keyType == "wrappedKey") {
            Object.defineProperty(this, "encodedWrappedKey", {value: keyData.encodedWrappedKey});
            Object.defineProperty(this, "encodedX509Certificate", {value: keyData.encodedX509Certificate});

            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: true});
        }
        else if(keyType == "externalCertificate") {
            Object.defineProperty(this, "encodedCertificate", {value: keyData.encodedCertificate});
            
            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: true});
        }

        // according to W3C specification
        Object.defineProperty(this, "type", {value: "secret"}); // unused
        Object.defineProperty(this, "algorithm", {value: algo}); // unused
        Object.defineProperty(this, "usages", {value: usages}); // unused
    };

    CryptoKey.prototype.toString = function() {
        var str = "";

        if(this.keyType == "handle" || this.keyType == "encodedCertificate") {
            str = str + "id=" + this.id + ", subId=" + this.subId;

            if(this.keyType == "internalCertificate") {
                str = str + " certificate=" + this.encodedCertificate.substr(0,8) + "...";
            }
        }
        else if(this.keyType == "wrappedKey") {
            str = str + "wrappedKey=" + this.encodedWrappedKey.substr(0,8) + "...";
        }
        else if(this.keyType == "externalCertificate") {
            str = str + "certificate=" + this.encodedCertificate.substr(0,8) + "...";
        }

        return str;
    }

    /**
     * [isValidCryptoKey description]
     * @param  {[type]}  key       [description]
     * @param  {[type]}  operation [description]
     * @return {Boolean}           [description]
     */
    var isValidCryptoKey = function(key, operation) {
        if( !( key instanceof CryptoKey ) ) {
            console.log("[w3c] cryptoKey passed is not a valid SkyTrust CryptoKey object");
            return false;
        }

        if( $.inArray(operation, key.usages) === -1 ) {
            console.log("[w3c] cryptoKey passed cannot be used for this operation");
            return false;
        }

        console.log("[w3c] CryptoKey passed is valid");

        return true;
    }

    return {
    	create: CryptoKey,
		isValidKey : isValidCryptoKey
    }

});