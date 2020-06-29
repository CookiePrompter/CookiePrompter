var MotomoTracker = (function () {
    "use strict";


    var cookieMgr = CookieMgr,
        trackerUrl,
        siteId,
        cookieDomain,
        enableLog = true;


    var log = function (msg) {
        if (window.console && enableLog) {
            console.log(msg);
        }
    };

    var eraseCookie = function () {
        log("Looking for Motomo cookies");

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var name = cookies[i].split("=")[0];
            var sub = name.trim().substr(0, 7);

            if (sub === "_pk_id.") {
                log("Removing _pk_id cookie");
                cookieMgr.eraseCookie(name);
                continue;
            }

            if (sub === "_pk_ses") {
                log("Removing _pk_session cookie");
                cookieMgr.eraseCookie(name);
                continue;
            }

            if (name === "MATOMO_SESSID") {
                log("Removing MATOMO_SESSID cookie");
                cookieMgr.eraseCookie(name);
                continue;
            }
        }

    };

    var injectCode = function (injectCfg) {
        log("Inserting Motomo tracking code");
        window._paq = [];

        // Set options
        window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        window._paq.push(["setCookieDomain", cookieDomain]);
        window._paq.push(["setDomains", [cookieDomain]]);

        if (trackerUrl.substr(-1) !== "/") {
            trackerUrl = trackerUrl + "/";
        }

        window._paq.push(['setSiteId', siteId]);
        window._paq.push(['setTrackerUrl', trackerUrl + 'matomo.php']);
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = trackerUrl + 'matomo.js'; s.parentNode.insertBefore(g, s);
    };

    var init = function (cfg) {

        trackerUrl = cfg.trackerUrl;
        siteId = cfg.siteId;
        cookieDomain = cfg.domain != "" ? cfg.domain : "*." + window.location.hostname;

    };

    return {
        init: init,
        eraseCookie: eraseCookie,
        injectCode: injectCode
    };

})();