/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />

QUnit.module('GemiusTracker');

QUnit.test('GemiusTracker is initialized', function (assert) {
    assert.expect(3);
    CookiePrompter.init({
        trackers: [{
            name: GemiusTracker,
            config: {
                scriptLocation: '/src/fakes/FakeGemius.js',
                gemiusAccount: '123sdf43',
                ready: function (cfg) {
                    assert.equal(cfg.scriptLocation, '/src/fakes/FakeGemius.js');
                    assert.equal(cfg.gemiusAccount, '123sdf43');
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});



QUnit.test('GemiusTracker is default async=true', function (assert) {
    assert.expect(1);
    var gaCfg = {
        scriptLocation: '/src/fakes/FakeGemius.js',
        gemiusAccount: '123sdf43'
    };
    GemiusTracker.init(gaCfg);
    GemiusTracker.injectCode();

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    assert.equal(scriptTag.async, true);
});
QUnit.test('GemiusTracker will respect injectCode async overriding', function (assert) {
    assert.expect(1);
    var gaCfg = {
        scriptLocation: '/src/fakes/FakeGemius.js',
        gemiusAccount: '123sdf43'
    };
    GemiusTracker.init(gaCfg);
    GemiusTracker.injectCode({
        async: false
    });

    // get scriptBlock
    var scriptTag = document.getElementsByTagName('script')[0];
    assert.equal(scriptTag.async, false);
});