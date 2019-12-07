(function () {
    window.ga = window.ga || function (args) {
        console.log('faking it universally');
        console.log(args);
    };

})(window);