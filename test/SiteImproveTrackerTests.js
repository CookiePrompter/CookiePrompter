/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('SiteImproveTracker');

test('SiteImproveTracker is initialized', function () {
    expect(2);
    CookiePrompter.init({
        trackers: [{
            name: SiteImproveTracker,
            config: {
                scriptLocation: '/scripts/FakeSiteImprove.js',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeSiteImprove.js');
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

test('SiteImproveTracker can erase cookie', function () {
    stop();
    CookiePrompter.init({
        trackers: [{
            name: SiteImproveTracker,
            config: {
                scriptLocation: '/scripts/FakeSiteImprove.js',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeSiteImprove.js');
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
});