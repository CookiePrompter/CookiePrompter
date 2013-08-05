/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('CookiePrompter tests');

test('Init can run', function() {
    CookiePrompter.init({});
    notEqual(null, Document);
});


test('TestTracker is initialized', function() {
    expect(1);
    CookiePrompter.init({
        trackers: [{
            name: TestTracker,
            config: { ready:function() {
                ok(true, 'tracker inialized');
            }}
        }]
    });
});
