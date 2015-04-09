define(function(require) {


    // ------- imports  

    var SkyTrustElement = require('../w3ccrypto/element');
    var E = require('../common/error');
    var CryptoKey = require('../common/key');
    var Util = require('../common/util');
    var SkyTrustKeyStore = require('../w3ccrypto/key-store');

    // one object per window
    var skyTrustElement = null;


    // -------- static

    var CryptoProvider = function() {

        // ------- C'tor

        if(skyTrustElement === null) {
            skyTrustElement = new SkyTrustElement();
        }


        // ------- public

        this.subtle = {};
        this.extended = {};

        /**
         * The CryptoKey object stores references to keys on the SkyTrust server
         * it should only be accessed this way for instanceof checks
         */
        this.subtle.CryptoKey = CryptoKey;


        /**
         * The encrypt method returns a new Promise object that will 
         * encrypt data using the specified AlgorithmIdentifier with the supplied CryptoKey.
         * @method encrypt
         * @param {} algorithm      encryption algorithm, see SkyTrust
         * @param {} key            CryptoKey object
         * @param {} data           data to encrypt (ArrayBuffer/Typed Array)
         * @return {Promise|ciphertext} 
         * @throws InvalidAccessError if the usages internal slot of key does not contain an entry that is "encrypt", 
         * if an error occurred during normalization of algorithm
         * @throws DataError if 
         */
        this.subtle.encrypt = function(algorithm, key, data) {
            return skyTrustElement.operation.encrypt(algorithm, key, data);
        };

        /**
         * The decrypt method returns a new Promise object that will 
         * decrypt data using the specified AlgorithmIdentifier with the supplied CryptoKey.
         * @method decrypt
         * @param {} algorithm
         * @param {} key
         * @param {} data
         * @return {Promise|plaintext} 
         * @throws InvalidAccessError if the usages internal slot of key does not contain an entry that is "decrypt", 
         * if an error occurred during normalization of algorithm
         */
        this.subtle.decrypt = function(algorithm, key, data) {
            return skyTrustElement.operation.decrypt(algorithm, key, data);
        };

        /**
         * The sign method returns a new Promise object that will 
         * sign data using the specified AlgorithmIdentifier with the supplied CryptoKey.
         * @method sign
         * @param {} algorithm
         * @param {} key
         * @param {} data
         * @return {Promise|result} 
         * @throws InvalidAccessError if the usages internal slot of key does not contain an entry that is "sign", 
         * if an error occurred during normalization of algorithm
         */
        this.subtle.sign = function(algorithm, key, data) {
            return skyTrustElement.operation.sign(algorithm, key, data);
        };

        /**
         * Generates a wrapped key
         * @method generateKey
         * @param {} algorithm
         * @param {} extractable
         * @param {} keyUsages
         * @return {Promise|result} Let result be the result of executing the generate key operation specified by normalizedAlgorithm using algorithm, extractable and usages. Result can be either a CryptoKey or a CryptoKeyPair
         * @throws SyntaxError if result is a CryptoKey object and if the type internal slot of result is "secret" or "private" and usages is empty,
         * or if result is a CryptoKeyPair object and if the usages internal slot of the privateKey attribute of result is the empty sequence
         */
        this.subtle.generateKey = function(algorithm, extractable, keyUsages, encryptionKeys, signingKey, certificateSubject) {
            Util.warningIfNotNull({'extractable' : extractable, 'keyUsages' : keyUsages});

            return skyTrustElement.operation.generateWrappedKey(algorithm, encryptionKeys, signingKey, certificateSubject);
        };


        /**
         * Exports a key.
         * @method exportKey
         * @param {} format
         * @param {} key
         * @return {Promise|result} Let result be the result of performing the export key operation specified by the algorithm internal slot of key using key and format.
         * @throws InvalidAccessError if the extractable internal slot of key is false
         */
        this.subtle.exportKey = function(format, key) {
            return skyTrustElement.operation.exportKey(format, key);
        };


        this.subtle.importKey = function(format, keyData, algorithm, extractable, keyUsages) {
            Util.warningIfNotNull({'algorithm' : algorithm,'extractable' : extractable, 'keyUsages' : keyUsages});

            return skyTrustElement.operation.importKey(format, keyData);
        };

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.deriveKey = Util.throwNotSupportedError;

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.deriveBits = Util.throwNotSupportedError;
        
        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.verify = Util.throwNotSupportedError;

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.digest = Util.throwNotSupportedError;

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.wrapKey = Util.throwNotSupportedError;

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.unwrapKey = Util.throwNotSupportedError;


        //---------------------------------------------------------------------------------

        /*
            EXTENDED
        */
       
        /**
         * key store class (needs to be instanciated)
         */
        this.extended.KeyStore = SkyTrustKeyStore;

        /**
         * retrieves all SkyTrust keys on the server as CryptoKey objects
         * @return [] list of CryptoKeys
         */
        this.extended.listKeys = function() {
            return skyTrustElement.operation.discoverKeys();
        };

        /**
         * encrypts data using a CMS container
         * @param  {} algorithm
         * @param  {} array of CryptoKey objects
         * @param  {} array of ArrayBuffer objects
         * @return {Promise} containing a list of ArrayBuffers
         */
        this.extended.encryptCMS = function(algorithm, key, data){
            return skyTrustElement.operation.encryptCMS(algorithm, key, data);
        };

        /**
         * decrypts data using a CMS container
         * @param  {} algorithm
         * @param  {} CryptoKey object
         * @param  {} array of ArrayBuffer objects
         * @return {Promise} containing a list of ArrayBuffers
         */
        this.extended.decryptCMS = function(algorithm, key, data){
            return skyTrustElement.operation.decryptCMS(algorithm, key, data);
        };

    }


    return CryptoProvider;

});