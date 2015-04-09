console.log("loading onCryptoProviderLoad() for adding onLoad callbacks");
window.onCryptoProviderLoad = function(f) {
    if(!window._cryptoProviderListenerFunctions) {
        window._cryptoProviderListenerFunctions = [];
    }
    window._cryptoProviderListenerFunctions.push(f);
}