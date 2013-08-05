
var GemiusTracker = (function () {
    var log = function (msg) {
        if (window.console) {
            console.log(msg);
        }
    };
    var injectCode = function (scriptLocation, gemiusAccount) {
        if (gemiusAccount && scriptLocation !== '') {
            log('inserting Geminus tracking code');
            window.pp_gemius_identifier = new String(gemiusAccount);
            var script = document.createElement('script');
            script.src = scriptLocation;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }
    };
    return { injectCode: injectCode };
})();