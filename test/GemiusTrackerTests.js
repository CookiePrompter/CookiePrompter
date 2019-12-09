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



test('GemiusTracker is default async=true', function () {
    expect(1);
    var gaCfg = {
        scriptLocation: '/scripts/FakeGemius.js',
        gemiusAccount: '123sdf43'
    };
    GemiusTracker.init(gaCfg);
    GemiusTracker.injectCode();

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    equal(scriptTag.async, true);
});
test('GemiusTracker will respect injectCode async overriding', function () {
    expect(1);
    var gaCfg = {
        scriptLocation: '/scripts/FakeGemius.js',
        gemiusAccount: '123sdf43'
    };
    GemiusTracker.init(gaCfg);
    GemiusTracker.injectCode({
        async: false
    });

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    equal(scriptTag.async, false);
});