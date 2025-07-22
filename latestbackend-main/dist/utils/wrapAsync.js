"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = wrapAsync;
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
