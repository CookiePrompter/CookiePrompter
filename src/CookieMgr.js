var CookieMgr = (function () {
    var enableLog = false;
    var setCookieOnTopLevelDomain = false;
    var log = function (msg) {
        if (enableLog && window.console) {
            console.log(msg);
        }
    };

    var getCookieDomain = function (hostname) {
        // strip www
        var domain = hostname.replace('www.', '');
        log('setting cookie on toplevel domain:' + setCookieOnTopLevelDomain);
        if (setCookieOnTopLevelDomain) {
            domain = domain.replace(/[\w\d\-\.]*\.([\w\d\-]*\.\w{2,3})$/i, '$1');
        }
        return domain;
    };

    var createCookie = function (name, value, days) {
        // debugger
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

            var domain = getCookieDomain(window.location.hostname);
            log('setting cookie on ' + domain);
            if (domain === 'localhost') {
                document.cookie = name + "=" + value + expires + "; path=/"+ ";SameSite=Lax";
            } else {
                document.cookie = name + "=" + value + expires + ";domain=" + domain + "; path=/"+ ";SameSite=Lax";
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
        },
        init = function (opts) {
            log('init cookiemgr:');
            log(opts);
            setCookieOnTopLevelDomain = opts.setCookieOnTopLevelDomain;
        };

    return {
        init: init,
        createCookie: createCookie,
        readCookie: readCookie,
        eraseCookie: eraseCookie,
        getCookieDomain: getCookieDomain
    };
})();
