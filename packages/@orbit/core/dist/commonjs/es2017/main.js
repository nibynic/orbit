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
const globals = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global || {};
const Orbit = {
    globals,
    Promise: globals.Promise,
    uuid: _utils.uuid
};
exports.default = Orbit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZ2xvYmFscyIsInNlbGYiLCJnbG9iYWwiLCJPcmJpdCIsIlByb21pc2UiLCJ1dWlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxVQUFVLE9BQU9DLElBQVAsSUFBZSxRQUFmLElBQTJCQSxLQUFLQSxJQUFMLEtBQWNBLElBQXpDLElBQWlEQSxJQUFqRCxJQUF5RCxPQUFPQyxNQUFQLElBQWlCLFFBQWpCLElBQTZCQSxNQUF0RixJQUFnRyxFQUFoSDtBQUNBLE1BQU1DLFFBQVE7QUFDVkgsV0FEVTtBQUVWSSxhQUFTSixRQUFRSSxPQUZQO0FBR1ZDO0FBSFUsQ0FBZDtrQkFLZUYsSyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXVpZCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCAoYHNlbGZgKSBpbiB0aGUgYnJvd3NlciwgYGdsb2JhbGBcbi8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbi8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG4vL1xuLy8gU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvYmxvYi9tYXN0ZXIvdW5kZXJzY29yZS5qcyNMMTEtTDE3XG4vLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5jb25zdCBnbG9iYWxzID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHwgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgfHwge307XG5jb25zdCBPcmJpdCA9IHtcbiAgICBnbG9iYWxzLFxuICAgIFByb21pc2U6IGdsb2JhbHMuUHJvbWlzZSxcbiAgICB1dWlkXG59O1xuZXhwb3J0IGRlZmF1bHQgT3JiaXQ7Il19