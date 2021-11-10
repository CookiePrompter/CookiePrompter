/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />

QUnit.module('SiteImproveTracker',{
    beforeEach: function () {
        CookieDeleter.DeleteAll();
    },
    afterEach: function () {
        CookieDeleter.DeleteAll();
    }
});

QUnit.test('SiteImproveTracker is initialized', function (assert) {
    assert.expect(2);
    CookiePrompter.init({
        trackers: [{
            name: SiteImproveTracker,
            config: {
                scriptLocation: '/scripts/FakeSiteImprove.js',
                ready: function (cfg) {
                    assert.equal(cfg.scriptLocation, '/scripts/FakeSiteImprove.js');
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

QUnit.test('SiteImproveTracker can erase cookie', function (assert) {
    var done = assert.async();

    CookiePrompter.init({
        trackers: [{
            name: SiteImproveTracker,
            config: {
                scriptLocation: '/scripts/FakeSiteImprove.js',
                ready: function (cfg) {
                    assert.equal(cfg.scriptLocation, '/scripts/FakeSiteImprove.js');
                    assert.ok(true, 'tracker initialized');
                    done();                    
                }
            }
        }]
    });

    // insert cookie manually
    CookieMgr.createCookie('nmstat', '1234', 23);
    // test that it is there
    assert.equal(CookieMgr.readCookie('nmstat'), '1234', 'Cookie was expected');

    CookiePrompter.removeCookies();

    // test that it is gone
    assert.equal(CookieMgr.readCookie('nmstat'), null, 'Cookie was not expected');

});