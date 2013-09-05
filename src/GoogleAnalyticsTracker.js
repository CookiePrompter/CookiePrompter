var GoogleAnalyticsTracker = (function() {
    "use strict";
    var cookieMgr = CookieMgr,
        loadAsync=false,
        account,
        params=[],
        fakeAnalytics;

    var log = function (msg) {
        if (window.console) {
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
                // if injectCode is called with a cfg object where async is set, use that. Otherwise fallback
                ga.async = injectCfg && injectCfg.async ? injectCfg.async : loadAsync; 
                if (fakeAnalytics === true) {
                    ga.src = '/scripts/FakeAnalytics.js';
                } else {
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
                        'http://www') + '.google-analytics.com/ga.js';
                }
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }
    };

    var init = function(cfg) {
        loadAsync = cfg.async || true;
        params = cfg.params || [];
        account = cfg.account;
        fakeAnalytics = cfg.fakeAnalytics;
        // if there is a ready() function on the configuration, this will be called.
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({ loadAsync:loadAsync,params:params,account:account,fakeAnalytics:fakeAnalytics});
        }
    };

    return {init:init,eraseCookie:eraseCookie, injectCode:injectCode};
})();