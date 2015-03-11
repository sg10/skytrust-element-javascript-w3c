define(function(require) {

	var $ = require('jQuery');
	var p = require('jQuery');


	/**
	 * [CryptoKey description]
	 * @param {[type]} id     [description]
	 * @param {[type]} subId  [description]
	 * @param {[type]} algo   [description]
	 * @param {[type]} usages [description]
	 */
    var CryptoKey = function(id, subId, algo, usages) {

    	// SkyTrust specific
        Object.defineProperty(this, "id", {value: id});
        Object.defineProperty(this, "subId", {value: subId});

        // according to W3C specification
        Object.defineProperty(this, "type", {value: "secret"});
        Object.defineProperty(this, "extractable", {value: false});
        Object.defineProperty(this, "algorithm", {value: algo});
        Object.defineProperty(this, "usages", {value: usages});
    };

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