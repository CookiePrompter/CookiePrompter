/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />


module('GoogleAnalyticsTracker');
test('GoogleAnalyticsTracker is initialized with account', function () {
    expect(2);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsTracker,
            config: {
                account: '1234',
                ready: function (cfg) {
                    equal(cfg.account, '1234');
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

test('GoogleAnalyticsTracker is initialized with params', function () {
    expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsTracker,
            config: {
                account: '1234',
                params: ['p1_sdf', 'p2)_sdfsf'],
                ready: function (cfg) {
                    equal(cfg.account, '1234');
                    deepEqual(cfg.params, ['p1_sdf', 'p2)_sdfsf']);
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});
