define(function() { 


    QUnit.start();

    var cp = null;

    QUnit.begin(function( details ) {
        console.log( "Test amount:", details.totalTests );
        console.log( "[test] creating IFrame" );
        var iframe = $( "<iframe src=\"#\" id=\"skytrust-iframe\" style=\"border: none;\" />" );
        $(document.body).append(iframe);
        cp = window.getCryptoProviderByName("SkyTrust");
    });
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  /* require your app components
   * for example, if you have /app/modules/doSomething.js, you can
   * require(['modules/doSomething'], function(theModule) {
   *   // test the things
   * });
   */

    QUnit.test('access via window.getCryptoProviderByName()', function(assert) {
        assert.ok(window.getCryptoProviderByName !== null, "window.getCryptoProviderByName not null");
        assert.ok(cp !== null, "SkyTrust crypto provider not null")
    });

    QUnit.test('crypto functions throw error if they are called without any arguments', function(assert) {
        var functions = {};
        functions.subtle = ['encrypt', 'decrypt', 'sign', 'wrapKey', 'exportKey', 'importKey']; //...
        functions.extended = ['encryptCMS', 'decryptCMS'];

        assert.expect(functions.subtle.length + functions.extended.length);

        for(var i=0; i<functions.subtle.length; i++) {
            var fname = functions.subtle[i];
            testThrowsExceptionWithoutParameters(cp.subtle[fname], fname, assert);
        }
        for(var i=0; i<functions.extended.length; i++) {
            var fname = functions.extended[i];
            testThrowsExceptionWithoutParameters(cp.extended[fname], fname, assert);
        }
    });

    function testThrowsExceptionWithoutParameters(func, funcname, assert) {
        var MESSAGE = "calling " + funcname + " without parameters throws an error";

        var done = assert.async();
        try {
            var promise = func();
            if(promise.catch) {
                promise
                    .then(function(result) {
                        console.log("[test]" + result);
                        assert.ok(false, MESSAGE + ": promise resolved (success)");
                    })
                    .catch(function(error) { 
                        assert.ok(true, MESSAGE + ": promise rejected (" + error + ")");
                        done();
                    });
            }
        }catch(error) {
            assert.ok(true, MESSAGE + ": exception before returning a promise (" + error + ")");
            done();
        }
    }

    QUnit.test('digest, verify, deriveKey, deriveBits throw OperationNotSupported error', function(assert) {
        var functions = ['digest', 'verify', 'deriveKey', 'deriveBits'];

        assert.expect(functions.length);

        for(var i=0; i<functions.length; i++) {
            var fname = functions[i];
            testNotSupported(cp.subtle[fname], fname, assert);
        }
    });

    function testNotSupported(func, funcname, assert) {
        var MESSAGE = funcname + "() throws not supported error";

        var done = assert.async();
        try {
            var promise = func();
        }catch(e) {
            assert.equal(e.name, "OperationNotSupported", MESSAGE);
            done();
        }
    }

});
