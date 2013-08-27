/* jshint -W053 */
var GemiusTracker = (function () {
    "use strict";

    var scriptLocation,gemiusAccount;

    var log = function (msg) {
        if (window.console) {
            console.log(msg);
        }
    };
    var injectCode = function () {
        if (gemiusAccount && scriptLocation !== '') {
            log('inserting Geminus tracking code');
            window.pp_gemius_identifier = new String(gemiusAccount);
            var script = document.createElement('script');
            script.src = scriptLocation;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };

    var eraseCookie = function(){
        // user should be redirected to http://optout.hit.gemius.pl/removeDK.php
    };

    var init = function(cfg) {
        scriptLocation = cfg.scriptLocation;
        gemiusAccount = cfg.gemiusAccount;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({scriptLocation:scriptLocation,gemiusAccount:gemiusAccount});
        }
    };

    return { init:init, injectCode: injectCode,eraseCookie:eraseCookie };
})();