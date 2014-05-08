function IFrameCommunicator(cookiesAllowedFunc,trackerManager,referrerHandler){
	this.cookiesAllowed=cookiesAllowedFunc;
	this.trackerManager = trackerManager;
	this.referrerHandler =referrerHandler;
	this.iframeParent='';
}

IFrameCommunicator.prototype.listenToChild = function(){
	var _this=this;
	CrossDomainHandler.subscribeToPostMessage(function(msg){
		_this.handleMsgFromChild(msg);
	});   
};

IFrameCommunicator.prototype.listenToParent = function(){
	var _this=this;
	CrossDomainHandler.subscribeToPostMessage(function(msg){
		_this.handleMsgFromParent(msg);
	});
};	

IFrameCommunicator.prototype.handleMsgFromChild = function(msg){
	if(msg.data==='prompt'){
		CookiePrompter.log(msg);
		CookiePrompter.log('child frame asking about cookie status');  
		msg.source.postMessage('cookiesAllowed:'+this.cookiesAllowed(),msg.origin);
	}
	if(msg.data==='acceptAndTrack'){
		CookiePrompter.log(msg);
		CookiePrompter.log('child frame asking telling us to track');  
		CookiePrompter.insertCookieRemovePromptAndInsertTrackers();
	}
};

IFrameCommunicator.prototype.handleMsgFromParent = function(msg){
	var args = msg.data.split(':');
	if(args.length<2){return;}
	CookiePrompter.log(msg);

	// parent replying to our prompt
	if(args[0]=='cookiesAllowed'){
		switch(args[1]){
			case 'true':
				// inject cookies 
				CookiePrompter.log('cookies are accepted, so lets inject them!');
				this.trackerManager.injectTrackers();
				break;
			case 'false':
				CookiePrompter.log('parent says no to cookies. ');
				this.trackerManager.eraseCookies();
				break;
			case 'unset':
				// if the iframed page was navigated to
				// from a page on the same iframed domain and the parent doesn't
				// have a cookie yet (first page impression)
				// the implicit accept kicks in on the iframe
				// - and we need to tell the parent to kill the prompt and set a cookie.
				// After which we should insert the tracking cookie.
				if(this.referrerHandler.cameFromSameDomain(document)){
					CookiePrompter.log('child injecting trackers');
					this.trackerManager.injectTrackers();
					CookiePrompter.log('telling parent to accept and track');
					parent.postMessage('acceptAndTrack',this.iframeParent);  
				}

				break;
			default:
				// dont do anything
		}
	}
};