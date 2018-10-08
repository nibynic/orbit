'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
//
// Source: https://github.com/jashkenas/underscore/blob/master/underscore.js#L11-L17
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
var globals = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global || {};
var Orbit = {
    globals: globals,
    Promise: globals.Promise,
    uuid: _utils.uuid
};
exports.default = Orbit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZ2xvYmFscyIsInNlbGYiLCJPcmJpdCIsIlByb21pc2UiLCJ1dWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLFVBQVUsT0FBQSxJQUFBLElBQUEsUUFBQSxJQUEyQkMsS0FBQUEsSUFBQUEsS0FBM0IsSUFBQSxJQUFBLElBQUEsSUFBeUQsT0FBQSxNQUFBLElBQUEsUUFBQSxJQUF6RCxNQUFBLElBQWhCLEVBQUE7QUFDQSxJQUFNQyxRQUFRO0FBQ1ZGLGFBRFUsT0FBQTtBQUVWRyxhQUFTSCxRQUZDLE9BQUE7QUFHVkksVUFBQUE7QUFIVSxDQUFkO2tCQUtBLEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1dWlkIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIChgc2VsZmApIGluIHRoZSBicm93c2VyLCBgZ2xvYmFsYFxuLy8gb24gdGhlIHNlcnZlciwgb3IgYHRoaXNgIGluIHNvbWUgdmlydHVhbCBtYWNoaW5lcy4gV2UgdXNlIGBzZWxmYFxuLy8gaW5zdGVhZCBvZiBgd2luZG93YCBmb3IgYFdlYldvcmtlcmAgc3VwcG9ydC5cbi8vXG4vLyBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9ibG9iL21hc3Rlci91bmRlcnNjb3JlLmpzI0wxMS1MMTdcbi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE3IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmNvbnN0IGdsb2JhbHMgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fCB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCB8fCB7fTtcbmNvbnN0IE9yYml0ID0ge1xuICAgIGdsb2JhbHMsXG4gICAgUHJvbWlzZTogZ2xvYmFscy5Qcm9taXNlLFxuICAgIHV1aWRcbn07XG5leHBvcnQgZGVmYXVsdCBPcmJpdDsiXX0=