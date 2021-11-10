/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />


QUnit.module('GoogleAnalyticsUniversalTracker',{
    afterEach: function () {
        CookieDeleter.DeleteAll();
    }
});

QUnit.test('GoogleAnalyticsUniversalTracker is initialized with account', function (assert) {
    assert.expect(2);
    window.ga = function (param) {
        assert.ok(true);
    };
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsUniversalTracker,
            config: {
                fakeAnalytics: 'helpers/FakeGoogleAnalyticsUniversal.js',
                account: '1234',
                ready: function (cfg) {
                    assert.equal(cfg.account, '1234');
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

QUnit.test('GoogleAnalyticsUniversalTracker is initialized with params', function (assert) {
    assert.expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsUniversalTracker,
            config: {
                fakeAnalytics: 'helpers/FakeGoogleAnalyticsUniversal.js',
                account: '1234',
                params: ['p1_sdf', 'p2)_sdfsf'],
                ready: function (cfg) {
                    assert.equal(cfg.account, '1234');
                    assert.deepEqual(cfg.params, ['p1_sdf', 'p2)_sdfsf']);
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});