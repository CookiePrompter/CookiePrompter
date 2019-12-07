/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="resources/qunit.js" />

module('CookieMgr tests', {
    setup: function () {},
    teardown: function () {}
});

test('readCookie will return null on empty string', function () {
    var val = CookieMgr.readCookie('');
    equal(val, null);
});;

test('readCookie will return null on null', function () {
    var val = CookieMgr.readCookie();
    equal(val, null);
});

test('createCookie will create cookie', function () {
    CookieMgr.createCookie('asdf', 'testval', 20);
    var saved = CookieMgr.readCookie('asdf');
    equal(saved, 'testval');
});

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



test('www will be stripped from cookie domain', function () {
    var domain = CookieMgr.getCookieDomain('www.mydomain.com');
    equal(domain, 'mydomain.com');
});

test('when on a subdomain the subdomain will stay in cookie domain', function () {
    var domain = CookieMgr.getCookieDomain('sales.mydomain.com');
    equal(domain, 'sales.mydomain.com');
})

test('when forcingTLD on a subdomain the cookie domain will be the TLD', function () {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('sales.mydomain.com');
    equal(domain, 'mydomain.com');
})

test('when forcingTLD on multiple subdomains the cookie domain will be the TLD', function () {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('more.sales.mydomain.com');
    equal(domain, 'mydomain.com');
})


test('when forcingTLD on root domains the cookie domain will be the TLD', function () {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('mydomain.com');
    equal(domain, 'mydomain.com');
})

test('when forcingTLD on a subdomain with special chars the cookie domain will be the TLD', function () {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('sales22-monster.mydomain.com');
    equal(domain, 'mydomain.com');
})