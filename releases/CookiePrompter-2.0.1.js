var CookieMgr = (function () {
    var enableLog = false;
    var log = function(msg){
        if(enableLog && window.console){
            console.log(msg);
        }
    };

    var createCookie = function (name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }

        if (value === '') {
            // deleting cookies from www-domain, if set
            document.cookie = name + "=" + value + expires + ";domain=" + window.location.hostname + "; path=/";
        }

        var domain = window.location.hostname.replace('www.', '');
        
        if (domain === 'localhost') {
            document.cookie = name + "=" + value + expires + "; path=/";
        } else {
            document.cookie = name + "=" + value + expires + ";domain=" + domain + "; path=/";
        }
    },
        readCookie = function (name) {
            var nameEq = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
            }
            return null;
        },
        eraseCookie = function (name) {
            log('erasing cookie: ' + name);
            createCookie(name, "", -1);
        };
    return { createCookie: createCookie, readCookie: readCookie, eraseCookie: eraseCookie };
})();

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
var GemiusTracker = (function () {
    "use strict";

    var scriptLocation,gemiusAccount,loadAsync=false,enableLog=false;

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
            setAsyncOnScript(script,injectCfg);
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
        loadAsync = cfg.async || true;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({scriptLocation:scriptLocation,gemiusAccount:gemiusAccount});
        }
    };


    var setAsyncOnScript = function(ga,injectCfg){
        // if injectCode is called with a cfg object where async is set, use that. Otherwise fallback
        if(injectCfg && typeof(injectCfg.async)!=='undefined'){
            log('setting async attribute from injectCfg');
            if(injectCfg.async===true){
                log('it was true');
                ga.async = injectCfg.async ; 
            }else{
                ga.async = undefined;
            }
        }else{
            log('setting default async attribute');
            if(loadAsync === true){
                ga.async = loadAsync ; 
            }else{
                ga.async = undefined;
            }
        }
    };


    return { init:init, injectCode: injectCode,eraseCookie:eraseCookie };
})();
var NetMinersTracker = (function () {
    "use strict";
    var netminersAccount,scriptLocation,enableLog = false;
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
var GoogleAnalyticsTracker = (function() {
    "use strict";
    var cookieMgr = CookieMgr,
        loadAsync=true,
        account,
        params=[],
        fakeAnalytics,
        enableLog = false;

    var log = function (msg) {
        if (window.console && enableLog) {
            console.log(msg);
        }
    };

    var eraseCookie = function () {
        // known google analytics cookies
        cookieMgr.eraseCookie('__utma');
        cookieMgr.eraseCookie('__utmb');
        cookieMgr.eraseCookie('__utmc');
        cookieMgr.eraseCookie('__utmz');
    };

    var injectCode = function (injectCfg) {
        log('injectCfg:');
        log(injectCfg);
        if (account) {
            log('inserting Google Analytics tracking code');
            window._gaq = window._gaq || [];
            window._gaq.push(['_setAccount', account]);
            window._gaq.push(['_trackPageview']);
            for (var i = 0; i < params.length; i++) {
                window._gaq.push(params[i]);
            }

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                setAsyncOnScript(ga,injectCfg);
                if (fakeAnalytics === true) {
                    ga.src = '/scripts/FakeAnalytics.js';
                } else {
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
                        'http://www') + '.google-analytics.com/ga.js';
                }
                log('async property on script: '+ga.async);
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }
    };

    var setAsyncOnScript = function(ga,injectCfg){
        // if injectCode is called with a cfg object where async is set, use that. Otherwise fallback
        if(injectCfg && typeof(injectCfg.async)!=='undefined'){
            log('setting async attribute from injectCfg');
            if(injectCfg.async===true){
                log('it was true');
                ga.async = injectCfg.async ; 
            }else{
                ga.async = undefined;
            }
        }else{
            log('setting default async attribute');
            if(loadAsync === true){
                ga.async = loadAsync ; 
            }else{
                ga.async = undefined;
            }
        }
    };

    var init = function(cfg) {
        loadAsync = cfg.async || true;
        params = cfg.params || [];
        account = cfg.account;
        fakeAnalytics = cfg.fakeAnalytics;
        // if there is a ready() function on the configuration, this will be called.
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({ loadAsync:loadAsync,params:params,account:account,fakeAnalytics:fakeAnalytics});
        }
    };

    return {init:init,eraseCookie:eraseCookie, injectCode:injectCode};
})();
var SiteImproveTracker = (function () {
    "use strict";
    var scriptLocation, 
        enableLog=false,
        cookieMgr = CookieMgr;

    var log = function (msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };

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
// Add a getElementsByClassName function if the browser doesn't have one
// Limitation: only works with one class name
// Copyright: Eike Send http://eike.se/nd
// License: MIT License
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(search) {
    var d = document, elements, pattern, i, results = [];
    if (d.querySelectorAll) { // IE8
      return d.querySelectorAll("." + search);
    }
    if (d.evaluate) { // IE6, IE7
      pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
      elements = d.evaluate(pattern, d, null, 0, null);
      while ((i = elements.iterateNext())) {
        results.push(i);
      }
    } else {
      elements = d.getElementsByTagName("*");
      pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
      for (i = 0; i < elements.length; i++) {
        if ( pattern.test(elements[i].className) ) {
          results.push(elements[i]);
        }
      }
    }
    return results;
  };
}
var CookiePrompter = (function () {
    "use strict";
    var NO_TRACK_VAL = 'n',
        OK_TRACK_VAL = 'y',
        TRACKING_COOKIE = 'cookieOptOut',
        cookieMgr = CookieMgr,
        trackers =[],
        config={},
        defaults = { // will be copied into config on init
            explicitAccept: false,
            trackLandingPage: false,
            readMoreUrl: '/',
            textHeader: 'Vi samler statistik ved hjælp af cookies',
            textblock1: 'Vi begynder dog først, når du klikker dig videre til næste side. Du kan sige ',
            textblock2: '. Vi bruger en cookie, for at huske dit Nej. Ønsker du helt at undgå cookies, skal du slå cookies fra i din browser. Du skal dog være opmærksom på, at hvis du slår cookies fra, kan du ikke logge på eller bruge andre funktioner, som forudsætter, at hjemmesiden kan huske dine valg.',
            textNoThanks: 'Nej tak til statistik ved at klikke her',
            textReadMore: 'Læs mere om cookies her',
            textAccept: 'Accepter cookies',
            textDontAccept: 'Accepter ikke Cookies',
            styling: {
                'inlinestyle': 'border-bottom:2px solid #000;padding: 12px 20px 0 20px;margin-bottom:12px;',
                'inlinestyleInner': 'max-width:960px;margin-left:auto;margin-right:auto;'
            },
            enableLog: false,
            cameFromSameDomain: function(doc){
                if(doc.referrer === null || typeof doc.referrer === 'undefined' ){return;}
                var indexAfterProtocolAndHostName = doc.referrer.indexOf('/',doc.referrer.indexOf('//')+2);
                var indexOfHostName = doc.referrer.indexOf(doc.location.host);
                if(indexOfHostName===-1 || indexOfHostName>indexAfterProtocolAndHostName){
                    return false;
                }else{
                    return true;
                }
            },
            onOptOut: function(pageHref){
                log('opting out from page: '+pageHref);
            },
            onReady: function(cfg){}
        };

    var log = function (msg) {
        if (config.enableLog && window.console) {
            console.log(msg);
        }
    };

    var removePrompt = function () {
        var el = document.getElementById("eksCookiePrompt");
        if (el) {
            el.parentNode.removeChild(el);
        }
    };

    var setNoTrackingCookie = function () {
        cookieMgr.eraseCookie(TRACKING_COOKIE);
        cookieMgr.createCookie(TRACKING_COOKIE, NO_TRACK_VAL, 30);
    };
    
    var acceptBtnClick = function(){
        cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, 30);
        insertTrackingCode();
        removePrompt();
        return false;
    };

    var eraseCookiesAndRemovePrompt = function(){
        removeCookies();
        removePrompt();
        if(config.onOptOut && typeof(config.onOptOut)==='function'){
            log('firing onOptOut callback');
            config.onOptOut(window.location.href);
        }
        return false;
    };

    var bindAcceptCookiesBtn = function(){
        var acceptbtns = document.getElementsByClassName('cpAcceptBtn');
        for (var i = acceptbtns.length - 1; i >= 0; i--) {
            var btn = acceptbtns[i];
            btn.onclick = acceptBtnClick;
        }
    };

    var bindDontAcceptCookiesBtn = function(){
      var dontAcceptBtns = document.getElementsByClassName('cpDontAcceptBtn');
        for (var i = dontAcceptBtns.length - 1; i >= 0; i--) {
            var btn = dontAcceptBtns[i];
            btn.onclick = eraseCookiesAndRemovePrompt;
        }
    };

    var hookupExplicitBtns = function(){
        bindAcceptCookiesBtn();
        bindDontAcceptCookiesBtn();
    };

    var renderCookieprompt = function () {
        removePrompt();

        var html = [];
        if (config.styling.cssclass) {
            html.push('<div class="' + config.styling.cssclass + '" id="eksCookiePrompt">');
            html.push('<div id="eksCookiePromptInner">');
        } else {
            html.push('<div style="' + config.styling.inlinestyle + '" id="eksCookiePrompt">');
            html.push('<div id="eksCookiePromptInner" style="' + config.styling.inlinestyleInner + '">');
        }
        html.push('<strong>' + config.textHeader + '</strong>');
        html.push('<p>' + config.textblock1);
        html.push('<a href="#" id="eksCookieNo">' + config.textNoThanks + '</a>');
        html.push(config.textblock2 + '</p>');

        if (config.readMoreUrl && document.location.hash !== '#cookieprompt') {
            html.push('<p><a href="' + config.readMoreUrl + '#cookieprompt">' + config.textReadMore + '</a></p>');
        }
        if(config.explicitAccept){
            html.push('<div><a href="#" class="cpAcceptBtn">'+config.textAccept+'</a><a href="#" class="cpDontAcceptBtn">'+config.textDontAccept+'</a></div>');
        }
        html.push('</div></div>');
        var body = document.getElementsByTagName('body')[0];
        var block = document.createElement('div');
        block.className ='eksCookieContainer';
        block.innerHTML = html.join('');
        body.insertBefore(block, body.firstChild);
        var link = document.getElementById('eksCookieNo');
        if (link) {
            link.onclick = eraseCookiesAndRemovePrompt;
        }

        hookupExplicitBtns();
    };

    var insertTrackingCode = function (cfg) {
        log('inserting tracking code');
        for (var i = 0; i < trackers.length; i++) {
            var t = trackers[i];
            log(t);
            t.injectCode(cfg);
        }
    };

    var init = function (opts) {
        if (opts.trackers) {
            for (var i = 0; i < opts.trackers.length; i++) {
                var tracker = opts.trackers[i].name;
                log(tracker);
                var trackerConfig =opts.trackers[i].config;
                tracker.init(trackerConfig);
                trackers.push(tracker); 
            }
        }

        // merge defaults into config
        for (var k in defaults) {
            config[k] = defaults[k]; 
        }

        // merge supplied overrides into config
        for (var j in opts) {
            config[j] = opts[j]; 
        }

        // read more page
        if (document.location.hash === '#cookieprompt') {
            renderCookieprompt();
            return;
        }

        // check for cookie
        var cookie = cookieMgr.readCookie(TRACKING_COOKIE);

        if (cookie === NO_TRACK_VAL) {
            log('a) disabletracking cookie found. Not tracking');
        } else {
            if (cookie === OK_TRACK_VAL) {
                log(' b) ok cookie found, tracking accepted, we are tracking');
                insertTrackingCode();
            } else {
                if(config.explicitAccept===true){
                    renderCookieprompt();
                }else{
                    if (config.cameFromSameDomain(document)) {
                        log(" c) referrer found from same domain, setting cookie and tracking");
                        cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, 30);
                        insertTrackingCode();
                    } else {
                        log(" d) first time, let's ask");
                        renderCookieprompt();
                    }
                    if (config.trackLandingPage) {
                        window.onbeforeunload = function () {
                            log('landing page tracking..');
                            if (cookieMgr.readCookie(TRACKING_COOKIE) === NO_TRACK_VAL) {
                                log('anticookie, lets skip');
                            } else {
                                cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, 30);
                                log('no anticookie set, lets track, but disable async to wait for script load before moving on');
                                insertTrackingCode({async:false});
                            }
                        };
                    }
                }
            }
        }
        config.onReady(config);
    };

    var removeCookies = function () {
        log('deleting cookies');
        for (var i = 0; i < trackers.length; i++) {
            trackers[i].eraseCookie();
        }

        setNoTrackingCookie();
    };

    return { init: init, removeCookies: removeCookies,removePrompt:removePrompt,eraseCookiesAndRemovePrompt:eraseCookiesAndRemovePrompt };
})();