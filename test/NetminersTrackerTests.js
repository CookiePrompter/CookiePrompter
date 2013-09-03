/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('NetminersTracker');

test('NetminersTracker is initialized', function () {
    expect(3);
    CookiePrompter.init({
        trackers: [{
            name: NetMinersTracker,
            config: {
                scriptLocation: '/scripts/FakeNetminersInsight.js',
                netminersAccount: 'xyz123',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeNetminersInsight.js');
                    equal(cfg.netminersAccount, 'xyz123');
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

test('NetminersTracker injectCode', function () {
    var netminersCfg = {
                scriptLocation: '/scripts/FakeNetminersInsight.js',
                netminersAccount: 'xyz123',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeNetminersInsight.js');
                    equal(cfg.netminersAccount, 'xyz123');
                    ok(true, 'tracker initialized');
                }
            };
    NetMinersTracker.init(netminersCfg);
    NetMinersTracker.injectCode();

    var scriptTag = document.getElementsByTagName('script')[0];
    var matches = scriptTag.src.match(netminersCfg.scriptLocation);
    equal(true,matches && matches.length===1,'netminers script tag does not match the provided location: '+netminersCfg.scriptLocation + ', (was: '+scriptTag.src+')');
});

/*test('NetminersTracker can erase cookie', function () {
    stop();
    CookiePrompter.init({
        trackers: [{
            name: NetMinersTracker,
            config: {
                scriptLocation: '/scripts/FakeNetminersInsight.js',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeNetminersInsight.js');
                    ok(true, 'tracker initialized');
                    start();
                }
            }
        }]
    });

    // insert cookie manually
    CookieMgr.createCookie('nmstat', '1234', 23);
    // test that it is there
    equal(CookieMgr.readCookie('nmstat'), '1234', 'Cookie was expected');

    CookiePrompter.removeCookies();

    // test that it is gone
    equal(CookieMgr.readCookie('nmstat'), null, 'Cookie was not expected');
});*/
