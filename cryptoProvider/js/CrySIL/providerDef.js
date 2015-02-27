define(function(require) {

    var P = require("./provider");

    /**
     * Returns a cryptographic provider.
     * @method getCryptoProviderByName
     * @param provider String identifying the desired crypto provider, currently supported: "w3c", "cordova-iaik" and "CrySIL"
     * @return provider
     * @throws NoSuchProviderError if provider does not exist
     */
    var getCryptoProviderByName = function(cryptoProvider){

        switch (cryptoProvider){
            case "w3c":
                return window.crypto || window.msCrypto;
            case "CrySIL": 
               return new P.provider();    
            default:
                throw new NoSuchProviderError();
        }
    };

    return {
        "getCryptoProviderByName": getCryptoProviderByName
    }

});