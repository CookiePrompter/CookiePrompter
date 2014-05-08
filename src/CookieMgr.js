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
            // deleting cookies from subdomain
            document.cookie = name + "=" + value + expires + ";domain=" + window.location.hostname + "; path=/";
            // deleting cookies from rootdomain, eg .local.com
            if(window && window.location && window.location.hostname){
                document.cookie = name + "=" + value + expires + ";domain=." + window.location.hostname.match(/[^\.]*\.[^.]*$/)[0]+ "; path=/";                
            }
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
    
        //document.cookie='$nmlv=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.local.com;path=/'
    };

    return { createCookie: createCookie, readCookie: readCookie, eraseCookie: eraseCookie };
})();
