

var TestTracker = (function() {
    var log = function(msg) {
        if (window.console) {
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
        },
        eraseCookie= function() {
        };
    return { init: init,injectCode:injectCode,eraseCookie:eraseCookie };
})();