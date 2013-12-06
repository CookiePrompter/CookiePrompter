CrossDomainHandler = (function(){
    var subscribeToPostMessage = function (func){
       if(func && typeof func ==='function'){
          var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
          var eventer = window[eventMethod];
          var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
          eventer(messageEvent,func,false);
       }
    };

    return {subscribeToPostMessage:subscribeToPostMessage};
})();