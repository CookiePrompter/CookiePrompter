var NetMinersTracker = (function () {
    "use strict";
    var netminersAccount,scriptLocation,enableLog = false,cookieMgr=CookieMgr;
    var log = function (msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };
    var injectCode = function () {
        log('scriptlocation:' + scriptLocation);
        if (typeof scriptLocation == 'string') {
            var script = document.createElement('script');
            script.src = scriptLocation;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };
    var eraseCookie = function () {
        log('erasing netminers cookie for account ' + netminersAccount);
        var script = document.createElement('script');
        script.src = document.location.protocol + '//' + netminersAccount + '.netminers.dk/tracker/removecookies.ashx?n=' + Math.random();
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);

        cookieMgr.eraseCookie('$nmuid');
        cookieMgr.eraseCookie('$nmlv');
        cookieMgr.eraseCookie('$nmsid');
        cookieMgr.eraseCookie('$nmvc');
        cookieMgr.eraseCookie('vat_$netminers');

    };

    var init = function(cfg){
        netminersAccount = cfg.netminersAccount;
        scriptLocation = cfg.scriptLocation;

        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({scriptLocation:scriptLocation,netminersAccount:netminersAccount});
        }

    };

    return { init:init,injectCode: injectCode, eraseCookie: eraseCookie };
})();