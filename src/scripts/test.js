(function(){
    var testTMPL = require('tmpl/test.html');
    var data = require('./data/testData');
    var html = testTMPL.render(data);

    document.querySelector('#j-test').innerHTML = html;
})();
