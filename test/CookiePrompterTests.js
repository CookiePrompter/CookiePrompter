/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />


function cleanup() {
    var existingPrompts = document.getElementsByClassName('eksCookieContainer');
    if (existingPrompts.length > 0) {
        for (var i = 0; i < existingPrompts.length; i++) {
            if (existingPrompts[i])
                existingPrompts[i].parentNode.removeChild(existingPrompts[i]);

        }
    }
}

module('CookiePrompter tests', {
    setup: function () {
        CookiePrompter.init({
            enableLog: false
        }); // reset defaults
        cleanup();
    },
    teardown: function () {
        CookieMgr.eraseCookie('cookieOptOut');
        CookiePrompter.init({
            enableLog: false
        }); // reset defaults
        cleanup();
    }
});

test('Init can run', function () {
    CookiePrompter.init({});
    notEqual(null, document);
});


test('OnOptOut callback can be null', function () {
    expect(2);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                    CookiePrompter.eraseCookiesAndRemovePrompt();
                    ok(true);
                }
            }
        }]
    });
});


test('config keys will be set individually for each init', function () {
    expect(4);
    CookiePrompter.init({
        expiryDays: 120,
        onReady: function (cfg) {
            ok(cfg.expiryDays === 120);
        },
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });

    CookiePrompter.init({
        onReady: function (cfg) {
            ok(cfg.expiryDays === 365);
        },
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

test('OnOptOut callback will be called once when erasing cookies', function () {
    expect(2);
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
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
    CookiePrompter.eraseCookiesAndRemovePrompt();
    ok(callCount === 1);
});

test('UnitTestTracker is initialized', function () {
    expect(1);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

test('UnitTestTracker will not inject if first visit', function () {
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {}
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el === null, 'Code injected, but should not have been');
});


test("Cookie will use provided expirydays when overridden", function () {
    expect(1);

    var fakeCookieMgr = (function () {
        return {
            init: function () {},

            createCookie: function (name, value, days) {
                ok(days === 45, "ExpiryDays not correctly provided");
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


test('Finding OK cookie will result in code injection', function () {
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
    ok(el, 'OK cookie set, but code not injected');
});

test('Finding OK cookie will result in code injection', function () {
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
    ok(el === null, 'NO cookie set, but tracker injected code anyway');
});

test('Explicit consent will be respected even if from same domain', function () {
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
    ok(el === null, 'Code injected, but should not have been');
});

test('will show cookieprompt if no cookies present', function () {
    CookiePrompter.init({});
    var cookiePrompt = document.getElementById('eksCookiePrompt');
    ok(cookiePrompt, 'CookiePrompt was not rendered');
});


test('Supplied text for OK btn will be used', function () {
    CookiePrompter.init({
        textAccept: 'yeah!'
    });
    var btn = document.getElementsByClassName('cpAcceptBtn')[0];
    ok(btn.innerText === 'yeah!', 'Text on OK button was not taken from config, was "' + btn.innerText + '"');
});

test('Both accept and do not acceptbuttons are showed', function () {
    CookiePrompter.init({
        textDontAccept: 'do not accept'
    });
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    var nobtns = document.getElementsByClassName('cpDontAcceptBtn');
    ok(okbtns.length === 1 && nobtns.length === 1, 'Explicit accept buttons were not rendered, should be');
});

test('When no dontaccepttext is set button will not be rendered', function () {
    CookiePrompter.init({
        textDontAccept: ''
    });
    var nobtns = document.getElementsByClassName('cpDontAcceptBtn');
    ok(nobtns.length === 0, 'Do not accept-button should not be rendered. It was.');
});

test('default setCookieOnTopLevelDomain will be passed on to cookieMgr', function () {
    var fakeCookieMgr = (function () {
        return {
            init: function (opts) {
                ok(opts && opts.setCookieOnTopLevelDomain === false, 'setCookieOnTopLevelDomain is not on ');
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

test('setCookieOnTopLevelDomain on main init opts will be passed on to cookieMgr', function () {
    var fakeCookieMgr = (function () {
        return {
            init: function (opts) {
                ok(opts && opts.setCookieOnTopLevelDomain === true, 'setCookieOnTopLevelDomain is not on ');
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