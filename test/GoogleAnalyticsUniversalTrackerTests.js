/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />


module('GoogleAnalyticsUniversalTracker');

test('GoogleAnalyticsUniversalTracker is initialized with account', function() {
    expect(2);
      window.ga=function(param){
        
            ok(true);
        
      };
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsUniversalTracker,
            config: {
                fakeAnalytics: 'helpers/FakeGoogleAnalyticsUniversal.js',
                account: '1234',
                ready: function(cfg) {
                    equal(cfg.account, '1234');
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

test('GoogleAnalyticsUniversalTracker is initialized with params', function() {
    expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GoogleAnalyticsUniversalTracker,
            config: {
                fakeAnalytics: 'helpers/FakeGoogleAnalyticsUniversal.js',
                account: '1234',
                params: ['p1_sdf', 'p2)_sdfsf'],
                ready: function(cfg) {
                    equal(cfg.account, '1234');
                    deepEqual(cfg.params, ['p1_sdf', 'p2)_sdfsf']);
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});