/// <reference path="../src/TrackerManager.js"/>
/// <reference path="resources/qunit.js" />

module('TrackerManager',{});

test('can initialize',function(){
	var sut = new TrackerManager();
	notEqual(null,sut);		
});

test('can add trackers',function(){
	var sut = new TrackerManager();
	var trackers = [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                }
            }}];

    sut.addTrackers(trackers);
    equal(trackers[0].name,sut.trackers[0]);
});

test('adding a tracker will initialize it',function(){
	expect(1);
	var sut = new TrackerManager();
	var trackers = [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                	ok(true);
                }
            }}];

    sut.addTrackers(trackers);

});




test('injectTrackers can be called',function(){
	var sut = new TrackerManager();
	sut.injectTrackers();
	ok(true);
});

test('injectTrackers will call injectCode on trackers',function(){
	expect(2);
	var sut = new TrackerManager();
	var trackers = [{
            name: UnitTestTracker,
            config: {
                ready: function () {
                	ok(true);
                },
                injectCodeCallback: function(){
                	ok(true);
                }
            }}];

    sut.addTracker(trackers[0]);
    sut.injectTrackers();
});

test('eraseCookies can be called',function(){
	var sut = new TrackerManager();
	sut.eraseCookies();
	ok(true);
});

