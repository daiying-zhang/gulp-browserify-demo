// index.js

var a = require('../m-a');
var b = require('../m-b');

var aStr = a.getString();
var bStr = b.getString();

console.info('Hello: ' + aStr + '  ' + bStr);

var logEle = document.querySelector('#log');
logEle.innerHTML += 'aStr: ' + aStr + '<br/>';
logEle.innerHTML += 'bStr: ' + bStr + '<br/>';
