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



test('TestTracker will not inject if first visit',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        cameFromSameDomain: function(doc){return false;},
        trackers: [{
            name: TestTracker,
            config: { ready:function() {}}
        }]
    }); 
    var el = document.getElementById('h1header');
    ok(el===null, 'Code injected, but should not have been');
})

test('TestTracker will inject code if referrer from same domain',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        cameFromSameDomain: function(doc){return true;},
        trackers: [{
            name: TestTracker,
            config: { ready:function() {}}
        }]
    }); 
    var el = document.getElementById('h1header');
    ok(el, 'Code not injected, but should not have been');
})


test('Explicit consent will be respected even if from same domain',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        cameFromSameDomain: function(doc){return true;},
        explicitAccept: true,
        trackers: [{
            name: TestTracker,
            config: { ready:function() {}}
        }]
    }); 
    var el = document.getElementById('h1header');
    ok(el===null, 'Code injected, but should not have been');
})





