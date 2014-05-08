
module('IFrameCommunicatorTests',{});

test('can create iframeCommunicator',function(){
	var sut = new IFrameCommunicator();
	ok(true);
});


test('listenToChild can be called',function(){
	var sut = new IFrameCommunicator();
	sut.listenToChild();
	ok(true);	
});


test('listenToParent can be called',function(){
	var sut = new IFrameCommunicator();
	sut.listenToParent();
	ok(true);
});



test('handleMsgFromParent can be called with unknown message without doing anything',function(){
	var sut = new IFrameCommunicator();
	var msgObject = {data:"some:string"};
	sut.handleMsgFromParent(msgObject);
	ok(true);
});


test('handleMsgFromParent will inject trackers if cookiesAllowed = true',function(){
	expect(2);

	var tm =function(){};
	tm.prototype.injectTrackers=function(){ok(true);};


	//handle message from parent will not use cookiesAllowed so we null that
	var sut = new IFrameCommunicator(null,new tm());;
	
	var msgObject = {data:"cookiesAllowed:true"};
	sut.handleMsgFromParent(msgObject);
	ok(true);
});

test('handleMsgFromParent will not inject trackers if cookiesAllowed = false',function(){
	expect(1);
	//handle message from parent will not use cookiesAllowed so we null that
	var tm = {
		injectTrackers:function(){
			throw "Should not injectTrackers when not allowed";
		},
		eraseCookies: function(){}
	};
	var sut = new IFrameCommunicator(null,tm);
	
	var msgObject = {data:"cookiesAllowed:false"};
	sut.handleMsgFromParent(msgObject);
	ok(true);
});

test('handleMsgFromParent will deleteCookies if cookiesAllowed = false',function(){
	expect(1);
	//handle message from parent will not use cookiesAllowed so we null that
	var tm = {
		injectTrackers:function(){
			throw "Should not injectTrackers when not allowed";
		},
		eraseCookies: function(){
			ok(true);
		}
	};
	var sut = new IFrameCommunicator(null,tm);
	
	var msgObject = {data:"cookiesAllowed:false"};
	sut.handleMsgFromParent(msgObject);

});




test('handleMsgFromChild will ignore unknown message',function(){
	var sut = new IFrameCommunicator();
	sut.handleMsgFromChild({data:'some:string'});
	ok(true);
});


test('handleMsgFromChild given "prompt" will reply with result from cookiesAllowed function',function(){
	expect(2);
	var cookiesAllowedFunc = function(){
		ok(true);
		return true;
	};
	var sut = new IFrameCommunicator(cookiesAllowedFunc);
	// this will mimic the PostMessage standard

	var msg = {
		source:{
			postMessage: function(arg,origin){
				equal('cookiesAllowed:true',arg);
			}
		},
		data:'prompt'
	};

	sut.handleMsgFromChild(msg);
});

test('handleMsgFromChild given "acceptAndTrack" will deleteprompt, allowtracking and insertTrackers',function(){
	//	insertCookieRemovePromptAndInsertTrackers
	var sut = new IFrameCommunicator();
	var msg = {
		data:'acceptAndTrack'
	};
	sut.handleMsgFromChild(msg);
	ok(true);
});


test('handleMsgFromParent when cookiesAllowed = "unset" will check if iframe has been navigated to from same domain and if so, injectTrackers',function(){
	expect(1);
	var tm = {injectTrackers:function(){
		ok(true);
	}};
	// setting up global parent
	parent = {
		postMessage: function(arg,origin){

		}
	};
	var sut = new IFrameCommunicator(null,tm,SameDomainReferrerHandler);
	var msgObject = {data:"cookiesAllowed:unset"};
	sut.handleMsgFromParent(msgObject);
	
});

test('handleMsgFromParent when cookiesAllowed = "unset" will check if iframe has been navigated to from same domain and if so tell parent',function(){
	
	var tm = {injectTrackers:function(){}};
	var iframeParent = 'http://mydomain.com';
	// setting up global parent
	parent = {
		postMessage: function(arg,origin){
			equal(arg,"acceptAndTrack");
			equal(origin,iframeParent);
		}
	};
	var sut = new IFrameCommunicator(null,tm,SameDomainReferrerHandler);
	sut.iframeParent = iframeParent;
	var msgObject = {data:"cookiesAllowed:unset"};
	sut.handleMsgFromParent(msgObject);
});



test('handleMsgFromParent when cookiesAllowed = "unset" will check if iframe has been navigated to from same domain and if NOT so, return',function(){
	var tm = {injectTrackers:function(){
		throw "Should not injectTrackers while implicit";
	}};

	var sut = new IFrameCommunicator(null,tm, OtherDomainReferrerHandler);
	var msgObject = {data:"cookiesAllowed:unset"};
	sut.handleMsgFromParent(msgObject);
	ok(true);
});