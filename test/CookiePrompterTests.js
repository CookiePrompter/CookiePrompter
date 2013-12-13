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
        cameFromSameDomain: function(doc) { return false; },
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
        cameFromSameDomain: function(doc) { return true; },
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


test('CameFromSameDomain will return true when domain is referrer',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    expect(1);
        CookiePrompter.init({
        onReady: function(cfg){
            var doc = {};
            doc.referrer = 'http://mydomain.dk/testuri';
            doc.location = {};
            doc.location.host = 'mydomain.dk';
            ok(cfg.cameFromSameDomain(doc));
        }
    });
});

test('CameFromSameDomain will return false on empty referrer',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    expect(1);
        CookiePrompter.init({
        onReady: function(cfg){
            var doc = {};
            doc.referrer = '';
            doc.location = {};
            doc.location.host = 'mydomain.dk';
            ok(!cfg.cameFromSameDomain(doc));
        }
    });
});

test('CameFromSameDomain will return false on undefined referrer',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    expect(1);
        CookiePrompter.init({
        onReady: function(cfg){
            var doc = {};
            doc.location = {};
            doc.location.host = 'mydomain.dk';
            ok(!cfg.cameFromSameDomain(doc));
        }
    });
});

test('CameFromSameDomain will return false when referrer is other plain domain',function(){
    expect(1);
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
        CookiePrompter.init({
        onReady: function(cfg){
            var doc = {};
            doc.referrer = 'http://otherdomain.dk/testuri';
                doc.location = {};
            doc.location.host = 'mydomain.dk';
            ok(!cfg.cameFromSameDomain(doc));
        }
    });
});

test('CameFromSameDomain will return false when domain is in querystring',function(){
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    expect(1);
        CookiePrompter.init({
        onReady: function(cfg){
            var doc = {};
            doc.referrer = 'http://www.google.dk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&sqi=2&ved=0CC0QFjAA&url=http%3A%2F%2Ferhvervsstyrelsen.dk%2F&ei=3hSrUrCBG83bsgbV-YH4BQ&usg=AFQjCNFoH1Gphl01QyAn3HXqe-_pqNhFHQ&bvm=bv.57967247,d.Yms';
            doc.location = {};
            doc.location.host = 'erhvervsstyrelsen.dk';
            ok(!cfg.cameFromSameDomain(doc));
        }
    });
});




test('Explicit consent will be respected even if from same domain', function() {
    CookiePrompter.removeCookies();
    CookieMgr.eraseCookie('cookieOptOut');
    CookiePrompter.init({
        cameFromSameDomain: function(doc) { return true; },
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