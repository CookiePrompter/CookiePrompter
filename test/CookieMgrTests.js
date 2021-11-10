/// <reference path="../src/CookiePrompter.js"/>
/// <reference path="../node_modules/qunit/qunit/qunit.js" />

QUnit.module('CookieMgr tests', {
    setup: function () {
        CookieDeleter.DeleteAll();
    },
    afterEach: function () {
        CookieDeleter.DeleteAll();
    },
});

QUnit.test('readCookie will return null on empty string', function (assert) {
    var val = CookieMgr.readCookie('');
    assert.equal(val, null);
});

QUnit.test('readCookie will return null on null', function (assert) {
    var val = CookieMgr.readCookie();
    assert.equal(val, null);
});

QUnit.test('createCookie will create cookie', function (assert) {
    CookieMgr.createCookie('asdf', 'testval', 20);
    var saved = CookieMgr.readCookie('asdf');
    assert.equal(saved, 'testval',"Cookie is not set");
});

QUnit.test('eraseCookie will survive non-existing cookie', function (assert) {
    CookieMgr.eraseCookie('test');
    assert.expect(0);
});

QUnit.test('eraseCookie will delete cookie', function (assert) {
    CookieMgr.createCookie('asdf', 'testval', 20);
    CookieMgr.eraseCookie('asdf');
    var saved = CookieMgr.readCookie('asdf');
    assert.equal(saved, null);
});

QUnit.test('www will be stripped from cookie domain', function (assert) {
    var domain = CookieMgr.getCookieDomain('www.mydomain.com');
    assert.equal(domain, 'mydomain.com');
});

QUnit.test('when on a subdomain the subdomain will stay in cookie domain', function (assert) {
    var domain = CookieMgr.getCookieDomain('sales.mydomain.com');
    assert.equal(domain, 'sales.mydomain.com');
});

QUnit.test('when forcingTLD on a subdomain the cookie domain will be the TLD', function (assert) {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('sales.mydomain.com');
    assert.equal(domain, 'mydomain.com');
});

QUnit.test('when forcingTLD on multiple subdomains the cookie domain will be the TLD', function (assert) {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('more.sales.mydomain.com');
    assert.equal(domain, 'mydomain.com');
});


QUnit.test('when forcingTLD on root domains the cookie domain will be the TLD', function (assert) {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('mydomain.com');
    assert.equal(domain, 'mydomain.com');
});

QUnit.test('when forcingTLD on a subdomain with special chars the cookie domain will be the TLD', function (assert) {
    CookieMgr.init({
        setCookieOnTopLevelDomain: true
    });
    var domain = CookieMgr.getCookieDomain('sales22-monster.mydomain.com');
    assert.equal(domain, 'mydomain.com');
});