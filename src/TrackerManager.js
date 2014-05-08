function TrackerManager(){

	this.trackers = [];
}

TrackerManager.prototype.addTracker = function(t){
	var tracker = t.name;
	CookiePrompter.log(tracker);
	var trackerConfig =t.config;
	tracker.init(trackerConfig);
	this.trackers.push(tracker); 
};

TrackerManager.prototype.addTrackers = function(ts){
	for (var i = 0; i < ts.length; i++) {
		this.addTracker(ts[i]);
	}
};

TrackerManager.prototype.injectTrackers = function(cfg){
	CookiePrompter.log('inserting tracking code for '+this.trackers.length+ ' trackers');
	for (var i = 0; i < this.trackers.length; i++) {
		var t = this.trackers[i];
		t.injectCode(cfg);
	}
};

TrackerManager.prototype.eraseCookies = function(){
	for (var i = 0; i < this.trackers.length; i++) {
		var t = this.trackers[i];
		t.eraseCookie();
	}	
};