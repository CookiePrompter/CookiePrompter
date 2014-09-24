﻿/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />


function cleanup(){
    var existingPrompts = document.getElementsByClassName('eksCookieContainer');
    if(existingPrompts.length>0){
        for(var i=0;i<existingPrompts.length;i++)
            {
                if(existingPrompts[i])
                    existingPrompts[i].parentNode.removeChild(existingPrompts[i]);

            };
    }
}



module('CookiePrompter tests',{
    setup:function(){
        CookiePrompter.init({enableLog:false}); // reset defaults
        cleanup();
    },
    teardown: function(){
        CookieMgr.eraseCookie('cookieOptOut');
        CookiePrompter.init({enableLog:false}); // reset defaults
        cleanup();
    }
});

test('Init can run', function() {
    CookiePrompter.init({});
    notEqual(null, document);
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

test('will show cookieprompt if no cookies present',function(){
    CookiePrompter.init({});
    var cookiePrompt = document.getElementById('eksCookiePrompt');
    ok(cookiePrompt,'CookiePrompt was not rendered');    
});


test('Will show OK button if given in config',function(){
    CookiePrompter.init({showOKbutton: true});
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    ok(okbtns.length===1,'No ok button was rendered');
});

test('Will not show OK button when told not to',function(){
    CookiePrompter.init({showOKbutton: false});
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    ok(okbtns.length===0,'Ok button was rendered, shouldnt be');
});

test('Will not show OK button by default',function(){
    CookiePrompter.init({});
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    ok(okbtns.length===0,'Ok button was rendered, shouldnt be');
});


test('Default text on OK btn will be OK',function(){
    CookiePrompter.init({showOKbutton:true});
    var btn = document.getElementsByClassName('cpAcceptBtn')[0];
    ok(btn.innerText==='OK','Text on OK button not OK. Literally.');
});

test('Supplied text for OK btn will be used',function(){
    CookiePrompter.init({showOKbutton:true,textOKbutton:'yeah!'});
    var btn = document.getElementsByClassName('cpAcceptBtn')[0];
    ok(btn.innerText==='yeah!','Text on OK button was not taken from config, was "'+btn.innerText+'"');
});

test('Will not show explicitAccept buttons when not activated',function(){
    CookiePrompter.init({});
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    var nobtns= document.getElementsByClassName('cpDontAcceptBtn');
    ok(okbtns.length===0 && nobtns.length===0,'Explicit accept buttons were rendered, shouldnt be');
});

test('Will show explicitAccept buttons when explicitAccept is set to true',function(){
    CookiePrompter.init({explicitAccept:true});
    var okbtns = document.getElementsByClassName('cpAcceptBtn');
    var nobtns= document.getElementsByClassName('cpDontAcceptBtn');
    ok(okbtns.length===1 && nobtns.length===1,'Explicit accept buttons were not rendered');
});