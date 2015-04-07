define("skytrust-config",{server:"http://skytrust-dev.iaik.tugraz.at/skytrust-server-no-auth-2.0/rest/json",supportedAlgorithms:{encrypt:["RSA-OAEP","RSAES-PKCS1-v1_5","RSAES-RAW"],sign:["RSASSA-PKCS1-v1_5-SHA-1","RSASSA-PKCS1-v1_5-SHA-224","RSASSA-PKCS1-v1_5-SHA-256","RSASSA-PKCS1-v1_5-SHA-512"],cms:["CMS-AES-128-CBC","CMS-AES-192-CBC","CMS-AES-256-CBC","CMS-AES-128-GCM","CMS-AES-192-GCM","CMS-AES-256-GCM","CMS-AES-128-CCM","CMS-AES-192-CCM","CMS-AES-256-CCM"],wrapped:["RSA-2048","RSA-4096"]}}),define("common/crypto-object",[],function(){var e=function(e){var t={},r={},o=-1;this.resolve=function(){},this.reject=function(){},this.setHeader=function(e){t=JSON.parse(JSON.stringify(e))},this.getHeader=function(){return t},this.setPayload=function(e){r=JSON.parse(JSON.stringify(e))},this.getPayload=function(){return r},this.setRequestID=function(e){o=e},this.getRequestID=function(){return o},this.json=function(){return JSON.stringify({header:t,payload:r})},this.jsonWithRequestID=function(){return JSON.stringify({header:t,payload:r,requestID:o})},this.toString=function(){return"[CryptoObject #"+o+"] header="+t+", payload="+r},e&&this.setPayload(e)};return e}),define("common/router",["require","../common/crypto-object"],function(e){var t=e("../common/crypto-object"),r=function(e){var r="";if(this.route=function(e,o,n){if(console.log("[common][router]  FROM="+e+" TO="+o),!(n instanceof t))throw new Error("Router can only transmit instances of CryptoObject");if(r.getComponent(o)===!1)throw new Error("Router, receiver: no component named "+o);if(r.getComponent(e)===!1)throw new Error("Router, sender: no component named "+e);if(!r.getComponent(o).onReceive)throw new Error("Router: onReceive() method not defined");r.getComponent(o).onReceive(n)},this.window===window)throw Error("Router called statically");r=e};return r}),define("common/component",[],function(){var e=function(){return this.window===window?!1:void 0};return e.prototype.send=function(e,t){console.log("[WARNING] abstract method was not overwritten"),console.log("to="+e+", object="+t)},e.prototype.onReceive=function(e){console.log("[WARNING] abstract method was not overwritten"),console.log("object="+e)},e}),define("common/util",["require"],function(){var e={};return e.atob=function(e){if("string"==typeof plainTextData)return window.atob(e);for(var t=[],r=0;r<e.length;r++)t.push(window.atob(e[r]));return t},e.btoa=function(e){if("string"==typeof e)return window.btoa(e);for(var t=[],r=0;r<e.length;r++)t.push(window.btoa(e[r]));return t},e.inArray=function(e,t){if(!t||!t.length)return!1;for(var r=e.toLowerCase(),o=0;o<t.length;o++)if(r===t[o].toLowerCase())return t[o];return!1},e.copyOf=function(t){var r;if("string"==typeof t)return""+t;if("number"==typeof t||"boolean"==typeof t)return t;if("[object Date]"===Object.prototype.toString.call(t))return r=new Date,r.setTime(t.getTime()),r;if(Array.isArray(t)){r=[];for(var o=0;o<t.length;o++)r[o]=e.copyOf(t[o]);return r}if("object"==typeof t||t instanceof Object)return $.extend(!0,{},t);throw new Error("Copying type "+typeof t+" is not supported!")},e}),define("common/protocol",["require","../common/util"],function(e){var t=e("../common/util"),r={},o=function(e,t){var r=t.split("."),o=e;try{for(var n=0;n<r.length;n++){if(!o.hasOwnProperty(t[n]))throw new Error;o=o[t[n]]}}catch(i){throw new Error("key '"+t+"' does not exist")}return o},n=function(e){if("[object Array]"!==Object.prototype.toString.call(e))return i(e);for(var t=[],r=0;r<e.length;r++)t.push(i(e[r]));return t},i=function(e){if(null==e||!e.keyType)return null;var t={type:e.keyType};return("handle"===e.keyType||"internalCertificate"===e.keyType)&&(t.id=e.id,t.subId=e.subId),"internalCertificate"===e.keyType&&(t.encodedCertificate=e.encodedCertificate),"wrappedKey"===e.keyType&&(t.encodedWrappedKey=e.encodedWrappedKey),"externalCertificate"===e.keyType&&(t.encodedCertificate=e.encodedCertificate),t};return r.getBlankHeader=function(){var e={type:"standardSkyTrustHeader",commandId:"",sessionId:"",path:["java-api-instance"],protocolVersion:"2.0"};return e},r.setBlankHeader=function(e){e.setHeader(r.getBlankHeader())},r.setDiscoverKeysRequest=function(e){var t={type:"discoverKeysRequest",representation:"handle"};e.setPayload&&e.setPayload(t)},r.setSessionId=function(e,t){if(e.getHeader){var r=e.getHeader();r.sessionId=t,e.setHeader(r)}else e.sessionId=t},r.getSessionId=function(e){return e.getHeader?o(e.getHeader(),"sessionId"):void 0},r.setUserPasswortAuth=function(e,t,r){var o={type:"authChallengeResponse",authInfo:{type:"UserNamePasswordAuthInfo",userName:t,passWord:r}};e.setPayload&&e.setPayload(o)},r.setEncryptRequest=function(e,r,o,n){var s=t.btoa(n),a={type:"encryptRequest",encryptionKeys:[i(o)],algorithm:r,plainData:"string"==typeof s?[s]:s};e.setPayload&&e.setPayload(a)},r.setDecryptRequest=function(e,t,r,o){var n={type:"decryptRequest",decryptionKey:i(r),algorithm:t,encryptedData:"string"==typeof o?[o]:o};e.setPayload&&e.setPayload(n)},r.setEncryptCMSRequest=function(e,r,o,n){var s=t.btoa(n),a={type:"encryptCMSRequest",encryptionKeys:[i(o)],algorithm:r,plainData:"string"==typeof s?[s]:s};e.setPayload&&e.setPayload(a)},r.setDecryptCMSRequest=function(e,t,r,o){var n={type:"decryptCMSRequest",decryptionKey:i(r),encryptedCMSData:"string"==typeof o?[o]:o};e.setPayload&&e.setPayload(n)},r.setSignRequest=function(e,r,o,n){var s=t.btoa(n),a={type:"signRequest",signatureKey:i(o),algorithm:r,hashesToBeSigned:"string"==typeof s?[s]:s};e.setPayload&&e.setPayload(a)},r.setGenerateWrappedKeyRequest=function(e,t,r,o,s){var a=i(o),c={type:"generateWrappedKeyRequest",encryptionKeys:n(r),keyType:t,certificateSubject:s};null!=a&&(c.signingKey=a),e.setPayload&&e.setPayload(c)},r.isAuthRequired=function(e){var t=e.getPayload();return t&&"authChallengeRequest"===t.type?!0:!1},r.getAuthTypes=function(e){for(var t=e.getPayload().authTypes,r=[],o=0;t&&o<t.length;o++)r.push(t[o].type);return r},r.getError=function(e){var t=e.getPayload();return t&&"status"===t.type?t.code:!1},r.getCommandId=function(e){return e.getHeader?e.getHeader().commandId:e.commandId},r.setCommandId=function(e,t){e.getHeader||(e.commandId=t),e.getHeader().commandId=t},r}),define("common/error",[],function(){var e=function(e){Error.call(this),this.name="NotYetImplementedException",this.message=e,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};e.prototype=Object.create(Error.prototype);var t=function(){Error.call(this),this.name="NoSuchProviderError",this.message="Provider does not exist.",this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};t.prototype=Object.create(Error.prototype);var r=function(){Error.call(this),this.name="UnauthorizedError",this.message="Please authorize, no active or invalid session.",this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};r.prototype=Object.create(Error.prototype);var o=function(e){Error.call(this),this.name="QuotaExceededError",this.message=e,this.code=22,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};o.prototype=Object.create(Error.prototype);var n=function(){Error.call(this),this.name="InvalidAccessError",this.message="The requested operation is not valid for the provided key.",this.code=15,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};n.prototype=Object.create(Error.prototype);var i=function(){Error.call(this),this.name="SyntaxError",this.message="A required parameter was missing or out-of-range",this.code=12,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};i.prototype=Object.create(Error.prototype);var s=function(e){Error.call(this),this.name="NotSupportedError",this.message="This algorithm is not supported: "+e,this.code=9,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};s.prototype=Object.create(Error.prototype);var a=function(){Error.call(this),this.name="OperationNotSupported",this.message="SkyTrust doesn't support this operation.",this.code=9,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};a.prototype=Object.create(Error.prototype);var c=function(){Error.call(this),this.name="InvalidStateError",this.message="The requested operation is not valid for the current state of the provided key.",this.code=11,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};c.prototype=Object.create(Error.prototype);var u=function(){Error.call(this),this.name="OperationError",this.message="The operation failed for an operation-specific reason.",this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};u.prototype=Object.create(Error.prototype);var p=function(){Error.call(this),this.name="UnknownError",this.message="The operation failed for an unknown transient reason (e.g. out of memory).",this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};p.prototype=Object.create(Error.prototype);var d=function(){Error.call(this),this.name="DataError",this.message="Data provided to an operation does not meet requirements.",this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};d.prototype=Object.create(Error.prototype);var y=function(e){Error.call(this),this.name="TypeMismatchError",this.message=e,this.stack=(new Error).stack,this.toString=function(){return"Error: "+this.name+": "+this.message}};return y.prototype=Object.create(Error.prototype),{NotYetImplementedException:e,NoSuchProviderError:t,UnauthorizedError:r,QuotaExceededError:o,InvalidStateError:c,SyntaxError:i,OperationNotSupportedError:a,NotSupportedError:s,InvalidAccessError:n,OperationError:u,UnknownError:p,DataError:d,TypeMismatchError:y}}),define("common/key",[],function(){var e=function(e,t,r,o){Object.defineProperty(this,"keyType",{value:r}),"handle"===r||"internalCertificate"===r?(Object.defineProperty(this,"id",{value:o.id}),Object.defineProperty(this,"subId",{value:o.subId}),"internalCertificate"===r&&Object.defineProperty(this,"encodedCertificate",{value:o.encodedCertificate}),Object.defineProperty(this,"extractable",{value:!1})):"wrappedKey"===r?(Object.defineProperty(this,"encodedWrappedKey",{value:o.encodedWrappedKey}),Object.defineProperty(this,"encodedX509Certificate",{value:o.encodedX509Certificate}),Object.defineProperty(this,"extractable",{value:!0})):"externalCertificate"===r&&(Object.defineProperty(this,"encodedCertificate",{value:o.encodedCertificate}),Object.defineProperty(this,"extractable",{value:!0})),Object.defineProperty(this,"type",{value:"secret"}),Object.defineProperty(this,"algorithm",{value:e}),Object.defineProperty(this,"usages",{value:t})};return e.prototype.toString=function(){var e="";return"handle"===this.keyType||"encodedCertificate"===this.keyType?(e=e+"id="+this.id+", subId="+this.subId,"internalCertificate"===this.keyType&&(e=e+" certificate="+this.encodedCertificate.substr(0,8)+"...")):"wrappedKey"===this.keyType?e=e+"wrappedKey="+this.encodedWrappedKey.substr(0,3)+"..."+this.encodedWrappedKey.substr(550,7)+"...":"externalCertificate"===this.keyType&&(e=e+"certificate="+this.encodedCertificate.substr(0,3)+"..."+this.encodedCertificate.substr(550,7)+"..."),e},e}),define("w3ccrypto/receiver",["require","../common/component","../common/crypto-object","../common/protocol","../skytrust-config","../common/util","../common/error","../common/key"],function(e){var t=e("../common/component"),r=e("../common/crypto-object"),o=e("../common/protocol"),n=e("../skytrust-config"),i=e("../common/util"),s=e("../common/error"),a=e("../common/key"),c=function(){var e=this,t=function(e){return new Promise(function(t,r){r(e)})},c=function(e,t){var r=e.name?e.name:e;r=(""+r).toLowerCase();var o=(""+t).toLowerCase(),a="decrypt"===o?"encrypt":o,c=n.supportedAlgorithms[a],u=i.inArray(r,c);if(!c||!u)throw new s.NotSupportedError(r);return u},u=function(o,n,i,s,a){try{i=c(i,n)}catch(u){return t(u)}return new Promise(function(t,n){var c=new r;o(c,i,s,a),c.resolve=t,c.reject=n,e.send("communication",c)})},p={encrypt:{request:function(e,t,r){return u(o.setEncryptRequest,"encrypt",e,t,i.copyOf(r))},response:function(e,t){t.encryptedData[0]&&t.encryptedData[0][0]?e.resolve(t.encryptedData[0][0]):e.rejected(new Error("skyTrust error"))}},decrypt:{request:function(e,t,r){return u(o.setDecryptRequest,"decrypt",e,t,i.copyOf(r))},response:function(e,t){e.resolve(window.atob(t.plainData[0]))}},sign:{request:function(e,t,r){return u(o.setSignRequest,"sign",e,t,i.copyOf(r))},response:function(e,t){e.resolve(t.signedHashes[0])}},encryptCMS:{request:function(e,t,r){return u(o.setEncryptCMSRequest,"cms",e,t,i.copyOf(r))},response:function(e,t){e.resolve(t.encryptedCMSData)}},decryptCMS:{request:function(e,t,r){return u(o.setDecryptCMSRequest,"cms",e,t,i.copyOf(r))},response:function(e,t){e.resolve(i.atob(t.plainData))}},discoverKeys:{request:function(){return new Promise(function(t,n){var i=new r;o.setDiscoverKeysRequest(i),i.resolve=t,i.reject=n,e.send("communication",i)})},response:function(e,t){for(var r=t.key,o=[],n=0;n<r.length;n++){var i={id:r[n].id,subId:r[n].subId};o.push(new a(null,null,"handle",i))}e.resolve(o)}},generateWrappedKey:{request:function(n,s,a,u,p,d){var y=i.copyOf(d);try{n=c(n,"wrapped")}catch(m){return t(m)}return new Promise(function(t,i){var s=new r;o.setGenerateWrappedKeyRequest(s,n,u,p,y),s.resolve=t,s.reject=i,e.send("communication",s)})},response:function(e,t){var r=new a(null,null,"wrappedKey",t);e.resolve(r)}},exportKey:function(e,t){return new Promise(function(r,o){t.extractable!==!0&&o(new s.InvalidAccessError),"x509"===e?r({key:t.encodedWrappedKey,certificate:t.encodedX509Certificate}):o(new Error("export format has to be x509"))})},importKey:function(e,t){i.copyOf(t);return new Promise(function(t,r){"x509"===e||"id"===e||r(new s.NotSupportedError(e))})}};this.onReceive=function(e){console.log("[w3c   ] received at receiver component"),console.log(e.json());var t=o.getError(e);if(t!==!1)e.reject(new Error("SkyTrust/HTTP error code "+t));else{var r=e.getPayload(),n=r.type,i={decryptResponse:p.decrypt.response,encryptResponse:p.encrypt.response,signResponse:p.sign.response,encryptCMSResponse:p.encryptCMS.response,decryptCMSResponse:p.decryptCMS.response,discoverKeysResponse:p.discoverKeys.response,generateWrappedKeyResponse:p.generateWrappedKey.response};try{i[n](e,r)}catch(s){e.reject(s)}}},this.operation={encrypt:p.encrypt.request,decrypt:p.decrypt.request,sign:p.sign.request,encryptCMS:p.encryptCMS.request,decryptCMS:p.decryptCMS.request,discoverKeys:p.discoverKeys.request,generateWrappedKey:p.generateWrappedKey.request,exportKey:p.exportKey,importKey:p.importKey}};return c.prototype=Object.create(t),c}),define("w3ccrypto/communication",["require","../common/component","../common/protocol"],function(e){var t=e("../common/component"),r=e("../common/protocol"),o=function(e){var t="",o=this,n={},i=function(){console.log("[iframe] init post message listener (iframe)"),window.addEventListener("message",u,!1)},s=function(e){var r=document.getElementById(t);console.log("[w3c   ] data to send: "),console.log(e.json());var o="";do o=Math.round(1e6*Math.random());while(n.hasOwnProperty(o));e.setRequestID(o),n[o]=e;var i=e.jsonWithRequestID();r.contentWindow.postMessage(i,"*"),console.log("[w3c   ] pending requests: "+Object.keys(n).length)},a=function(e){var t=n[e];return n[e]&&delete n[e],t},c=function(e){console.log("[w3c   ] sending post message to iframe ..."),s(e)},u=function(e){console.log("[w3c   ] received post message ..."),console.log("[w3c   ] postMessage origin: "+e.origin),console.log("[w3c   ] postMessage data:"),console.log(e.data);var t=JSON.parse(e.data),r=a(t.requestID);if(!r)throw new Error("no matching request with ID '"+t.requestID+"' found!");r.setPayload(t.payload),r.setHeader(t.header),o.send("receiver",r)};if(this.onReceive=function(e){console.log("[w3c   ] received at communication component"),r.setBlankHeader(e),c(e)},this.window===window)throw new Error("Communication called statically");t=e,i()};return o.prototype=Object.create(t),o}),define("w3ccrypto/element",["require","../common/router","../w3ccrypto/receiver","../w3ccrypto/communication","jQuery"],function(e){var t=e("../common/router"),r=e("../w3ccrypto/receiver"),o=e("../w3ccrypto/communication"),n=e("jQuery");return function(){var i={},s=new t(this),a="skytrust-iframe",c=e.toUrl("skytrust-iframe.html"),u=function(e,t){return i.hasOwnProperty(e)?!1:(i[e]=t,void(t.send=function(t,r){s.route(e,t,r)}))};if(this.operation={},this.getComponent=function(e){return i.hasOwnProperty(e)?i[e]:!1},this.window===window)throw Error("Element called statically");n(document).ready(function(){n("#"+a).attr("src",c)}),u("receiver",new r),u("communication",new o(a)),this.operation=i.receiver.operation}}),define("w3ccrypto/provider",["require","../w3ccrypto/element","../common/error","../common/key"],function(e){var t=e("../w3ccrypto/element"),r=e("../common/error"),o=e("../common/key"),n=function(){var e=new t;this.subtle={},this.extended={},this.subtle.CryptoKey=o,this.subtle.encrypt=e.operation.encrypt,this.subtle.decrypt=e.operation.decrypt,this.subtle.sign=e.operation.sign,this.subtle.generateKey=e.operation.generateWrappedKey,this.subtle.exportKey=e.operation.exportKey,this.subtle.deriveKey=function(){throw new r.OperationNotSupportedError},this.subtle.deriveBits=function(){throw new r.OperationNotSupportedError},this.subtle.verify=function(){throw new r.OperationNotSupportedError},this.subtle.digest=function(){throw new r.OperationNotSupportedError},this.subtle.wrapKey=function(){throw new r.NotYetImplementedException},this.subtle.unwrapKey=function(){throw new r.NotYetImplementedException},this.extended.listKeys=e.operation.discoverKeys,this.extended.encryptCMS=e.operation.encryptCMS,this.extended.decryptCMS=e.operation.decryptCMS};return n}),define("w3ccrypto/providerDef",["require","../w3ccrypto/provider","../common/error"],function(e){var t=e("../w3ccrypto/provider"),r=e("../common/error"),o=function(e){switch(e){case"w3c":return window.crypto||window.msCrypto;case"SkyTrust":return new t;default:throw new r.NoSuchProviderError}};return{getCryptoProviderByName:o}}),define("iframe/receiver",["require","../common/component","../common/crypto-object"],function(e){var t=e("../common/component"),r=e("../common/crypto-object"),o=function(){var e=this,t=function(){console.log("[iframe] init post message listener (iframe)"),window.addEventListener("message",o,!1)},o=function(t){console.log("[iframe] received post message ..."),console.log("[iframe] postMessage origin: "+t.origin);var o=JSON.parse(t.data);console.log("[iframe] data received post message");var n=new r(o.payload);n.setHeader(o.header),n.setRequestID(o.requestID),n.resolve=function(){console.log("[iframe] sending post message back ..."),t.source.postMessage(n.jsonWithRequestID(),"*")},n.reject=function(e){console.log("[iframe] sending post message back ..."),n.payload.nodeError=e.toString(),t.source.postMessage(n.jsonWithRequestID(),"*")},e.send("communication",n)};this.onReceive=function(e){console.log("[iframe] received at receiver component"),e.resolve()},t()};return o.prototype=Object.create(t),o}),define("iframe/authentication",["require","../common/component","../common/protocol"],function(e){var t=e("../common/component"),r=e("../common/protocol"),o=function(){var e=this,t=function(t){var o=t.data,n=$("#loginusername").val(),i=$("#loginpassword").val();console.log("[iframe] user name: "+n),console.log("[iframe] password: "+i),r.setUserPasswortAuth(o,n,i),console.log("[iframe] object after auth"),console.log(o.json()),$("#loginform").hide(),$("#loginform").off("submit"),e.send("communication",o)};if(this.onReceive=function(e){console.log("[iframe] received at authentication component"),$("#loginform").show(),$("#loginform-message").hide(),$("#loginform").submit(e,t),"609"===r.getError(e)&&($("#loginform-message").html("Invalid username/password"),$("#loginform-message").show())},this.window===window)throw Error("Authentication called statically")};return o.prototype=Object.create(t),o}),define("iframe/communication",["require","../common/component","../skytrust-config","../common/protocol"],function(e){var t=e("../common/component"),r=e("../skytrust-config"),o=e("../common/protocol"),n=function(){var e="",t=this,n=function(e){var o=e.json();$.ajax({url:r.server,method:"post",dataType:"json",processData:!1,contentType:"application/json",data:o}).done(function(t){i(t,e,o)}).fail(function(r,o,n){console.log("[iframe] request error "+n);var i={type:"status",code:r.status};console.log(r),e.setPayload(i),t.send("receiver",e)})},i=function(r,n,i){console.log("[iframe] ajax response received");var s=n;s.setHeader(r.header),s.setPayload(r.payload),console.log(n.getHeader());var a=s.getHeader().sessionId;if(e!==a&&(console.log("[iframe] setting session ID: "+a),e=a),o.isAuthRequired(s)){var c=o.getAuthTypes(s);$.inArray("authChallengeRequest",c)&&t.send("authentication",s)}else if("609"===o.getError(s)){console.log("[iframe] wrong username/password");var u=o.getCommandId(JSON.parse(i).header);console.log("header command id: "+u),o.setCommandId(s,u),t.send("authentication",s)}else t.send("receiver",n)};this.onReceive=function(t){if(console.log("[iframe] received at communication component"),null===t.getHeader()){var r=o.getBlankHeader();console.log("[iframe] header was blank, setting new header"),t.setHeader(r)}o.setSessionId(t,e),n(t)}};return n.prototype=Object.create(t),n}),define("iframe/element",["require","../common/router","../iframe/receiver","../iframe/authentication","../iframe/communication"],function(e){var t=e("../common/router"),r=e("../iframe/receiver"),o=e("../iframe/authentication"),n=e("../iframe/communication"),i=function(){var e=null,i={},s=function(t,r){return i.hasOwnProperty(t)?!1:(i[t]=r,void(r.send=function(r,o){e.route(t,r,o)}))};if(this.operation=null,this.getComponent=function(e){return i.hasOwnProperty(e)?i[e]:!1},this.window===window)throw Error("Element called statically");e=new t(this),s("receiver",new r),s("authentication",new o),s("communication",new n),this.operation=i.receiver.operation};return i}),requirejs.config({paths:{jQuery:"https://code.jquery.com/jquery-1.11.2.min"},shim:{jQuery:{exports:"$"}}}),requirejs(["jQuery","skytrust-config","w3ccrypto/providerDef","iframe/element"],function(e,t,r,o){"undefined"!=typeof ___skytrust_javascript_iframe___?(console.log("[iframe] initializing SkyTrust"),new o,e("#loginserver").val(t.server)):(console.log("[w3c   ] initializing SkyTrust: window.getCryptoProviderByName()"),window.getCryptoProviderByName=r.getCryptoProviderByName)}),define("skytrust",function(){});