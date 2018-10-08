"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Code based on: https://github.com/mattbierner/hamt
 * Author: Matt Bierner
 * MIT license
 *
 * Which is based on: https://github.com/exclipy/pdata
 */
/* eslint-disable */
function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
/* Configuration
 ******************************************************************************/
var SIZE = 5;
var BUCKET_SIZE = Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
/*
 ******************************************************************************/
var nothing = {};
function constant(x) {
    return function () {
        return x;
    };
}
/**
  Get 32 bit hash of string.

  Based on:
  http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
*/
function hash(str) {
    var type = typeof str === 'undefined' ? 'undefined' : _typeof(str);
    if (type === 'number') return str;
    if (type !== 'string') str += '';
    var h = 0;
    for (var i = 0, len = str.length; i < len; ++i) {
        var c = str.charCodeAt(i);
        h = (h << 5) - h + c | 0;
    }
    return h;
}
/* Bit Ops
 ******************************************************************************/
/**
  Hamming weight.

  Taken from: http://jsperf.com/hamming-weight
*/
function popcount(x) {
    x -= x >> 1 & 0x55555555;
    x = (x & 0x33333333) + (x >> 2 & 0x33333333);
    x = x + (x >> 4) & 0x0f0f0f0f;
    x += x >> 8;
    x += x >> 16;
    return x & 0x7f;
}
function hashFragment(shift, h) {
    return h >>> shift & MASK;
}
function toBitmap(x) {
    return 1 << x;
}
function fromBitmap(bitmap, bit) {
    return popcount(bitmap & bit - 1);
}
/* Array Ops
 ******************************************************************************/
/**
  Set a value in an array.

  @param mutate Should the input array be mutated?
  @param at Index to change.
  @param v New value
  @param arr Array.
*/
function arrayUpdate(mutate, at, v, arr) {
    var out = arr;
    if (!mutate) {
        var len = arr.length;
        out = new Array(len);
        for (var i = 0; i < len; ++i) {
            out[i] = arr[i];
        }
    }
    out[at] = v;
    return out;
}
/**
  Remove a value from an array.

  @param mutate Should the input array be mutated?
  @param at Index to remove.
  @param arr Array.
*/
function arraySpliceOut(mutate, at, arr) {
    var len = arr.length;
    var i = 0,
        g = 0;
    var out = arr;
    if (mutate) {
        i = g = at;
    } else {
        out = new Array(len - 1);
        while (i < at) {
            out[g++] = arr[i++];
        }
        ++i;
    }
    while (i < len) {
        out[g++] = arr[i++];
    }
    return out;
}
/**
  Insert a value into an array.

  @param mutate Should the input array be mutated?
  @param at Index to insert at.
  @param v Value to insert,
  @param arr Array.
*/
function arraySpliceIn(mutate, at, v, arr) {
    var len = arr.length;
    if (mutate) {
        var _i = len;
        while (_i >= at) {
            arr[_i--] = arr[_i];
        }
        arr[at] = v;
        return arr;
    }
    var i = 0,
        g = 0;
    var out = new Array(len + 1);
    while (i < at) {
        out[g++] = arr[i++];
    }
    out[at] = v;
    while (i < len) {
        out[++g] = arr[i++];
    }
    return out;
}
/* Node Structures
 ******************************************************************************/
var LEAF = 1;
var COLLISION = 2;
var INDEX = 3;
var ARRAY = 4;
/**
  Empty node.
*/
var empty = {
    __hamt_isEmpty: true,
    _modify: function (edit, keyEq, shift, f, h, k, size) {
        var v = f();
        if (v === nothing) return empty;
        ++size.value;
        return Leaf(edit, h, k, v);
    }
};
function isEmptyNode(x) {
    return x === empty || x && x.__hamt_isEmpty;
}
/**
  Leaf holding a value.

  @member edit Edit of the node.
  @member hash Hash of key.
  @member key Key.
  @member value Value stored.
*/
function Leaf(edit, hash, key, value) {
    return {
        type: LEAF,
        edit: edit,
        hash: hash,
        key: key,
        value: value,
        _modify: Leaf__modify
    };
}
/**
  Leaf holding multiple values with the same hash but different keys.

  @member edit Edit of the node.
  @member hash Hash of key.
  @member children Array of collision children node.
*/
function Collision(edit, hash, children) {
    return {
        type: COLLISION,
        edit: edit,
        hash: hash,
        children: children,
        _modify: Collision__modify
    };
}
/**
  Internal node with a sparse set of children.

  Uses a bitmap and array to pack children.

  @member edit Edit of the node.
  @member mask Bitmap that encode the positions of children in the array.
  @member children Array of child nodes.
*/
function IndexedNode(edit, mask, children) {
    return {
        type: INDEX,
        edit: edit,
        mask: mask,
        children: children,
        _modify: IndexedNode__modify
    };
}
/**
  Internal node with many children.

  @member edit Edit of the node.
  @member size Number of children.
  @member children Array of child nodes.
*/
function ArrayNode(edit, size, children) {
    return {
        type: ARRAY,
        edit: edit,
        size: size,
        children: children,
        _modify: ArrayNode__modify
    };
}
/**
    Is `node` a leaf node?
*/
function isLeaf(node) {
    return node === empty || node.type === LEAF || node.type === COLLISION;
}
/* Internal node operations.
 ******************************************************************************/
/**
  Expand an indexed node into an array node.

  @param edit Current edit.
  @param frag Index of added child.
  @param child Added child.
  @param mask Index node mask before child added.
  @param subNodes Index node children before child added.
*/
function expand(edit, frag, child, bitmap, subNodes) {
    var arr = [];
    var bit = bitmap;
    var count = 0;
    for (var i = 0; bit; ++i) {
        if (bit & 1) arr[i] = subNodes[count++];
        bit >>>= 1;
    }
    arr[frag] = child;
    return ArrayNode(edit, count + 1, arr);
}
/**
  Collapse an array node into a indexed node.

  @param edit Current edit.
  @param count Number of elements in new array.
  @param removed Index of removed element.
  @param elements Array node children before remove.
*/
function pack(edit, count, removed, elements) {
    var children = new Array(count - 1);
    var g = 0;
    var bitmap = 0;
    for (var i = 0, len = elements.length; i < len; ++i) {
        if (i !== removed) {
            var elem = elements[i];
            if (elem && !isEmptyNode(elem)) {
                children[g++] = elem;
                bitmap |= 1 << i;
            }
        }
    }
    return IndexedNode(edit, bitmap, children);
}
/**
  Merge two leaf nodes.

  @param shift Current shift.
  @param h1 Node 1 hash.
  @param n1 Node 1.
  @param h2 Node 2 hash.
  @param n2 Node 2.
*/
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
    if (h1 === h2) return Collision(edit, h1, [n2, n1]);
    var subH1 = hashFragment(shift, h1);
    var subH2 = hashFragment(shift, h2);
    return IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), subH1 === subH2 ? [mergeLeaves(edit, shift + SIZE, h1, n1, h2, n2)] : subH1 < subH2 ? [n1, n2] : [n2, n1]);
}
/**
  Update an entry in a collision list.

  @param mutate Should mutation be used?
  @param edit Current edit.
  @param keyEq Key compare function.
  @param hash Hash of collision.
  @param list Collision list.
  @param f Update function.
  @param k Key to update.
  @param size Size ref.
*/
function updateCollisionList(mutate, edit, keyEq, h, list, f, k, size) {
    var len = list.length;
    for (var i = 0; i < len; ++i) {
        var child = list[i];
        if (keyEq(k, child.key)) {
            var value = child.value;
            var _newValue = f(value);
            if (_newValue === value) return list;
            if (_newValue === nothing) {
                --size.value;
                return arraySpliceOut(mutate, i, list);
            }
            return arrayUpdate(mutate, i, Leaf(edit, h, k, _newValue), list);
        }
    }
    var newValue = f();
    if (newValue === nothing) return list;
    ++size.value;
    return arrayUpdate(mutate, len, Leaf(edit, h, k, newValue), list);
}
function canEditNode(edit, node) {
    return edit === node.edit;
}
/* Editing
 ******************************************************************************/
function Leaf__modify(edit, keyEq, shift, f, h, k, size) {
    if (keyEq(k, this.key)) {
        var _v = f(this.value);
        if (_v === this.value) return this;else if (_v === nothing) {
            --size.value;
            return empty;
        }
        if (canEditNode(edit, this)) {
            this.value = _v;
            return this;
        }
        return Leaf(edit, h, k, _v);
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
}
function Collision__modify(edit, keyEq, shift, f, h, k, size) {
    if (h === this.hash) {
        var canEdit = canEditNode(edit, this);
        var list = updateCollisionList(canEdit, edit, keyEq, this.hash, this.children, f, k, size);
        if (list === this.children) return this;
        return list.length > 1 ? Collision(edit, this.hash, list) : list[0]; // collapse single element collision list
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
}
function IndexedNode__modify(edit, keyEq, shift, f, h, k, size) {
    var mask = this.mask;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var bit = toBitmap(frag);
    var indx = fromBitmap(mask, bit);
    var exists = mask & bit;
    var current = exists ? children[indx] : empty;
    var child = current._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (current === child) return this;
    var canEdit = canEditNode(edit, this);
    var bitmap = mask;
    var newChildren = undefined;
    if (exists && isEmptyNode(child)) {
        // remove
        bitmap &= ~bit;
        if (!bitmap) return empty;
        if (children.length <= 2 && isLeaf(children[indx ^ 1])) return children[indx ^ 1]; // collapse
        newChildren = arraySpliceOut(canEdit, indx, children);
    } else if (!exists && !isEmptyNode(child)) {
        // add
        if (children.length >= MAX_INDEX_NODE) return expand(edit, frag, child, mask, children);
        bitmap |= bit;
        newChildren = arraySpliceIn(canEdit, indx, child, children);
    } else {
        // modify
        newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
        this.mask = bitmap;
        this.children = newChildren;
        return this;
    }
    return IndexedNode(edit, bitmap, newChildren);
}
function ArrayNode__modify(edit, keyEq, shift, f, h, k, size) {
    var count = this.size;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var child = children[frag];
    var newChild = (child || empty)._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (child === newChild) return this;
    var canEdit = canEditNode(edit, this);
    var newChildren = undefined;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
        // add
        ++count;
        newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
        // remove
        --count;
        if (count <= MIN_ARRAY_NODE) return pack(edit, count, frag, children);
        newChildren = arrayUpdate(canEdit, frag, empty, children);
    } else {
        // modify
        newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
        this.size = count;
        this.children = newChildren;
        return this;
    }
    return ArrayNode(edit, count, newChildren);
}
;
/* Queries
 ******************************************************************************/
/**
    Lookup the value for `key` in `map` using a custom `hash`.

    Returns the value or `alt` if none.
*/
function _tryGetHash(alt, hash, key, map) {
    var node = map._root;
    var shift = 0;
    var keyEq = map._config.keyEq;
    while (true) {
        switch (node.type) {
            case LEAF:
                {
                    return keyEq(key, node.key) ? node.value : alt;
                }
            case COLLISION:
                {
                    if (hash === node.hash) {
                        var children = node.children;
                        for (var i = 0, len = children.length; i < len; ++i) {
                            var child = children[i];
                            if (keyEq(key, child.key)) return child.value;
                        }
                    }
                    return alt;
                }
            case INDEX:
                {
                    var frag = hashFragment(shift, hash);
                    var bit = toBitmap(frag);
                    if (node.mask & bit) {
                        node = node.children[fromBitmap(node.mask, bit)];
                        shift += SIZE;
                        break;
                    }
                    return alt;
                }
            case ARRAY:
                {
                    node = node.children[hashFragment(shift, hash)];
                    if (node) {
                        shift += SIZE;
                        break;
                    }
                    return alt;
                }
            default:
                return alt;
        }
    }
}
/**
  Lookup the value for `key` in `map` using internal hash function.

  @see `tryGetHash`
*/
function _tryGet(alt, key, map) {
    return _tryGetHash(alt, map._config.hash(key), key, map);
}
/**
  Lookup the value for `key` in `map` using a custom `hash`.

  Returns the value or `undefined` if none.
*/
function _getHash(hash, key, map) {
    return _tryGetHash(undefined, hash, key, map);
}
/**
  Lookup the value for `key` in `map` using internal hash function.

  @see `get`
*/
function get(key, map) {
    return _tryGetHash(undefined, map._config.hash(key), key, map);
}
/**
    Does an entry exist for `key` in `map`? Uses custom `hash`.
*/
function _hasHash(hash, key, map) {
    return _tryGetHash(nothing, hash, key, map) !== nothing;
}
/**
  Does an entry exist for `key` in `map`? Uses internal hash function.
*/
function _has(key, map) {
    return _hasHash(map._config.hash(key), key, map);
}
function defKeyCompare(x, y) {
    return x === y;
}
/**
  Does `map` contain any elements?
*/
function isEmpty(map) {
    return map && !!isEmptyNode(map._root);
}
/* Updates
 ******************************************************************************/
/**
    Alter the value stored for `key` in `map` using function `f` using
    custom hash.

    `f` is invoked with the current value for `k` if it exists,
    or no arguments if no such value exists. `modify` will always either
    update or insert a value into the map.

    Returns a map with the modified value. Does not alter `map`.
*/
function _modifyHash(f, hash, key, map) {
    var size = { value: map._size };
    var newRoot = map._root._modify(map._editable ? map._edit : NaN, map._config.keyEq, 0, f, hash, key, size);
    return map.setTree(newRoot, size.value);
}
/**
  Alter the value stored for `key` in `map` using function `f` using
  internal hash function.

  @see `modifyHash`
*/
function _modify(f, key, map) {
    return _modifyHash(f, map._config.hash(key), key, map);
}
/**
  Store `value` for `key` in `map` using custom `hash`.

  Returns a map with the modified value. Does not alter `map`.
*/
function _setHash(hash, key, value, map) {
    return _modifyHash(constant(value), hash, key, map);
}
/**
  Store `value` for `key` in `map` using internal hash function.

  @see `setHash`
*/
function _set(key, value, map) {
    return _setHash(map._config.hash(key), key, value, map);
}
/**
  Remove the entry for `key` in `map`.

  Returns a map with the value removed. Does not alter `map`.
*/
var del = constant(nothing);
function _removeHash(hash, key, map) {
    return _modifyHash(del, hash, key, map);
}
/**
  Remove the entry for `key` in `map` using internal hash function.

  @see `removeHash`
*/
function _remove(key, map) {
    return _removeHash(map._config.hash(key), key, map);
}
/* Mutation
 ******************************************************************************/
/**
  Mark `map` as mutable.
 */
function _beginMutation(map) {
    return new HAMTMap(map._editable + 1, map._edit + 1, map._config, map._root, map._size);
}
/**
  Mark `map` as immutable.
 */
function _endMutation(map) {
    map._editable = map._editable && map._editable - 1;
    return map;
}
/**
  Mutate `map` within the context of `f`.
  @param f
  @param map HAMT
*/
function _mutate(f, map) {
    var transient = _beginMutation(map);
    f(transient);
    return _endMutation(transient);
}
;
/* Traversal
 ******************************************************************************/
/**
  Apply a continuation.
*/
function appk(k) {
    return k && lazyVisitChildren(k[0], k[1], k[2], k[3], k[4]);
}
/**
  Recursively visit all values stored in an array of nodes lazily.
*/
function lazyVisitChildren(len, children, i, f, k) {
    while (i < len) {
        var child = children[i++];
        if (child && !isEmptyNode(child)) return lazyVisit(child, f, [len, children, i, f, k]);
    }
    return appk(k);
}
/**
  Recursively visit all values stored in `node` lazily.
*/
function lazyVisit(node, f, k) {
    switch (node.type) {
        case LEAF:
            return {
                value: f(node),
                rest: k
            };
        case COLLISION:
        case ARRAY:
        case INDEX:
            var children = node.children;
            return lazyVisitChildren(children.length, children, 0, f, k);
        default:
            return appk(k);
    }
}
var DONE = {
    done: true
};
/**
  Lazily visit each value in map with function `f`.
*/
function visit(map, f) {
    return new HAMTMapIterator(lazyVisit(map._root, f));
}
/**
  Get a Javascsript iterator of `map`.

  Iterates over `[key, value]` arrays.
*/
function buildPairs(x) {
    return [x.key, x.value];
}
function _entries(map) {
    return visit(map, buildPairs);
}
;
/**
  Get array of all keys in `map`.

  Order is not guaranteed.
*/
function buildKeys(x) {
    return x.key;
}
function _keys(map) {
    return visit(map, buildKeys);
}
/**
  Get array of all values in `map`.

  Order is not guaranteed, duplicates are preserved.
*/
function buildValues(x) {
    return x.value;
}
function _values(map) {
    return visit(map, buildValues);
}
/* Fold
 ******************************************************************************/
/**
  Visit every entry in the map, aggregating data.

  Order of nodes is not guaranteed.

  @param f Function mapping accumulated value, value, and key to new value.
  @param z Starting value.
  @param m HAMT
*/
function _fold(f, z, m) {
    var root = m._root;
    if (root.type === LEAF) return f(z, root.value, root.key);
    var toVisit = [root.children];
    var children = undefined;
    while (children = toVisit.pop()) {
        for (var i = 0, len = children.length; i < len;) {
            var child = children[i++];
            if (child && child.type) {
                if (child.type === LEAF) z = f(z, child.value, child.key);else toVisit.push(child.children);
            }
        }
    }
    return z;
}
/**
  Visit every entry in the map, aggregating data.

  Order of nodes is not guaranteed.

  @param f Function invoked with value and key
  @param map HAMT
*/
function _forEach(f, map) {
    return _fold(function (_, value, key) {
        return f(value, key, map);
    }, null, map);
}
/* Export
 ******************************************************************************/
var HAMTMapIterator = exports.HAMTMapIterator = function () {
    function HAMTMapIterator(v) {
        _classCallCheck(this, HAMTMapIterator);

        this[Symbol.iterator] = function () {
            return this;
        };
        this.v = v;
    }

    HAMTMapIterator.prototype.next = function next() {
        if (!this.v) return DONE;
        var v0 = this.v;
        this.v = appk(v0.rest);
        return v0;
    };

    return HAMTMapIterator;
}();

var HAMTMap = function () {
    function HAMTMap() {
        var editable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var edit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var root = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : empty;
        var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        _classCallCheck(this, HAMTMap);

        this.isEmpty = function () {
            return isEmpty(this);
        };
        this[Symbol.iterator] = function () {
            return _entries(this);
        };
        this._editable = editable;
        this._edit = edit;
        this._config = {
            keyEq: config && config.keyEq || defKeyCompare,
            hash: config && config.hash || hash
        };
        this._root = root;
        this._size = size;
    }

    HAMTMap.prototype.setTree = function setTree(newRoot, newSize) {
        if (this._editable) {
            this._root = newRoot;
            this._size = newSize;
            return this;
        }
        return newRoot === this._root ? this : new HAMTMap(this._editable, this._edit, this._config, newRoot, newSize);
    };

    HAMTMap.prototype.tryGetHash = function tryGetHash(alt, hash, key) {
        return _tryGetHash(alt, hash, key, this);
    };

    HAMTMap.prototype.tryGet = function tryGet(alt, key) {
        return _tryGet(alt, key, this);
    };

    HAMTMap.prototype.getHash = function getHash(hash, key) {
        return _getHash(hash, key, this);
    };

    HAMTMap.prototype.get = function get(key, alt) {
        return _tryGet(alt, key, this);
    };

    HAMTMap.prototype.hasHash = function hasHash(hash, key) {
        return _hasHash(hash, key, this);
    };

    HAMTMap.prototype.has = function has(key) {
        return _has(key, this);
    };

    HAMTMap.prototype.modifyHash = function modifyHash(hash, key, f) {
        return _modifyHash(f, hash, key, this);
    };

    HAMTMap.prototype.modify = function modify(key, f) {
        return _modify(f, key, this);
    };

    HAMTMap.prototype.setHash = function setHash(hash, key, value) {
        return _setHash(hash, key, value, this);
    };

    HAMTMap.prototype.set = function set(key, value) {
        return _set(key, value, this);
    };

    HAMTMap.prototype.deleteHash = function deleteHash(hash, key) {
        return _removeHash(hash, key, this);
    };

    HAMTMap.prototype.removeHash = function removeHash(hash, key) {
        return _removeHash(hash, key, this);
    };

    HAMTMap.prototype.remove = function remove(key) {
        return _remove(key, this);
    };

    HAMTMap.prototype.beginMutation = function beginMutation() {
        return _beginMutation(this);
    };

    HAMTMap.prototype.endMutation = function endMutation() {
        return _endMutation(this);
    };

    HAMTMap.prototype.mutate = function mutate(f) {
        return _mutate(f, this);
    };

    HAMTMap.prototype.entries = function entries() {
        return _entries(this);
    };

    HAMTMap.prototype.keys = function keys() {
        return _keys(this);
    };

    HAMTMap.prototype.values = function values() {
        return _values(this);
    };

    HAMTMap.prototype.fold = function fold(f, z) {
        return _fold(f, z, this);
    };

    HAMTMap.prototype.forEach = function forEach(f) {
        return _forEach(f, this);
    };

    _createClass(HAMTMap, [{
        key: "size",
        get: function () {
            return this._size;
        }
    }]);

    return HAMTMap;
}();

exports.default = HAMTMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL2hhbXQuanMiXSwibmFtZXMiOlsib2JqIiwiU0laRSIsIkJVQ0tFVF9TSVpFIiwiTWF0aCIsIk1BU0siLCJNQVhfSU5ERVhfTk9ERSIsIk1JTl9BUlJBWV9OT0RFIiwibm90aGluZyIsInR5cGUiLCJfdHlwZW9mIiwic3RyIiwiaCIsImkiLCJsZW4iLCJjIiwieCIsInBvcGNvdW50IiwiYml0bWFwIiwiYml0Iiwib3V0IiwiYXJyIiwiZyIsIl9pIiwiTEVBRiIsIkNPTExJU0lPTiIsIklOREVYIiwiQVJSQVkiLCJlbXB0eSIsIl9faGFtdF9pc0VtcHR5IiwidiIsInNpemUiLCJMZWFmIiwiZWRpdCIsImhhc2giLCJrZXkiLCJ2YWx1ZSIsIl9tb2RpZnkiLCJMZWFmX19tb2RpZnkiLCJjaGlsZHJlbiIsIkNvbGxpc2lvbl9fbW9kaWZ5IiwibWFzayIsIkluZGV4ZWROb2RlX19tb2RpZnkiLCJBcnJheU5vZGVfX21vZGlmeSIsIm5vZGUiLCJjb3VudCIsInN1Yk5vZGVzIiwiQXJyYXlOb2RlIiwiZWxlbWVudHMiLCJlbGVtIiwiaXNFbXB0eU5vZGUiLCJJbmRleGVkTm9kZSIsImgxIiwiQ29sbGlzaW9uIiwic3ViSDEiLCJoYXNoRnJhZ21lbnQiLCJzdWJIMiIsInRvQml0bWFwIiwibWVyZ2VMZWF2ZXMiLCJzaGlmdCIsImxpc3QiLCJjaGlsZCIsImtleUVxIiwiX25ld1ZhbHVlIiwiZiIsImFycmF5U3BsaWNlT3V0IiwiYXJyYXlVcGRhdGUiLCJuZXdWYWx1ZSIsIl92IiwiY2FuRWRpdE5vZGUiLCJjYW5FZGl0IiwidXBkYXRlQ29sbGlzaW9uTGlzdCIsImZyYWciLCJpbmR4IiwiZnJvbUJpdG1hcCIsImV4aXN0cyIsImN1cnJlbnQiLCJuZXdDaGlsZHJlbiIsImlzTGVhZiIsImV4cGFuZCIsImFycmF5U3BsaWNlSW4iLCJuZXdDaGlsZCIsInBhY2siLCJtYXAiLCJ0cnlHZXRIYXNoIiwiaGFzSGFzaCIsIm5ld1Jvb3QiLCJtb2RpZnlIYXNoIiwiY29uc3RhbnQiLCJzZXRIYXNoIiwiZGVsIiwicmVtb3ZlSGFzaCIsInRyYW5zaWVudCIsImJlZ2luTXV0YXRpb24iLCJlbmRNdXRhdGlvbiIsImsiLCJsYXp5VmlzaXRDaGlsZHJlbiIsImxhenlWaXNpdCIsImFwcGsiLCJyZXN0IiwiRE9ORSIsImRvbmUiLCJ2aXNpdCIsInJvb3QiLCJtIiwidG9WaXNpdCIsInoiLCJTeW1ib2wiLCJ2MCIsIkhBTVRNYXAiLCJlZGl0YWJsZSIsImNvbmZpZyIsImlzRW1wdHkiLCJlbnRyaWVzIiwic2V0VHJlZSIsIm5ld1NpemUiLCJhbHQiLCJ0cnlHZXQiLCJnZXRIYXNoIiwiZ2V0IiwiaGFzIiwibW9kaWZ5Iiwic2V0IiwiZGVsZXRlSGFzaCIsInJlbW92ZSIsIm11dGF0ZSIsImtleXMiLCJ2YWx1ZXMiLCJmb2xkIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7QUFPQTtBQUNBLFNBQUEsT0FBQSxDQUFBLEdBQUEsRUFBc0I7QUFDbEIsV0FBT0EsT0FBTyxPQUFBLE1BQUEsS0FBUEEsV0FBQUEsSUFBd0NBLElBQUFBLFdBQUFBLEtBQXhDQSxNQUFBQSxHQUFBQSxRQUFBQSxHQUFnRixPQUF2RixHQUFBO0FBQ0g7QUFDRDs7QUFFQSxJQUFNQyxPQUFOLENBQUE7QUFDQSxJQUFNQyxjQUFjQyxLQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxFQUFwQixJQUFvQkEsQ0FBcEI7QUFDQSxJQUFNQyxPQUFPRixjQUFiLENBQUE7QUFDQSxJQUFNRyxpQkFBaUJILGNBQXZCLENBQUE7QUFDQSxJQUFNSSxpQkFBaUJKLGNBQXZCLENBQUE7QUFDQTs7QUFFQSxJQUFNSyxVQUFOLEVBQUE7QUFDQSxTQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQXFCO0FBQ2pCLFdBQU8sWUFBWTtBQUNmLGVBQUEsQ0FBQTtBQURKLEtBQUE7QUFHSDtBQUNEOzs7Ozs7QUFNQSxTQUFBLElBQUEsQ0FBQSxHQUFBLEVBQW1CO0FBQ2YsUUFBTUMsT0FBTyxP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O0FBQ1AsZUFBT3NCLE1BQUFBLENBQUFBLEVBQUFBLENBQUFBLEVBQVAsSUFBT0EsQ0FBUDs7O3NCQUVKQyxPLG9CQUFRakUsQyxFQUFHO0FBQ1AsZUFBT2lFLFNBQUFBLENBQUFBLEVBQVAsSUFBT0EsQ0FBUDs7Ozs7eUJBeEVPO0FBQ1AsbUJBQU8sS0FBUCxLQUFBO0FBQ0g7Ozs7OztrQkFuQmdCcEIsTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29kZSBiYXNlZCBvbjogaHR0cHM6Ly9naXRodWIuY29tL21hdHRiaWVybmVyL2hhbXRcbiAqIEF1dGhvcjogTWF0dCBCaWVybmVyXG4gKiBNSVQgbGljZW5zZVxuICpcbiAqIFdoaWNoIGlzIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXhjbGlweS9wZGF0YVxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn1cbi8qIENvbmZpZ3VyYXRpb25cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBTSVpFID0gNTtcbmNvbnN0IEJVQ0tFVF9TSVpFID0gTWF0aC5wb3coMiwgU0laRSk7XG5jb25zdCBNQVNLID0gQlVDS0VUX1NJWkUgLSAxO1xuY29uc3QgTUFYX0lOREVYX05PREUgPSBCVUNLRVRfU0laRSAvIDI7XG5jb25zdCBNSU5fQVJSQVlfTk9ERSA9IEJVQ0tFVF9TSVpFIC8gNDtcbi8qXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3Qgbm90aGluZyA9IHt9O1xuZnVuY3Rpb24gY29uc3RhbnQoeCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgIH07XG59XG4vKipcbiAgR2V0IDMyIGJpdCBoYXNoIG9mIHN0cmluZy5cblxuICBCYXNlZCBvbjpcbiAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83NjE2NDYxL2dlbmVyYXRlLWEtaGFzaC1mcm9tLXN0cmluZy1pbi1qYXZhc2NyaXB0LWpxdWVyeVxuKi9cbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHN0cik7XG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSByZXR1cm4gc3RyO1xuICAgIGlmICh0eXBlICE9PSAnc3RyaW5nJykgc3RyICs9ICcnO1xuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGggPSAoaCA8PCA1KSAtIGggKyBjIHwgMDtcbiAgICB9XG4gICAgcmV0dXJuIGg7XG59XG4vKiBCaXQgT3BzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIEhhbW1pbmcgd2VpZ2h0LlxuXG4gIFRha2VuIGZyb206IGh0dHA6Ly9qc3BlcmYuY29tL2hhbW1pbmctd2VpZ2h0XG4qL1xuZnVuY3Rpb24gcG9wY291bnQoeCkge1xuICAgIHggLT0geCA+PiAxICYgMHg1NTU1NTU1NTtcbiAgICB4ID0gKHggJiAweDMzMzMzMzMzKSArICh4ID4+IDIgJiAweDMzMzMzMzMzKTtcbiAgICB4ID0geCArICh4ID4+IDQpICYgMHgwZjBmMGYwZjtcbiAgICB4ICs9IHggPj4gODtcbiAgICB4ICs9IHggPj4gMTY7XG4gICAgcmV0dXJuIHggJiAweDdmO1xufVxuZnVuY3Rpb24gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKSB7XG4gICAgcmV0dXJuIGggPj4+IHNoaWZ0ICYgTUFTSztcbn1cbmZ1bmN0aW9uIHRvQml0bWFwKHgpIHtcbiAgICByZXR1cm4gMSA8PCB4O1xufVxuZnVuY3Rpb24gZnJvbUJpdG1hcChiaXRtYXAsIGJpdCkge1xuICAgIHJldHVybiBwb3Bjb3VudChiaXRtYXAgJiBiaXQgLSAxKTtcbn1cbi8qIEFycmF5IE9wc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBTZXQgYSB2YWx1ZSBpbiBhbiBhcnJheS5cblxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCB0aGUgaW5wdXQgYXJyYXkgYmUgbXV0YXRlZD9cbiAgQHBhcmFtIGF0IEluZGV4IHRvIGNoYW5nZS5cbiAgQHBhcmFtIHYgTmV3IHZhbHVlXG4gIEBwYXJhbSBhcnIgQXJyYXkuXG4qL1xuZnVuY3Rpb24gYXJyYXlVcGRhdGUobXV0YXRlLCBhdCwgdiwgYXJyKSB7XG4gICAgdmFyIG91dCA9IGFycjtcbiAgICBpZiAoIW11dGF0ZSkge1xuICAgICAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgICAgICAgb3V0ID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGFycltpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvdXRbYXRdID0gdjtcbiAgICByZXR1cm4gb3V0O1xufVxuLyoqXG4gIFJlbW92ZSBhIHZhbHVlIGZyb20gYW4gYXJyYXkuXG5cbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgdGhlIGlucHV0IGFycmF5IGJlIG11dGF0ZWQ/XG4gIEBwYXJhbSBhdCBJbmRleCB0byByZW1vdmUuXG4gIEBwYXJhbSBhcnIgQXJyYXkuXG4qL1xuZnVuY3Rpb24gYXJyYXlTcGxpY2VPdXQobXV0YXRlLCBhdCwgYXJyKSB7XG4gICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBnID0gMDtcbiAgICB2YXIgb3V0ID0gYXJyO1xuICAgIGlmIChtdXRhdGUpIHtcbiAgICAgICAgaSA9IGcgPSBhdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIHdoaWxlIChpIDwgYXQpIHtcbiAgICAgICAgICAgIG91dFtnKytdID0gYXJyW2krK107XG4gICAgICAgIH1cbiAgICAgICAgKytpO1xuICAgIH1cbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICBvdXRbZysrXSA9IGFycltpKytdO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuLyoqXG4gIEluc2VydCBhIHZhbHVlIGludG8gYW4gYXJyYXkuXG5cbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgdGhlIGlucHV0IGFycmF5IGJlIG11dGF0ZWQ/XG4gIEBwYXJhbSBhdCBJbmRleCB0byBpbnNlcnQgYXQuXG4gIEBwYXJhbSB2IFZhbHVlIHRvIGluc2VydCxcbiAgQHBhcmFtIGFyciBBcnJheS5cbiovXG5mdW5jdGlvbiBhcnJheVNwbGljZUluKG11dGF0ZSwgYXQsIHYsIGFycikge1xuICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICAgIGlmIChtdXRhdGUpIHtcbiAgICAgICAgdmFyIF9pID0gbGVuO1xuICAgICAgICB3aGlsZSAoX2kgPj0gYXQpIHtcbiAgICAgICAgICAgIGFycltfaS0tXSA9IGFycltfaV07XG4gICAgICAgIH1cbiAgICAgICAgYXJyW2F0XSA9IHY7XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICAgIHZhciBpID0gMCxcbiAgICAgICAgZyA9IDA7XG4gICAgdmFyIG91dCA9IG5ldyBBcnJheShsZW4gKyAxKTtcbiAgICB3aGlsZSAoaSA8IGF0KSB7XG4gICAgICAgIG91dFtnKytdID0gYXJyW2krK107XG4gICAgfVxuICAgIG91dFthdF0gPSB2O1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIG91dFsrK2ddID0gYXJyW2krK107XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG4vKiBOb2RlIFN0cnVjdHVyZXNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBMRUFGID0gMTtcbmNvbnN0IENPTExJU0lPTiA9IDI7XG5jb25zdCBJTkRFWCA9IDM7XG5jb25zdCBBUlJBWSA9IDQ7XG4vKipcbiAgRW1wdHkgbm9kZS5cbiovXG5jb25zdCBlbXB0eSA9IHtcbiAgICBfX2hhbXRfaXNFbXB0eTogdHJ1ZSxcbiAgICBfbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xuICAgICAgICB2YXIgdiA9IGYoKTtcbiAgICAgICAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiBlbXB0eTtcbiAgICAgICAgKytzaXplLnZhbHVlO1xuICAgICAgICByZXR1cm4gTGVhZihlZGl0LCBoLCBrLCB2KTtcbiAgICB9XG59O1xuZnVuY3Rpb24gaXNFbXB0eU5vZGUoeCkge1xuICAgIHJldHVybiB4ID09PSBlbXB0eSB8fCB4ICYmIHguX19oYW10X2lzRW1wdHk7XG59XG4vKipcbiAgTGVhZiBob2xkaW5nIGEgdmFsdWUuXG5cbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXG4gIEBtZW1iZXIgaGFzaCBIYXNoIG9mIGtleS5cbiAgQG1lbWJlciBrZXkgS2V5LlxuICBAbWVtYmVyIHZhbHVlIFZhbHVlIHN0b3JlZC5cbiovXG5mdW5jdGlvbiBMZWFmKGVkaXQsIGhhc2gsIGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBMRUFGLFxuICAgICAgICBlZGl0OiBlZGl0LFxuICAgICAgICBoYXNoOiBoYXNoLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBfbW9kaWZ5OiBMZWFmX19tb2RpZnlcbiAgICB9O1xufVxuLyoqXG4gIExlYWYgaG9sZGluZyBtdWx0aXBsZSB2YWx1ZXMgd2l0aCB0aGUgc2FtZSBoYXNoIGJ1dCBkaWZmZXJlbnQga2V5cy5cblxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cbiAgQG1lbWJlciBoYXNoIEhhc2ggb2Yga2V5LlxuICBAbWVtYmVyIGNoaWxkcmVuIEFycmF5IG9mIGNvbGxpc2lvbiBjaGlsZHJlbiBub2RlLlxuKi9cbmZ1bmN0aW9uIENvbGxpc2lvbihlZGl0LCBoYXNoLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IENPTExJU0lPTixcbiAgICAgICAgZWRpdDogZWRpdCxcbiAgICAgICAgaGFzaDogaGFzaCxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgICBfbW9kaWZ5OiBDb2xsaXNpb25fX21vZGlmeVxuICAgIH07XG59XG4vKipcbiAgSW50ZXJuYWwgbm9kZSB3aXRoIGEgc3BhcnNlIHNldCBvZiBjaGlsZHJlbi5cblxuICBVc2VzIGEgYml0bWFwIGFuZCBhcnJheSB0byBwYWNrIGNoaWxkcmVuLlxuXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxuICBAbWVtYmVyIG1hc2sgQml0bWFwIHRoYXQgZW5jb2RlIHRoZSBwb3NpdGlvbnMgb2YgY2hpbGRyZW4gaW4gdGhlIGFycmF5LlxuICBAbWVtYmVyIGNoaWxkcmVuIEFycmF5IG9mIGNoaWxkIG5vZGVzLlxuKi9cbmZ1bmN0aW9uIEluZGV4ZWROb2RlKGVkaXQsIG1hc2ssIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogSU5ERVgsXG4gICAgICAgIGVkaXQ6IGVkaXQsXG4gICAgICAgIG1hc2s6IG1hc2ssXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgICAgX21vZGlmeTogSW5kZXhlZE5vZGVfX21vZGlmeVxuICAgIH07XG59XG4vKipcbiAgSW50ZXJuYWwgbm9kZSB3aXRoIG1hbnkgY2hpbGRyZW4uXG5cbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXG4gIEBtZW1iZXIgc2l6ZSBOdW1iZXIgb2YgY2hpbGRyZW4uXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY2hpbGQgbm9kZXMuXG4qL1xuZnVuY3Rpb24gQXJyYXlOb2RlKGVkaXQsIHNpemUsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQVJSQVksXG4gICAgICAgIGVkaXQ6IGVkaXQsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgICAgX21vZGlmeTogQXJyYXlOb2RlX19tb2RpZnlcbiAgICB9O1xufVxuLyoqXG4gICAgSXMgYG5vZGVgIGEgbGVhZiBub2RlP1xuKi9cbmZ1bmN0aW9uIGlzTGVhZihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgPT09IGVtcHR5IHx8IG5vZGUudHlwZSA9PT0gTEVBRiB8fCBub2RlLnR5cGUgPT09IENPTExJU0lPTjtcbn1cbi8qIEludGVybmFsIG5vZGUgb3BlcmF0aW9ucy5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgRXhwYW5kIGFuIGluZGV4ZWQgbm9kZSBpbnRvIGFuIGFycmF5IG5vZGUuXG5cbiAgQHBhcmFtIGVkaXQgQ3VycmVudCBlZGl0LlxuICBAcGFyYW0gZnJhZyBJbmRleCBvZiBhZGRlZCBjaGlsZC5cbiAgQHBhcmFtIGNoaWxkIEFkZGVkIGNoaWxkLlxuICBAcGFyYW0gbWFzayBJbmRleCBub2RlIG1hc2sgYmVmb3JlIGNoaWxkIGFkZGVkLlxuICBAcGFyYW0gc3ViTm9kZXMgSW5kZXggbm9kZSBjaGlsZHJlbiBiZWZvcmUgY2hpbGQgYWRkZWQuXG4qL1xuZnVuY3Rpb24gZXhwYW5kKGVkaXQsIGZyYWcsIGNoaWxkLCBiaXRtYXAsIHN1Yk5vZGVzKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIHZhciBiaXQgPSBiaXRtYXA7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgYml0OyArK2kpIHtcbiAgICAgICAgaWYgKGJpdCAmIDEpIGFycltpXSA9IHN1Yk5vZGVzW2NvdW50KytdO1xuICAgICAgICBiaXQgPj4+PSAxO1xuICAgIH1cbiAgICBhcnJbZnJhZ10gPSBjaGlsZDtcbiAgICByZXR1cm4gQXJyYXlOb2RlKGVkaXQsIGNvdW50ICsgMSwgYXJyKTtcbn1cbi8qKlxuICBDb2xsYXBzZSBhbiBhcnJheSBub2RlIGludG8gYSBpbmRleGVkIG5vZGUuXG5cbiAgQHBhcmFtIGVkaXQgQ3VycmVudCBlZGl0LlxuICBAcGFyYW0gY291bnQgTnVtYmVyIG9mIGVsZW1lbnRzIGluIG5ldyBhcnJheS5cbiAgQHBhcmFtIHJlbW92ZWQgSW5kZXggb2YgcmVtb3ZlZCBlbGVtZW50LlxuICBAcGFyYW0gZWxlbWVudHMgQXJyYXkgbm9kZSBjaGlsZHJlbiBiZWZvcmUgcmVtb3ZlLlxuKi9cbmZ1bmN0aW9uIHBhY2soZWRpdCwgY291bnQsIHJlbW92ZWQsIGVsZW1lbnRzKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gbmV3IEFycmF5KGNvdW50IC0gMSk7XG4gICAgdmFyIGcgPSAwO1xuICAgIHZhciBiaXRtYXAgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZiAoaSAhPT0gcmVtb3ZlZCkge1xuICAgICAgICAgICAgdmFyIGVsZW0gPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChlbGVtICYmICFpc0VtcHR5Tm9kZShlbGVtKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2crK10gPSBlbGVtO1xuICAgICAgICAgICAgICAgIGJpdG1hcCB8PSAxIDw8IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIGJpdG1hcCwgY2hpbGRyZW4pO1xufVxuLyoqXG4gIE1lcmdlIHR3byBsZWFmIG5vZGVzLlxuXG4gIEBwYXJhbSBzaGlmdCBDdXJyZW50IHNoaWZ0LlxuICBAcGFyYW0gaDEgTm9kZSAxIGhhc2guXG4gIEBwYXJhbSBuMSBOb2RlIDEuXG4gIEBwYXJhbSBoMiBOb2RlIDIgaGFzaC5cbiAgQHBhcmFtIG4yIE5vZGUgMi5cbiovXG5mdW5jdGlvbiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgaDEsIG4xLCBoMiwgbjIpIHtcbiAgICBpZiAoaDEgPT09IGgyKSByZXR1cm4gQ29sbGlzaW9uKGVkaXQsIGgxLCBbbjIsIG4xXSk7XG4gICAgdmFyIHN1YkgxID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoMSk7XG4gICAgdmFyIHN1YkgyID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoMik7XG4gICAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIHRvQml0bWFwKHN1YkgxKSB8IHRvQml0bWFwKHN1YkgyKSwgc3ViSDEgPT09IHN1YkgyID8gW21lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0ICsgU0laRSwgaDEsIG4xLCBoMiwgbjIpXSA6IHN1YkgxIDwgc3ViSDIgPyBbbjEsIG4yXSA6IFtuMiwgbjFdKTtcbn1cbi8qKlxuICBVcGRhdGUgYW4gZW50cnkgaW4gYSBjb2xsaXNpb24gbGlzdC5cblxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCBtdXRhdGlvbiBiZSB1c2VkP1xuICBAcGFyYW0gZWRpdCBDdXJyZW50IGVkaXQuXG4gIEBwYXJhbSBrZXlFcSBLZXkgY29tcGFyZSBmdW5jdGlvbi5cbiAgQHBhcmFtIGhhc2ggSGFzaCBvZiBjb2xsaXNpb24uXG4gIEBwYXJhbSBsaXN0IENvbGxpc2lvbiBsaXN0LlxuICBAcGFyYW0gZiBVcGRhdGUgZnVuY3Rpb24uXG4gIEBwYXJhbSBrIEtleSB0byB1cGRhdGUuXG4gIEBwYXJhbSBzaXplIFNpemUgcmVmLlxuKi9cbmZ1bmN0aW9uIHVwZGF0ZUNvbGxpc2lvbkxpc3QobXV0YXRlLCBlZGl0LCBrZXlFcSwgaCwgbGlzdCwgZiwgaywgc2l6ZSkge1xuICAgIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGxpc3RbaV07XG4gICAgICAgIGlmIChrZXlFcShrLCBjaGlsZC5rZXkpKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBjaGlsZC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBfbmV3VmFsdWUgPSBmKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChfbmV3VmFsdWUgPT09IHZhbHVlKSByZXR1cm4gbGlzdDtcbiAgICAgICAgICAgIGlmIChfbmV3VmFsdWUgPT09IG5vdGhpbmcpIHtcbiAgICAgICAgICAgICAgICAtLXNpemUudmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5U3BsaWNlT3V0KG11dGF0ZSwgaSwgbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlVcGRhdGUobXV0YXRlLCBpLCBMZWFmKGVkaXQsIGgsIGssIF9uZXdWYWx1ZSksIGxpc3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBuZXdWYWx1ZSA9IGYoKTtcbiAgICBpZiAobmV3VmFsdWUgPT09IG5vdGhpbmcpIHJldHVybiBsaXN0O1xuICAgICsrc2l6ZS52YWx1ZTtcbiAgICByZXR1cm4gYXJyYXlVcGRhdGUobXV0YXRlLCBsZW4sIExlYWYoZWRpdCwgaCwgaywgbmV3VmFsdWUpLCBsaXN0KTtcbn1cbmZ1bmN0aW9uIGNhbkVkaXROb2RlKGVkaXQsIG5vZGUpIHtcbiAgICByZXR1cm4gZWRpdCA9PT0gbm9kZS5lZGl0O1xufVxuLyogRWRpdGluZ1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIExlYWZfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcbiAgICBpZiAoa2V5RXEoaywgdGhpcy5rZXkpKSB7XG4gICAgICAgIHZhciBfdiA9IGYodGhpcy52YWx1ZSk7XG4gICAgICAgIGlmIChfdiA9PT0gdGhpcy52YWx1ZSkgcmV0dXJuIHRoaXM7ZWxzZSBpZiAoX3YgPT09IG5vdGhpbmcpIHtcbiAgICAgICAgICAgIC0tc2l6ZS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FuRWRpdE5vZGUoZWRpdCwgdGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBfdjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBMZWFmKGVkaXQsIGgsIGssIF92KTtcbiAgICB9XG4gICAgdmFyIHYgPSBmKCk7XG4gICAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiB0aGlzO1xuICAgICsrc2l6ZS52YWx1ZTtcbiAgICByZXR1cm4gbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQsIHRoaXMuaGFzaCwgdGhpcywgaCwgTGVhZihlZGl0LCBoLCBrLCB2KSk7XG59XG5mdW5jdGlvbiBDb2xsaXNpb25fX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcbiAgICBpZiAoaCA9PT0gdGhpcy5oYXNoKSB7XG4gICAgICAgIHZhciBjYW5FZGl0ID0gY2FuRWRpdE5vZGUoZWRpdCwgdGhpcyk7XG4gICAgICAgIHZhciBsaXN0ID0gdXBkYXRlQ29sbGlzaW9uTGlzdChjYW5FZGl0LCBlZGl0LCBrZXlFcSwgdGhpcy5oYXNoLCB0aGlzLmNoaWxkcmVuLCBmLCBrLCBzaXplKTtcbiAgICAgICAgaWYgKGxpc3QgPT09IHRoaXMuY2hpbGRyZW4pIHJldHVybiB0aGlzO1xuICAgICAgICByZXR1cm4gbGlzdC5sZW5ndGggPiAxID8gQ29sbGlzaW9uKGVkaXQsIHRoaXMuaGFzaCwgbGlzdCkgOiBsaXN0WzBdOyAvLyBjb2xsYXBzZSBzaW5nbGUgZWxlbWVudCBjb2xsaXNpb24gbGlzdFxuICAgIH1cbiAgICB2YXIgdiA9IGYoKTtcbiAgICBpZiAodiA9PT0gbm90aGluZykgcmV0dXJuIHRoaXM7XG4gICAgKytzaXplLnZhbHVlO1xuICAgIHJldHVybiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgdGhpcy5oYXNoLCB0aGlzLCBoLCBMZWFmKGVkaXQsIGgsIGssIHYpKTtcbn1cbmZ1bmN0aW9uIEluZGV4ZWROb2RlX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XG4gICAgdmFyIG1hc2sgPSB0aGlzLm1hc2s7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICB2YXIgZnJhZyA9IGhhc2hGcmFnbWVudChzaGlmdCwgaCk7XG4gICAgdmFyIGJpdCA9IHRvQml0bWFwKGZyYWcpO1xuICAgIHZhciBpbmR4ID0gZnJvbUJpdG1hcChtYXNrLCBiaXQpO1xuICAgIHZhciBleGlzdHMgPSBtYXNrICYgYml0O1xuICAgIHZhciBjdXJyZW50ID0gZXhpc3RzID8gY2hpbGRyZW5baW5keF0gOiBlbXB0eTtcbiAgICB2YXIgY2hpbGQgPSBjdXJyZW50Ll9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0ICsgU0laRSwgZiwgaCwgaywgc2l6ZSk7XG4gICAgaWYgKGN1cnJlbnQgPT09IGNoaWxkKSByZXR1cm4gdGhpcztcbiAgICB2YXIgY2FuRWRpdCA9IGNhbkVkaXROb2RlKGVkaXQsIHRoaXMpO1xuICAgIHZhciBiaXRtYXAgPSBtYXNrO1xuICAgIHZhciBuZXdDaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZXhpc3RzICYmIGlzRW1wdHlOb2RlKGNoaWxkKSkge1xuICAgICAgICAvLyByZW1vdmVcbiAgICAgICAgYml0bWFwICY9IH5iaXQ7XG4gICAgICAgIGlmICghYml0bWFwKSByZXR1cm4gZW1wdHk7XG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPD0gMiAmJiBpc0xlYWYoY2hpbGRyZW5baW5keCBeIDFdKSkgcmV0dXJuIGNoaWxkcmVuW2luZHggXiAxXTsgLy8gY29sbGFwc2VcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVNwbGljZU91dChjYW5FZGl0LCBpbmR4LCBjaGlsZHJlbik7XG4gICAgfSBlbHNlIGlmICghZXhpc3RzICYmICFpc0VtcHR5Tm9kZShjaGlsZCkpIHtcbiAgICAgICAgLy8gYWRkXG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPj0gTUFYX0lOREVYX05PREUpIHJldHVybiBleHBhbmQoZWRpdCwgZnJhZywgY2hpbGQsIG1hc2ssIGNoaWxkcmVuKTtcbiAgICAgICAgYml0bWFwIHw9IGJpdDtcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVNwbGljZUluKGNhbkVkaXQsIGluZHgsIGNoaWxkLCBjaGlsZHJlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbW9kaWZ5XG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgaW5keCwgY2hpbGQsIGNoaWxkcmVuKTtcbiAgICB9XG4gICAgaWYgKGNhbkVkaXQpIHtcbiAgICAgICAgdGhpcy5tYXNrID0gYml0bWFwO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gSW5kZXhlZE5vZGUoZWRpdCwgYml0bWFwLCBuZXdDaGlsZHJlbik7XG59XG5mdW5jdGlvbiBBcnJheU5vZGVfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcbiAgICB2YXIgY291bnQgPSB0aGlzLnNpemU7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICB2YXIgZnJhZyA9IGhhc2hGcmFnbWVudChzaGlmdCwgaCk7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5bZnJhZ107XG4gICAgdmFyIG5ld0NoaWxkID0gKGNoaWxkIHx8IGVtcHR5KS5fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCArIFNJWkUsIGYsIGgsIGssIHNpemUpO1xuICAgIGlmIChjaGlsZCA9PT0gbmV3Q2hpbGQpIHJldHVybiB0aGlzO1xuICAgIHZhciBjYW5FZGl0ID0gY2FuRWRpdE5vZGUoZWRpdCwgdGhpcyk7XG4gICAgdmFyIG5ld0NoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc0VtcHR5Tm9kZShjaGlsZCkgJiYgIWlzRW1wdHlOb2RlKG5ld0NoaWxkKSkge1xuICAgICAgICAvLyBhZGRcbiAgICAgICAgKytjb3VudDtcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBmcmFnLCBuZXdDaGlsZCwgY2hpbGRyZW4pO1xuICAgIH0gZWxzZSBpZiAoIWlzRW1wdHlOb2RlKGNoaWxkKSAmJiBpc0VtcHR5Tm9kZShuZXdDaGlsZCkpIHtcbiAgICAgICAgLy8gcmVtb3ZlXG4gICAgICAgIC0tY291bnQ7XG4gICAgICAgIGlmIChjb3VudCA8PSBNSU5fQVJSQVlfTk9ERSkgcmV0dXJuIHBhY2soZWRpdCwgY291bnQsIGZyYWcsIGNoaWxkcmVuKTtcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBmcmFnLCBlbXB0eSwgY2hpbGRyZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG1vZGlmeVxuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGZyYWcsIG5ld0NoaWxkLCBjaGlsZHJlbik7XG4gICAgfVxuICAgIGlmIChjYW5FZGl0KSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IGNvdW50O1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXlOb2RlKGVkaXQsIGNvdW50LCBuZXdDaGlsZHJlbik7XG59XG47XG4vKiBRdWVyaWVzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gICAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgYSBjdXN0b20gYGhhc2hgLlxuXG4gICAgUmV0dXJucyB0aGUgdmFsdWUgb3IgYGFsdGAgaWYgbm9uZS5cbiovXG5mdW5jdGlvbiB0cnlHZXRIYXNoKGFsdCwgaGFzaCwga2V5LCBtYXApIHtcbiAgICB2YXIgbm9kZSA9IG1hcC5fcm9vdDtcbiAgICB2YXIgc2hpZnQgPSAwO1xuICAgIHZhciBrZXlFcSA9IG1hcC5fY29uZmlnLmtleUVxO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIExFQUY6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5RXEoa2V5LCBub2RlLmtleSkgPyBub2RlLnZhbHVlIDogYWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQ09MTElTSU9OOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc2ggPT09IG5vZGUuaGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlFcShrZXksIGNoaWxkLmtleSkpIHJldHVybiBjaGlsZC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgSU5ERVg6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IGhhc2hGcmFnbWVudChzaGlmdCwgaGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiaXQgPSB0b0JpdG1hcChmcmFnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubWFzayAmIGJpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bZnJvbUJpdG1hcChub2RlLm1hc2ssIGJpdCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQgKz0gU0laRTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBBUlJBWTpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuW2hhc2hGcmFnbWVudChzaGlmdCwgaGFzaCldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQgKz0gU0laRTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gYWx0O1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gIExvb2t1cCB0aGUgdmFsdWUgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG5cbiAgQHNlZSBgdHJ5R2V0SGFzaGBcbiovXG5mdW5jdGlvbiB0cnlHZXQoYWx0LCBrZXksIG1hcCkge1xuICAgIHJldHVybiB0cnlHZXRIYXNoKGFsdCwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XG59XG4vKipcbiAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgYSBjdXN0b20gYGhhc2hgLlxuXG4gIFJldHVybnMgdGhlIHZhbHVlIG9yIGB1bmRlZmluZWRgIGlmIG5vbmUuXG4qL1xuZnVuY3Rpb24gZ2V0SGFzaChoYXNoLCBrZXksIG1hcCkge1xuICAgIHJldHVybiB0cnlHZXRIYXNoKHVuZGVmaW5lZCwgaGFzaCwga2V5LCBtYXApO1xufVxuLyoqXG4gIExvb2t1cCB0aGUgdmFsdWUgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG5cbiAgQHNlZSBgZ2V0YFxuKi9cbmZ1bmN0aW9uIGdldChrZXksIG1hcCkge1xuICAgIHJldHVybiB0cnlHZXRIYXNoKHVuZGVmaW5lZCwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XG59XG4vKipcbiAgICBEb2VzIGFuIGVudHJ5IGV4aXN0IGZvciBga2V5YCBpbiBgbWFwYD8gVXNlcyBjdXN0b20gYGhhc2hgLlxuKi9cbmZ1bmN0aW9uIGhhc0hhc2goaGFzaCwga2V5LCBtYXApIHtcbiAgICByZXR1cm4gdHJ5R2V0SGFzaChub3RoaW5nLCBoYXNoLCBrZXksIG1hcCkgIT09IG5vdGhpbmc7XG59XG4vKipcbiAgRG9lcyBhbiBlbnRyeSBleGlzdCBmb3IgYGtleWAgaW4gYG1hcGA/IFVzZXMgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cbiovXG5mdW5jdGlvbiBoYXMoa2V5LCBtYXApIHtcbiAgICByZXR1cm4gaGFzSGFzaChtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcbn1cbmZ1bmN0aW9uIGRlZktleUNvbXBhcmUoeCwgeSkge1xuICAgIHJldHVybiB4ID09PSB5O1xufVxuLyoqXG4gIERvZXMgYG1hcGAgY29udGFpbiBhbnkgZWxlbWVudHM/XG4qL1xuZnVuY3Rpb24gaXNFbXB0eShtYXApIHtcbiAgICByZXR1cm4gbWFwICYmICEhaXNFbXB0eU5vZGUobWFwLl9yb290KTtcbn1cbi8qIFVwZGF0ZXNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgICBBbHRlciB0aGUgdmFsdWUgc3RvcmVkIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBmdW5jdGlvbiBgZmAgdXNpbmdcbiAgICBjdXN0b20gaGFzaC5cblxuICAgIGBmYCBpcyBpbnZva2VkIHdpdGggdGhlIGN1cnJlbnQgdmFsdWUgZm9yIGBrYCBpZiBpdCBleGlzdHMsXG4gICAgb3Igbm8gYXJndW1lbnRzIGlmIG5vIHN1Y2ggdmFsdWUgZXhpc3RzLiBgbW9kaWZ5YCB3aWxsIGFsd2F5cyBlaXRoZXJcbiAgICB1cGRhdGUgb3IgaW5zZXJ0IGEgdmFsdWUgaW50byB0aGUgbWFwLlxuXG4gICAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSBtb2RpZmllZCB2YWx1ZS4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXG4qL1xuZnVuY3Rpb24gbW9kaWZ5SGFzaChmLCBoYXNoLCBrZXksIG1hcCkge1xuICAgIHZhciBzaXplID0geyB2YWx1ZTogbWFwLl9zaXplIH07XG4gICAgdmFyIG5ld1Jvb3QgPSBtYXAuX3Jvb3QuX21vZGlmeShtYXAuX2VkaXRhYmxlID8gbWFwLl9lZGl0IDogTmFOLCBtYXAuX2NvbmZpZy5rZXlFcSwgMCwgZiwgaGFzaCwga2V5LCBzaXplKTtcbiAgICByZXR1cm4gbWFwLnNldFRyZWUobmV3Um9vdCwgc2l6ZS52YWx1ZSk7XG59XG4vKipcbiAgQWx0ZXIgdGhlIHZhbHVlIHN0b3JlZCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgZnVuY3Rpb24gYGZgIHVzaW5nXG4gIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG5cbiAgQHNlZSBgbW9kaWZ5SGFzaGBcbiovXG5mdW5jdGlvbiBtb2RpZnkoZiwga2V5LCBtYXApIHtcbiAgICByZXR1cm4gbW9kaWZ5SGFzaChmLCBtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcbn1cbi8qKlxuICBTdG9yZSBgdmFsdWVgIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBjdXN0b20gYGhhc2hgLlxuXG4gIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgbW9kaWZpZWQgdmFsdWUuIERvZXMgbm90IGFsdGVyIGBtYXBgLlxuKi9cbmZ1bmN0aW9uIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSwgbWFwKSB7XG4gICAgcmV0dXJuIG1vZGlmeUhhc2goY29uc3RhbnQodmFsdWUpLCBoYXNoLCBrZXksIG1hcCk7XG59XG4vKipcbiAgU3RvcmUgYHZhbHVlYCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cblxuICBAc2VlIGBzZXRIYXNoYFxuKi9cbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBtYXApIHtcbiAgICByZXR1cm4gc2V0SGFzaChtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgdmFsdWUsIG1hcCk7XG59XG4vKipcbiAgUmVtb3ZlIHRoZSBlbnRyeSBmb3IgYGtleWAgaW4gYG1hcGAuXG5cbiAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSB2YWx1ZSByZW1vdmVkLiBEb2VzIG5vdCBhbHRlciBgbWFwYC5cbiovXG5jb25zdCBkZWwgPSBjb25zdGFudChub3RoaW5nKTtcbmZ1bmN0aW9uIHJlbW92ZUhhc2goaGFzaCwga2V5LCBtYXApIHtcbiAgICByZXR1cm4gbW9kaWZ5SGFzaChkZWwsIGhhc2gsIGtleSwgbWFwKTtcbn1cbi8qKlxuICBSZW1vdmUgdGhlIGVudHJ5IGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuXG4gIEBzZWUgYHJlbW92ZUhhc2hgXG4qL1xuZnVuY3Rpb24gcmVtb3ZlKGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIHJlbW92ZUhhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XG59XG4vKiBNdXRhdGlvblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBNYXJrIGBtYXBgIGFzIG11dGFibGUuXG4gKi9cbmZ1bmN0aW9uIGJlZ2luTXV0YXRpb24obWFwKSB7XG4gICAgcmV0dXJuIG5ldyBIQU1UTWFwKG1hcC5fZWRpdGFibGUgKyAxLCBtYXAuX2VkaXQgKyAxLCBtYXAuX2NvbmZpZywgbWFwLl9yb290LCBtYXAuX3NpemUpO1xufVxuLyoqXG4gIE1hcmsgYG1hcGAgYXMgaW1tdXRhYmxlLlxuICovXG5mdW5jdGlvbiBlbmRNdXRhdGlvbihtYXApIHtcbiAgICBtYXAuX2VkaXRhYmxlID0gbWFwLl9lZGl0YWJsZSAmJiBtYXAuX2VkaXRhYmxlIC0gMTtcbiAgICByZXR1cm4gbWFwO1xufVxuLyoqXG4gIE11dGF0ZSBgbWFwYCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYGZgLlxuICBAcGFyYW0gZlxuICBAcGFyYW0gbWFwIEhBTVRcbiovXG5mdW5jdGlvbiBtdXRhdGUoZiwgbWFwKSB7XG4gICAgdmFyIHRyYW5zaWVudCA9IGJlZ2luTXV0YXRpb24obWFwKTtcbiAgICBmKHRyYW5zaWVudCk7XG4gICAgcmV0dXJuIGVuZE11dGF0aW9uKHRyYW5zaWVudCk7XG59XG47XG4vKiBUcmF2ZXJzYWxcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgQXBwbHkgYSBjb250aW51YXRpb24uXG4qL1xuZnVuY3Rpb24gYXBwayhrKSB7XG4gICAgcmV0dXJuIGsgJiYgbGF6eVZpc2l0Q2hpbGRyZW4oa1swXSwga1sxXSwga1syXSwga1szXSwga1s0XSk7XG59XG4vKipcbiAgUmVjdXJzaXZlbHkgdmlzaXQgYWxsIHZhbHVlcyBzdG9yZWQgaW4gYW4gYXJyYXkgb2Ygbm9kZXMgbGF6aWx5LlxuKi9cbmZ1bmN0aW9uIGxhenlWaXNpdENoaWxkcmVuKGxlbiwgY2hpbGRyZW4sIGksIGYsIGspIHtcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpKytdO1xuICAgICAgICBpZiAoY2hpbGQgJiYgIWlzRW1wdHlOb2RlKGNoaWxkKSkgcmV0dXJuIGxhenlWaXNpdChjaGlsZCwgZiwgW2xlbiwgY2hpbGRyZW4sIGksIGYsIGtdKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcGsoayk7XG59XG4vKipcbiAgUmVjdXJzaXZlbHkgdmlzaXQgYWxsIHZhbHVlcyBzdG9yZWQgaW4gYG5vZGVgIGxhemlseS5cbiovXG5mdW5jdGlvbiBsYXp5VmlzaXQobm9kZSwgZiwgaykge1xuICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgIGNhc2UgTEVBRjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGYobm9kZSksXG4gICAgICAgICAgICAgICAgcmVzdDoga1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBDT0xMSVNJT046XG4gICAgICAgIGNhc2UgQVJSQVk6XG4gICAgICAgIGNhc2UgSU5ERVg6XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgcmV0dXJuIGxhenlWaXNpdENoaWxkcmVuKGNoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW4sIDAsIGYsIGspO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGFwcGsoayk7XG4gICAgfVxufVxuY29uc3QgRE9ORSA9IHtcbiAgICBkb25lOiB0cnVlXG59O1xuLyoqXG4gIExhemlseSB2aXNpdCBlYWNoIHZhbHVlIGluIG1hcCB3aXRoIGZ1bmN0aW9uIGBmYC5cbiovXG5mdW5jdGlvbiB2aXNpdChtYXAsIGYpIHtcbiAgICByZXR1cm4gbmV3IEhBTVRNYXBJdGVyYXRvcihsYXp5VmlzaXQobWFwLl9yb290LCBmKSk7XG59XG4vKipcbiAgR2V0IGEgSmF2YXNjc3JpcHQgaXRlcmF0b3Igb2YgYG1hcGAuXG5cbiAgSXRlcmF0ZXMgb3ZlciBgW2tleSwgdmFsdWVdYCBhcnJheXMuXG4qL1xuZnVuY3Rpb24gYnVpbGRQYWlycyh4KSB7XG4gICAgcmV0dXJuIFt4LmtleSwgeC52YWx1ZV07XG59XG5mdW5jdGlvbiBlbnRyaWVzKG1hcCkge1xuICAgIHJldHVybiB2aXNpdChtYXAsIGJ1aWxkUGFpcnMpO1xufVxuO1xuLyoqXG4gIEdldCBhcnJheSBvZiBhbGwga2V5cyBpbiBgbWFwYC5cblxuICBPcmRlciBpcyBub3QgZ3VhcmFudGVlZC5cbiovXG5mdW5jdGlvbiBidWlsZEtleXMoeCkge1xuICAgIHJldHVybiB4LmtleTtcbn1cbmZ1bmN0aW9uIGtleXMobWFwKSB7XG4gICAgcmV0dXJuIHZpc2l0KG1hcCwgYnVpbGRLZXlzKTtcbn1cbi8qKlxuICBHZXQgYXJyYXkgb2YgYWxsIHZhbHVlcyBpbiBgbWFwYC5cblxuICBPcmRlciBpcyBub3QgZ3VhcmFudGVlZCwgZHVwbGljYXRlcyBhcmUgcHJlc2VydmVkLlxuKi9cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKHgpIHtcbiAgICByZXR1cm4geC52YWx1ZTtcbn1cbmZ1bmN0aW9uIHZhbHVlcyhtYXApIHtcbiAgICByZXR1cm4gdmlzaXQobWFwLCBidWlsZFZhbHVlcyk7XG59XG4vKiBGb2xkXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIFZpc2l0IGV2ZXJ5IGVudHJ5IGluIHRoZSBtYXAsIGFnZ3JlZ2F0aW5nIGRhdGEuXG5cbiAgT3JkZXIgb2Ygbm9kZXMgaXMgbm90IGd1YXJhbnRlZWQuXG5cbiAgQHBhcmFtIGYgRnVuY3Rpb24gbWFwcGluZyBhY2N1bXVsYXRlZCB2YWx1ZSwgdmFsdWUsIGFuZCBrZXkgdG8gbmV3IHZhbHVlLlxuICBAcGFyYW0geiBTdGFydGluZyB2YWx1ZS5cbiAgQHBhcmFtIG0gSEFNVFxuKi9cbmZ1bmN0aW9uIGZvbGQoZiwgeiwgbSkge1xuICAgIHZhciByb290ID0gbS5fcm9vdDtcbiAgICBpZiAocm9vdC50eXBlID09PSBMRUFGKSByZXR1cm4gZih6LCByb290LnZhbHVlLCByb290LmtleSk7XG4gICAgdmFyIHRvVmlzaXQgPSBbcm9vdC5jaGlsZHJlbl07XG4gICAgdmFyIGNoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgIHdoaWxlIChjaGlsZHJlbiA9IHRvVmlzaXQucG9wKCkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2krK107XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQudHlwZSkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBMRUFGKSB6ID0gZih6LCBjaGlsZC52YWx1ZSwgY2hpbGQua2V5KTtlbHNlIHRvVmlzaXQucHVzaChjaGlsZC5jaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHo7XG59XG4vKipcbiAgVmlzaXQgZXZlcnkgZW50cnkgaW4gdGhlIG1hcCwgYWdncmVnYXRpbmcgZGF0YS5cblxuICBPcmRlciBvZiBub2RlcyBpcyBub3QgZ3VhcmFudGVlZC5cblxuICBAcGFyYW0gZiBGdW5jdGlvbiBpbnZva2VkIHdpdGggdmFsdWUgYW5kIGtleVxuICBAcGFyYW0gbWFwIEhBTVRcbiovXG5mdW5jdGlvbiBmb3JFYWNoKGYsIG1hcCkge1xuICAgIHJldHVybiBmb2xkKGZ1bmN0aW9uIChfLCB2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiBmKHZhbHVlLCBrZXksIG1hcCk7XG4gICAgfSwgbnVsbCwgbWFwKTtcbn1cbi8qIEV4cG9ydFxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmV4cG9ydCBjbGFzcyBIQU1UTWFwSXRlcmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHYpIHtcbiAgICAgICAgdGhpc1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudiA9IHY7XG4gICAgfVxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICghdGhpcy52KSByZXR1cm4gRE9ORTtcbiAgICAgICAgdmFyIHYwID0gdGhpcy52O1xuICAgICAgICB0aGlzLnYgPSBhcHBrKHYwLnJlc3QpO1xuICAgICAgICByZXR1cm4gdjA7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSEFNVE1hcCB7XG4gICAgY29uc3RydWN0b3IoZWRpdGFibGUgPSAwLCBlZGl0ID0gMCwgY29uZmlnID0ge30sIHJvb3QgPSBlbXB0eSwgc2l6ZSA9IDApIHtcbiAgICAgICAgdGhpcy5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRW1wdHkodGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXNbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRyaWVzKHRoaXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9lZGl0YWJsZSA9IGVkaXRhYmxlO1xuICAgICAgICB0aGlzLl9lZGl0ID0gZWRpdDtcbiAgICAgICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgICAgICAga2V5RXE6IGNvbmZpZyAmJiBjb25maWcua2V5RXEgfHwgZGVmS2V5Q29tcGFyZSxcbiAgICAgICAgICAgIGhhc2g6IGNvbmZpZyAmJiBjb25maWcuaGFzaCB8fCBoYXNoXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcbiAgICB9XG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgIH1cbiAgICBzZXRUcmVlKG5ld1Jvb3QsIG5ld1NpemUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbmV3Um9vdDtcbiAgICAgICAgICAgIHRoaXMuX3NpemUgPSBuZXdTaXplO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1Jvb3QgPT09IHRoaXMuX3Jvb3QgPyB0aGlzIDogbmV3IEhBTVRNYXAodGhpcy5fZWRpdGFibGUsIHRoaXMuX2VkaXQsIHRoaXMuX2NvbmZpZywgbmV3Um9vdCwgbmV3U2l6ZSk7XG4gICAgfVxuICAgIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICB0cnlHZXQoYWx0LCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRyeUdldChhbHQsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIGdldEhhc2goaGFzaCwga2V5KSB7XG4gICAgICAgIHJldHVybiBnZXRIYXNoKGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIGdldChrZXksIGFsdCkge1xuICAgICAgICByZXR1cm4gdHJ5R2V0KGFsdCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgaGFzSGFzaChoYXNoLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGhhc0hhc2goaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gaGFzKGtleSwgdGhpcyk7XG4gICAgfVxuICAgIG1vZGlmeUhhc2goaGFzaCwga2V5LCBmKSB7XG4gICAgICAgIHJldHVybiBtb2RpZnlIYXNoKGYsIGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIG1vZGlmeShrZXksIGYpIHtcbiAgICAgICAgcmV0dXJuIG1vZGlmeShmLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBzZXRIYXNoKGhhc2gsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSwgdGhpcyk7XG4gICAgfVxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBzZXQoa2V5LCB2YWx1ZSwgdGhpcyk7XG4gICAgfVxuICAgIGRlbGV0ZUhhc2goaGFzaCwga2V5KSB7XG4gICAgICAgIHJldHVybiByZW1vdmVIYXNoKGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIHJlbW92ZUhhc2goaGFzaCwga2V5KSB7XG4gICAgICAgIHJldHVybiByZW1vdmVIYXNoKGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIHJlbW92ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZShrZXksIHRoaXMpO1xuICAgIH1cbiAgICBiZWdpbk11dGF0aW9uKCkge1xuICAgICAgICByZXR1cm4gYmVnaW5NdXRhdGlvbih0aGlzKTtcbiAgICB9XG4gICAgZW5kTXV0YXRpb24oKSB7XG4gICAgICAgIHJldHVybiBlbmRNdXRhdGlvbih0aGlzKTtcbiAgICB9XG4gICAgbXV0YXRlKGYpIHtcbiAgICAgICAgcmV0dXJuIG11dGF0ZShmLCB0aGlzKTtcbiAgICB9XG4gICAgZW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIGVudHJpZXModGhpcyk7XG4gICAgfVxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBrZXlzKHRoaXMpO1xuICAgIH1cbiAgICB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXModGhpcyk7XG4gICAgfVxuICAgIGZvbGQoZiwgeikge1xuICAgICAgICByZXR1cm4gZm9sZChmLCB6LCB0aGlzKTtcbiAgICB9XG4gICAgZm9yRWFjaChmKSB7XG4gICAgICAgIHJldHVybiBmb3JFYWNoKGYsIHRoaXMpO1xuICAgIH1cbn0iXX0=