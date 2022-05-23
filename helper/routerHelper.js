/**
 * wrap a async express middleware so that it can catch any thrown exception
 * borrow from https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
 * @param {Function} fn express middleware
 */
//const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

/**
 * Create a controller function by creating a controller instance and call the method
 * @param {Function}  ControllerClass   the constructor of the controller
 * @param {string}    method            the method name of the handler function
 * @returns {Function}  A function that create a controller instance and call the method
 */
function createControllerFunction(ControllerClass, method) {
    const actionFn = function(...args) {
        const controller = new ControllerClass(...args);
        return controller[method](...args);
    };

    //return wrap(actionFn);
    return actionFn;
}

module.exports = {
    createControllerFunction,
};
