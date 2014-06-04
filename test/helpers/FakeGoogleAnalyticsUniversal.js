(function(){
	window.ga = window.ga || function(args){
		console.log('faking it universally');
		console.log(args);
	}
	
})(window);


/*console.log('included');
(function() {
    if (window.console) {
        console.log('Fakelogging');
        console.log(window.ga);
    }
    var f = function(args){
    	console.log('ga is called');
    	console.log(args);
    };
    return f;
})();*/