define(function(require) {

	var Cert = require("../w3ccrypto/cert");
	var Config = require('../skytrust-config');

	var KeyStore = function() {
		if(!(this instanceof KeyStore)) {
			throw new Error("KeyStore called statically");
		}

		var self = this;
		
		var db = null;

		var provider = null;

		console.log(Cert.getCertificateData("MIIDITCCAoqgAwIBAgIQT52W2WawmStUwpV8tBV9TTANBgkqhkiG9w0BAQUFADBMMQswCQYDVQQGEwJaQTElMCMGA1UEChMcVGhhd3RlIENvbnN1bHRpbmcgKFB0eSkgTHRkLjEWMBQGA1UEAxMNVGhhd3RlIFNHQyBDQTAeFw0xMTEwMjYwMDAwMDBaFw0xMzA5MzAyMzU5NTlaMGgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHFA1Nb3VudGFpbiBWaWV3MRMwEQYDVQQKFApHb29nbGUgSW5jMRcwFQYDVQQDFA53d3cuZ29vZ2xlLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA3rcmQ6aZhc04pxUJuc8PycNVjIjujI0oJyRLKl6g2Bb6YRhLz21ggNM1QDJywI8S2OVOj7my9tkVXlqGMaO6hqpryNlxjMzNJxMenUJdOPanrO/6YvMYgdQkRn8Bd3zGKokUmbuYOR2oGfs5AER9G5RqeC1prcB6LPrQ2iASmNMCAwEAAaOB5zCB5DAMBgNVHRMBAf8EAjAAMDYGA1UdHwQvMC0wK6ApoCeGJWh0dHA6Ly9jcmwudGhhd3RlLmNvbS9UaGF3dGVTR0NDQS5jcmwwKAYDVR0lBCEwHwYIKwYBBQUHAwEGCCsGAQUFBwMCBglghkgBhvhCBAEwcgYIKwYBBQUHAQEEZjBkMCIGCCsGAQUFBzABhhZodHRwOi8vb2NzcC50aGF3dGUuY29tMD4GCCsGAQUFBzAChjJodHRwOi8vd3d3LnRoYXd0ZS5jb20vcmVwb3NpdG9yeS9UaGF3dGVfU0dDX0NBLmNydDANBgkqhkiG9w0BAQUFAAOBgQAhrNWuyjSJWsKrUtKyNGadeqvu5nzVfsJcKLt0AMkQH0IT/GmKHiSgAgDpulvKGQSy068Bsn5fFNum21K5mvMSf3yinDtvmX3qUA12IxL/92ZzKbeVCq3Yi7LeIOkKcGQRCMha8X2e7GmlpdWC1ycenlbN0nbVeSv3JUMcafC4+Q=="));
		
		// expiration window.setTimeout for cached keys 
		var cachingTime = Config.keyStore.cachingTime;
		var cacheTimeout = null; 
		var cacheReload = true;

		var loadKeys = function() {
			return new Promise(function(resolve, reject) {
				if(cacheReload === true) {
					// get keys from server
					provider.extended.listKeys().then(function(keys) {
						db = {};
						$.each(keys, function(idx, cryptoKey) {
							db[cryptoKey.id+"-"+cryptoKey.subId] = cryptoKey;
						});

						// cache
						cacheReload = false;
						window.clearTimeout(cacheTimeout);
						cacheTimeout = window.setTimeout(function() {
							console.log("KeyStore cache timeout");
							cacheReload = true; 
						}, cachingTime);

						resolve();
					}).
					catch(reject);
				}
				else {
					resolve();
				}
			});
		};


		self.open = function() {
			return new Promise(function(resolve, reject) {
				var Provider = require("./provider");
				provider = new Provider();
				if(!provider) reject(new Error("No SkyTrust Crypto provider"));
				
				loadKeys().then(function(){resolve(self)}).catch(reject);
			});
		};

		// saveKey method
		//
		// Takes the public and private keys, and an arbitrary name
		// for the saved key. The private key can be passed as null if unavailable.
		//
		// Returns a Promise. If a key can be saved, the
		// Promise is resolveed with a copy of the object
		// that was saved. Otherwise, it is rejected with an Error.
		//
		self.saveKey = function(publicKey, privateKey, name) {
			return new Promise(function(resolve, reject) {
				reject(new Error("SkyTrust key store does not support saving keys"));
			});
		};

		// getKey method
		//
		// Takes the name of a property (one of id, name, or spki), and
		// the value of that property to search for.
		//
		// Returns a Promise. If a key with the given propertyValue of
		// the specified propertyName exists in the database, the Promise
		// is resolveed with the saved object, otherwise it is rejected
		// with an Error.
		//
		// If there are multiple objects with the requested propertyValue,
		// only one of them is passed to the resolve function.
		//
		self.getKey = function(propertyName, propertyValue) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error("KeyStore is not open."));
				}

				loadKeys().then(function() {

					if(propertyName === "handle") { //id
						if(db.hasOwnKey(propertyName)) {
							resolve(db[propertyName]);
						}
						else {
							reject(new Error("no key with handle"));
						}
					}
					else if(propertyName === "co") {
						reject(new Error("not yet implemented"));
					}
					else {
						reject(new Error("propertyName '"+propertyName+"' not supported"));
					}
				}).
				catch(reject);

			});
		};

		// listKeys method
		//
		// Takes no parameters.
		//
		// Returns a Promise. Unless there is an error, resolves the
		// Promise with an array of all objects
		// Otherwise it rejects it with an Error.
		//
		self.listKeys = function() {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error("KeyStore is not open."));
				}
				
				loadKeys().then(function() {
					// create array
					var list = [];
					$.each(db, function(k, v) {
						list.push(v);
					});
					resolve(list);
				}).
				catch(reject);
			});
		};


		// close method
		//
		// Takes no parameters.
		//
		// Simply closes the database and returns immediately. Note that
		// the IndexedDB system actually closes the database in a separate
		// thread, and there is no way to know when that process is complete.
		//
		self.close = function() {
			return new Promise(function(resolve, reject) {
				db = {};
				resolve();
			});
		};
	}

	return KeyStore;


});