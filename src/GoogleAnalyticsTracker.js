

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

    var eraseAnalyticsCookies = function () {
        // known google analytics cookies
        cookieMgr.eraseCookie('__utma');
        cookieMgr.eraseCookie('__utmb');
        cookieMgr.eraseCookie('__utmc');
        cookieMgr.eraseCookie('__utmz');
    };
    var insertGoogleAnalytics = function () {
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
                ga.async = loadAsync;
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
        loadAsync = cfg.async;
        params = cfg.params || [];
        account = cfg.account;
        fakeAnalytics = cfg.fakeAnalytics;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({ loadAsync:loadAsync,params:params,account:account,fakeAnalytics:fakeAnalytics});
        }
    };

    return {init:init,eraseCookie:eraseAnalyticsCookies, injectCode:insertGoogleAnalytics};

})();

