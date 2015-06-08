var b = require('./m-b');
var c = require('./m-c/m-c');

var bStr = b.getString();
var cStr = c.getString();

console.info('Hello: ' + bStr + ' ' + cStr);

var logEle = document.querySelector('#log');
logEle.innerHTML += 'bStr: ' + bStr + '<br/>';
logEle.innerHTML += 'cStr: ' + cStr + '<br/>';
