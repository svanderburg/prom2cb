var fs = require('fs');
var Promise = require('rsvp').Promise;
var prom2cb = require('../lib/prom2cb.js');

prom2cb.promisify(Promise, fs.writeFile)("hello.txt", "Hello world!\n").then(function() {
    return prom2cb.promisify(Promise, fs.readFile)("hello.txt");
}).then(function(data) {
    console.log("data: "+data);
}, function(err) {
    console.log("error: "+err);
});
