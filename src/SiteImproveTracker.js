

var SiteImproveTracker = (function () {
    var scriptLocation, 
        enableLog=false;

    var log = function (msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };
    var cookieMgr = CookieMgr;
    var injectCode = function () {
        if (typeof scriptLocation == 'string') {
            log('inserting SiteImprove tracking code');
            var script = document.createElement('script');
            script.src = scriptLocation;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };
    var eraseCookie = function () {
        log('deleting SiteImprove cookie');
        cookieMgr.eraseCookie('nmstat');
    };

    var init = function(cfg) {
        scriptLocation = cfg.scriptLocation;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({scriptLocation:scriptLocation});
        }
    };

    return { init:init,injectCode: injectCode, eraseCookie: eraseCookie };
})();