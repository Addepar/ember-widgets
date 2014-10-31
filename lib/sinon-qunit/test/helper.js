/*jslint onevar: false, eqeqeq: false*/
/*global TestCase*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
function testCase(name, tests) {
    var jstdCase = {};
    var jstdTestCase = TestCase; // Silence JsLint...

    for (var prop in tests) {
        if (tests.hasOwnProperty(prop)) {
            if (!/(^(setUp|tearDown)$)|^test/.test(prop) &&
                typeof tests[prop] == "function") {
                jstdCase["test " + prop] = tests[prop];
            } else {
                jstdCase[prop] = tests[prop];
            }
        }
    }

    jstdTestCase(name, jstdCase);
}
