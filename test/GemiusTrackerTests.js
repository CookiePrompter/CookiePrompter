/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('GemiusTracker');

test('GemiusTracker is initialized', function () {
    expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GemiusTracker,
            config: {
                scriptLocation: '/scripts/FakeGemius.js',
                gemiusAccount: '123sdf43',
                ready: function (cfg) {
                    equal(cfg.scriptLocation, '/scripts/FakeGemius.js');
                    equal(cfg.gemiusAccount, '123sdf43');
                    ok(true, 'tracker initialized');
                }
            }
        }]
    });
});