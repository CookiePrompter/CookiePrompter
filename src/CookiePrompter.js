var CookiePrompter = (function () {
    "use strict";
    var NO_TRACK_VAL = 'n',
        OK_TRACK_VAL = 'y',
        TRACKING_COOKIE = 'cookieOptOut',
        trackers =[],
        config={}, // will get keys from defaults on init 
        defaults = { // will be copied into config on init
            explicitAccept: false,
            expiryDays: 365,
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
            onOptOut: function(pageHref){
                log('opting out from page: '+pageHref);
            },
            onReady: function(cfg){},
            referrerHandler: ReferrerHandler,
            cookieMgr: CookieMgr
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
        config.cookieMgr.eraseCookie(TRACKING_COOKIE);
        config.cookieMgr.createCookie(TRACKING_COOKIE, NO_TRACK_VAL, config.expiryDays);
    };
    
    var acceptBtnClick = function(){
        config.cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, config.expiryDays);
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
        log('rendering prompt');
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
        log('inserting tracking code for '+trackers.length+ ' trackers');
        for (var i = 0; i < trackers.length; i++) {
            var t = trackers[i];
            t.injectCode(cfg);
        }
    };

    var init = function (opts) {
        // merge defaults into config
        for (var k in defaults) {
            config[k] = defaults[k]; 
        }

        // merge supplied overrides into config
        for (var j in opts) {
            config[j] = opts[j]; 
        }

        log('init');

        trackers = [];
        if (opts.trackers) {
            for (var i = 0; i < opts.trackers.length; i++) {
                var tracker = opts.trackers[i].name;
                log(tracker);
                var trackerConfig =opts.trackers[i].config;
                tracker.init(trackerConfig);
                trackers.push(tracker); 
            }
        }else{
            log('no trackers added. You would probably want at least one.');
        }


        // read more page
        if (document.location.hash === '#cookieprompt') {
            renderCookieprompt();
            return;
        }

        if(config.iframeParent && config.iframeParent!==''){
            deferCookieDecisionsToParentFrame();
        }else{
            handleCookieFlowLocally();
        }
        
        listenForPromptsFromChildFrames();    

        config.onReady(config);
    };
    
    var listenForPromptsFromChildFrames = function(){
        // Cross Domain iframe PARENT logic
        // listen to childframes asking for cookie status
        CrossDomainHandler.subscribeToPostMessage(function(msg){
            // Only handle prompts from children
            if(msg.data==='prompt'){
                log(msg);
                log('child frame asking about cookie status');  
                msg.source.postMessage('cookiesAllowed:'+cookiesAllowed(),msg.origin);
            }
        });
    };

    var deferCookieDecisionsToParentFrame = function(){
        // cross domain iframe CHILD logic
        log('letting parent frame at '+config.iframeParent +' run the show');

        // listen for parent messages
        CrossDomainHandler.subscribeToPostMessage(function(msg){
            
            // if(msg.origin!==config.iframeParent){
            //     log('ignoring msg, not from valid domain. Expected '+config.iframeParent +' but was contacted by '+msg.origin);
            //     return;
            // }
            var args = msg.data.split(':');
            if(args.length<2){return;}
            log(msg);
            if(args[0]=='cookiesAllowed' && args[1]=='true'){
                // inject cookies 
                log('cookies are accepted, so lets inject them!');
                insertTrackingCode();
            }else{
                log('parent says no to cookies. ');
            }
        });

        parent.postMessage('prompt',config.iframeParent);  
    };


    var handleCookieFlowLocally = function(){
        // check for cookie
        var cookie = config.cookieMgr.readCookie(TRACKING_COOKIE);
        if (cookie === NO_TRACK_VAL) {
            log('a) disabletracking cookie found. Not tracking');
        } else {
            if (cookie === OK_TRACK_VAL) {
                log(' b) ok cookie found, tracking accepted, we are tracking');
                insertTrackingCode();
            } else {
                if(config.explicitAccept===true){
                    log('rendering prompt because explicit (no cookie)');
                    renderCookieprompt();
                }else{
                    if (config.referrerHandler.cameFromSameDomain(document)) {
                        log(" c) referrer found from same domain, setting cookie and tracking");
                        config.cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, config.expiryDays);
                        insertTrackingCode();
                    } else {
                        log(" d) first time, let's ask");
                        renderCookieprompt();
                    }
                    if (config.trackLandingPage) {
                        window.onbeforeunload = function () {
                            log('landing page tracking..');
                            if (config.cookieMgr.readCookie(TRACKING_COOKIE) === NO_TRACK_VAL) {
                                log('anticookie, lets skip');
                            } else {
                                config.cookieMgr.createCookie(TRACKING_COOKIE, OK_TRACK_VAL, config.expiryDays);
                                log('no anticookie set, lets track, but disable async to wait for script load before moving on');
                                insertTrackingCode({async:false});
                            }
                        };
                    }
                }
            }
        }

    };

    var cookiesAllowed = function(){
        var cookie = cookieMgr.readCookie(TRACKING_COOKIE);
        return cookie === OK_TRACK_VAL;
    };

    var removeCookies = function () {
        log('deleting cookies');
        for (var i = 0; i < trackers.length; i++) {
            trackers[i].eraseCookie();
        }

        setNoTrackingCookie();
    };

    return { 
        init: init, 
        removeCookies: removeCookies,
        removePrompt:removePrompt,
        eraseCookiesAndRemovePrompt:eraseCookiesAndRemovePrompt, 
        cookiesAllowed:cookiesAllowed 
    };
})();
