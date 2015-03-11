define(function(require) {


    // -------------  load modules  -------------------

    var $ = require('jQuery');

    var CrySILNode = require('./crysil-node-w3c/node');

    var E = require('./error');
    var Config = require('./config');
    var CryptoKey = require('./key');
    

    // -------------  private  ------------------------

    var CrySILCryptoSubtle = function (){};

    var crySILNode = new CrySILNode();

    // -------------  public  -------------------------

    var CryptoProvider = function() {
        this.subtle = new CrySILCryptoSubtle();
    }

    CrySILCryptoSubtle.prototype.CryptoKey = CryptoKey.create;


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
    CrySILCryptoSubtle.prototype.encrypt = function(algorithm, key, data){
        console.log("[w3c] -> CrySILCryptoSubtle.prototype.encrypt()")
        
        return crySILNode.operation.encrypt(algorithm, key, data);
    }


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
    CrySILCryptoSubtle.prototype.decrypt = function(algorithm, key, data){
        throw new E.NotYetImplementedException();
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
    CrySILCryptoSubtle.prototype.sign = function(algorithm, key, data){
        throw new E.NotYetImplementedException();
    };

    /**
     * The verify method returns a new Promise object that will 
     * verify data using the specified AlgorithmIdentifier with the supplied CryptoKey.
     * @method verify
     * @param {} algorithm
     * @param {} key
     * @param {} signature
     * @param {} data
     * @return {Promise|result} 
     * @throws InvalidAccessError if the usages internal slot of key does not contain an entry that is "verify", 
     * if an error occurred during normalization of algorithm 
     */
    CrySILCryptoSubtle.prototype.verify = function(algorithm, key, signature, data){
        throw new E.NotYetImplementedException();
    };

    /**
     * The digest method returns a new Promise object that will 
     * digest data using the specified AlgorithmIdentifier.
     * @method digest
     * @param {} algorithm
     * @param {} data
     * @return {Promise|result} 
     */
    CrySILCryptoSubtle.prototype.digest = function(algorithm, data){
        throw new E.NotYetImplementedException();
    };

    /**
     * Generates a new CryptoKey or CryptoKeyPair object.
     * @method generateKey
     * @param {} algorithm
     * @param {} extractable
     * @param {} keyUsages
     * @return {Promise|result} Let result be the result of executing the generate key operation specified by normalizedAlgorithm using algorithm, extractable and usages. Result can be either a CryptoKey or a CryptoKeyPair
     * @throws SyntaxError if result is a CryptoKey object and if the type internal slot of result is "secret" or "private" and usages is empty,
     * or if result is a CryptoKeyPair object and if the usages internal slot of the privateKey attribute of result is the empty sequence
     */
    CrySILCryptoSubtle.prototype.generateKey = function(algorithm, extractable, keyUsages){
        throw new E.NotYetImplementedException();
    };

    /**
     * Description
     * @method deriveKey
     * @param {} algorithm
     * @param {} baseKey
     * @param {} derivedKeyType
     * @param {} extractable
     * @param {} keyUsages
     * @return {Promise|result} Let result be the result of executing the import key operation specified by normalizedDerivedKeyAlgorithm using "raw" as format, secret as keyData, derivedKeyType as algorithm and using extractable and usages.
     * @throws NotSupportedError if the name member of normalizedAlgorithm does not identify a registered algorithm that supports the derive bits operation,
     * or if the name member of normalizedDerivedKeyAlgorithm does not identify a registered algorithm that supports the get key length operation
     * @throws InvalidAccessError if the name member of the normalized algorithm is not equal to the name attribute of the algorithm internal slot of baseKey,
     * or if the usages internal slot of baseKey does not contain an entry that is "deriveKey"
     * @throws SyntaxError if the type internal slot of result is "secret" or "private" and usages is empty
     */
    CrySILCryptoSubtle.prototype.deriveKey = function(algorithm, baseKey, derivedKeyType, extractable, keyUsages){
        throw new E.NotYetImplementedException();
    };

    /**
     * Derives bits from a given baseKey.
     * @method deriveBits
     * @param {} algorithm
     * @param {} baseKey
     * @param {} length
     * @return {Promise|result} Let result be a new ArrayBuffer containing the result of executing the derive bits operation specified by normalizedAlgorithm using baseKey, algorithm and length.
     * @throws InvalidAccessError if the name member of the normalized algorithm is not equal to the name attribute of the algorithm internal slot of baseKey,
     * or if the usages internal slot of baseKey does not contain an entry that is "deriveBits"
     */
    CrySILCryptoSubtle.prototype.deriveBits = function(algorithm, baseKey, length){
        throw new E.NotYetImplementedException();
    };


    /**
     * Exports a key.
     * @method exportKey
     * @param {} format
     * @param {} key
     * @return {Promise|result} Let result be the result of performing the export key operation specified by the algorithm internal slot of key using key and format.
     * @throws InvalidAccessError if the extractable internal slot of key is false
     */
    CrySILCryptoSubtle.prototype.exportKey = function(format, key){
        throw new E.NotYetImplementedException();
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
    CrySILCryptoSubtle.prototype.wrapKey = function(format, key, wrappingKey, wrapAlgorithm){
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
    CrySILCryptoSubtle.prototype.unwrapKey = function(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages){
        throw new E.NotYetImplementedException();
    };



    return CryptoProvider;

});