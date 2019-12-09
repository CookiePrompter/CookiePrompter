/* jshint -W053 */
var GemiusTracker = (function () {
    "use strict";

    var scriptLocation, gemiusAccount, loadAsync = false,
        enableLog = false;

    var log = function (msg) {
        if (window.console && enableLog) {
            console.log(msg);
        }
    };
    var injectCode = function (injectCfg) {
        if (gemiusAccount && scriptLocation !== '') {
            log('inserting Geminus tracking code');
            window.pp_gemius_identifier = new String(gemiusAccount);
            var script = document.createElement('script');
            script.src = scriptLocation;
            setAsyncOnScript(script, injectCfg);
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };

    var eraseCookie = function () {
        // user should be redirected to http://optout.hit.gemius.pl/removeDK.php
    };

    var init = function (cfg) {
        scriptLocation = cfg.scriptLocation;
        gemiusAccount = cfg.gemiusAccount;
        loadAsync = cfg.async || true;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({
                scriptLocation: scriptLocation,
                gemiusAccount: gemiusAccount
            });
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


    return {
        init: init,
        injectCode: injectCode,
        eraseCookie: eraseCookie
    };
})();