/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('CookieMgr tests', {
    setup: function() {
    },
    teardown: function() {
    }
});

test('readCookie will return null on empty string', function () {
    var val = CookieMgr.readCookie('');
    equal(val, null);
});;

test('readCookie will return null on null', function () {
    var val = CookieMgr.readCookie();
    equal(val, null);
});;


test('createCookie will create cookie', function () {
    CookieMgr.createCookie('asdf', 'testval', 20);
    var saved = CookieMgr.readCookie('asdf');
    equal(saved, 'testval');
});

//test('document cookie works',function() {
//    equal(document.cookie, '','There should not be any cookies.');
//    document.cookie='test=123';
//    equal(document.cookie, 'test=123','Expected cookie');
//});

test('eraseCookie will survive non-existing cookie', function () {
    CookieMgr.eraseCookie('test');
    expect(0);
});

test('eraseCookie will delete cookie', function () {
    CookieMgr.createCookie('asdf', 'testval', 20);
    CookieMgr.eraseCookie('asdf');
    var saved = CookieMgr.readCookie('asdf');
    equal(saved, null);
});

