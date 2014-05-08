CrossDomainHandler = (function(){
    var subscribeToPostMessage = function (func,scope){
       if(func && typeof func ==='function'){
          var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
          var eventer = window[eventMethod];
          var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
          // window['addEventListener']('onMessage',callback,false);
          eventer(messageEvent,func,false);
       }
    };

    return {subscribeToPostMessage:subscribeToPostMessage};
})();