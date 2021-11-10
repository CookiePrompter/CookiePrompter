/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />


function cleanup() {
    var existingPrompts = document.getElementsByClassName('eksCookieContainer');
    if (existingPrompts.length > 0) {
        for (var i = 0; i < existingPrompts.length; i++) {
            if (existingPrompts[i])
                existingPrompts[i].parentNode.removeChild(existingPrompts[i]);

        }
    }
}

QUnit.module('CookiePrompter tests', {
    beforeEach: function () {
        CookiePrompter.init({
            enableLog: false
        }); // reset defaults
        cleanup();
    },
    afterEach: function () {
        CookieMgr.eraseCookie('cookieOptOut');
        CookiePrompter.init({
            enableLog: false
        }); // reset defaults
        cleanup();
        CookieDeleter.DeleteAll();
    }
});

QUnit.test('Init can run', function (assert) {
    CookiePrompter.init({});
    assert.notEqual(null, document);
});


QUnit.test('OnOptOut callback can be null', function (assert) {
    assert.expect(2);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    assert.ok(true, 'tracker inialized');
                    CookiePrompter.eraseCookiesAndRemovePrompt();
                    assert.ok(true);
                }
            }
        }]
    });
});


QUnit.test('config keys will be set individually for each init', function (assert) {
    assert.expect(4);
    CookiePrompter.init({
        expiryDays: 120,
        onReady: function (cfg) {
            assert.ok(cfg.expiryDays === 120);
        },
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    assert.ok(true, 'tracker inialized');
                }
            }
        }]
    });

    CookiePrompter.init({
        onReady: function (cfg) {
            assert.ok(cfg.expiryDays === 365);
        },
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    assert.ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

QUnit.test('OnOptOut callback will be called once when erasing cookies', function (assert) {
    assert.expect(2);
    var callCount = 0;
    CookiePrompter.init({
        enableLog: false,
        onOptOut: function (href) {
            callCount = callCount + 1;
        },
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    assert.ok(true, 'tracker inialized');
                }
            }
        }]
    });
    CookiePrompter.eraseCookiesAndRemovePrompt();
    assert.ok(callCount === 1);
});

QUnit.test('UnitTestTracker is initialized', function (assert) {
    assert.expect(1);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    assert.ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

QUnit.test('UnitTestTracker will not inject if first visit', function (assert) {
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {}
            }
        }]
    });
    var el = document.getElementById('h1header');
    assert.ok(el === null, 'Code injected, but should not have been');
});


QUnit.test("Cookie will use provided expirydays when overridden", function (assert) {
    assert.expect(1);

    var fakeCookieMgr = (function () {
        return {
            init: function () {},

            createCookie: function (name, value, days) {
                assert.ok(days === 45, "ExpiryDays not correctly provided");
            },
            readCookie: function () {
                return ""; // not used
            },
            eraseCookie: function () {
                // not used
            }

        };
    })();

    CookiePrompter.init({
        expiryDays: 45,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    CookiePrompter.eraseCookiesAndRemovePrompt();
                }
            }
        }],
        cookieMgr: fakeCookieMgr
    });
});


QUnit.test('Finding OK cookie will result in code injection', function (assert) {
    var fakeCookieMgr = (function () {
        return {
            init: function () {},

            createCookie: function (name, value, days) {
                throw "Should not create cookie, when it exists";
            },
            readCookie: function () {
                return "y";
            }
        };
    })();
    CookiePrompter.init({
        cookieMgr: fakeCookieMgr,
        enableLog: false,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {}
            }
        }]
    });
    var el = document.getElementById('h1header');
    assert.ok(el, 'OK cookie set, but code not injected');
});

QUnit.test('Finding OK cookie will result in code injection', function (assert) {
    var fakeCookieMgr = (function () {
        return {
            init: function () {},
            eraseCookie: function(){},

            createCookie: function (name, value, days) {
                throw "Should not create cookie, when it exists";
            },
            readCookie: function () {
                return "n";
            }
        };
    })();
    CookiePrompter.init({
        cookieMgr: fakeCookieMgr,
        enableLog: false,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {}
            }
        }]
    });
    var el = document.getElementById('h1header');
    assert.ok(el === null, 'NO cookie set, but tracker injected code anyway');
});

QUnit.test('Explicit consent will be respected even if from same domain', function (assert) {
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {

                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    assert.ok(el === null, 'Code injected, but should not have been');
});

QUnit.test('will show cookieprompt if no cookies present', function (assert) {
    CookiePrompter.init({});
    var cookiePrompt = document.getElementById('eksCookiePrompt');
    assert.ok(cookiePrompt, 'CookiePrompt was not rendered');
});


QUnit.test('Supplied text for OK btn will be used', function (assert) {
    CookiePrompter.init({
        textAccept: 'yeah!'
    });
    var btn = document.getElementsByClassName('cpAcceptBtn')[0];
    assert.ok(btn.innerText === 'yeah!', 'Text on OK button was not taken from config, was "' + btn.innerText + '"');
});

QUnit.test('Both accept and do not acceptbuttons are showed', function (assert) {
    CookiePrompter.init({
        textDontAccept: 'do not accept'
    });
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    var nobtns = document.getElementsByClassName('cpDontAcceptBtn');
    assert.ok(okbtns.length === 1 && nobtns.length === 1, 'Explicit accept buttons were not rendered, should be');
});

QUnit.test('When no dontaccepttext is set button will not be rendered', function (assert) {
    CookiePrompter.init({
        textDontAccept: ''
    });
    var nobtns = document.getElementsByClassName('cpDontAcceptBtn');
    assert.ok(nobtns.length === 0, 'Do not accept-button should not be rendered. It was.');
});

QUnit.test('default setCookieOnTopLevelDomain will be passed on to cookieMgr', function (assert) {
    var fakeCookieMgr = (function () {
        return {
            init: function (opts) {
                assert.ok(opts && opts.setCookieOnTopLevelDomain === false, 'setCookieOnTopLevelDomain is not on ');
            },

            createCookie: function (name, value, days) {},
            readCookie: function () {
                return null;
            }
        };
    })();
    CookiePrompter.init({
        cookieMgr: fakeCookieMgr
    });
});

QUnit.test('setCookieOnTopLevelDomain on main init opts will be passed on to cookieMgr', function (assert) {
    var fakeCookieMgr = (function () {
        return {
            init: function (opts) {
                assert.ok(opts && opts.setCookieOnTopLevelDomain === true, 'setCookieOnTopLevelDomain is not on ');
            },

            createCookie: function (name, value, days) {},
            readCookie: function () {
                return null;
            }
        };
    })();
    CookiePrompter.init({
        cookieMgr: fakeCookieMgr,
        setCookieOnTopLevelDomain: true
    });
});