define(function(require) {


    // ------- imports  

    var SkyTrustElement = require('../w3ccrypto/element');
    var E = require('../common/error');
    var CryptoKey = require('../common/key');


    // -------- static

    var CryptoProvider = function() {

        // ------- private


        var skyTrustElement = new SkyTrustElement();


        // ------- public

        this.subtle = {};
        this.extended = {};

        this.subtle.CryptoKey = CryptoKey;


        /**
         * The encrypt method returns a new Promise object that will 
         * encrypt data using the specified AlgorithmIdentifier with the supplied CryptoKey.
         * @method encrypt
         * @param {} algorithm
         * @param {} key
         * @param {} data
         * @return {Promise|ciphertext} 
         * @throws InvalidAccessError if the usages internal slot of key does not contain an entry that is "encrypt", 
         * if an error occurred during normalization of algorithm
         */
        this.subtle.encrypt = skyTrustElement.operation.encrypt;


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
        this.subtle.decrypt = skyTrustElement.operation.decrypt;


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
        this.subtle.sign = skyTrustElement.operation.sign;


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
        this.subtle.generateKey = skyTrustElement.operation.generateWrappedKey;


        /**
         * Exports a key.
         * @method exportKey
         * @param {} format
         * @param {} key
         * @return {Promise|result} Let result be the result of performing the export key operation specified by the algorithm internal slot of key using key and format.
         * @throws InvalidAccessError if the extractable internal slot of key is false
         */
        this.subtle.exportKey = skyTrustElement.operation.exportKey;


    //---------------------------------------------------------------------------------

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.deriveKey = function(algorithm, baseKey, derivedKeyType, extractable, keyUsages){
            throw new E.OperationNotSupportedError();
        };

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.deriveBits = function(algorithm, baseKey, length){
            throw new E.OperationNotSupportedError();
        };

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.verify = function(algorithm, key, signature, data){
            throw new E.OperationNotSupportedError();
        };

        /**
         * @throws OperationNotSupportedError because this isn't supported by SkyTrust
         */
        this.subtle.digest = function(algorithm, data){
            throw new E.OperationNotSupportedError();
        };

        /**
         * Wrap key method.
         * @method wrapKey
         * @param {} format
         * @param {} key
         * @param {} wrappingKey
         * @param {} wrapAlgorithm
         * @return {Promise|result} 
         * @throws InvalidAccessError if the usages internal slot of wrappingKey does not contain an entry that is "wrapKey"
         * @throws NotSupportedError If the name member of normalized algorithm does not identify a registered algorithm that supports the encrypt or wrap key operation,
         * or if the name member of normalized algorithm is not equal to the name attribute of the algorithm internal slot of wrappingKey,
         * or if the algorithm identified by the algorithm internal slot of key does not support the export key operation,
         * or if the extractable internal slot of key is false
         */
        this.subtle.wrapKey = function(format, key, wrappingKey, wrapAlgorithm){
            throw new E.NotYetImplementedException();
        };

        /**
         * Unwrap key method.
         * @method unwrapKey
         * @param {} format
         * @param {} wrappedKey
         * @param {} unwrappingKey
         * @param {} unwrapAlgorithm
         * @param {} unwrappedKeyAlgorithm
         * @param {} extractable
         * @param {} keyUsages
         * @return {Promise|result} 
         * @throws InvalidAccessError
         * @throws NotSupportedError
         * @throws Syntax Error if the type internal slot of result is "secret" or "private" and usages is empty
         */
        this.subtle.unwrapKey = function(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages){
            throw new E.NotYetImplementedException();
        };


        /*
            EXTENDED
        */

        this.extended.listKeys = skyTrustElement.operation.discoverKeys;

        this.extended.encryptCMS = skyTrustElement.operation.encryptCMS;

        this.extended.decryptCMS = skyTrustElement.operation.decryptCMS;

    }


    return CryptoProvider;

});