/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('CookiePrompter tests');

test('Init can run', function() {
    CookiePrompter.init({});
    notEqual(null, Document);
});


test('OnOptOut callback can be null',function(){
    expect(2);
    CookiePrompter.init({
        trackers: [{
            name: TestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                    CookiePrompter.eraseCookiesAndRemovePrompt();
                    ok(true);
                }
            }
        }]
    });
});


test('config keys will be set individually for each init',function(){
    expect(4);
    CookiePrompter.init({
        trackLandingPage: true,
        onReady: function(cfg){
            ok(cfg.trackLandingPage===true);
        },
        trackers: [{
            name: TestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });

    CookiePrompter.init({
        onReady: function(cfg){
            ok(cfg.trackLandingPage===false);
        },
        trackers: [{
            name: TestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

test('OnOptOut callback will be called once when erasing cookies',function(){
    expect(2);
    var callCount = 0;
    CookiePrompter.init({
        enableLog: false,
        onOptOut: function(href){
            callCount = callCount+1;
        },
        trackers: [{
            name: TestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
    CookiePrompter.eraseCookiesAndRemovePrompt();
    ok(callCount===1);
});

test('TestTracker is initialized', function () {
    expect(1);
    CookiePrompter.init({
        trackers: [{
            name: TestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

test('TestTracker will not inject if first visit', function() {
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        referrerHandler: OtherDomainReferrerHandler,
        trackers: [{
            name: TestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el === null, 'Code injected, but should not have been');
});



test('TestTracker will inject code if referrer from same domain', function() {
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler
    ,
        trackers: [{
            name: TestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el, 'Code not injected, but should not have been');
});

test('Explicit consent will be respected even if from same domain', function() {
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        explicitAccept: true,
        trackers: [{
            name: TestTracker,
            config: {
                ready: function() {
                }   
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el === null, 'Code injected, but should not have been');
});