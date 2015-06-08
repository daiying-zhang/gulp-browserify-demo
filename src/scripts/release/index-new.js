// index-new.js

var a = require('../m-a');
var b = require('../m-b');
var c = require('../m-c/m-c');

var aStr = a.getString();
var bStr = b.getString();
var cStr = c.getString();

console.info('Hello: ' + bStr + ' ' + cStr);

var logEle = document.querySelector('#log');
logEle.innerHTML += 'aStr: ' + aStr + '<br/>';
logEle.innerHTML += 'bStr: ' + bStr + '<br/>';
logEle.innerHTML += 'cStr: ' + cStr + '<br/>';
