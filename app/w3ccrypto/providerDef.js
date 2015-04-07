define(function(require) {

    var SkyTrustCryptoProvider = require('../w3ccrypto/provider');
    var E = require('../common/error');

    /**
     * Returns a cryptographic provider.
     * @method getCryptoProviderByName
     * @param provider String identifying the desired crypto provider, currently supported: "w3c", "cordova-iaik" and "SkyTrust"
     * @return provider
     * @throws NoSuchProviderError if provider does not exist
     */
    var getByName = function(cryptoProvider){

        switch (cryptoProvider){
            case "w3c":
                return window.crypto || window.msCrypto;
            case "SkyTrust": 
               return new SkyTrustCryptoProvider();    
            default:
                throw new E.NoSuchProviderError(); // TODO: check
        }
    };

    return {
        "getCryptoProviderByName": getByName
    };

});