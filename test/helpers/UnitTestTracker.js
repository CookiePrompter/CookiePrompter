var UnitTestTracker = (function() {
    "use strict";
    var enableLog = false;
    var injectCodeCallback;
    var log = function(msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };
    var init = function (cfg) {
        log('initializing TestTracker');
        log(cfg);
        injectCodeCallback=cfg.injectCodeCallback;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready();
        }
    },
    injectCode= function(cfg) {
        log('injecting UnitTestTracker code');
        var testTag = document.createElement('h1');
        testTag.className = 'testheader';
        testTag.innerText = 'Overskrift';
        testTag.id = 'h1header';
        var qunitfixture = document.getElementById('qunit-fixture');
        qunitfixture.insertBefore(testTag,qunitfixture.childNodes[0]);
        if(typeof injectCodeCallback==='function'){injectCodeCallback(cfg)};
    },
    eraseCookie= function() {
        var el = document.getElementById("h1header");
        if (el) {
            el.parentNode.removeChild(el);
        }
    };
    return { init: init,injectCode:injectCode,eraseCookie:eraseCookie };
})();