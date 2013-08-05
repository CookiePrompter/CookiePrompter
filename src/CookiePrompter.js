﻿

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
            enableLog: false
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