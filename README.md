prom2cb.js
==========
An adapter library converting Node.js-style functions with callbacks into
functions constructing promises and vice-versa.

It has only a few simple requirements. For "chaining" Node.js-style callbacks to
promises, we require that promises implement a `.then()` method that conforms to
the Promises/A+ standard (which should be obvious).

For wrapping Node.js-style functions into functions returing promises, we
require a `Promise` prototype providing a constructor with the following
structure: `new Promise(function(resolve, reject) { ... }` in which the function
parameters refer to callbacks that should be called when a promise gets fulfilled
or rejected.

Installation
============
Currently, this library is tested for usage with Node.js and web browsers.

Node.js
-------
Usage on Node.js is straight forward. It can be installed into a working
directory with the NPM package manager by running:

    $ npm install prom2cb

In the code, the module can be imported with:

    var prom2cb = require('prom2cb');

Browser
-------
For usage in the browser copy `lib/prom2cb.js` into a folder accessible by a web
page. Then add the following script include to the HTML code of that web page:

    <script type="text/javascript" src="prom2cb.js"></script>

Usage
=====
This library provides two conversion functions.

Chaining a Node.js-style callback function to a promise
-------------------------------------------------------
`prom2cb.chainCallback()` can be used to chain a Node.js-style callback (which
first argument corresponds to an error object) to a promise. This function
replaces the `.then()` function invocation, that is normally used to obtain the
result of a promise.

With this function you can, for example, easily integrate promise-style function
invocations with a Node.js-function style control flow abstraction function:

    slasp.sequence([
        function(callback) {
            prom2cb.chainCallback(Task.sync(), callback);
        },
        
        function(callback) {
            prom2cb.chainCallback(Task.create({
                title: "Get some coffee",
                description: "Get some coffee ASAP"
            }), callback);
        },
        
        function(callback) {
            prom2cb.chainCallback(Task.create({
                title: "Drink coffee",
                description: "Because I need caffeine"
            }), callback);
        },
        
        function(callback) {
            prom2cb.chainCallback(Task.findAll(), callback);
        },
        
        function(callback, tasks) {
            for(var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                console.log(task.title + ": "+ task.description);
            }
        }
    ], function(err) {
        if(err) {
            console.log("An error occured: "+err);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });

Converting a Node.js-style function into a function returning a promise
-----------------------------------------------------------------------
`prom2cb.promisify()` can be used wrap a Node.js-style function, in which the
last function parameter corresponds to a callback, into a function returning a
promise. The wrapped function takes the same function parameters (minus the
callback).

Because the wrapped functions return promises, we can "chain" them to other
promises through `.then()` function invocations:

    var fs = require('fs');
    var Promise = require('rsvp').Promise; // We use RSVP to construct promises
    
    /* Wrap the fs.readFile function into a function return a promise */
    var readFile = prom2cb.promisify(Promise, fs.readFile); 
    
    /* Invoke the function as a promise */
    readFile("hello.txt").then(function(data) {
        console.log("File contents is: "+data);
    }, function(err) {
        console.log("Error opening file: "+err);
    });

Instead of defining and adapting the function first and invoking it later, we
can also combine these aspects into a one liner:

    prom2cb.promisify(Promise, fs.readFile)("hello.txt").then(function(data) {
        console.log("File contents is: "+data);
    }, function(err) {
        console.log("Error opening file: "+err);
    });

The latter is typically useful if you have to invoke a function only once.
