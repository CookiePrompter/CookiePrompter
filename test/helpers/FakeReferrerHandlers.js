var SameDomainReferrerHandler = (function () {
    return {
        cameFromSameDomain: function (doc) {
            return true;
        }
    };
})();


var OtherDomainReferrerHandler = (function () {
    return {
        cameFromSameDomain: function (doc) {
            return false;
        }
    };
})();