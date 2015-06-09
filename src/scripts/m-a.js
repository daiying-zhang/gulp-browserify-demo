// m-a.js

var name = 'a';
var modD = require('./m-c/m-d');

module.exports = {
    getString: function(){
        console.log('m-a modD value: ' + modD);
        console.info('ok...');
        return 'm-' + name;
    }
};
