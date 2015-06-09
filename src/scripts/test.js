(function(){
    var testTMPL = require('../template/test.html');
    var data = require('./data/testData');
    var html = testTMPL.render(data);

    document.querySelector('#j-test').innerHTML = html;
})();
