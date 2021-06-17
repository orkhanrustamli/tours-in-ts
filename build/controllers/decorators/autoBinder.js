"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoBinder = void 0;
function autoBinder(_, _2, descriptor) {
    var originalFunc = descriptor.value;
    var newDescriptor = {
        configurable: true,
        enumerable: false,
        get: function () {
            return originalFunc.bind(this);
        },
    };
    return newDescriptor;
}
exports.autoBinder = autoBinder;
