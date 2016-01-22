/**
 * @static @class prom2cb
 * A collection of functions that connect promises to Node.js-style callback
 * functions and vice versa.
 */
(function() {
    var prom2cb = {};
    
    /**
     * Takes a promise object and chains a Node.js-style callback function to it
     * that can be used to retrieve the results or the error.
     *
     * @param {Promise} promise An aribitary promise
     * @param {Function} callback A Node.js-style callback function
     */
    function chainCallback(promise, callback) {
        promise.then(function() {
            var args = Array.prototype.slice.call(arguments, 0);
            
            // Add null as a first argument to indicate that there is no error
            args.unshift(null);
            // Invoke the callback and propagate the results
            callback.apply(null, args);
        }, function() {
            var args = Array.prototype.slice.call(arguments, 0);
            
            if(args.length == 0) { // If no parameter is provided, we compose one ourselves
                callback("Promise error");
            } else if(args.length == 1) { // If one parameter is provided, we simply propagate it
                callback(args[0]);
            } else { // Otherwise, we propagate all parameters as an array of objects
                callback(args);
            }
        });
    }
    
    prom2cb.chainCallback = chainCallback;
    
    /**
     * Takes a Node.js-style function, which last parameter refers to a
     * Node.js-style callback function, and returns a function having the
     * same interface returning a promise.
     *
     * @param {Function} Promise A function that constructs a promise object following the Promises/A+ convention
     * @param {Function} fun An arbitrary function in which the last parameter refers to a Node.js-style callback
     * @return {Function} A function taking the same parameters (without the callback). The function returns a promise instead.
     */
    function promisify(Promise, fun) {
        return function() {
           var args = Array.prototype.slice.call(arguments, 0);
           
           return new Promise(function(resolve, reject) {
                /*
                 * Define a callback function invoking the resolve function in
                 * case of success and reject in case of a failure
                 */
                function callback() {
                    var args = Array.prototype.slice.call(arguments, 0);
                    var err = args[0]; // First function argument is the error object
                    args.shift(); // Remove first element (error)
                    
                    if(err) {
                        reject(err);
                    } else {
                        resolve(args);
                    }
                }
           
                // Use the callback adapter as callback
                args.push(callback);
                
                // Invoke the function with the given arguments and callback adapter as callback
                fun.apply(null, args);
            });
        };
    }
    
    prom2cb.promisify = promisify;
    
    /* Export the prom2cb module */
    if(typeof module != "undefined")
        module.exports = prom2cb; // Node.js export
    else
        this.prom2cb = prom2cb; // Browser export

})();
