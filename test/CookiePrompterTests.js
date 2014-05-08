/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('CookiePrompter tests',{
    setup:function(){
        var existingPrompts = document.getElementsByClassName('eksCookieContainer');
        if(existingPrompts.length>0){
            for(var i=0;i<existingPrompts.length;i++)
                {
                    if(existingPrompts[i])
                        existingPrompts[i].parentNode.removeChild(existingPrompts[i]);

                };
        }
        CookiePrompter.init({enableLog:false}); // reset defaults
    },
    teardown: function(){
        CookieMgr.eraseCookie('cookieOptOut');
        CookiePrompter.init({enableLog:false}); // reset defaults
    }
});

test('Init can run', function() {
    CookiePrompter.init({});
    notEqual(null, Document);
});


test('OnOptOut callback can be null',function(){
    expect(2);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
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
            name: UnitTestTracker,
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
            name: UnitTestTracker,
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
            name: UnitTestTracker,
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

test('UnitTestTracker is initialized', function () {
    expect(1);
    CookiePrompter.init({
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                    ok(true, 'tracker inialized');
                }
            }
        }]
    });
});

test('UnitTestTracker will not inject if first visit', function() {
    CookiePrompter.init({
        referrerHandler: OtherDomainReferrerHandler,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el === null, 'Code injected, but should not have been');
});


test("Implicit accept, no cookies and referer from same domain will set cookie",function(){
    expect(1);

    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                ok(true,"Expected cookie to be created");
            },
            readCookie:function(){
            }
    };
    })();

    CookiePrompter.init({
        cookieMgr:fakeCookieMgr,
        referrerHandler: SameDomainReferrerHandler,
    });
});

test("Cookie will use provided expirydays when overridden",function(){
    expect(1);

    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                ok(days===45,"ExpiryDays not correctly provided");
            },
            readCookie:function(){
                return null;
            }
        };
    })();

    CookiePrompter.init({
        enableLog:false,
        expiryDays:45,
        cookieMgr:fakeCookieMgr,
        referrerHandler: SameDomainReferrerHandler,
    });
});


test('UnitTestTracker will inject code if referrer from same domain', function() {
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        enableLog:false,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el, 'Code not injected, but should have been');
});

test('Finding OK cookie will result in code injection', function() {
    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                throw "Should not create cookie, when it exists";
            },
            readCookie:function(){
                return "y";
            }
        };
    })();
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        cookieMgr: fakeCookieMgr,
        enableLog:false,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el, 'OK cookie set, but code not injected');
});

test('Finding OK cookie will result in code injection', function() {
    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                throw "Should not create cookie, when it exists";
            },
            readCookie:function(){
                return "n";
            }
        };
    })();
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        cookieMgr: fakeCookieMgr,
        enableLog:false,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function() {
                }
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el===null, 'NO cookie set, but tracker injected code anyway');
});

test('Explicit consent will be respected even if from same domain', function() {
    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        explicitAccept: true,
        trackers: [{
            name: UnitTestTracker,
            config: {
                ready: function() {

                }   
            }
        }]
    });
    var el = document.getElementById('h1header');
    ok(el === null, 'Code injected, but should not have been');
});


test('CookiePrompter.cookiesAllowed will ask CookieMgr if OK cookie has been set',function(){
    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                throw "Should not create cookie, when it exists";
            },
            readCookie:function(){
                return "y";
            }
        };
    })();

    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        cookieMgr: fakeCookieMgr,
    });

    equal(true,CookiePrompter.cookiesAllowed());
});

test('CookiePrompter.cookiesAllowed will return false if disallow cookie has been set',function(){
    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                throw "Should not create cookie, when it exists";
            },
            readCookie:function(){
                return "n";
            }
        };
    })();

    CookiePrompter.init({
        referrerHandler: SameDomainReferrerHandler,
        cookieMgr: fakeCookieMgr,
    });

    equal(false,CookiePrompter.cookiesAllowed());
});

test('CookiePrompter.cookiesAllowed will return "unset" no cookie has been set',function(){
    var fakeCookieMgr = (function(){
        return{
            createCookie:function(name,value,days){
                throw "Should not create cookie, when it exists";
            },
            readCookie:function(){
                return null;
            }
        };
    })();

    CookiePrompter.init({
        cookieMgr: fakeCookieMgr
    });

    equal(CookiePrompter.cookiesAllowed(),"unset");
});
