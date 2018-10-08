var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
export var HAMTMapIterator = function () {
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

export default HAMTMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL2hhbXQuanMiXSwibmFtZXMiOlsiX3R5cGVvZiIsIm9iaiIsIlN5bWJvbCIsImNvbnN0cnVjdG9yIiwiU0laRSIsIkJVQ0tFVF9TSVpFIiwiTWF0aCIsInBvdyIsIk1BU0siLCJNQVhfSU5ERVhfTk9ERSIsIk1JTl9BUlJBWV9OT0RFIiwibm90aGluZyIsImNvbnN0YW50IiwieCIsImhhc2giLCJzdHIiLCJ0eXBlIiwiaCIsImkiLCJsZW4iLCJsZW5ndGgiLCJjIiwiY2hhckNvZGVBdCIsInBvcGNvdW50IiwiaGFzaEZyYWdtZW50Iiwic2hpZnQiLCJ0b0JpdG1hcCIsImZyb21CaXRtYXAiLCJiaXRtYXAiLCJiaXQiLCJhcnJheVVwZGF0ZSIsIm11dGF0ZSIsImF0IiwidiIsImFyciIsIm91dCIsIkFycmF5IiwiYXJyYXlTcGxpY2VPdXQiLCJnIiwiYXJyYXlTcGxpY2VJbiIsIl9pIiwiTEVBRiIsIkNPTExJU0lPTiIsIklOREVYIiwiQVJSQVkiLCJlbXB0eSIsIl9faGFtdF9pc0VtcHR5IiwiX21vZGlmeSIsImVkaXQiLCJrZXlFcSIsImYiLCJrIiwic2l6ZSIsInZhbHVlIiwiTGVhZiIsImlzRW1wdHlOb2RlIiwia2V5IiwiTGVhZl9fbW9kaWZ5IiwiQ29sbGlzaW9uIiwiY2hpbGRyZW4iLCJDb2xsaXNpb25fX21vZGlmeSIsIkluZGV4ZWROb2RlIiwibWFzayIsIkluZGV4ZWROb2RlX19tb2RpZnkiLCJBcnJheU5vZGUiLCJBcnJheU5vZGVfX21vZGlmeSIsImlzTGVhZiIsIm5vZGUiLCJleHBhbmQiLCJmcmFnIiwiY2hpbGQiLCJzdWJOb2RlcyIsImNvdW50IiwicGFjayIsInJlbW92ZWQiLCJlbGVtZW50cyIsImVsZW0iLCJtZXJnZUxlYXZlcyIsImgxIiwibjEiLCJoMiIsIm4yIiwic3ViSDEiLCJzdWJIMiIsInVwZGF0ZUNvbGxpc2lvbkxpc3QiLCJsaXN0IiwiX25ld1ZhbHVlIiwibmV3VmFsdWUiLCJjYW5FZGl0Tm9kZSIsIl92IiwiY2FuRWRpdCIsImluZHgiLCJleGlzdHMiLCJjdXJyZW50IiwibmV3Q2hpbGRyZW4iLCJ1bmRlZmluZWQiLCJuZXdDaGlsZCIsInRyeUdldEhhc2giLCJhbHQiLCJtYXAiLCJfcm9vdCIsIl9jb25maWciLCJ0cnlHZXQiLCJnZXRIYXNoIiwiZ2V0IiwiaGFzSGFzaCIsImhhcyIsImRlZktleUNvbXBhcmUiLCJ5IiwiaXNFbXB0eSIsIm1vZGlmeUhhc2giLCJfc2l6ZSIsIm5ld1Jvb3QiLCJfZWRpdGFibGUiLCJfZWRpdCIsIk5hTiIsInNldFRyZWUiLCJtb2RpZnkiLCJzZXRIYXNoIiwic2V0IiwiZGVsIiwicmVtb3ZlSGFzaCIsInJlbW92ZSIsImJlZ2luTXV0YXRpb24iLCJIQU1UTWFwIiwiZW5kTXV0YXRpb24iLCJ0cmFuc2llbnQiLCJhcHBrIiwibGF6eVZpc2l0Q2hpbGRyZW4iLCJsYXp5VmlzaXQiLCJyZXN0IiwiRE9ORSIsImRvbmUiLCJ2aXNpdCIsIkhBTVRNYXBJdGVyYXRvciIsImJ1aWxkUGFpcnMiLCJlbnRyaWVzIiwiYnVpbGRLZXlzIiwia2V5cyIsImJ1aWxkVmFsdWVzIiwidmFsdWVzIiwiZm9sZCIsInoiLCJtIiwicm9vdCIsInRvVmlzaXQiLCJwb3AiLCJwdXNoIiwiZm9yRWFjaCIsIl8iLCJpdGVyYXRvciIsIm5leHQiLCJ2MCIsImVkaXRhYmxlIiwiY29uZmlnIiwibmV3U2l6ZSIsImRlbGV0ZUhhc2giXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7OztBQU9BO0FBQ0EsU0FBU0EsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDbEIsV0FBT0EsT0FBTyxPQUFPQyxNQUFQLEtBQWtCLFdBQXpCLElBQXdDRCxJQUFJRSxXQUFKLEtBQW9CRCxNQUE1RCxHQUFxRSxRQUFyRSxHQUFnRixPQUFPRCxHQUE5RjtBQUNIO0FBQ0Q7O0FBRUEsSUFBTUcsT0FBTyxDQUFiO0FBQ0EsSUFBTUMsY0FBY0MsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUgsSUFBWixDQUFwQjtBQUNBLElBQU1J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QSxTQUFRLElBQVIsQ0FBUDtBQUNILEs7O3NCQUNERSxJLG1CQUFPO0FBQ0gsZUFBT0EsTUFBSyxJQUFMLENBQVA7QUFDSCxLOztzQkFDREUsTSxxQkFBUztBQUNMLGVBQU9BLFFBQU8sSUFBUCxDQUFQO0FBQ0gsSzs7c0JBQ0RDLEksaUJBQUszRixDLEVBQUc0RixDLEVBQUc7QUFDUCxlQUFPRCxNQUFLM0YsQ0FBTCxFQUFRNEYsQ0FBUixFQUFXLElBQVgsQ0FBUDtBQUNILEs7O3NCQUNETSxPLG9CQUFRbEcsQyxFQUFHO0FBQ1AsZUFBT2tHLFNBQVFsRyxDQUFSLEVBQVcsSUFBWCxDQUFQO0FBQ0gsSzs7Ozt5QkF6RVU7QUFDUCxtQkFBTyxLQUFLNkQsS0FBWjtBQUNIOzs7Ozs7ZUFuQmdCYSxPIiwiZmlsZSI6InV0aWxzL2hhbXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvZGUgYmFzZWQgb246IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0Ymllcm5lci9oYW10XG4gKiBBdXRob3I6IE1hdHQgQmllcm5lclxuICogTUlUIGxpY2Vuc2VcbiAqXG4gKiBXaGljaCBpcyBiYXNlZCBvbjogaHR0cHM6Ly9naXRodWIuY29tL2V4Y2xpcHkvcGRhdGFcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgKi9cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59XG4vKiBDb25maWd1cmF0aW9uXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgU0laRSA9IDU7XG5jb25zdCBCVUNLRVRfU0laRSA9IE1hdGgucG93KDIsIFNJWkUpO1xuY29uc3QgTUFTSyA9IEJVQ0tFVF9TSVpFIC0gMTtcbmNvbnN0IE1BWF9JTkRFWF9OT0RFID0gQlVDS0VUX1NJWkUgLyAyO1xuY29uc3QgTUlOX0FSUkFZX05PREUgPSBCVUNLRVRfU0laRSAvIDQ7XG4vKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IG5vdGhpbmcgPSB7fTtcbmZ1bmN0aW9uIGNvbnN0YW50KHgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICB9O1xufVxuLyoqXG4gIEdldCAzMiBiaXQgaGFzaCBvZiBzdHJpbmcuXG5cbiAgQmFzZWQgb246XG4gIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzYxNjQ2MS9nZW5lcmF0ZS1hLWhhc2gtZnJvbS1zdHJpbmctaW4tamF2YXNjcmlwdC1qcXVlcnlcbiovXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihzdHIpO1xuICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykgcmV0dXJuIHN0cjtcbiAgICBpZiAodHlwZSAhPT0gJ3N0cmluZycpIHN0ciArPSAnJztcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBoID0gKGggPDwgNSkgLSBoICsgYyB8IDA7XG4gICAgfVxuICAgIHJldHVybiBoO1xufVxuLyogQml0IE9wc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBIYW1taW5nIHdlaWdodC5cblxuICBUYWtlbiBmcm9tOiBodHRwOi8vanNwZXJmLmNvbS9oYW1taW5nLXdlaWdodFxuKi9cbmZ1bmN0aW9uIHBvcGNvdW50KHgpIHtcbiAgICB4IC09IHggPj4gMSAmIDB4NTU1NTU1NTU7XG4gICAgeCA9ICh4ICYgMHgzMzMzMzMzMykgKyAoeCA+PiAyICYgMHgzMzMzMzMzMyk7XG4gICAgeCA9IHggKyAoeCA+PiA0KSAmIDB4MGYwZjBmMGY7XG4gICAgeCArPSB4ID4+IDg7XG4gICAgeCArPSB4ID4+IDE2O1xuICAgIHJldHVybiB4ICYgMHg3Zjtcbn1cbmZ1bmN0aW9uIGhhc2hGcmFnbWVudChzaGlmdCwgaCkge1xuICAgIHJldHVybiBoID4+PiBzaGlmdCAmIE1BU0s7XG59XG5mdW5jdGlvbiB0b0JpdG1hcCh4KSB7XG4gICAgcmV0dXJuIDEgPDwgeDtcbn1cbmZ1bmN0aW9uIGZyb21CaXRtYXAoYml0bWFwLCBiaXQpIHtcbiAgICByZXR1cm4gcG9wY291bnQoYml0bWFwICYgYml0IC0gMSk7XG59XG4vKiBBcnJheSBPcHNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgU2V0IGEgdmFsdWUgaW4gYW4gYXJyYXkuXG5cbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgdGhlIGlucHV0IGFycmF5IGJlIG11dGF0ZWQ/XG4gIEBwYXJhbSBhdCBJbmRleCB0byBjaGFuZ2UuXG4gIEBwYXJhbSB2IE5ldyB2YWx1ZVxuICBAcGFyYW0gYXJyIEFycmF5LlxuKi9cbmZ1bmN0aW9uIGFycmF5VXBkYXRlKG11dGF0ZSwgYXQsIHYsIGFycikge1xuICAgIHZhciBvdXQgPSBhcnI7XG4gICAgaWYgKCFtdXRhdGUpIHtcbiAgICAgICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgICAgIG91dCA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBhcnJbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3V0W2F0XSA9IHY7XG4gICAgcmV0dXJuIG91dDtcbn1cbi8qKlxuICBSZW1vdmUgYSB2YWx1ZSBmcm9tIGFuIGFycmF5LlxuXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIHRoZSBpbnB1dCBhcnJheSBiZSBtdXRhdGVkP1xuICBAcGFyYW0gYXQgSW5kZXggdG8gcmVtb3ZlLlxuICBAcGFyYW0gYXJyIEFycmF5LlxuKi9cbmZ1bmN0aW9uIGFycmF5U3BsaWNlT3V0KG11dGF0ZSwgYXQsIGFycikge1xuICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgZyA9IDA7XG4gICAgdmFyIG91dCA9IGFycjtcbiAgICBpZiAobXV0YXRlKSB7XG4gICAgICAgIGkgPSBnID0gYXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICB3aGlsZSAoaSA8IGF0KSB7XG4gICAgICAgICAgICBvdXRbZysrXSA9IGFycltpKytdO1xuICAgICAgICB9XG4gICAgICAgICsraTtcbiAgICB9XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgb3V0W2crK10gPSBhcnJbaSsrXTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cbi8qKlxuICBJbnNlcnQgYSB2YWx1ZSBpbnRvIGFuIGFycmF5LlxuXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIHRoZSBpbnB1dCBhcnJheSBiZSBtdXRhdGVkP1xuICBAcGFyYW0gYXQgSW5kZXggdG8gaW5zZXJ0IGF0LlxuICBAcGFyYW0gdiBWYWx1ZSB0byBpbnNlcnQsXG4gIEBwYXJhbSBhcnIgQXJyYXkuXG4qL1xuZnVuY3Rpb24gYXJyYXlTcGxpY2VJbihtdXRhdGUsIGF0LCB2LCBhcnIpIHtcbiAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgICBpZiAobXV0YXRlKSB7XG4gICAgICAgIHZhciBfaSA9IGxlbjtcbiAgICAgICAgd2hpbGUgKF9pID49IGF0KSB7XG4gICAgICAgICAgICBhcnJbX2ktLV0gPSBhcnJbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGFyclthdF0gPSB2O1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGcgPSAwO1xuICAgIHZhciBvdXQgPSBuZXcgQXJyYXkobGVuICsgMSk7XG4gICAgd2hpbGUgKGkgPCBhdCkge1xuICAgICAgICBvdXRbZysrXSA9IGFycltpKytdO1xuICAgIH1cbiAgICBvdXRbYXRdID0gdjtcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICBvdXRbKytnXSA9IGFycltpKytdO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuLyogTm9kZSBTdHJ1Y3R1cmVzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuY29uc3QgTEVBRiA9IDE7XG5jb25zdCBDT0xMSVNJT04gPSAyO1xuY29uc3QgSU5ERVggPSAzO1xuY29uc3QgQVJSQVkgPSA0O1xuLyoqXG4gIEVtcHR5IG5vZGUuXG4qL1xuY29uc3QgZW1wdHkgPSB7XG4gICAgX19oYW10X2lzRW1wdHk6IHRydWUsXG4gICAgX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcbiAgICAgICAgdmFyIHYgPSBmKCk7XG4gICAgICAgIGlmICh2ID09PSBub3RoaW5nKSByZXR1cm4gZW1wdHk7XG4gICAgICAgICsrc2l6ZS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIExlYWYoZWRpdCwgaCwgaywgdik7XG4gICAgfVxufTtcbmZ1bmN0aW9uIGlzRW1wdHlOb2RlKHgpIHtcbiAgICByZXR1cm4geCA9PT0gZW1wdHkgfHwgeCAmJiB4Ll9faGFtdF9pc0VtcHR5O1xufVxuLyoqXG4gIExlYWYgaG9sZGluZyBhIHZhbHVlLlxuXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxuICBAbWVtYmVyIGhhc2ggSGFzaCBvZiBrZXkuXG4gIEBtZW1iZXIga2V5IEtleS5cbiAgQG1lbWJlciB2YWx1ZSBWYWx1ZSBzdG9yZWQuXG4qL1xuZnVuY3Rpb24gTGVhZihlZGl0LCBoYXNoLCBrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogTEVBRixcbiAgICAgICAgZWRpdDogZWRpdCxcbiAgICAgICAgaGFzaDogaGFzaCxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgX21vZGlmeTogTGVhZl9fbW9kaWZ5XG4gICAgfTtcbn1cbi8qKlxuICBMZWFmIGhvbGRpbmcgbXVsdGlwbGUgdmFsdWVzIHdpdGggdGhlIHNhbWUgaGFzaCBidXQgZGlmZmVyZW50IGtleXMuXG5cbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXG4gIEBtZW1iZXIgaGFzaCBIYXNoIG9mIGtleS5cbiAgQG1lbWJlciBjaGlsZHJlbiBBcnJheSBvZiBjb2xsaXNpb24gY2hpbGRyZW4gbm9kZS5cbiovXG5mdW5jdGlvbiBDb2xsaXNpb24oZWRpdCwgaGFzaCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBDT0xMSVNJT04sXG4gICAgICAgIGVkaXQ6IGVkaXQsXG4gICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgICAgX21vZGlmeTogQ29sbGlzaW9uX19tb2RpZnlcbiAgICB9O1xufVxuLyoqXG4gIEludGVybmFsIG5vZGUgd2l0aCBhIHNwYXJzZSBzZXQgb2YgY2hpbGRyZW4uXG5cbiAgVXNlcyBhIGJpdG1hcCBhbmQgYXJyYXkgdG8gcGFjayBjaGlsZHJlbi5cblxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cbiAgQG1lbWJlciBtYXNrIEJpdG1hcCB0aGF0IGVuY29kZSB0aGUgcG9zaXRpb25zIG9mIGNoaWxkcmVuIGluIHRoZSBhcnJheS5cbiAgQG1lbWJlciBjaGlsZHJlbiBBcnJheSBvZiBjaGlsZCBub2Rlcy5cbiovXG5mdW5jdGlvbiBJbmRleGVkTm9kZShlZGl0LCBtYXNrLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IElOREVYLFxuICAgICAgICBlZGl0OiBlZGl0LFxuICAgICAgICBtYXNrOiBtYXNrLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIF9tb2RpZnk6IEluZGV4ZWROb2RlX19tb2RpZnlcbiAgICB9O1xufVxuLyoqXG4gIEludGVybmFsIG5vZGUgd2l0aCBtYW55IGNoaWxkcmVuLlxuXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxuICBAbWVtYmVyIHNpemUgTnVtYmVyIG9mIGNoaWxkcmVuLlxuICBAbWVtYmVyIGNoaWxkcmVuIEFycmF5IG9mIGNoaWxkIG5vZGVzLlxuKi9cbmZ1bmN0aW9uIEFycmF5Tm9kZShlZGl0LCBzaXplLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IEFSUkFZLFxuICAgICAgICBlZGl0OiBlZGl0LFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIF9tb2RpZnk6IEFycmF5Tm9kZV9fbW9kaWZ5XG4gICAgfTtcbn1cbi8qKlxuICAgIElzIGBub2RlYCBhIGxlYWYgbm9kZT9cbiovXG5mdW5jdGlvbiBpc0xlYWYobm9kZSkge1xuICAgIHJldHVybiBub2RlID09PSBlbXB0eSB8fCBub2RlLnR5cGUgPT09IExFQUYgfHwgbm9kZS50eXBlID09PSBDT0xMSVNJT047XG59XG4vKiBJbnRlcm5hbCBub2RlIG9wZXJhdGlvbnMuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIEV4cGFuZCBhbiBpbmRleGVkIG5vZGUgaW50byBhbiBhcnJheSBub2RlLlxuXG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cbiAgQHBhcmFtIGZyYWcgSW5kZXggb2YgYWRkZWQgY2hpbGQuXG4gIEBwYXJhbSBjaGlsZCBBZGRlZCBjaGlsZC5cbiAgQHBhcmFtIG1hc2sgSW5kZXggbm9kZSBtYXNrIGJlZm9yZSBjaGlsZCBhZGRlZC5cbiAgQHBhcmFtIHN1Yk5vZGVzIEluZGV4IG5vZGUgY2hpbGRyZW4gYmVmb3JlIGNoaWxkIGFkZGVkLlxuKi9cbmZ1bmN0aW9uIGV4cGFuZChlZGl0LCBmcmFnLCBjaGlsZCwgYml0bWFwLCBzdWJOb2Rlcykge1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB2YXIgYml0ID0gYml0bWFwO1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGJpdDsgKytpKSB7XG4gICAgICAgIGlmIChiaXQgJiAxKSBhcnJbaV0gPSBzdWJOb2Rlc1tjb3VudCsrXTtcbiAgICAgICAgYml0ID4+Pj0gMTtcbiAgICB9XG4gICAgYXJyW2ZyYWddID0gY2hpbGQ7XG4gICAgcmV0dXJuIEFycmF5Tm9kZShlZGl0LCBjb3VudCArIDEsIGFycik7XG59XG4vKipcbiAgQ29sbGFwc2UgYW4gYXJyYXkgbm9kZSBpbnRvIGEgaW5kZXhlZCBub2RlLlxuXG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cbiAgQHBhcmFtIGNvdW50IE51bWJlciBvZiBlbGVtZW50cyBpbiBuZXcgYXJyYXkuXG4gIEBwYXJhbSByZW1vdmVkIEluZGV4IG9mIHJlbW92ZWQgZWxlbWVudC5cbiAgQHBhcmFtIGVsZW1lbnRzIEFycmF5IG5vZGUgY2hpbGRyZW4gYmVmb3JlIHJlbW92ZS5cbiovXG5mdW5jdGlvbiBwYWNrKGVkaXQsIGNvdW50LCByZW1vdmVkLCBlbGVtZW50cykge1xuICAgIHZhciBjaGlsZHJlbiA9IG5ldyBBcnJheShjb3VudCAtIDEpO1xuICAgIHZhciBnID0gMDtcbiAgICB2YXIgYml0bWFwID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYgKGkgIT09IHJlbW92ZWQpIHtcbiAgICAgICAgICAgIHZhciBlbGVtID0gZWxlbWVudHNbaV07XG4gICAgICAgICAgICBpZiAoZWxlbSAmJiAhaXNFbXB0eU5vZGUoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltnKytdID0gZWxlbTtcbiAgICAgICAgICAgICAgICBiaXRtYXAgfD0gMSA8PCBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJbmRleGVkTm9kZShlZGl0LCBiaXRtYXAsIGNoaWxkcmVuKTtcbn1cbi8qKlxuICBNZXJnZSB0d28gbGVhZiBub2Rlcy5cblxuICBAcGFyYW0gc2hpZnQgQ3VycmVudCBzaGlmdC5cbiAgQHBhcmFtIGgxIE5vZGUgMSBoYXNoLlxuICBAcGFyYW0gbjEgTm9kZSAxLlxuICBAcGFyYW0gaDIgTm9kZSAyIGhhc2guXG4gIEBwYXJhbSBuMiBOb2RlIDIuXG4qL1xuZnVuY3Rpb24gbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQsIGgxLCBuMSwgaDIsIG4yKSB7XG4gICAgaWYgKGgxID09PSBoMikgcmV0dXJuIENvbGxpc2lvbihlZGl0LCBoMSwgW24yLCBuMV0pO1xuICAgIHZhciBzdWJIMSA9IGhhc2hGcmFnbWVudChzaGlmdCwgaDEpO1xuICAgIHZhciBzdWJIMiA9IGhhc2hGcmFnbWVudChzaGlmdCwgaDIpO1xuICAgIHJldHVybiBJbmRleGVkTm9kZShlZGl0LCB0b0JpdG1hcChzdWJIMSkgfCB0b0JpdG1hcChzdWJIMiksIHN1YkgxID09PSBzdWJIMiA/IFttZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCArIFNJWkUsIGgxLCBuMSwgaDIsIG4yKV0gOiBzdWJIMSA8IHN1YkgyID8gW24xLCBuMl0gOiBbbjIsIG4xXSk7XG59XG4vKipcbiAgVXBkYXRlIGFuIGVudHJ5IGluIGEgY29sbGlzaW9uIGxpc3QuXG5cbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgbXV0YXRpb24gYmUgdXNlZD9cbiAgQHBhcmFtIGVkaXQgQ3VycmVudCBlZGl0LlxuICBAcGFyYW0ga2V5RXEgS2V5IGNvbXBhcmUgZnVuY3Rpb24uXG4gIEBwYXJhbSBoYXNoIEhhc2ggb2YgY29sbGlzaW9uLlxuICBAcGFyYW0gbGlzdCBDb2xsaXNpb24gbGlzdC5cbiAgQHBhcmFtIGYgVXBkYXRlIGZ1bmN0aW9uLlxuICBAcGFyYW0gayBLZXkgdG8gdXBkYXRlLlxuICBAcGFyYW0gc2l6ZSBTaXplIHJlZi5cbiovXG5mdW5jdGlvbiB1cGRhdGVDb2xsaXNpb25MaXN0KG11dGF0ZSwgZWRpdCwga2V5RXEsIGgsIGxpc3QsIGYsIGssIHNpemUpIHtcbiAgICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIgY2hpbGQgPSBsaXN0W2ldO1xuICAgICAgICBpZiAoa2V5RXEoaywgY2hpbGQua2V5KSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gY2hpbGQudmFsdWU7XG4gICAgICAgICAgICB2YXIgX25ld1ZhbHVlID0gZih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoX25ld1ZhbHVlID09PSB2YWx1ZSkgcmV0dXJuIGxpc3Q7XG4gICAgICAgICAgICBpZiAoX25ld1ZhbHVlID09PSBub3RoaW5nKSB7XG4gICAgICAgICAgICAgICAgLS1zaXplLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVNwbGljZU91dChtdXRhdGUsIGksIGxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5VXBkYXRlKG11dGF0ZSwgaSwgTGVhZihlZGl0LCBoLCBrLCBfbmV3VmFsdWUpLCBsaXN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgbmV3VmFsdWUgPSBmKCk7XG4gICAgaWYgKG5ld1ZhbHVlID09PSBub3RoaW5nKSByZXR1cm4gbGlzdDtcbiAgICArK3NpemUudmFsdWU7XG4gICAgcmV0dXJuIGFycmF5VXBkYXRlKG11dGF0ZSwgbGVuLCBMZWFmKGVkaXQsIGgsIGssIG5ld1ZhbHVlKSwgbGlzdCk7XG59XG5mdW5jdGlvbiBjYW5FZGl0Tm9kZShlZGl0LCBub2RlKSB7XG4gICAgcmV0dXJuIGVkaXQgPT09IG5vZGUuZWRpdDtcbn1cbi8qIEVkaXRpbmdcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5mdW5jdGlvbiBMZWFmX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XG4gICAgaWYgKGtleUVxKGssIHRoaXMua2V5KSkge1xuICAgICAgICB2YXIgX3YgPSBmKHRoaXMudmFsdWUpO1xuICAgICAgICBpZiAoX3YgPT09IHRoaXMudmFsdWUpIHJldHVybiB0aGlzO2Vsc2UgaWYgKF92ID09PSBub3RoaW5nKSB7XG4gICAgICAgICAgICAtLXNpemUudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbkVkaXROb2RlKGVkaXQsIHRoaXMpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gX3Y7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTGVhZihlZGl0LCBoLCBrLCBfdik7XG4gICAgfVxuICAgIHZhciB2ID0gZigpO1xuICAgIGlmICh2ID09PSBub3RoaW5nKSByZXR1cm4gdGhpcztcbiAgICArK3NpemUudmFsdWU7XG4gICAgcmV0dXJuIG1lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0LCB0aGlzLmhhc2gsIHRoaXMsIGgsIExlYWYoZWRpdCwgaCwgaywgdikpO1xufVxuZnVuY3Rpb24gQ29sbGlzaW9uX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XG4gICAgaWYgKGggPT09IHRoaXMuaGFzaCkge1xuICAgICAgICB2YXIgY2FuRWRpdCA9IGNhbkVkaXROb2RlKGVkaXQsIHRoaXMpO1xuICAgICAgICB2YXIgbGlzdCA9IHVwZGF0ZUNvbGxpc2lvbkxpc3QoY2FuRWRpdCwgZWRpdCwga2V5RXEsIHRoaXMuaGFzaCwgdGhpcy5jaGlsZHJlbiwgZiwgaywgc2l6ZSk7XG4gICAgICAgIGlmIChsaXN0ID09PSB0aGlzLmNoaWxkcmVuKSByZXR1cm4gdGhpcztcbiAgICAgICAgcmV0dXJuIGxpc3QubGVuZ3RoID4gMSA/IENvbGxpc2lvbihlZGl0LCB0aGlzLmhhc2gsIGxpc3QpIDogbGlzdFswXTsgLy8gY29sbGFwc2Ugc2luZ2xlIGVsZW1lbnQgY29sbGlzaW9uIGxpc3RcbiAgICB9XG4gICAgdmFyIHYgPSBmKCk7XG4gICAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiB0aGlzO1xuICAgICsrc2l6ZS52YWx1ZTtcbiAgICByZXR1cm4gbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQsIHRoaXMuaGFzaCwgdGhpcywgaCwgTGVhZihlZGl0LCBoLCBrLCB2KSk7XG59XG5mdW5jdGlvbiBJbmRleGVkTm9kZV9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xuICAgIHZhciBtYXNrID0gdGhpcy5tYXNrO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgdmFyIGZyYWcgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGgpO1xuICAgIHZhciBiaXQgPSB0b0JpdG1hcChmcmFnKTtcbiAgICB2YXIgaW5keCA9IGZyb21CaXRtYXAobWFzaywgYml0KTtcbiAgICB2YXIgZXhpc3RzID0gbWFzayAmIGJpdDtcbiAgICB2YXIgY3VycmVudCA9IGV4aXN0cyA/IGNoaWxkcmVuW2luZHhdIDogZW1wdHk7XG4gICAgdmFyIGNoaWxkID0gY3VycmVudC5fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCArIFNJWkUsIGYsIGgsIGssIHNpemUpO1xuICAgIGlmIChjdXJyZW50ID09PSBjaGlsZCkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcbiAgICB2YXIgYml0bWFwID0gbWFzaztcbiAgICB2YXIgbmV3Q2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0cyAmJiBpc0VtcHR5Tm9kZShjaGlsZCkpIHtcbiAgICAgICAgLy8gcmVtb3ZlXG4gICAgICAgIGJpdG1hcCAmPSB+Yml0O1xuICAgICAgICBpZiAoIWJpdG1hcCkgcmV0dXJuIGVtcHR5O1xuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoIDw9IDIgJiYgaXNMZWFmKGNoaWxkcmVuW2luZHggXiAxXSkpIHJldHVybiBjaGlsZHJlbltpbmR4IF4gMV07IC8vIGNvbGxhcHNlXG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlTcGxpY2VPdXQoY2FuRWRpdCwgaW5keCwgY2hpbGRyZW4pO1xuICAgIH0gZWxzZSBpZiAoIWV4aXN0cyAmJiAhaXNFbXB0eU5vZGUoY2hpbGQpKSB7XG4gICAgICAgIC8vIGFkZFxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID49IE1BWF9JTkRFWF9OT0RFKSByZXR1cm4gZXhwYW5kKGVkaXQsIGZyYWcsIGNoaWxkLCBtYXNrLCBjaGlsZHJlbik7XG4gICAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlTcGxpY2VJbihjYW5FZGl0LCBpbmR4LCBjaGlsZCwgY2hpbGRyZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG1vZGlmeVxuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGluZHgsIGNoaWxkLCBjaGlsZHJlbik7XG4gICAgfVxuICAgIGlmIChjYW5FZGl0KSB7XG4gICAgICAgIHRoaXMubWFzayA9IGJpdG1hcDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIGJpdG1hcCwgbmV3Q2hpbGRyZW4pO1xufVxuZnVuY3Rpb24gQXJyYXlOb2RlX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XG4gICAgdmFyIGNvdW50ID0gdGhpcy5zaXplO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgdmFyIGZyYWcgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGgpO1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ZyYWddO1xuICAgIHZhciBuZXdDaGlsZCA9IChjaGlsZCB8fCBlbXB0eSkuX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQgKyBTSVpFLCBmLCBoLCBrLCBzaXplKTtcbiAgICBpZiAoY2hpbGQgPT09IG5ld0NoaWxkKSByZXR1cm4gdGhpcztcbiAgICB2YXIgY2FuRWRpdCA9IGNhbkVkaXROb2RlKGVkaXQsIHRoaXMpO1xuICAgIHZhciBuZXdDaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNFbXB0eU5vZGUoY2hpbGQpICYmICFpc0VtcHR5Tm9kZShuZXdDaGlsZCkpIHtcbiAgICAgICAgLy8gYWRkXG4gICAgICAgICsrY291bnQ7XG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgZnJhZywgbmV3Q2hpbGQsIGNoaWxkcmVuKTtcbiAgICB9IGVsc2UgaWYgKCFpc0VtcHR5Tm9kZShjaGlsZCkgJiYgaXNFbXB0eU5vZGUobmV3Q2hpbGQpKSB7XG4gICAgICAgIC8vIHJlbW92ZVxuICAgICAgICAtLWNvdW50O1xuICAgICAgICBpZiAoY291bnQgPD0gTUlOX0FSUkFZX05PREUpIHJldHVybiBwYWNrKGVkaXQsIGNvdW50LCBmcmFnLCBjaGlsZHJlbik7XG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgZnJhZywgZW1wdHksIGNoaWxkcmVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBtb2RpZnlcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBmcmFnLCBuZXdDaGlsZCwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICBpZiAoY2FuRWRpdCkge1xuICAgICAgICB0aGlzLnNpemUgPSBjb3VudDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5Tm9kZShlZGl0LCBjb3VudCwgbmV3Q2hpbGRyZW4pO1xufVxuO1xuLyogUXVlcmllc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICAgIExvb2t1cCB0aGUgdmFsdWUgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGEgY3VzdG9tIGBoYXNoYC5cblxuICAgIFJldHVybnMgdGhlIHZhbHVlIG9yIGBhbHRgIGlmIG5vbmUuXG4qL1xuZnVuY3Rpb24gdHJ5R2V0SGFzaChhbHQsIGhhc2gsIGtleSwgbWFwKSB7XG4gICAgdmFyIG5vZGUgPSBtYXAuX3Jvb3Q7XG4gICAgdmFyIHNoaWZ0ID0gMDtcbiAgICB2YXIga2V5RXEgPSBtYXAuX2NvbmZpZy5rZXlFcTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBMRUFGOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleUVxKGtleSwgbm9kZS5rZXkpID8gbm9kZS52YWx1ZSA6IGFsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIENPTExJU0lPTjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNoID09PSBub2RlLmhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5RXEoa2V5LCBjaGlsZC5rZXkpKSByZXR1cm4gY2hpbGQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIElOREVYOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyYWcgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGhhc2gpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYml0ID0gdG9CaXRtYXAoZnJhZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm1hc2sgJiBiaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuW2Zyb21CaXRtYXAobm9kZS5tYXNrLCBiaXQpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0ICs9IFNJWkU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQVJSQVk6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlbltoYXNoRnJhZ21lbnQoc2hpZnQsIGhhc2gpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0ICs9IFNJWkU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuXG4gIEBzZWUgYHRyeUdldEhhc2hgXG4qL1xuZnVuY3Rpb24gdHJ5R2V0KGFsdCwga2V5LCBtYXApIHtcbiAgICByZXR1cm4gdHJ5R2V0SGFzaChhbHQsIG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xufVxuLyoqXG4gIExvb2t1cCB0aGUgdmFsdWUgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGEgY3VzdG9tIGBoYXNoYC5cblxuICBSZXR1cm5zIHRoZSB2YWx1ZSBvciBgdW5kZWZpbmVkYCBpZiBub25lLlxuKi9cbmZ1bmN0aW9uIGdldEhhc2goaGFzaCwga2V5LCBtYXApIHtcbiAgICByZXR1cm4gdHJ5R2V0SGFzaCh1bmRlZmluZWQsIGhhc2gsIGtleSwgbWFwKTtcbn1cbi8qKlxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuXG4gIEBzZWUgYGdldGBcbiovXG5mdW5jdGlvbiBnZXQoa2V5LCBtYXApIHtcbiAgICByZXR1cm4gdHJ5R2V0SGFzaCh1bmRlZmluZWQsIG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xufVxuLyoqXG4gICAgRG9lcyBhbiBlbnRyeSBleGlzdCBmb3IgYGtleWAgaW4gYG1hcGA/IFVzZXMgY3VzdG9tIGBoYXNoYC5cbiovXG5mdW5jdGlvbiBoYXNIYXNoKGhhc2gsIGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIHRyeUdldEhhc2gobm90aGluZywgaGFzaCwga2V5LCBtYXApICE9PSBub3RoaW5nO1xufVxuLyoqXG4gIERvZXMgYW4gZW50cnkgZXhpc3QgZm9yIGBrZXlgIGluIGBtYXBgPyBVc2VzIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG4qL1xuZnVuY3Rpb24gaGFzKGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIGhhc0hhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XG59XG5mdW5jdGlvbiBkZWZLZXlDb21wYXJlKHgsIHkpIHtcbiAgICByZXR1cm4geCA9PT0geTtcbn1cbi8qKlxuICBEb2VzIGBtYXBgIGNvbnRhaW4gYW55IGVsZW1lbnRzP1xuKi9cbmZ1bmN0aW9uIGlzRW1wdHkobWFwKSB7XG4gICAgcmV0dXJuIG1hcCAmJiAhIWlzRW1wdHlOb2RlKG1hcC5fcm9vdCk7XG59XG4vKiBVcGRhdGVzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gICAgQWx0ZXIgdGhlIHZhbHVlIHN0b3JlZCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgZnVuY3Rpb24gYGZgIHVzaW5nXG4gICAgY3VzdG9tIGhhc2guXG5cbiAgICBgZmAgaXMgaW52b2tlZCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlIGZvciBga2AgaWYgaXQgZXhpc3RzLFxuICAgIG9yIG5vIGFyZ3VtZW50cyBpZiBubyBzdWNoIHZhbHVlIGV4aXN0cy4gYG1vZGlmeWAgd2lsbCBhbHdheXMgZWl0aGVyXG4gICAgdXBkYXRlIG9yIGluc2VydCBhIHZhbHVlIGludG8gdGhlIG1hcC5cblxuICAgIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgbW9kaWZpZWQgdmFsdWUuIERvZXMgbm90IGFsdGVyIGBtYXBgLlxuKi9cbmZ1bmN0aW9uIG1vZGlmeUhhc2goZiwgaGFzaCwga2V5LCBtYXApIHtcbiAgICB2YXIgc2l6ZSA9IHsgdmFsdWU6IG1hcC5fc2l6ZSB9O1xuICAgIHZhciBuZXdSb290ID0gbWFwLl9yb290Ll9tb2RpZnkobWFwLl9lZGl0YWJsZSA/IG1hcC5fZWRpdCA6IE5hTiwgbWFwLl9jb25maWcua2V5RXEsIDAsIGYsIGhhc2gsIGtleSwgc2l6ZSk7XG4gICAgcmV0dXJuIG1hcC5zZXRUcmVlKG5ld1Jvb3QsIHNpemUudmFsdWUpO1xufVxuLyoqXG4gIEFsdGVyIHRoZSB2YWx1ZSBzdG9yZWQgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGZ1bmN0aW9uIGBmYCB1c2luZ1xuICBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuXG4gIEBzZWUgYG1vZGlmeUhhc2hgXG4qL1xuZnVuY3Rpb24gbW9kaWZ5KGYsIGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIG1vZGlmeUhhc2goZiwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XG59XG4vKipcbiAgU3RvcmUgYHZhbHVlYCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgY3VzdG9tIGBoYXNoYC5cblxuICBSZXR1cm5zIGEgbWFwIHdpdGggdGhlIG1vZGlmaWVkIHZhbHVlLiBEb2VzIG5vdCBhbHRlciBgbWFwYC5cbiovXG5mdW5jdGlvbiBzZXRIYXNoKGhhc2gsIGtleSwgdmFsdWUsIG1hcCkge1xuICAgIHJldHVybiBtb2RpZnlIYXNoKGNvbnN0YW50KHZhbHVlKSwgaGFzaCwga2V5LCBtYXApO1xufVxuLyoqXG4gIFN0b3JlIGB2YWx1ZWAgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG5cbiAgQHNlZSBgc2V0SGFzaGBcbiovXG5mdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSwgbWFwKSB7XG4gICAgcmV0dXJuIHNldEhhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIHZhbHVlLCBtYXApO1xufVxuLyoqXG4gIFJlbW92ZSB0aGUgZW50cnkgZm9yIGBrZXlgIGluIGBtYXBgLlxuXG4gIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgdmFsdWUgcmVtb3ZlZC4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXG4qL1xuY29uc3QgZGVsID0gY29uc3RhbnQobm90aGluZyk7XG5mdW5jdGlvbiByZW1vdmVIYXNoKGhhc2gsIGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIG1vZGlmeUhhc2goZGVsLCBoYXNoLCBrZXksIG1hcCk7XG59XG4vKipcbiAgUmVtb3ZlIHRoZSBlbnRyeSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cblxuICBAc2VlIGByZW1vdmVIYXNoYFxuKi9cbmZ1bmN0aW9uIHJlbW92ZShrZXksIG1hcCkge1xuICAgIHJldHVybiByZW1vdmVIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xufVxuLyogTXV0YXRpb25cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgTWFyayBgbWFwYCBhcyBtdXRhYmxlLlxuICovXG5mdW5jdGlvbiBiZWdpbk11dGF0aW9uKG1hcCkge1xuICAgIHJldHVybiBuZXcgSEFNVE1hcChtYXAuX2VkaXRhYmxlICsgMSwgbWFwLl9lZGl0ICsgMSwgbWFwLl9jb25maWcsIG1hcC5fcm9vdCwgbWFwLl9zaXplKTtcbn1cbi8qKlxuICBNYXJrIGBtYXBgIGFzIGltbXV0YWJsZS5cbiAqL1xuZnVuY3Rpb24gZW5kTXV0YXRpb24obWFwKSB7XG4gICAgbWFwLl9lZGl0YWJsZSA9IG1hcC5fZWRpdGFibGUgJiYgbWFwLl9lZGl0YWJsZSAtIDE7XG4gICAgcmV0dXJuIG1hcDtcbn1cbi8qKlxuICBNdXRhdGUgYG1hcGAgd2l0aGluIHRoZSBjb250ZXh0IG9mIGBmYC5cbiAgQHBhcmFtIGZcbiAgQHBhcmFtIG1hcCBIQU1UXG4qL1xuZnVuY3Rpb24gbXV0YXRlKGYsIG1hcCkge1xuICAgIHZhciB0cmFuc2llbnQgPSBiZWdpbk11dGF0aW9uKG1hcCk7XG4gICAgZih0cmFuc2llbnQpO1xuICAgIHJldHVybiBlbmRNdXRhdGlvbih0cmFuc2llbnQpO1xufVxuO1xuLyogVHJhdmVyc2FsXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIEFwcGx5IGEgY29udGludWF0aW9uLlxuKi9cbmZ1bmN0aW9uIGFwcGsoaykge1xuICAgIHJldHVybiBrICYmIGxhenlWaXNpdENoaWxkcmVuKGtbMF0sIGtbMV0sIGtbMl0sIGtbM10sIGtbNF0pO1xufVxuLyoqXG4gIFJlY3Vyc2l2ZWx5IHZpc2l0IGFsbCB2YWx1ZXMgc3RvcmVkIGluIGFuIGFycmF5IG9mIG5vZGVzIGxhemlseS5cbiovXG5mdW5jdGlvbiBsYXp5VmlzaXRDaGlsZHJlbihsZW4sIGNoaWxkcmVuLCBpLCBmLCBrKSB7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baSsrXTtcbiAgICAgICAgaWYgKGNoaWxkICYmICFpc0VtcHR5Tm9kZShjaGlsZCkpIHJldHVybiBsYXp5VmlzaXQoY2hpbGQsIGYsIFtsZW4sIGNoaWxkcmVuLCBpLCBmLCBrXSk7XG4gICAgfVxuICAgIHJldHVybiBhcHBrKGspO1xufVxuLyoqXG4gIFJlY3Vyc2l2ZWx5IHZpc2l0IGFsbCB2YWx1ZXMgc3RvcmVkIGluIGBub2RlYCBsYXppbHkuXG4qL1xuZnVuY3Rpb24gbGF6eVZpc2l0KG5vZGUsIGYsIGspIHtcbiAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICBjYXNlIExFQUY6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBmKG5vZGUpLFxuICAgICAgICAgICAgICAgIHJlc3Q6IGtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgQ09MTElTSU9OOlxuICAgICAgICBjYXNlIEFSUkFZOlxuICAgICAgICBjYXNlIElOREVYOlxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgICAgIHJldHVybiBsYXp5VmlzaXRDaGlsZHJlbihjaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuLCAwLCBmLCBrKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBhcHBrKGspO1xuICAgIH1cbn1cbmNvbnN0IERPTkUgPSB7XG4gICAgZG9uZTogdHJ1ZVxufTtcbi8qKlxuICBMYXppbHkgdmlzaXQgZWFjaCB2YWx1ZSBpbiBtYXAgd2l0aCBmdW5jdGlvbiBgZmAuXG4qL1xuZnVuY3Rpb24gdmlzaXQobWFwLCBmKSB7XG4gICAgcmV0dXJuIG5ldyBIQU1UTWFwSXRlcmF0b3IobGF6eVZpc2l0KG1hcC5fcm9vdCwgZikpO1xufVxuLyoqXG4gIEdldCBhIEphdmFzY3NyaXB0IGl0ZXJhdG9yIG9mIGBtYXBgLlxuXG4gIEl0ZXJhdGVzIG92ZXIgYFtrZXksIHZhbHVlXWAgYXJyYXlzLlxuKi9cbmZ1bmN0aW9uIGJ1aWxkUGFpcnMoeCkge1xuICAgIHJldHVybiBbeC5rZXksIHgudmFsdWVdO1xufVxuZnVuY3Rpb24gZW50cmllcyhtYXApIHtcbiAgICByZXR1cm4gdmlzaXQobWFwLCBidWlsZFBhaXJzKTtcbn1cbjtcbi8qKlxuICBHZXQgYXJyYXkgb2YgYWxsIGtleXMgaW4gYG1hcGAuXG5cbiAgT3JkZXIgaXMgbm90IGd1YXJhbnRlZWQuXG4qL1xuZnVuY3Rpb24gYnVpbGRLZXlzKHgpIHtcbiAgICByZXR1cm4geC5rZXk7XG59XG5mdW5jdGlvbiBrZXlzKG1hcCkge1xuICAgIHJldHVybiB2aXNpdChtYXAsIGJ1aWxkS2V5cyk7XG59XG4vKipcbiAgR2V0IGFycmF5IG9mIGFsbCB2YWx1ZXMgaW4gYG1hcGAuXG5cbiAgT3JkZXIgaXMgbm90IGd1YXJhbnRlZWQsIGR1cGxpY2F0ZXMgYXJlIHByZXNlcnZlZC5cbiovXG5mdW5jdGlvbiBidWlsZFZhbHVlcyh4KSB7XG4gICAgcmV0dXJuIHgudmFsdWU7XG59XG5mdW5jdGlvbiB2YWx1ZXMobWFwKSB7XG4gICAgcmV0dXJuIHZpc2l0KG1hcCwgYnVpbGRWYWx1ZXMpO1xufVxuLyogRm9sZFxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBWaXNpdCBldmVyeSBlbnRyeSBpbiB0aGUgbWFwLCBhZ2dyZWdhdGluZyBkYXRhLlxuXG4gIE9yZGVyIG9mIG5vZGVzIGlzIG5vdCBndWFyYW50ZWVkLlxuXG4gIEBwYXJhbSBmIEZ1bmN0aW9uIG1hcHBpbmcgYWNjdW11bGF0ZWQgdmFsdWUsIHZhbHVlLCBhbmQga2V5IHRvIG5ldyB2YWx1ZS5cbiAgQHBhcmFtIHogU3RhcnRpbmcgdmFsdWUuXG4gIEBwYXJhbSBtIEhBTVRcbiovXG5mdW5jdGlvbiBmb2xkKGYsIHosIG0pIHtcbiAgICB2YXIgcm9vdCA9IG0uX3Jvb3Q7XG4gICAgaWYgKHJvb3QudHlwZSA9PT0gTEVBRikgcmV0dXJuIGYoeiwgcm9vdC52YWx1ZSwgcm9vdC5rZXkpO1xuICAgIHZhciB0b1Zpc2l0ID0gW3Jvb3QuY2hpbGRyZW5dO1xuICAgIHZhciBjaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgICB3aGlsZSAoY2hpbGRyZW4gPSB0b1Zpc2l0LnBvcCgpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpKytdO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gTEVBRikgeiA9IGYoeiwgY2hpbGQudmFsdWUsIGNoaWxkLmtleSk7ZWxzZSB0b1Zpc2l0LnB1c2goY2hpbGQuY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB6O1xufVxuLyoqXG4gIFZpc2l0IGV2ZXJ5IGVudHJ5IGluIHRoZSBtYXAsIGFnZ3JlZ2F0aW5nIGRhdGEuXG5cbiAgT3JkZXIgb2Ygbm9kZXMgaXMgbm90IGd1YXJhbnRlZWQuXG5cbiAgQHBhcmFtIGYgRnVuY3Rpb24gaW52b2tlZCB3aXRoIHZhbHVlIGFuZCBrZXlcbiAgQHBhcmFtIG1hcCBIQU1UXG4qL1xuZnVuY3Rpb24gZm9yRWFjaChmLCBtYXApIHtcbiAgICByZXR1cm4gZm9sZChmdW5jdGlvbiAoXywgdmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gZih2YWx1ZSwga2V5LCBtYXApO1xuICAgIH0sIG51bGwsIG1hcCk7XG59XG4vKiBFeHBvcnRcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5leHBvcnQgY2xhc3MgSEFNVE1hcEl0ZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcih2KSB7XG4gICAgICAgIHRoaXNbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnYgPSB2O1xuICAgIH1cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAoIXRoaXMudikgcmV0dXJuIERPTkU7XG4gICAgICAgIHZhciB2MCA9IHRoaXMudjtcbiAgICAgICAgdGhpcy52ID0gYXBwayh2MC5yZXN0KTtcbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhBTVRNYXAge1xuICAgIGNvbnN0cnVjdG9yKGVkaXRhYmxlID0gMCwgZWRpdCA9IDAsIGNvbmZpZyA9IHt9LCByb290ID0gZW1wdHksIHNpemUgPSAwKSB7XG4gICAgICAgIHRoaXMuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0VtcHR5KHRoaXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50cmllcyh0aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fZWRpdGFibGUgPSBlZGl0YWJsZTtcbiAgICAgICAgdGhpcy5fZWRpdCA9IGVkaXQ7XG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgICAgICAgIGtleUVxOiBjb25maWcgJiYgY29uZmlnLmtleUVxIHx8IGRlZktleUNvbXBhcmUsXG4gICAgICAgICAgICBoYXNoOiBjb25maWcgJiYgY29uZmlnLmhhc2ggfHwgaGFzaFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG4gICAgfVxuICAgIGdldCBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG4gICAgc2V0VHJlZShuZXdSb290LCBuZXdTaXplKSB7XG4gICAgICAgIGlmICh0aGlzLl9lZGl0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICAgICAgICB0aGlzLl9zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSb290ID09PSB0aGlzLl9yb290ID8gdGhpcyA6IG5ldyBIQU1UTWFwKHRoaXMuX2VkaXRhYmxlLCB0aGlzLl9lZGl0LCB0aGlzLl9jb25maWcsIG5ld1Jvb3QsIG5ld1NpemUpO1xuICAgIH1cbiAgICB0cnlHZXRIYXNoKGFsdCwgaGFzaCwga2V5KSB7XG4gICAgICAgIHJldHVybiB0cnlHZXRIYXNoKGFsdCwgaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgdHJ5R2V0KGFsdCwga2V5KSB7XG4gICAgICAgIHJldHVybiB0cnlHZXQoYWx0LCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBnZXRIYXNoKGhhc2gsIGtleSkge1xuICAgICAgICByZXR1cm4gZ2V0SGFzaChoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBnZXQoa2V5LCBhbHQpIHtcbiAgICAgICAgcmV0dXJuIHRyeUdldChhbHQsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIGhhc0hhc2goaGFzaCwga2V5KSB7XG4gICAgICAgIHJldHVybiBoYXNIYXNoKGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIGhhcyhrZXksIHRoaXMpO1xuICAgIH1cbiAgICBtb2RpZnlIYXNoKGhhc2gsIGtleSwgZikge1xuICAgICAgICByZXR1cm4gbW9kaWZ5SGFzaChmLCBoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBtb2RpZnkoa2V5LCBmKSB7XG4gICAgICAgIHJldHVybiBtb2RpZnkoZiwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgc2V0SGFzaChoYXNoLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBzZXRIYXNoKGhhc2gsIGtleSwgdmFsdWUsIHRoaXMpO1xuICAgIH1cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gc2V0KGtleSwgdmFsdWUsIHRoaXMpO1xuICAgIH1cbiAgICBkZWxldGVIYXNoKGhhc2gsIGtleSkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlSGFzaChoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICByZW1vdmVIYXNoKGhhc2gsIGtleSkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlSGFzaChoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICByZW1vdmUoa2V5KSB7XG4gICAgICAgIHJldHVybiByZW1vdmUoa2V5LCB0aGlzKTtcbiAgICB9XG4gICAgYmVnaW5NdXRhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJlZ2luTXV0YXRpb24odGhpcyk7XG4gICAgfVxuICAgIGVuZE11dGF0aW9uKCkge1xuICAgICAgICByZXR1cm4gZW5kTXV0YXRpb24odGhpcyk7XG4gICAgfVxuICAgIG11dGF0ZShmKSB7XG4gICAgICAgIHJldHVybiBtdXRhdGUoZiwgdGhpcyk7XG4gICAgfVxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBlbnRyaWVzKHRoaXMpO1xuICAgIH1cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4ga2V5cyh0aGlzKTtcbiAgICB9XG4gICAgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdmFsdWVzKHRoaXMpO1xuICAgIH1cbiAgICBmb2xkKGYsIHopIHtcbiAgICAgICAgcmV0dXJuIGZvbGQoZiwgeiwgdGhpcyk7XG4gICAgfVxuICAgIGZvckVhY2goZikge1xuICAgICAgICByZXR1cm4gZm9yRWFjaChmLCB0aGlzKTtcbiAgICB9XG59Il19