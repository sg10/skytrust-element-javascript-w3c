define(function(require) {

	function decodeAndParseCertificate(base64String) {
		var decoded = window.atob(base64String);
		var der = new Uint8Array(decoded.length);
		for (var i=0; i<decoded.length; i++) {
		    der[i] = decoded.charCodeAt(i);
		}
		return parseCertificate(der);
	}

	function parseCertificate(byteArray) {
	    var asn1 = berToJavaScript(byteArray);
	    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
	        throw new Error("This can't be an X.509 certificate. Wrong data type.");
	    }

	    var cert = {asn1: asn1};  // Include the raw parser result for debugging
	    var pieces = berListToJavaScript(asn1.contents);
	    if (pieces.length !== 3) {
	        throw new Error("Certificate contains more than the three specified children.");
	    }

	    cert.tbsCertificate     = parseTBSCertificate(pieces[0]);
	    cert.signatureAlgorithm = parseSignatureAlgorithm(pieces[1]);
	    cert.signatureValue     = parseSignatureValue(pieces[2]);

	    return cert;
	}

	function berListToJavaScript(byteArray) {
	    var result = new Array();
	    var nextPosition = 0;
	    while (nextPosition < byteArray.length) {
	        var nextPiece = berToJavaScript(byteArray.subarray(nextPosition));
	        result.push(nextPiece);
	        nextPosition += nextPiece.byteLength;
	    }
	    return result;
	}

	function berBitStringValue(byteArray) {
	    return {
	        unusedBits: byteArray[0],
	        bytes: byteArray.subarray(1)
	    };
	}

	var parseSignatureAlgorithm = parseAlgorithmIdentifier;
	function parseAlgorithmIdentifier(asn1) {
	    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
	        throw new Error("Bad algorithm identifier. Not a SEQUENCE.");
	    }
	    var alg = {asn1: asn1};
	    var pieces = berListToJavaScript(asn1.contents);
	    if (pieces.length > 2) {
	        throw new Error("Bad algorithm identifier. Contains too many child objects.");
	    }
	    var encodedAlgorithm = pieces[0];
	    if (encodedAlgorithm.cls !== 0 || encodedAlgorithm.tag !== 6 || encodedAlgorithm.structured) {
	        throw new Error("Bad algorithm identifier. Does not begin with an OBJECT IDENTIFIER.");
	    }
	    alg.algorithm = berObjectIdentifierValue(encodedAlgorithm.contents);
	    if (pieces.length === 2) {
	        alg.parameters = {asn1: pieces[1]}; // Don't need this now, so not parsing it
	    } else {
	        alg.parameters = null;  // It is optional
	    }
	    return alg;
	}

	function parseSignatureValue(asn1) {
	    if (asn1.cls !== 0 || asn1.tag !== 3 || asn1.structured) {
	        throw new Error("Bad signature value. Not a BIT STRING.");
	    }
	    var sig = {asn1: asn1};   // Useful for debugging
	    sig.bits = berBitStringValue(asn1.contents);
	    return sig;
	}

	function berObjectIdentifierValue(byteArray) {
	    var oid = Math.floor(byteArray[0] / 40) + "." + byteArray[0] % 40;
	    var position = 1;
	    while(position < byteArray.length) {
	        var nextInteger = 0;
	        while (byteArray[position] >= 0x80) {
	            nextInteger = nextInteger * 0x80 + (byteArray[position] & 0x7f);
	            position += 1;
	        }
	        nextInteger = nextInteger * 0x80 + byteArray[position];
	        position += 1;
	        oid += "." + nextInteger;
	    }
	    return oid;
	}

	function parseTBSCertificate(asn1) {
	    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
	        throw new Error("This can't be a TBSCertificate. Wrong data type.");
	    }
	    var tbs = {asn1: asn1};  // Include the raw parser result for debugging
	    var pieces = berListToJavaScript(asn1.contents);
	    if (pieces.length < 7) {
	        throw new Error("Bad TBS Certificate. There are fewer than the seven required children.");
	    }
	    tbs.version = pieces[0];
	    tbs.serialNumber = pieces[1];
	    tbs.signature = parseAlgorithmIdentifier(pieces[2]);
	    tbs.issuer = pieces[3];
	    tbs.validity = pieces[4];
	    tbs.subject = pieces[5];
	    tbs.subjectPublicKeyInfo = parseSubjectPublicKeyInfo(pieces[6]);
	    return tbs;  // Ignore optional fields for now
	}

	function parseSubject(asn1) {
	    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
	        throw new Error("Bad SPKI. Not a SEQUENCE.");
	    }
	    var pieces = berListToJavaScript(asn1.contents);
	    
	    var jsPieces = [];

	    console.log("pieces: " + pieces.length);
	    for(var i=0; i<pieces.length; i++) {
	    	var pieces2 = berListToJavaScript(pieces[i]);

	    	var jsPieces2 = [];
	    	console.log("pieces2: " + pieces2.length);
	    	for(var j=0; j<pieces2.length; j++) {
		    	if(!pieces2[j].contents) break; 

	    		jsPieces2.push(pieces2[j]);
	    	}

	    	jsPieces.push(jsPieces2);
	    }

	    return jsPieces;
	}

	function parseSubjectPublicKeyInfo(asn1) {
	    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
	        throw new Error("Bad SPKI. Not a SEQUENCE.");
	    }
	    var spki = {asn1: asn1};
	    var pieces = berListToJavaScript(asn1.contents);
	    if (pieces.length !== 2) {
	        throw new Error("Bad SubjectPublicKeyInfo. Wrong number of child objects.");
	    }
	    spki.algorithm = parseAlgorithmIdentifier(pieces[0]);
	    spki.bits = berBitStringValue(pieces[1].contents);
	    return spki;
	}

	function berToJavaScript(byteArray) {
	    "use strict";
	    var result = {};
	    var position = 0;

	    result.cls              = getClass();
	    result.structured       = getStructured();
	    result.tag              = getTag();
	    var length              = getLength(); // As encoded, which may be special value 0

	    if (length === 0x80) {
	        length = 0;
	        while (byteArray[position + length] !== 0 || byteArray[position + length + 1] !== 0) {
	            length += 1;
	        }
	        result.byteLength   = position + length + 2;
	        result.contents     = byteArray.subarray(position, position + length);
	    } else {
	        result.byteLength   = position + length;
	        result.contents     = byteArray.subarray(position, result.byteLength);
	    }

	    result.raw              = byteArray.subarray(0, result.byteLength); // May not be the whole input array
	    return result;

	    function getClass() {
	        var cls = (byteArray[position] & 0xc0) / 64;
	        // Consumes no bytes
	        return cls;
	    }

	    function getStructured() {
	        var structured = ((byteArray[0] & 0x20) === 0x20);
	        // Consumes no bytes
	        return structured;
	    }

	    function getTag() {
	        var tag = byteArray[0] & 0x1f;
	        position += 1;
	        if (tag === 0x1f) {
	            tag = 0;
	            while (byteArray[position] >= 0x80) {
	                tag = tag * 128 + byteArray[position] - 0x80;
	                position += 1;
	            }
	            tag = tag * 128 + byteArray[position] - 0x80;
	            position += 1;
	        }
	        return tag;
	    }

	    function getLength() {
	        var length = 0;

	        if (byteArray[position] < 0x80) {
	            length = byteArray[position];
	            position += 1;
	        } else {
	            var numberOfDigits = byteArray[position] & 0x7f;
	            position += 1;
	            length = 0;
	            for (var i=0; i<numberOfDigits; i++) {
	                length = length * 256 + byteArray[position];
	                position += 1;
	            }
	        }
	        return length;
	    }
	}

	return {
		decodeAndParseCertificate : decodeAndParseCertificate,
		parseCertificate : parseCertificate,
		berListToJavaScript : berListToJavaScript,
		berBitStringValue : berBitStringValue,
		parseAlgorithmIdentifier : parseAlgorithmIdentifier,
		parseSignatureValue : parseSignatureValue,
		berObjectIdentifierValue : berObjectIdentifierValue,
		parseTBSCertificate : parseTBSCertificate,
		parseSubject : parseSubject,
		parseSubjectPublicKeyInfo : parseSubjectPublicKeyInfo,
		berToJavaScript : berToJavaScript,
	};

}); 