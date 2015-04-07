define(function(require) {

    var Util = require("./util");

    var CryptoKey = function(algo, usages, keyType, keyData) {
        if(!(this instanceof CryptoKey)) {
            throw new Error("CryptoKey called statically");
        }

        Util.warningIfNotNull({'algo' : algo, 'usages' : usages});

        // SkyTrust specific
        Object.defineProperty(this, "keyType", {value: keyType});

        if(keyType === "handle" || keyType === "internalCertificate") {
            Object.defineProperty(this, "id", {value: keyData.id});
            Object.defineProperty(this, "subId", {value: keyData.subId});

            if(keyType === "internalCertificate") {
                Object.defineProperty(this, "encodedCertificate", {value: keyData.encodedCertificate});
            }

            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: false});
        }
        else if(keyType === "wrappedKey") {
            Object.defineProperty(this, "encodedWrappedKey", {value: keyData.encodedWrappedKey});
            Object.defineProperty(this, "encodedX509Certificate", {value: keyData.encodedX509Certificate});

            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: true});
        }
        else if(keyType === "externalCertificate") {
            Object.defineProperty(this, "encodedCertificate", {value: keyData.encodedCertificate});
            
            // according to W3C specification
            Object.defineProperty(this, "extractable", {value: true});
        }
        else {
            throw new Error("Invalid keyType specified");
        }

        // according to W3C specification
        Object.defineProperty(this, "type", {value: "secret"}); // unused
        Object.defineProperty(this, "algorithm", {value: algo}); // unused
        Object.defineProperty(this, "usages", {value: usages}); // unused
    };


    CryptoKey.prototype.toString = function() {
        var str = "[CryptoKey] ";

        if(this.keyType === "handle" || this.keyType === "encodedCertificate") {
            str = str + "id=" + this.id + ", subId=" + this.subId;

            if(this.keyType === "internalCertificate") {
                str = str + " certificate=" + this.encodedCertificate.substr(0,8) + "...";
            }
        }
        else if(this.keyType === "wrappedKey") {
            str = str + "wrappedKey=" + this.encodedWrappedKey.substr(0,3) + "..." + this.encodedWrappedKey.substr(550, 7) + "...";
        }
        else if(this.keyType === "externalCertificate") {
            str = str + "certificate=" + this.encodedCertificate.substr(0,3) + "..." + this.encodedCertificate.substr(550, 7) + "...";
        }

        return str;
    };

    return CryptoKey;

});