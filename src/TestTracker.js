var TestTracker = (function() {
    "use strict";
    var enableLog = false;
    var log = function(msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };
    var init = function (cfg) {
        log('initializing TestTracker');
        log(cfg);
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready();
        }

    },
    injectCode= function() {
        var testTag = document.createElement('h1');
        testTag.className = 'testheader';
        testTag.innerText = 'Overskrift';
        testTag.id = 'h1header';
        var body = document.getElementsByTagName('body')[0];
        body.insertBefore(testTag, body.firstChild);
    },
    eraseCookie= function() {
        var el = document.getElementById("h1header");
        if (el) {
            el.parentNode.removeChild(el);
        }
    };
    return { init: init,injectCode:injectCode,eraseCookie:eraseCookie };
})();