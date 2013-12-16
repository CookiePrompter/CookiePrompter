module('ReferrerHandler tests', {
    setup: function() {
    },
    teardown: function() {
    }
});

test('CameFromSameDomain will return true when domain is referrer',function(){
    var doc = {};
    doc.referrer = 'http://mydomain.dk/testuri';
    doc.location = {};
    doc.location.host = 'mydomain.dk';
    ok(ReferrerHandler.cameFromSameDomain(doc));
});

test('CameFromSameDomain will return false on empty referrer',function(){
	var doc = {};
	doc.referrer = '';
	doc.location = {};
	doc.location.host = 'mydomain.dk';
    ok(!ReferrerHandler.cameFromSameDomain(doc));
});

test('CameFromSameDomain will return false on undefined referrer',function(){
    var doc = {};
    doc.location = {};
    doc.location.host = 'mydomain.dk';
    ok(!ReferrerHandler.cameFromSameDomain(doc));
});

test('CameFromSameDomain will return false when referrer is other plain domain',function(){
	var doc = {};
	doc.referrer = 'http://otherdomain.dk/testuri';
	doc.location = {};
	doc.location.host = 'mydomain.dk';
    ok(!ReferrerHandler.cameFromSameDomain(doc));
});

test('CameFromSameDomain will return false when domain is in querystring',function(){
    var doc = {};
    doc.referrer = 'http://www.google.dk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&sqi=2&ved=0CC0QFjAA&url=http%3A%2F%2Ferhvervsstyrelsen.dk%2F&ei=3hSrUrCBG83bsgbV-YH4BQ&usg=AFQjCNFoH1Gphl01QyAn3HXqe-_pqNhFHQ&bvm=bv.57967247,d.Yms';
    doc.location = {};
    doc.location.host = 'erhvervsstyrelsen.dk';
    ok(!ReferrerHandler.cameFromSameDomain(doc));
});
