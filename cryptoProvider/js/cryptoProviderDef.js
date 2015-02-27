/**
 * Returns a cryptographic provider.
 * @method getCryptoProviderByName
 * @param provider String identifying the desired crypto provider, currently supported: "w3c", "cordova-iaik" and "crysil"
 * @return provider
 * @throws NoSuchProviderError if provider does not exist
 */
window.getCryptoProviderByName = function(provider){
    switch (provider){
    case "w3c":
        return window.crypto || window.msCrypto;
    // case "cordova-iaik":
    //     return new CordovaCryptoProvider();
   case "crysil": 
       return new CrySILCryptoProvider();    
    default:
        throw new NoSuchProviderError();
    }
};

