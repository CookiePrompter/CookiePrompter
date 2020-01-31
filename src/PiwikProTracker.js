var PiwikProTracker = (function () {
    "use strict";
    var cookieMgr = CookieMgr,
        loadAsync = true,
        account,
        piwikProPath,
        params = [],
        fakeAnalytics,
        enableLog = true;

    var log = function (msg) {
        if (window.console && enableLog) {
            console.log(msg);
        }
    };

    var eraseCookie = function () {
        log('erasing cookies in piwikpro tracker');
        // known piwik pro cookies
        cookieMgr.eraseCookie('_pk_id.' + account + '.1fff');
        cookieMgr.eraseCookie('_pk_ses.' + account + '.1fff');
        cookieMgr.eraseCookie('stg_last_interaction');
        cookieMgr.eraseCookie('stg_returning_visitor');
        cookieMgr.eraseCookie('stg_traffic_source_priority');
        cookieMgr.eraseCookie('PIWIK_SESSID');
        cookieMgr.eraseCookie('piwik_auth');
        cookieMgr.eraseCookie('_pk_cvar');
        cookieMgr.eraseCookie('stg_popup');
        cookieMgr.eraseCookie('stg_utm_campaign');
        cookieMgr.eraseCookie('stg_externalReferrer');
        cookieMgr.eraseCookie('stg_content');
    };

    var callSetupCode = function (accountPath, accountId) {
        /* jshint ignore:start */
        (function (window, document, dataLayerName, id) {
            window[dataLayerName] = window[dataLayerName] || [], window[dataLayerName].push({
                start: (new Date).getTime(),
                event: "stg.start"
            });
            var scripts = document.getElementsByTagName('script')[0],
                tags = document.createElement('script');

            function stgCreateCookie(a, b, c) {
                var d = "";
                if (c) {
                    var e = new Date;
                    e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3), d = "; expires=" + e.toUTCString()
                }
                document.cookie = a + "=" + b + d + "; path=/"
            }
            var isStgDebug = (window.location.href.match("stg_debug") || document.cookie.match("stg_debug")) && !window.location.href.match("stg_disable_debug");
            stgCreateCookie("stg_debug", isStgDebug ? 1 : "", isStgDebug ? 14 : -1);
            var qP = [];
            dataLayerName !== "dataLayer" && qP.push("data_layer_name=" + dataLayerName), isStgDebug && qP.push("stg_debug");
            var qPString = qP.length > 0 ? ("?" + qP.join("&")) : "";
            tags.async = !0, tags.src = "//"+accountPath+"/" + id + ".js" + qPString, scripts.parentNode.insertBefore(tags, scripts);
            ! function (a, n, i) {
                a[n] = a[n] || {};
                for (var c = 0; c < i.length; c++) ! function (i) {
                    a[n][i] = a[n][i] || {}, a[n][i].api = a[n][i].api || function () {
                        var a = [].slice.call(arguments, 0);
                        "string" == typeof a[0] && window[dataLayerName].push({
                            event: n + "." + i + ":" + a[0],
                            parameters: [].slice.call(arguments, 1)
                        })
                    }
                }(i[c])
            }(window, "ppms", ["tm", "cm"]);
        })(window, document, 'dataLayer', accountId);

        /* jshint ignore:end */
    };

    var injectCode = function (injectCfg) {
        if (account) {
            log('inserting Piwik Pro tracking code',piwikProPath,account);
            callSetupCode(piwikProPath, account);
        }
    };

    var setAsyncOnScript = function (ga, injectCfg) {};

    var init = function (cfg) {
        loadAsync = cfg.async || true;
        params = cfg.params || [];
        account = cfg.account;
        piwikProPath = cfg.piwikProPath;
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