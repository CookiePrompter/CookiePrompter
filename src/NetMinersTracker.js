

/// Adding netmindersAccount var to global scope is not pretty
var NetMinersTracker = (function () {
    var enableLog = false;
    var log = function (msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };
    var injectCode = function (scriptLocation) {
        if (typeof scriptLocation == 'string') {
            var script = document.createElement('script');
            script.src = scriptLocation;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };
    var eraseCookie = function (netminersAccount) {
        log('erasing netminers cookie for account ' + netminersAccount);
        var script = document.createElement('script');
        script.src = document.location.protocol + '//' + netminersAccount + '.netminers.dk/tracker/removecookies.ashx?n=' + Math.random();
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
    };

    return { injectCode: injectCode, eraseCookie: eraseCookie };
})();
