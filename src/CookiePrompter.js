var CookieMgr = (function () {
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
                if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
            }
            return null;
        },
        eraseCookie = function (name) {
            console.log('erasing cookie: ' + name);
            createCookie(name, "", -1);
        };
    return { createCookie: createCookie, readCookie: readCookie, eraseCookie: eraseCookie };
})();


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

var SiteImproveTracker = (function () {
    var scriptLocation;

    var log = function (msg) {
        if (window.console) {
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

/// Adding netmindersAccount var to global scope is not pretty
var NetMinersTracker = (function () {
    var log = function (msg) {
        if (window.console) {
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


var GoogleAnalyticsTracker = (function() {
    var cookieMgr = CookieMgr,
        loadAsync=false,
        account,
        params=[],
        fakeAnalytics;

    var log = function (msg) {
        if (window.console) {
            console.log(msg);
        }
    };

    var eraseAnalyticsCookies = function () {
        // known google analytics cookies
        cookieMgr.eraseCookie('__utma');
        cookieMgr.eraseCookie('__utmb');
        cookieMgr.eraseCookie('__utmc');
        cookieMgr.eraseCookie('__utmz');
    };
    var insertGoogleAnalytics = function () {
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
                ga.async = loadAsync;
                if (fakeAnalytics === true) {
                    ga.src = '/scripts/FakeAnalytics.js';
                } else {
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
                        'http://www') + '.google-analytics.com/ga.js';
                }
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }
    };

    var init = function(cfg) {
        loadAsync = cfg.async;
        params = cfg.params || [];
        account = cfg.account;
        fakeAnalytics = cfg.fakeAnalytics;
        if (cfg.ready && typeof cfg.ready === 'function') {
            cfg.ready({ loadAsync:loadAsync,params:params,account:account,fakeAnalytics:fakeAnalytics});
        }
    };

    return {init:init,eraseCookie:eraseAnalyticsCookies, injectCode:insertGoogleAnalytics};

})();


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

var CookiePrompter = (function () {
    var NO_TRACK_VAL = 'n',
        OK_TRACK_VAL = 'y',
        TRACKING_COOKIE = 'cookieOptOut',
        cookieMgr = CookieMgr,
        trackers =[],
        config = {
            gemiusaccount: null,
            gemiusScriptLocation: null,
//            analyticsaccount: null,
//            analyticsParams: [],
            netminersScriptLocation: null,
            netminersAccount: null,
            trackLandingPage: false,
            readMoreUrl: '/',
            textHeader: 'Vi samler statistik ved hjælp af cookies',
            textblock1: 'Vi begynder dog først, når du klikker dig videre til næste side. Du kan sige ',
            textblock2: '. Vi bruger en cookie, for at huske dit Nej. Ønsker du helt at undgå cookies, skal du slå cookies fra i din browser. Du skal dog være opmærksom på, at hvis du slår cookies fra, kan du ikke logge på eller bruge andre funktioner, som forudsætter, at hjemmesiden kan huske dine valg.',
            textNoThanks: 'Nej tak til statistik ved at klikke her',
            textReadMore: 'Læs mere om cookies her',
            styling: {
                'inlinestyle': 'border-bottom:2px solid #000;padding: 12px 20px 0 20px;margin-bottom:12px;',
                'inlinestyleInner': 'max-width:960px;margin-left:auto;margin-right:auto;'
            },
            enableLog: true
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

        html.push('</div></div>');
        var body = document.getElementsByTagName('body')[0];
        var block = document.createElement('div');
        block.innerHTML = html.join('');
        body.insertBefore(block, body.firstChild);
        var link = document.getElementById('eksCookieNo');
        if (link) {
            link.onclick = function () {
  //              GoogleAnalyticsTracker.eraseCookie();
                if (config.netminersAccount) {
                    NetMinersTracker.eraseCookie(config.netminersAccount);
                }
                for (var i = 0; i < trackers.length; i++) {
                    trackers[i].eraseCookie();
                }
                setNoTrackingCookie();
                removePrompt();
            };
        }
    };

    var insertTrackingCode = function (async) {
        var asynch = async || true;

        if (config.analyticsaccount) {
            GoogleAnalyticsTracker.injectCode(asynch,config.analyticsaccount,config.analyticsParams,config.fakeAnalytics);
        }

        for (var i = 0; i < trackers.length; i++) {
            var t = trackers[i];
            log(t);
            t.injectCode();
        }

        if (config.gemiusaccount) {
            GemiusTracker.injectCode(config.gemiusScriptLocation, config.gemiusaccount);
        }
      

        if (config.netminersScriptLocation) {
            NetMinersTracker.injectCode(config.netminersScriptLocation);
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



        // merge options into config
        for (var k in opts) { config[k] = opts[k]; }

        if (document.location.hash === '#cookieprompt') {
            renderCookieprompt();
            return;
        }

        // check for cookie
        var cookie = cookieMgr.readCookie(TRACKING_COOKIE);

        // a) it's there and so we can NOT track
        if (cookie === NO_TRACK_VAL) {
            log('a) disabletracking cookie found. Not tracking');
        } else {
            if (cookie === OK_TRACK_VAL) {
                log(' b) ok cookie found, tracking accepted, we are tracking');
                insertTrackingCode();
            } else {
                if (document.referrer != null && ~document.referrer.indexOf(window.location.host)) {
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
                            log('no anticookie set, lets track');
                            insertTrackingCode(false);
                        }
                    };
                }
            }
        }
    };

    

    var removeCookies = function () {
        log('deleting cookies');
        for (var i = 0; i < trackers.length; i++) {
            trackers[i].eraseCookie();
        }

        if (config.netminersScriptLocation) {
            NetMinersTracker.eraseCookie(config.netminersAccount);
        }

        setNoTrackingCookie();

    };

    return { init: init, removeCookies: removeCookies };
})();