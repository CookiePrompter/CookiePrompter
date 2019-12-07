var GoogleAnalyticsUniversalTracker = (function () {
  "use strict";
  var cookieMgr = CookieMgr,
    loadAsync = true,
    account,
    params = [],
    fakeAnalytics,
    enableLog = true;

  var log = function (msg) {
    if (window.console && enableLog) {
      console.log(msg);
    }
  };

  var eraseCookie = function () {
    // known google analytics cookies
    cookieMgr.eraseCookie('_ga');
  };

  var callSetupCode = function () {
    /* jshint ignore:start */
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)

    })(window, document, 'script', fakeAnalytics || '//www.google-analytics.com/analytics.js', 'ga');
    /* jshint ignore:end */

  };

  var injectCode = function (injectCfg) {
    log('injectCfg:');
    log(injectCfg);
    if (account) {
      log('inserting Google Analytics tracking code');

      callSetupCode();

      var gaCfg = {};
      for (var i = 0; i < params.length; i++) {
        gaCfg[params[i][0]] = params[i][1];
      }

      // make sure that we set the cookieDomain
      if (typeof gaCfg.cookieDomain === 'undefined') {
        gaCfg.cookieDomain = "auto";
      }


      ga('create', account, gaCfg);
      ga('send', 'pageview');
    }
  };

  var setAsyncOnScript = function (ga, injectCfg) {};

  var init = function (cfg) {
    loadAsync = cfg.async || true;
    params = cfg.params || [];
    account = cfg.account;
    fakeAnalytics = cfg.fakeAnalytics;
    // if there is a ready() function on the configuration, this will be called.
    if (cfg.ready && typeof cfg.ready === 'function') {
      cfg.ready({
        loadAsync: loadAsync,
        params: params,
        account: account
      });
    }
  };

  return {
    init: init,
    eraseCookie: eraseCookie,
    injectCode: injectCode
  };
})();