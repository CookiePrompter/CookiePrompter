/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />

QUnit.module('NetminersTracker',{
    beforeEach: function () {
        CookieDeleter.DeleteAll();
    },
    afterEach: function () {
        CookieDeleter.DeleteAll();
    }
});

QUnit.test('NetminersTracker is initialized', function (assert) {
    assert.expect(3);
    CookiePrompter.init({
        trackers: [{
            name: NetMinersTracker,
            config: {
                scriptLocation: '/src/fakes/FakeNetminersInsight.js',
                netminersAccount: 'xyz123',
                ready: function (cfg) {
                    assert.equal(cfg.scriptLocation, '/src/fakes/FakeNetminersInsight.js');
                    assert.equal(cfg.netminersAccount, 'xyz123');
                    assert.ok(true, 'tracker initialized');
                }
            }
        }]
    });
});

QUnit.test('NetminersTracker injectCode', function (assert) {
    var netminersCfg = {
        scriptLocation: '/src/fakes/FakeNetminersInsight.js',
        netminersAccount: 'xyz123',
        ready: function (cfg) {
            assert.equal(cfg.scriptLocation, '/src/fakes/FakeNetminersInsight.js');
            assert.equal(cfg.netminersAccount, 'xyz123');
            assert.ok(true, 'tracker initialized');
        }
    };
    NetMinersTracker.init(netminersCfg);
    NetMinersTracker.injectCode();

    var scriptTag = document.getElementsByTagName('script')[0];
    var matches = scriptTag.src.match(netminersCfg.scriptLocation);
    assert.equal(true, matches && matches.length === 1, 'netminers script tag does not match the provided location: ' + netminersCfg.scriptLocation + ', (was: ' + scriptTag.src + ')');
});

// QUnit.test('NetminersTracker can erase cookie', function (assert) {
//     var done = assert.async();
//     CookiePrompter.init({
//         trackers: [{
//             name: NetMinersTracker,
//             config: {
//                 scriptLocation: '/scripts/FakeNetminersInsight.js',
//                 netminersAccount: 'xyz123',
//                 ready: function (cfg) {
//                     assert.equal(cfg.scriptLocation, '/scripts/FakeNetminersInsight.js');
//                     assert.ok(true, 'tracker initialized');
//                     done();
//                 }
//             }
//         }]
//     });

   
//     CookiePrompter.removeCookies();

// });