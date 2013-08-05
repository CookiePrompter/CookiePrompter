(function () {
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
        document.cookie = name + "=" + value + expires + ";domain=" + domain + "; path=/";
    };

    createCookie('nmstat', '123456789', 300);
    if (window.console) {
        console.log('Fakelogging SiteImprove');
    }
})();