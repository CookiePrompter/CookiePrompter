var ReferrerHandler = (function () {
    var cameFromSameDomain = function (doc) {
        if (doc.referrer === null || typeof doc.referrer === 'undefined') {
            return;
        }
        var indexAfterProtocolAndHostName = doc.referrer.indexOf('/', doc.referrer.indexOf('//') + 2);
        var indexOfHostName = doc.referrer.indexOf(doc.location.host);
        if (indexOfHostName === -1 || indexOfHostName > indexAfterProtocolAndHostName) {
            return false;
        } else {
            return true;
        }
    };
    return {
        cameFromSameDomain: cameFromSameDomain
    };
})();