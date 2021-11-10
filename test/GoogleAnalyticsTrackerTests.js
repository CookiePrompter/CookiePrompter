/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />


QUnit.module('GoogleAnalyticsTracker',{
    afterEach: function () {
        CookieDeleter.DeleteAll();
    }
});
QUnit.test('GoogleAnalyticsTracker is initialized with account', function (assert) {
    assert.expect(2);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsTracker,
            config: {
                account: '1234',
                ready: function (cfg) {
                    assert.equal(cfg.account, '1234');
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

QUnit.test('GoogleAnalyticsTracker is initialized with params', function (assert) {
    assert.expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsTracker,
            config: {
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

QUnit.test('GoogleAnalyticsTracker script is default async=true', function (assert) {
    assert.expect(1);
    var gaCfg = {
        account: '1234',
        params: ['p1_sdf', 'p2)_sdfsf']
    };
    GoogleAnalyticsTracker.init(gaCfg);
    GoogleAnalyticsTracker.injectCode();

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    assert.equal(scriptTag.async, true);
});

QUnit.test('Google analytics script will respect injectCode async overriding', function (assert) {
    assert.expect(1);
    var gaCfg = {
        account: '1234',
        params: ['p1_sdf', 'p2)_sdfsf']
    };
    GoogleAnalyticsTracker.init(gaCfg);
    GoogleAnalyticsTracker.injectCode({
        async: false
    });

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    assert.equal(scriptTag.async, false);
});