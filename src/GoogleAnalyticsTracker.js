var GoogleAnalyticsTracker = (function () {
    "use strict";
    var cookieMgr = CookieMgr,
        loadAsync = true,
        account,
        params = [],
        fakeAnalytics,
        enableLog = false;

    var log = function (msg) {
        if (window.console && enableLog) {
            console.log(msg);
        }
    };

    var eraseCookie = function () {
        // known google analytics cookies
        cookieMgr.eraseCookie('__utma');
        cookieMgr.eraseCookie('__utmb');
        cookieMgr.eraseCookie('__utmc');
        cookieMgr.eraseCookie('__utmz');
    };

    var injectCode = function (injectCfg) {
        log('injectCfg:');
        log(injectCfg);
        if (account) {
            log('inserting Google Analytics tracking code');
            window._gaq = window._gaq || [];
            window._gaq.push(['_setAccount', account]);
            window._gaq.push(['_trackPageview']);
            for (var i = 0; i < params.length; i++) {
                window._gaq.push(params[i]);
            }

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                setAsyncOnScript(ga, injectCfg);
                if (fakeAnalytics === true) {
                    ga.src = '/scripts/FakeAnalytics.js';
                } else {
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
                        'http://www') + '.google-analytics.com/ga.js';
                }
                log('async property on script: ' + ga.async);
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }
    };

    var setAsyncOnScript = function (ga, injectCfg) {
        // if injectCode is called with a cfg object where async is set, use that. Otherwise fallback
        if (injectCfg && typeof (injectCfg.async) !== 'undefined') {
            log('setting async attribute from injectCfg');
            if (injectCfg.async === true) {
                log('it was true');
                ga.async = injectCfg.async;
            } else {
                ga.async = undefined;
            }
        } else {
            log('setting default async attribute');
            if (loadAsync === true) {
                ga.async = loadAsync;
            } else {
                ga.async = undefined;
            }
        }
    };

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
                account: account,
                fakeAnalytics: fakeAnalytics
            });
        }
    };

    return {
        init: init,
        eraseCookie: eraseCookie,
        injectCode: injectCode
    };
})();