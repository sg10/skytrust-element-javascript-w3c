/**
 * Provider for native cryptographic methods provided as Cordova plugin. 
 * @class CordovaCryptoProvider
 * @return 
 */
function CordovaCryptoProvider(){
    this.subtle = new CordovaCryptoSubtle();
};

/**
 * Generates cryptographically random values.
 * @method getRandomValues
 * @param {} array
 * @return {Promise|array} 
 * @throws TypeMismatchError if array is not of an integer type 
 * (i.e., Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, or Uint32Array)
 * @throws QuotaExceededError if the byteLength of array is greater than 65536
 */
CordovaCryptoProvider.prototype.getRandomValues = function(array){
    return new Promise(function(resolve, reject){
        
        if(!(array instanceof Int8Array 
                || array instanceof Uint8Array 
                || array instanceof Int16Array 
                || array instanceof Uint16Array
                || array instanceof Int32Array
                || array instanceof Uint32Array)){
            reject(new TypeMismatchError("Parameter array must be a Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array or Uint32Array."));
        }
        if(array.byteLength > 65536){
            reject(new QuotaExceededError("Array Length is greater than 65536!"));
        }
      
        function convertResult(base64){
            var bytes = base64ToArrayBuffer(base64);
            
            if(array instanceof Int8Array){
                array = new Int8Array(bytes.buffer);
                bytes = new Int8Array(bytes.buffer);
            }else if(array instanceof Uint8Array){
                array = new Uint8Array(bytes.buffer);
                bytes = new Uint8Array(bytes.buffer);
            }else if(array instanceof Int16Array){
                array = new Int16Array(bytes.buffer);
                bytes = new Int16Array(bytes.buffer);
            }else if(array instanceof Uint16Array){
                array = new Uint16Array(bytes.buffer);
                bytes = new Uint16Array(bytes.buffer);
            }else if(array instanceof Int32Array){
                array = new Int32Array(bytes.buffer);
                bytes = new Int32Array(bytes.buffer);
            }else if(array instanceof Uint32Array){
                array = new Uint32Array(bytes.buffer);
                bytes = new Uint32Array(bytes.buffer);
            }else{
                throw new OperationError();
            }
            
            resolve(bytes);
        }
        
        function errorCallback(err){
            reject(Error(err));
        }

        cordova.exec(convertResult, errorCallback, "CryptoPlugin", "getRandomValues", [array.byteLength]);
    });  
};  

/**
 * Description
 * @class CordovaCryptoSubtle
 * @return 
 */
function CordovaCryptoSubtle(){};

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
CordovaCryptoSubtle.prototype.encrypt = function(algorithm, key, data){
    throw new NotYetImplementedError();
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
CordovaCryptoSubtle.prototype.decrypt = function(algorithm, key, data){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.sign = function(algorithm, key, data){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.verify = function(algorithm, key, signature, data){
    throw new NotYetImplementedException();
};

/**
 * The digest method returns a new Promise object that will 
 * digest data using the specified AlgorithmIdentifier.
 * @method digest
 * @param {} algorithm
 * @param {} data
 * @return {Promise|result} 
 */
CordovaCryptoSubtle.prototype.digest = function(algorithm, data){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.generateKey = function(algorithm, extractable, keyUsages){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.deriveKey = function(algorithm, baseKey, derivedKeyType, extractable, keyUsages){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.deriveBits = function(algorithm, baseKey, length){
    throw new NotYetImplementedException();
};

/**
 * Imports a key specified by the given parameters.
 * @method importKey
 * @param {} format
 * @param {} keyData
 * @param {} algorithm
 * @param {} extractable
 * @param {} keyUsages
 * @return {Promise|result} Let result be the CryptoKey object that results from performing the import key operation specified by normalizedAlgorithm using keyData, algorithm, format, extractable and usages.
 * @throws TypeError
 * If format is equal to the string "raw", "pkcs8", or "spki":
 *     If the keyData parameter passed to the importKey method is a JsonWebKey dictionary, throw a TypeError.
 * If format is equal to the string "jwk":
 *     If the keyData parameter passed to the importKey method is not a JsonWebKey dictionary, throw a TypeError.
 * @throws SyntaxError if the type internal slot of result is "secret" or "private" and usages is empty
 */
CordovaCryptoSubtle.prototype.importKey = function(format, keyData, algorithm, extractable, keyUsages){
    throw new NotYetImplementedException();
};

/**
 * Exports a key.
 * @method exportKey
 * @param {} format
 * @param {} key
 * @return {Promise|result} Let result be the result of performing the export key operation specified by the algorithm internal slot of key using key and format.
 * @throws InvalidAccessError if the extractable internal slot of key is false
 */
CordovaCryptoSubtle.prototype.exportKey = function(format, key){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.wrapKey = function(format, key, wrappingKey, wrapAlgorithm){
    throw new NotYetImplementedException();
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
CordovaCryptoSubtle.prototype.unwrapKey = function(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages){
    throw new NotYetImplementedException();
};