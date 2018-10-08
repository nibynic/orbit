"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
const SIZE = 5;
const BUCKET_SIZE = Math.pow(2, SIZE);
const MASK = BUCKET_SIZE - 1;
const MAX_INDEX_NODE = BUCKET_SIZE / 2;
const MIN_ARRAY_NODE = BUCKET_SIZE / 4;
/*
 ******************************************************************************/
const nothing = {};
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
    const type = typeof str === 'undefined' ? 'undefined' : _typeof(str);
    if (type === 'number') return str;
    if (type !== 'string') str += '';
    let h = 0;
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
const LEAF = 1;
const COLLISION = 2;
const INDEX = 3;
const ARRAY = 4;
/**
  Empty node.
*/
const empty = {
    __hamt_isEmpty: true,
    _modify(edit, keyEq, shift, f, h, k, size) {
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
function tryGetHash(alt, hash, key, map) {
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
function tryGet(alt, key, map) {
    return tryGetHash(alt, map._config.hash(key), key, map);
}
/**
  Lookup the value for `key` in `map` using a custom `hash`.

  Returns the value or `undefined` if none.
*/
function getHash(hash, key, map) {
    return tryGetHash(undefined, hash, key, map);
}
/**
  Lookup the value for `key` in `map` using internal hash function.

  @see `get`
*/
function get(key, map) {
    return tryGetHash(undefined, map._config.hash(key), key, map);
}
/**
    Does an entry exist for `key` in `map`? Uses custom `hash`.
*/
function hasHash(hash, key, map) {
    return tryGetHash(nothing, hash, key, map) !== nothing;
}
/**
  Does an entry exist for `key` in `map`? Uses internal hash function.
*/
function has(key, map) {
    return hasHash(map._config.hash(key), key, map);
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
function modifyHash(f, hash, key, map) {
    var size = { value: map._size };
    var newRoot = map._root._modify(map._editable ? map._edit : NaN, map._config.keyEq, 0, f, hash, key, size);
    return map.setTree(newRoot, size.value);
}
/**
  Alter the value stored for `key` in `map` using function `f` using
  internal hash function.

  @see `modifyHash`
*/
function modify(f, key, map) {
    return modifyHash(f, map._config.hash(key), key, map);
}
/**
  Store `value` for `key` in `map` using custom `hash`.

  Returns a map with the modified value. Does not alter `map`.
*/
function setHash(hash, key, value, map) {
    return modifyHash(constant(value), hash, key, map);
}
/**
  Store `value` for `key` in `map` using internal hash function.

  @see `setHash`
*/
function set(key, value, map) {
    return setHash(map._config.hash(key), key, value, map);
}
/**
  Remove the entry for `key` in `map`.

  Returns a map with the value removed. Does not alter `map`.
*/
const del = constant(nothing);
function removeHash(hash, key, map) {
    return modifyHash(del, hash, key, map);
}
/**
  Remove the entry for `key` in `map` using internal hash function.

  @see `removeHash`
*/
function remove(key, map) {
    return removeHash(map._config.hash(key), key, map);
}
/* Mutation
 ******************************************************************************/
/**
  Mark `map` as mutable.
 */
function beginMutation(map) {
    return new HAMTMap(map._editable + 1, map._edit + 1, map._config, map._root, map._size);
}
/**
  Mark `map` as immutable.
 */
function endMutation(map) {
    map._editable = map._editable && map._editable - 1;
    return map;
}
/**
  Mutate `map` within the context of `f`.
  @param f
  @param map HAMT
*/
function mutate(f, map) {
    var transient = beginMutation(map);
    f(transient);
    return endMutation(transient);
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
const DONE = {
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
function entries(map) {
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
function keys(map) {
    return visit(map, buildKeys);
}
/**
  Get array of all values in `map`.

  Order is not guaranteed, duplicates are preserved.
*/
function buildValues(x) {
    return x.value;
}
function values(map) {
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
function fold(f, z, m) {
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
function forEach(f, map) {
    return fold(function (_, value, key) {
        return f(value, key, map);
    }, null, map);
}
/* Export
 ******************************************************************************/
class HAMTMapIterator {
    constructor(v) {
        this[Symbol.iterator] = function () {
            return this;
        };
        this.v = v;
    }
    next() {
        if (!this.v) return DONE;
        var v0 = this.v;
        this.v = appk(v0.rest);
        return v0;
    }
}
exports.HAMTMapIterator = HAMTMapIterator;
class HAMTMap {
    constructor(editable = 0, edit = 0, config = {}, root = empty, size = 0) {
        this.isEmpty = function () {
            return isEmpty(this);
        };
        this[Symbol.iterator] = function () {
            return entries(this);
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
    get size() {
        return this._size;
    }
    setTree(newRoot, newSize) {
        if (this._editable) {
            this._root = newRoot;
            this._size = newSize;
            return this;
        }
        return newRoot === this._root ? this : new HAMTMap(this._editable, this._edit, this._config, newRoot, newSize);
    }
    tryGetHash(alt, hash, key) {
        return tryGetHash(alt, hash, key, this);
    }
    tryGet(alt, key) {
        return tryGet(alt, key, this);
    }
    getHash(hash, key) {
        return getHash(hash, key, this);
    }
    get(key, alt) {
        return tryGet(alt, key, this);
    }
    hasHash(hash, key) {
        return hasHash(hash, key, this);
    }
    has(key) {
        return has(key, this);
    }
    modifyHash(hash, key, f) {
        return modifyHash(f, hash, key, this);
    }
    modify(key, f) {
        return modify(f, key, this);
    }
    setHash(hash, key, value) {
        return setHash(hash, key, value, this);
    }
    set(key, value) {
        return set(key, value, this);
    }
    deleteHash(hash, key) {
        return removeHash(hash, key, this);
    }
    removeHash(hash, key) {
        return removeHash(hash, key, this);
    }
    remove(key) {
        return remove(key, this);
    }
    beginMutation() {
        return beginMutation(this);
    }
    endMutation() {
        return endMutation(this);
    }
    mutate(f) {
        return mutate(f, this);
    }
    entries() {
        return entries(this);
    }
    keys() {
        return keys(this);
    }
    values() {
        return values(this);
    }
    fold(f, z) {
        return fold(f, z, this);
    }
    forEach(f) {
        return forEach(f, this);
    }
}
exports.default = HAMTMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL2hhbXQuanMiXSwibmFtZXMiOlsiX3R5cGVvZiIsIm9iaiIsIlN5bWJvbCIsImNvbnN0cnVjdG9yIiwiU0laRSIsIkJVQ0tFVF9TSVpFIiwiTWF0aCIsInBvdyIsIk1BU0siLCJNQVhfSU5ERVhfTk9ERSIsIk1JTl9BUlJBWV9OT0RFIiwibm90aGluZyIsImNvbnN0YW50IiwieCIsImhhc2giLCJzdHIiLCJ0eXBlIiwiaCIsImkiLCJsZW4iLCJsZW5ndGgiLCJjIiwiY2hhckNvZGVBdCIsInBvcGNvdW50IiwiaGFzaEZyYWdtZW50Iiwic2hpZnQiLCJ0b0JpdG1hcCIsImZyb21CaXRtYXAiLCJiaXRtYXAiLCJiaXQiLCJhcnJheVVwZGF0ZSIsIm11dGF0ZSIsImF0IiwidiIsImFyciIsIm91dCIsIkFycmF5IiwiYXJyYXlTcGxpY2VPdXQiLCJnIiwiYXJyYXlTcGxpY2VJbiIsIl9pIiwiTEVBRiIsIkNPTExJU0lPTiIsIklOREVYIiwiQVJSQVkiLCJlbXB0eSIsIl9faGFtdF9pc0VtcHR5IiwiX21vZGlmeSIsImVkaXQiLCJrZXlFcSIsImYiLCJrIiwic2l6ZSIsInZhbHVlIiwiTGVhZiIsImlzRW1wdHlOb2RlIiwia2V5IiwiTGVhZl9fbW9kaWZ5IiwiQ29sbGlzaW9uIiwiY2hpbGRyZW4iLCJDb2xsaXNpb25fX21vZGlmeSIsIkluZGV4ZWROb2RlIiwibWFzayIsIkluZGV4ZWROb2RlX19tb2RpZnkiLCJBcnJheU5vZGUiLCJBcnJheU5vZGVfX21vZGlmeSIsImlzTGVhZiIsIm5vZGUiLCJleHBhbmQiLCJmcmFnIiwiY2hpbGQiLCJzdWJOb2RlcyIsImNvdW50IiwicGFjayIsInJlbW92ZWQiLCJlbGVtZW50cyIsImVsZW0iLCJtZXJnZUxlYXZlcyIsImgxIiwibjEiLCJoMiIsIm4yIiwic3ViSDEiLCJzdWJIMiIsInVwZGF0ZUNvbGxpc2lvbkxpc3QiLCJsaXN0IiwiX25ld1ZhbHVlIiwibmV3VmFsdWUiLCJjYW5FZGl0Tm9kZSIsIl92IiwiY2FuRWRpdCIsImluZHgiLCJleGlzdHMiLCJjdXJyZW50IiwibmV3Q2hpbGRyZW4iLCJ1bmRlZmluZWQiLCJuZXdDaGlsZCIsInRyeUdldEhhc2giLCJhbHQiLCJtYXAiLCJfcm9vdCIsIl9jb25maWciLCJ0cnlHZXQiLCJnZXRIYXNoIiwiZ2V0IiwiaGFzSGFzaCIsImhhcyIsImRlZktleUNvbXBhcmUiLCJ5IiwiaXNFbXB0eSIsIm1vZGlmeUhhc2giLCJfc2l6ZSIsIm5ld1Jvb3QiLCJfZWRpdGFibGUiLCJfZWRpdCIsIk5hTiIsInNldFRyZWUiLCJtb2RpZnkiLCJzZXRIYXNoIiwic2V0IiwiZGVsIiwicmVtb3ZlSGFzaCIsInJlbW92ZSIsImJlZ2luTXV0YXRpb24iLCJIQU1UTWFwIiwiZW5kTXV0YXRpb24iLCJ0cmFuc2llbnQiLCJhcHBrIiwibGF6eVZpc2l0Q2hpbGRyZW4iLCJsYXp5VmlzaXQiLCJyZXN0IiwiRE9ORSIsImRvbmUiLCJ2aXNpdCIsIkhBTVRNYXBJdGVyYXRvciIsImJ1aWxkUGFpcnMiLCJlbnRyaWVzIiwiYnVpbGRLZXlzIiwia2V5cyIsImJ1aWxkVmFsdWVzIiwidmFsdWVzIiwiZm9sZCIsInoiLCJtIiwicm9vdCIsInRvVmlzaXQiLCJwb3AiLCJwdXNoIiwiZm9yRWFjaCIsIl8iLCJpdGVyYXRvciIsIm5leHQiLCJ2MCIsImVkaXRhYmxlIiwiY29uZmlnIiwibmV3U2l6ZSIsImRlbGV0ZUhhc2giXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7QUFPQTtBQUNBLFNBQVNBLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQ2xCLFdBQU9BLE9BQU8sT0FBT0MsTUFBUCxLQUFrQixXQUF6QixJQUF3Q0QsSUFBSUUsV0FBSixLQUFvQkQsTUFBNUQsR0FBcUUsUUFBckUsR0FBZ0YsT0FBT0QsR0FBOUY7QUFDSDtBQUNEOztBQUVBLE1BQU1HLE9BQU8sQ0FBYjtBQUNBLE1BQU1DLGNBQWNDLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVlILElBQVosQ0FBcEI7QUFDQSxNQUFN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SDtBQUNERSxXQUFPO0FBQ0gsZUFBT0EsS0FBSyxJQUFMLENBQVA7QUFDSDtBQUNERSxhQUFTO0FBQ0wsZUFBT0EsT0FBTyxJQUFQLENBQVA7QUFDSDtBQUNEQyxTQUFLM0YsQ0FBTCxFQUFRNEYsQ0FBUixFQUFXO0FBQ1AsZUFBT0QsS0FBSzNGLENBQUwsRUFBUTRGLENBQVIsRUFBVyxJQUFYLENBQVA7QUFDSDtBQUNETSxZQUFRbEcsQ0FBUixFQUFXO0FBQ1AsZUFBT2tHLFFBQVFsRyxDQUFSLEVBQVcsSUFBWCxDQUFQO0FBQ0g7QUExRndCO2tCQUFSMEUsTyIsImZpbGUiOiJ1dGlscy9oYW10LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb2RlIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGJpZXJuZXIvaGFtdFxuICogQXV0aG9yOiBNYXR0IEJpZXJuZXJcbiAqIE1JVCBsaWNlbnNlXG4gKlxuICogV2hpY2ggaXMgYmFzZWQgb246IGh0dHBzOi8vZ2l0aHViLmNvbS9leGNsaXB5L3BkYXRhXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlICovXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufVxuLyogQ29uZmlndXJhdGlvblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IFNJWkUgPSA1O1xuY29uc3QgQlVDS0VUX1NJWkUgPSBNYXRoLnBvdygyLCBTSVpFKTtcbmNvbnN0IE1BU0sgPSBCVUNLRVRfU0laRSAtIDE7XG5jb25zdCBNQVhfSU5ERVhfTk9ERSA9IEJVQ0tFVF9TSVpFIC8gMjtcbmNvbnN0IE1JTl9BUlJBWV9OT0RFID0gQlVDS0VUX1NJWkUgLyA0O1xuLypcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBub3RoaW5nID0ge307XG5mdW5jdGlvbiBjb25zdGFudCh4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfTtcbn1cbi8qKlxuICBHZXQgMzIgYml0IGhhc2ggb2Ygc3RyaW5nLlxuXG4gIEJhc2VkIG9uOlxuICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc2MTY0NjEvZ2VuZXJhdGUtYS1oYXNoLWZyb20tc3RyaW5nLWluLWphdmFzY3JpcHQtanF1ZXJ5XG4qL1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yoc3RyKTtcbiAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHJldHVybiBzdHI7XG4gICAgaWYgKHR5cGUgIT09ICdzdHJpbmcnKSBzdHIgKz0gJyc7XG4gICAgbGV0IGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHIubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaCA9IChoIDw8IDUpIC0gaCArIGMgfCAwO1xuICAgIH1cbiAgICByZXR1cm4gaDtcbn1cbi8qIEJpdCBPcHNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgSGFtbWluZyB3ZWlnaHQuXG5cbiAgVGFrZW4gZnJvbTogaHR0cDovL2pzcGVyZi5jb20vaGFtbWluZy13ZWlnaHRcbiovXG5mdW5jdGlvbiBwb3Bjb3VudCh4KSB7XG4gICAgeCAtPSB4ID4+IDEgJiAweDU1NTU1NTU1O1xuICAgIHggPSAoeCAmIDB4MzMzMzMzMzMpICsgKHggPj4gMiAmIDB4MzMzMzMzMzMpO1xuICAgIHggPSB4ICsgKHggPj4gNCkgJiAweDBmMGYwZjBmO1xuICAgIHggKz0geCA+PiA4O1xuICAgIHggKz0geCA+PiAxNjtcbiAgICByZXR1cm4geCAmIDB4N2Y7XG59XG5mdW5jdGlvbiBoYXNoRnJhZ21lbnQoc2hpZnQsIGgpIHtcbiAgICByZXR1cm4gaCA+Pj4gc2hpZnQgJiBNQVNLO1xufVxuZnVuY3Rpb24gdG9CaXRtYXAoeCkge1xuICAgIHJldHVybiAxIDw8IHg7XG59XG5mdW5jdGlvbiBmcm9tQml0bWFwKGJpdG1hcCwgYml0KSB7XG4gICAgcmV0dXJuIHBvcGNvdW50KGJpdG1hcCAmIGJpdCAtIDEpO1xufVxuLyogQXJyYXkgT3BzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIFNldCBhIHZhbHVlIGluIGFuIGFycmF5LlxuXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIHRoZSBpbnB1dCBhcnJheSBiZSBtdXRhdGVkP1xuICBAcGFyYW0gYXQgSW5kZXggdG8gY2hhbmdlLlxuICBAcGFyYW0gdiBOZXcgdmFsdWVcbiAgQHBhcmFtIGFyciBBcnJheS5cbiovXG5mdW5jdGlvbiBhcnJheVVwZGF0ZShtdXRhdGUsIGF0LCB2LCBhcnIpIHtcbiAgICB2YXIgb3V0ID0gYXJyO1xuICAgIGlmICghbXV0YXRlKSB7XG4gICAgICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBvdXQgPSBuZXcgQXJyYXkobGVuKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgb3V0W2ldID0gYXJyW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIG91dFthdF0gPSB2O1xuICAgIHJldHVybiBvdXQ7XG59XG4vKipcbiAgUmVtb3ZlIGEgdmFsdWUgZnJvbSBhbiBhcnJheS5cblxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCB0aGUgaW5wdXQgYXJyYXkgYmUgbXV0YXRlZD9cbiAgQHBhcmFtIGF0IEluZGV4IHRvIHJlbW92ZS5cbiAgQHBhcmFtIGFyciBBcnJheS5cbiovXG5mdW5jdGlvbiBhcnJheVNwbGljZU91dChtdXRhdGUsIGF0LCBhcnIpIHtcbiAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGcgPSAwO1xuICAgIHZhciBvdXQgPSBhcnI7XG4gICAgaWYgKG11dGF0ZSkge1xuICAgICAgICBpID0gZyA9IGF0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgd2hpbGUgKGkgPCBhdCkge1xuICAgICAgICAgICAgb3V0W2crK10gPSBhcnJbaSsrXTtcbiAgICAgICAgfVxuICAgICAgICArK2k7XG4gICAgfVxuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIG91dFtnKytdID0gYXJyW2krK107XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG4vKipcbiAgSW5zZXJ0IGEgdmFsdWUgaW50byBhbiBhcnJheS5cblxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCB0aGUgaW5wdXQgYXJyYXkgYmUgbXV0YXRlZD9cbiAgQHBhcmFtIGF0IEluZGV4IHRvIGluc2VydCBhdC5cbiAgQHBhcmFtIHYgVmFsdWUgdG8gaW5zZXJ0LFxuICBAcGFyYW0gYXJyIEFycmF5LlxuKi9cbmZ1bmN0aW9uIGFycmF5U3BsaWNlSW4obXV0YXRlLCBhdCwgdiwgYXJyKSB7XG4gICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgaWYgKG11dGF0ZSkge1xuICAgICAgICB2YXIgX2kgPSBsZW47XG4gICAgICAgIHdoaWxlIChfaSA+PSBhdCkge1xuICAgICAgICAgICAgYXJyW19pLS1dID0gYXJyW19pXTtcbiAgICAgICAgfVxuICAgICAgICBhcnJbYXRdID0gdjtcbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBnID0gMDtcbiAgICB2YXIgb3V0ID0gbmV3IEFycmF5KGxlbiArIDEpO1xuICAgIHdoaWxlIChpIDwgYXQpIHtcbiAgICAgICAgb3V0W2crK10gPSBhcnJbaSsrXTtcbiAgICB9XG4gICAgb3V0W2F0XSA9IHY7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgb3V0WysrZ10gPSBhcnJbaSsrXTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cbi8qIE5vZGUgU3RydWN0dXJlc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IExFQUYgPSAxO1xuY29uc3QgQ09MTElTSU9OID0gMjtcbmNvbnN0IElOREVYID0gMztcbmNvbnN0IEFSUkFZID0gNDtcbi8qKlxuICBFbXB0eSBub2RlLlxuKi9cbmNvbnN0IGVtcHR5ID0ge1xuICAgIF9faGFtdF9pc0VtcHR5OiB0cnVlLFxuICAgIF9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XG4gICAgICAgIHZhciB2ID0gZigpO1xuICAgICAgICBpZiAodiA9PT0gbm90aGluZykgcmV0dXJuIGVtcHR5O1xuICAgICAgICArK3NpemUudmFsdWU7XG4gICAgICAgIHJldHVybiBMZWFmKGVkaXQsIGgsIGssIHYpO1xuICAgIH1cbn07XG5mdW5jdGlvbiBpc0VtcHR5Tm9kZSh4KSB7XG4gICAgcmV0dXJuIHggPT09IGVtcHR5IHx8IHggJiYgeC5fX2hhbXRfaXNFbXB0eTtcbn1cbi8qKlxuICBMZWFmIGhvbGRpbmcgYSB2YWx1ZS5cblxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cbiAgQG1lbWJlciBoYXNoIEhhc2ggb2Yga2V5LlxuICBAbWVtYmVyIGtleSBLZXkuXG4gIEBtZW1iZXIgdmFsdWUgVmFsdWUgc3RvcmVkLlxuKi9cbmZ1bmN0aW9uIExlYWYoZWRpdCwgaGFzaCwga2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IExFQUYsXG4gICAgICAgIGVkaXQ6IGVkaXQsXG4gICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIF9tb2RpZnk6IExlYWZfX21vZGlmeVxuICAgIH07XG59XG4vKipcbiAgTGVhZiBob2xkaW5nIG11bHRpcGxlIHZhbHVlcyB3aXRoIHRoZSBzYW1lIGhhc2ggYnV0IGRpZmZlcmVudCBrZXlzLlxuXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxuICBAbWVtYmVyIGhhc2ggSGFzaCBvZiBrZXkuXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY29sbGlzaW9uIGNoaWxkcmVuIG5vZGUuXG4qL1xuZnVuY3Rpb24gQ29sbGlzaW9uKGVkaXQsIGhhc2gsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQ09MTElTSU9OLFxuICAgICAgICBlZGl0OiBlZGl0LFxuICAgICAgICBoYXNoOiBoYXNoLFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIF9tb2RpZnk6IENvbGxpc2lvbl9fbW9kaWZ5XG4gICAgfTtcbn1cbi8qKlxuICBJbnRlcm5hbCBub2RlIHdpdGggYSBzcGFyc2Ugc2V0IG9mIGNoaWxkcmVuLlxuXG4gIFVzZXMgYSBiaXRtYXAgYW5kIGFycmF5IHRvIHBhY2sgY2hpbGRyZW4uXG5cbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXG4gIEBtZW1iZXIgbWFzayBCaXRtYXAgdGhhdCBlbmNvZGUgdGhlIHBvc2l0aW9ucyBvZiBjaGlsZHJlbiBpbiB0aGUgYXJyYXkuXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY2hpbGQgbm9kZXMuXG4qL1xuZnVuY3Rpb24gSW5kZXhlZE5vZGUoZWRpdCwgbWFzaywgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBJTkRFWCxcbiAgICAgICAgZWRpdDogZWRpdCxcbiAgICAgICAgbWFzazogbWFzayxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgICBfbW9kaWZ5OiBJbmRleGVkTm9kZV9fbW9kaWZ5XG4gICAgfTtcbn1cbi8qKlxuICBJbnRlcm5hbCBub2RlIHdpdGggbWFueSBjaGlsZHJlbi5cblxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cbiAgQG1lbWJlciBzaXplIE51bWJlciBvZiBjaGlsZHJlbi5cbiAgQG1lbWJlciBjaGlsZHJlbiBBcnJheSBvZiBjaGlsZCBub2Rlcy5cbiovXG5mdW5jdGlvbiBBcnJheU5vZGUoZWRpdCwgc2l6ZSwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBBUlJBWSxcbiAgICAgICAgZWRpdDogZWRpdCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgICBfbW9kaWZ5OiBBcnJheU5vZGVfX21vZGlmeVxuICAgIH07XG59XG4vKipcbiAgICBJcyBgbm9kZWAgYSBsZWFmIG5vZGU/XG4qL1xuZnVuY3Rpb24gaXNMZWFmKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSA9PT0gZW1wdHkgfHwgbm9kZS50eXBlID09PSBMRUFGIHx8IG5vZGUudHlwZSA9PT0gQ09MTElTSU9OO1xufVxuLyogSW50ZXJuYWwgbm9kZSBvcGVyYXRpb25zLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBFeHBhbmQgYW4gaW5kZXhlZCBub2RlIGludG8gYW4gYXJyYXkgbm9kZS5cblxuICBAcGFyYW0gZWRpdCBDdXJyZW50IGVkaXQuXG4gIEBwYXJhbSBmcmFnIEluZGV4IG9mIGFkZGVkIGNoaWxkLlxuICBAcGFyYW0gY2hpbGQgQWRkZWQgY2hpbGQuXG4gIEBwYXJhbSBtYXNrIEluZGV4IG5vZGUgbWFzayBiZWZvcmUgY2hpbGQgYWRkZWQuXG4gIEBwYXJhbSBzdWJOb2RlcyBJbmRleCBub2RlIGNoaWxkcmVuIGJlZm9yZSBjaGlsZCBhZGRlZC5cbiovXG5mdW5jdGlvbiBleHBhbmQoZWRpdCwgZnJhZywgY2hpbGQsIGJpdG1hcCwgc3ViTm9kZXMpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgdmFyIGJpdCA9IGJpdG1hcDtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBiaXQ7ICsraSkge1xuICAgICAgICBpZiAoYml0ICYgMSkgYXJyW2ldID0gc3ViTm9kZXNbY291bnQrK107XG4gICAgICAgIGJpdCA+Pj49IDE7XG4gICAgfVxuICAgIGFycltmcmFnXSA9IGNoaWxkO1xuICAgIHJldHVybiBBcnJheU5vZGUoZWRpdCwgY291bnQgKyAxLCBhcnIpO1xufVxuLyoqXG4gIENvbGxhcHNlIGFuIGFycmF5IG5vZGUgaW50byBhIGluZGV4ZWQgbm9kZS5cblxuICBAcGFyYW0gZWRpdCBDdXJyZW50IGVkaXQuXG4gIEBwYXJhbSBjb3VudCBOdW1iZXIgb2YgZWxlbWVudHMgaW4gbmV3IGFycmF5LlxuICBAcGFyYW0gcmVtb3ZlZCBJbmRleCBvZiByZW1vdmVkIGVsZW1lbnQuXG4gIEBwYXJhbSBlbGVtZW50cyBBcnJheSBub2RlIGNoaWxkcmVuIGJlZm9yZSByZW1vdmUuXG4qL1xuZnVuY3Rpb24gcGFjayhlZGl0LCBjb3VudCwgcmVtb3ZlZCwgZWxlbWVudHMpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSBuZXcgQXJyYXkoY291bnQgLSAxKTtcbiAgICB2YXIgZyA9IDA7XG4gICAgdmFyIGJpdG1hcCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGlmIChpICE9PSByZW1vdmVkKSB7XG4gICAgICAgICAgICB2YXIgZWxlbSA9IGVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGVsZW0gJiYgIWlzRW1wdHlOb2RlKGVsZW0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bZysrXSA9IGVsZW07XG4gICAgICAgICAgICAgICAgYml0bWFwIHw9IDEgPDwgaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSW5kZXhlZE5vZGUoZWRpdCwgYml0bWFwLCBjaGlsZHJlbik7XG59XG4vKipcbiAgTWVyZ2UgdHdvIGxlYWYgbm9kZXMuXG5cbiAgQHBhcmFtIHNoaWZ0IEN1cnJlbnQgc2hpZnQuXG4gIEBwYXJhbSBoMSBOb2RlIDEgaGFzaC5cbiAgQHBhcmFtIG4xIE5vZGUgMS5cbiAgQHBhcmFtIGgyIE5vZGUgMiBoYXNoLlxuICBAcGFyYW0gbjIgTm9kZSAyLlxuKi9cbmZ1bmN0aW9uIG1lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0LCBoMSwgbjEsIGgyLCBuMikge1xuICAgIGlmIChoMSA9PT0gaDIpIHJldHVybiBDb2xsaXNpb24oZWRpdCwgaDEsIFtuMiwgbjFdKTtcbiAgICB2YXIgc3ViSDEgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGgxKTtcbiAgICB2YXIgc3ViSDIgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGgyKTtcbiAgICByZXR1cm4gSW5kZXhlZE5vZGUoZWRpdCwgdG9CaXRtYXAoc3ViSDEpIHwgdG9CaXRtYXAoc3ViSDIpLCBzdWJIMSA9PT0gc3ViSDIgPyBbbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQgKyBTSVpFLCBoMSwgbjEsIGgyLCBuMildIDogc3ViSDEgPCBzdWJIMiA/IFtuMSwgbjJdIDogW24yLCBuMV0pO1xufVxuLyoqXG4gIFVwZGF0ZSBhbiBlbnRyeSBpbiBhIGNvbGxpc2lvbiBsaXN0LlxuXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIG11dGF0aW9uIGJlIHVzZWQ/XG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cbiAgQHBhcmFtIGtleUVxIEtleSBjb21wYXJlIGZ1bmN0aW9uLlxuICBAcGFyYW0gaGFzaCBIYXNoIG9mIGNvbGxpc2lvbi5cbiAgQHBhcmFtIGxpc3QgQ29sbGlzaW9uIGxpc3QuXG4gIEBwYXJhbSBmIFVwZGF0ZSBmdW5jdGlvbi5cbiAgQHBhcmFtIGsgS2V5IHRvIHVwZGF0ZS5cbiAgQHBhcmFtIHNpemUgU2l6ZSByZWYuXG4qL1xuZnVuY3Rpb24gdXBkYXRlQ29sbGlzaW9uTGlzdChtdXRhdGUsIGVkaXQsIGtleUVxLCBoLCBsaXN0LCBmLCBrLCBzaXplKSB7XG4gICAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gbGlzdFtpXTtcbiAgICAgICAgaWYgKGtleUVxKGssIGNoaWxkLmtleSkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNoaWxkLnZhbHVlO1xuICAgICAgICAgICAgdmFyIF9uZXdWYWx1ZSA9IGYodmFsdWUpO1xuICAgICAgICAgICAgaWYgKF9uZXdWYWx1ZSA9PT0gdmFsdWUpIHJldHVybiBsaXN0O1xuICAgICAgICAgICAgaWYgKF9uZXdWYWx1ZSA9PT0gbm90aGluZykge1xuICAgICAgICAgICAgICAgIC0tc2l6ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlTcGxpY2VPdXQobXV0YXRlLCBpLCBsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhcnJheVVwZGF0ZShtdXRhdGUsIGksIExlYWYoZWRpdCwgaCwgaywgX25ld1ZhbHVlKSwgbGlzdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIG5ld1ZhbHVlID0gZigpO1xuICAgIGlmIChuZXdWYWx1ZSA9PT0gbm90aGluZykgcmV0dXJuIGxpc3Q7XG4gICAgKytzaXplLnZhbHVlO1xuICAgIHJldHVybiBhcnJheVVwZGF0ZShtdXRhdGUsIGxlbiwgTGVhZihlZGl0LCBoLCBrLCBuZXdWYWx1ZSksIGxpc3QpO1xufVxuZnVuY3Rpb24gY2FuRWRpdE5vZGUoZWRpdCwgbm9kZSkge1xuICAgIHJldHVybiBlZGl0ID09PSBub2RlLmVkaXQ7XG59XG4vKiBFZGl0aW5nXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZnVuY3Rpb24gTGVhZl9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xuICAgIGlmIChrZXlFcShrLCB0aGlzLmtleSkpIHtcbiAgICAgICAgdmFyIF92ID0gZih0aGlzLnZhbHVlKTtcbiAgICAgICAgaWYgKF92ID09PSB0aGlzLnZhbHVlKSByZXR1cm4gdGhpcztlbHNlIGlmIChfdiA9PT0gbm90aGluZykge1xuICAgICAgICAgICAgLS1zaXplLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IF92O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIExlYWYoZWRpdCwgaCwgaywgX3YpO1xuICAgIH1cbiAgICB2YXIgdiA9IGYoKTtcbiAgICBpZiAodiA9PT0gbm90aGluZykgcmV0dXJuIHRoaXM7XG4gICAgKytzaXplLnZhbHVlO1xuICAgIHJldHVybiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgdGhpcy5oYXNoLCB0aGlzLCBoLCBMZWFmKGVkaXQsIGgsIGssIHYpKTtcbn1cbmZ1bmN0aW9uIENvbGxpc2lvbl9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xuICAgIGlmIChoID09PSB0aGlzLmhhc2gpIHtcbiAgICAgICAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcbiAgICAgICAgdmFyIGxpc3QgPSB1cGRhdGVDb2xsaXNpb25MaXN0KGNhbkVkaXQsIGVkaXQsIGtleUVxLCB0aGlzLmhhc2gsIHRoaXMuY2hpbGRyZW4sIGYsIGssIHNpemUpO1xuICAgICAgICBpZiAobGlzdCA9PT0gdGhpcy5jaGlsZHJlbikgcmV0dXJuIHRoaXM7XG4gICAgICAgIHJldHVybiBsaXN0Lmxlbmd0aCA+IDEgPyBDb2xsaXNpb24oZWRpdCwgdGhpcy5oYXNoLCBsaXN0KSA6IGxpc3RbMF07IC8vIGNvbGxhcHNlIHNpbmdsZSBlbGVtZW50IGNvbGxpc2lvbiBsaXN0XG4gICAgfVxuICAgIHZhciB2ID0gZigpO1xuICAgIGlmICh2ID09PSBub3RoaW5nKSByZXR1cm4gdGhpcztcbiAgICArK3NpemUudmFsdWU7XG4gICAgcmV0dXJuIG1lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0LCB0aGlzLmhhc2gsIHRoaXMsIGgsIExlYWYoZWRpdCwgaCwgaywgdikpO1xufVxuZnVuY3Rpb24gSW5kZXhlZE5vZGVfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcbiAgICB2YXIgbWFzayA9IHRoaXMubWFzaztcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKTtcbiAgICB2YXIgYml0ID0gdG9CaXRtYXAoZnJhZyk7XG4gICAgdmFyIGluZHggPSBmcm9tQml0bWFwKG1hc2ssIGJpdCk7XG4gICAgdmFyIGV4aXN0cyA9IG1hc2sgJiBiaXQ7XG4gICAgdmFyIGN1cnJlbnQgPSBleGlzdHMgPyBjaGlsZHJlbltpbmR4XSA6IGVtcHR5O1xuICAgIHZhciBjaGlsZCA9IGN1cnJlbnQuX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQgKyBTSVpFLCBmLCBoLCBrLCBzaXplKTtcbiAgICBpZiAoY3VycmVudCA9PT0gY2hpbGQpIHJldHVybiB0aGlzO1xuICAgIHZhciBjYW5FZGl0ID0gY2FuRWRpdE5vZGUoZWRpdCwgdGhpcyk7XG4gICAgdmFyIGJpdG1hcCA9IG1hc2s7XG4gICAgdmFyIG5ld0NoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgIGlmIChleGlzdHMgJiYgaXNFbXB0eU5vZGUoY2hpbGQpKSB7XG4gICAgICAgIC8vIHJlbW92ZVxuICAgICAgICBiaXRtYXAgJj0gfmJpdDtcbiAgICAgICAgaWYgKCFiaXRtYXApIHJldHVybiBlbXB0eTtcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA8PSAyICYmIGlzTGVhZihjaGlsZHJlbltpbmR4IF4gMV0pKSByZXR1cm4gY2hpbGRyZW5baW5keCBeIDFdOyAvLyBjb2xsYXBzZVxuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5U3BsaWNlT3V0KGNhbkVkaXQsIGluZHgsIGNoaWxkcmVuKTtcbiAgICB9IGVsc2UgaWYgKCFleGlzdHMgJiYgIWlzRW1wdHlOb2RlKGNoaWxkKSkge1xuICAgICAgICAvLyBhZGRcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+PSBNQVhfSU5ERVhfTk9ERSkgcmV0dXJuIGV4cGFuZChlZGl0LCBmcmFnLCBjaGlsZCwgbWFzaywgY2hpbGRyZW4pO1xuICAgICAgICBiaXRtYXAgfD0gYml0O1xuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5U3BsaWNlSW4oY2FuRWRpdCwgaW5keCwgY2hpbGQsIGNoaWxkcmVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBtb2RpZnlcbiAgICAgICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBpbmR4LCBjaGlsZCwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICBpZiAoY2FuRWRpdCkge1xuICAgICAgICB0aGlzLm1hc2sgPSBiaXRtYXA7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBJbmRleGVkTm9kZShlZGl0LCBiaXRtYXAsIG5ld0NoaWxkcmVuKTtcbn1cbmZ1bmN0aW9uIEFycmF5Tm9kZV9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xuICAgIHZhciBjb3VudCA9IHRoaXMuc2l6ZTtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKTtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltmcmFnXTtcbiAgICB2YXIgbmV3Q2hpbGQgPSAoY2hpbGQgfHwgZW1wdHkpLl9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0ICsgU0laRSwgZiwgaCwgaywgc2l6ZSk7XG4gICAgaWYgKGNoaWxkID09PSBuZXdDaGlsZCkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcbiAgICB2YXIgbmV3Q2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzRW1wdHlOb2RlKGNoaWxkKSAmJiAhaXNFbXB0eU5vZGUobmV3Q2hpbGQpKSB7XG4gICAgICAgIC8vIGFkZFxuICAgICAgICArK2NvdW50O1xuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGZyYWcsIG5ld0NoaWxkLCBjaGlsZHJlbik7XG4gICAgfSBlbHNlIGlmICghaXNFbXB0eU5vZGUoY2hpbGQpICYmIGlzRW1wdHlOb2RlKG5ld0NoaWxkKSkge1xuICAgICAgICAvLyByZW1vdmVcbiAgICAgICAgLS1jb3VudDtcbiAgICAgICAgaWYgKGNvdW50IDw9IE1JTl9BUlJBWV9OT0RFKSByZXR1cm4gcGFjayhlZGl0LCBjb3VudCwgZnJhZywgY2hpbGRyZW4pO1xuICAgICAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGZyYWcsIGVtcHR5LCBjaGlsZHJlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbW9kaWZ5XG4gICAgICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgZnJhZywgbmV3Q2hpbGQsIGNoaWxkcmVuKTtcbiAgICB9XG4gICAgaWYgKGNhbkVkaXQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gY291bnQ7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBBcnJheU5vZGUoZWRpdCwgY291bnQsIG5ld0NoaWxkcmVuKTtcbn1cbjtcbi8qIFF1ZXJpZXNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBhIGN1c3RvbSBgaGFzaGAuXG5cbiAgICBSZXR1cm5zIHRoZSB2YWx1ZSBvciBgYWx0YCBpZiBub25lLlxuKi9cbmZ1bmN0aW9uIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXksIG1hcCkge1xuICAgIHZhciBub2RlID0gbWFwLl9yb290O1xuICAgIHZhciBzaGlmdCA9IDA7XG4gICAgdmFyIGtleUVxID0gbWFwLl9jb25maWcua2V5RXE7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgTEVBRjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlFcShrZXksIG5vZGUua2V5KSA/IG5vZGUudmFsdWUgOiBhbHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBDT0xMSVNJT046XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzaCA9PT0gbm9kZS5oYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleUVxKGtleSwgY2hpbGQua2V5KSkgcmV0dXJuIGNoaWxkLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBJTkRFWDpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJpdCA9IHRvQml0bWFwKGZyYWcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5tYXNrICYgYml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlbltmcm9tQml0bWFwKG5vZGUubWFzaywgYml0KV07XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCArPSBTSVpFO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEFSUkFZOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5baGFzaEZyYWdtZW50KHNoaWZ0LCBoYXNoKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCArPSBTSVpFO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cblxuICBAc2VlIGB0cnlHZXRIYXNoYFxuKi9cbmZ1bmN0aW9uIHRyeUdldChhbHQsIGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIHRyeUdldEhhc2goYWx0LCBtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcbn1cbi8qKlxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBhIGN1c3RvbSBgaGFzaGAuXG5cbiAgUmV0dXJucyB0aGUgdmFsdWUgb3IgYHVuZGVmaW5lZGAgaWYgbm9uZS5cbiovXG5mdW5jdGlvbiBnZXRIYXNoKGhhc2gsIGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIHRyeUdldEhhc2godW5kZWZpbmVkLCBoYXNoLCBrZXksIG1hcCk7XG59XG4vKipcbiAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cblxuICBAc2VlIGBnZXRgXG4qL1xuZnVuY3Rpb24gZ2V0KGtleSwgbWFwKSB7XG4gICAgcmV0dXJuIHRyeUdldEhhc2godW5kZWZpbmVkLCBtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcbn1cbi8qKlxuICAgIERvZXMgYW4gZW50cnkgZXhpc3QgZm9yIGBrZXlgIGluIGBtYXBgPyBVc2VzIGN1c3RvbSBgaGFzaGAuXG4qL1xuZnVuY3Rpb24gaGFzSGFzaChoYXNoLCBrZXksIG1hcCkge1xuICAgIHJldHVybiB0cnlHZXRIYXNoKG5vdGhpbmcsIGhhc2gsIGtleSwgbWFwKSAhPT0gbm90aGluZztcbn1cbi8qKlxuICBEb2VzIGFuIGVudHJ5IGV4aXN0IGZvciBga2V5YCBpbiBgbWFwYD8gVXNlcyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuKi9cbmZ1bmN0aW9uIGhhcyhrZXksIG1hcCkge1xuICAgIHJldHVybiBoYXNIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xufVxuZnVuY3Rpb24gZGVmS2V5Q29tcGFyZSh4LCB5KSB7XG4gICAgcmV0dXJuIHggPT09IHk7XG59XG4vKipcbiAgRG9lcyBgbWFwYCBjb250YWluIGFueSBlbGVtZW50cz9cbiovXG5mdW5jdGlvbiBpc0VtcHR5KG1hcCkge1xuICAgIHJldHVybiBtYXAgJiYgISFpc0VtcHR5Tm9kZShtYXAuX3Jvb3QpO1xufVxuLyogVXBkYXRlc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICAgIEFsdGVyIHRoZSB2YWx1ZSBzdG9yZWQgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGZ1bmN0aW9uIGBmYCB1c2luZ1xuICAgIGN1c3RvbSBoYXNoLlxuXG4gICAgYGZgIGlzIGludm9rZWQgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSBmb3IgYGtgIGlmIGl0IGV4aXN0cyxcbiAgICBvciBubyBhcmd1bWVudHMgaWYgbm8gc3VjaCB2YWx1ZSBleGlzdHMuIGBtb2RpZnlgIHdpbGwgYWx3YXlzIGVpdGhlclxuICAgIHVwZGF0ZSBvciBpbnNlcnQgYSB2YWx1ZSBpbnRvIHRoZSBtYXAuXG5cbiAgICBSZXR1cm5zIGEgbWFwIHdpdGggdGhlIG1vZGlmaWVkIHZhbHVlLiBEb2VzIG5vdCBhbHRlciBgbWFwYC5cbiovXG5mdW5jdGlvbiBtb2RpZnlIYXNoKGYsIGhhc2gsIGtleSwgbWFwKSB7XG4gICAgdmFyIHNpemUgPSB7IHZhbHVlOiBtYXAuX3NpemUgfTtcbiAgICB2YXIgbmV3Um9vdCA9IG1hcC5fcm9vdC5fbW9kaWZ5KG1hcC5fZWRpdGFibGUgPyBtYXAuX2VkaXQgOiBOYU4sIG1hcC5fY29uZmlnLmtleUVxLCAwLCBmLCBoYXNoLCBrZXksIHNpemUpO1xuICAgIHJldHVybiBtYXAuc2V0VHJlZShuZXdSb290LCBzaXplLnZhbHVlKTtcbn1cbi8qKlxuICBBbHRlciB0aGUgdmFsdWUgc3RvcmVkIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBmdW5jdGlvbiBgZmAgdXNpbmdcbiAgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cblxuICBAc2VlIGBtb2RpZnlIYXNoYFxuKi9cbmZ1bmN0aW9uIG1vZGlmeShmLCBrZXksIG1hcCkge1xuICAgIHJldHVybiBtb2RpZnlIYXNoKGYsIG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xufVxuLyoqXG4gIFN0b3JlIGB2YWx1ZWAgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGN1c3RvbSBgaGFzaGAuXG5cbiAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSBtb2RpZmllZCB2YWx1ZS4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXG4qL1xuZnVuY3Rpb24gc2V0SGFzaChoYXNoLCBrZXksIHZhbHVlLCBtYXApIHtcbiAgICByZXR1cm4gbW9kaWZ5SGFzaChjb25zdGFudCh2YWx1ZSksIGhhc2gsIGtleSwgbWFwKTtcbn1cbi8qKlxuICBTdG9yZSBgdmFsdWVgIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxuXG4gIEBzZWUgYHNldEhhc2hgXG4qL1xuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIG1hcCkge1xuICAgIHJldHVybiBzZXRIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCB2YWx1ZSwgbWFwKTtcbn1cbi8qKlxuICBSZW1vdmUgdGhlIGVudHJ5IGZvciBga2V5YCBpbiBgbWFwYC5cblxuICBSZXR1cm5zIGEgbWFwIHdpdGggdGhlIHZhbHVlIHJlbW92ZWQuIERvZXMgbm90IGFsdGVyIGBtYXBgLlxuKi9cbmNvbnN0IGRlbCA9IGNvbnN0YW50KG5vdGhpbmcpO1xuZnVuY3Rpb24gcmVtb3ZlSGFzaChoYXNoLCBrZXksIG1hcCkge1xuICAgIHJldHVybiBtb2RpZnlIYXNoKGRlbCwgaGFzaCwga2V5LCBtYXApO1xufVxuLyoqXG4gIFJlbW92ZSB0aGUgZW50cnkgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXG5cbiAgQHNlZSBgcmVtb3ZlSGFzaGBcbiovXG5mdW5jdGlvbiByZW1vdmUoa2V5LCBtYXApIHtcbiAgICByZXR1cm4gcmVtb3ZlSGFzaChtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcbn1cbi8qIE11dGF0aW9uXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqXG4gIE1hcmsgYG1hcGAgYXMgbXV0YWJsZS5cbiAqL1xuZnVuY3Rpb24gYmVnaW5NdXRhdGlvbihtYXApIHtcbiAgICByZXR1cm4gbmV3IEhBTVRNYXAobWFwLl9lZGl0YWJsZSArIDEsIG1hcC5fZWRpdCArIDEsIG1hcC5fY29uZmlnLCBtYXAuX3Jvb3QsIG1hcC5fc2l6ZSk7XG59XG4vKipcbiAgTWFyayBgbWFwYCBhcyBpbW11dGFibGUuXG4gKi9cbmZ1bmN0aW9uIGVuZE11dGF0aW9uKG1hcCkge1xuICAgIG1hcC5fZWRpdGFibGUgPSBtYXAuX2VkaXRhYmxlICYmIG1hcC5fZWRpdGFibGUgLSAxO1xuICAgIHJldHVybiBtYXA7XG59XG4vKipcbiAgTXV0YXRlIGBtYXBgIHdpdGhpbiB0aGUgY29udGV4dCBvZiBgZmAuXG4gIEBwYXJhbSBmXG4gIEBwYXJhbSBtYXAgSEFNVFxuKi9cbmZ1bmN0aW9uIG11dGF0ZShmLCBtYXApIHtcbiAgICB2YXIgdHJhbnNpZW50ID0gYmVnaW5NdXRhdGlvbihtYXApO1xuICAgIGYodHJhbnNpZW50KTtcbiAgICByZXR1cm4gZW5kTXV0YXRpb24odHJhbnNpZW50KTtcbn1cbjtcbi8qIFRyYXZlcnNhbFxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKlxuICBBcHBseSBhIGNvbnRpbnVhdGlvbi5cbiovXG5mdW5jdGlvbiBhcHBrKGspIHtcbiAgICByZXR1cm4gayAmJiBsYXp5VmlzaXRDaGlsZHJlbihrWzBdLCBrWzFdLCBrWzJdLCBrWzNdLCBrWzRdKTtcbn1cbi8qKlxuICBSZWN1cnNpdmVseSB2aXNpdCBhbGwgdmFsdWVzIHN0b3JlZCBpbiBhbiBhcnJheSBvZiBub2RlcyBsYXppbHkuXG4qL1xuZnVuY3Rpb24gbGF6eVZpc2l0Q2hpbGRyZW4obGVuLCBjaGlsZHJlbiwgaSwgZiwgaykge1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2krK107XG4gICAgICAgIGlmIChjaGlsZCAmJiAhaXNFbXB0eU5vZGUoY2hpbGQpKSByZXR1cm4gbGF6eVZpc2l0KGNoaWxkLCBmLCBbbGVuLCBjaGlsZHJlbiwgaSwgZiwga10pO1xuICAgIH1cbiAgICByZXR1cm4gYXBwayhrKTtcbn1cbi8qKlxuICBSZWN1cnNpdmVseSB2aXNpdCBhbGwgdmFsdWVzIHN0b3JlZCBpbiBgbm9kZWAgbGF6aWx5LlxuKi9cbmZ1bmN0aW9uIGxhenlWaXNpdChub2RlLCBmLCBrKSB7XG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBMRUFGOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogZihub2RlKSxcbiAgICAgICAgICAgICAgICByZXN0OiBrXG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIENPTExJU0lPTjpcbiAgICAgICAgY2FzZSBBUlJBWTpcbiAgICAgICAgY2FzZSBJTkRFWDpcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgICByZXR1cm4gbGF6eVZpc2l0Q2hpbGRyZW4oY2hpbGRyZW4ubGVuZ3RoLCBjaGlsZHJlbiwgMCwgZiwgayk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gYXBwayhrKTtcbiAgICB9XG59XG5jb25zdCBET05FID0ge1xuICAgIGRvbmU6IHRydWVcbn07XG4vKipcbiAgTGF6aWx5IHZpc2l0IGVhY2ggdmFsdWUgaW4gbWFwIHdpdGggZnVuY3Rpb24gYGZgLlxuKi9cbmZ1bmN0aW9uIHZpc2l0KG1hcCwgZikge1xuICAgIHJldHVybiBuZXcgSEFNVE1hcEl0ZXJhdG9yKGxhenlWaXNpdChtYXAuX3Jvb3QsIGYpKTtcbn1cbi8qKlxuICBHZXQgYSBKYXZhc2NzcmlwdCBpdGVyYXRvciBvZiBgbWFwYC5cblxuICBJdGVyYXRlcyBvdmVyIGBba2V5LCB2YWx1ZV1gIGFycmF5cy5cbiovXG5mdW5jdGlvbiBidWlsZFBhaXJzKHgpIHtcbiAgICByZXR1cm4gW3gua2V5LCB4LnZhbHVlXTtcbn1cbmZ1bmN0aW9uIGVudHJpZXMobWFwKSB7XG4gICAgcmV0dXJuIHZpc2l0KG1hcCwgYnVpbGRQYWlycyk7XG59XG47XG4vKipcbiAgR2V0IGFycmF5IG9mIGFsbCBrZXlzIGluIGBtYXBgLlxuXG4gIE9yZGVyIGlzIG5vdCBndWFyYW50ZWVkLlxuKi9cbmZ1bmN0aW9uIGJ1aWxkS2V5cyh4KSB7XG4gICAgcmV0dXJuIHgua2V5O1xufVxuZnVuY3Rpb24ga2V5cyhtYXApIHtcbiAgICByZXR1cm4gdmlzaXQobWFwLCBidWlsZEtleXMpO1xufVxuLyoqXG4gIEdldCBhcnJheSBvZiBhbGwgdmFsdWVzIGluIGBtYXBgLlxuXG4gIE9yZGVyIGlzIG5vdCBndWFyYW50ZWVkLCBkdXBsaWNhdGVzIGFyZSBwcmVzZXJ2ZWQuXG4qL1xuZnVuY3Rpb24gYnVpbGRWYWx1ZXMoeCkge1xuICAgIHJldHVybiB4LnZhbHVlO1xufVxuZnVuY3Rpb24gdmFsdWVzKG1hcCkge1xuICAgIHJldHVybiB2aXNpdChtYXAsIGJ1aWxkVmFsdWVzKTtcbn1cbi8qIEZvbGRcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKipcbiAgVmlzaXQgZXZlcnkgZW50cnkgaW4gdGhlIG1hcCwgYWdncmVnYXRpbmcgZGF0YS5cblxuICBPcmRlciBvZiBub2RlcyBpcyBub3QgZ3VhcmFudGVlZC5cblxuICBAcGFyYW0gZiBGdW5jdGlvbiBtYXBwaW5nIGFjY3VtdWxhdGVkIHZhbHVlLCB2YWx1ZSwgYW5kIGtleSB0byBuZXcgdmFsdWUuXG4gIEBwYXJhbSB6IFN0YXJ0aW5nIHZhbHVlLlxuICBAcGFyYW0gbSBIQU1UXG4qL1xuZnVuY3Rpb24gZm9sZChmLCB6LCBtKSB7XG4gICAgdmFyIHJvb3QgPSBtLl9yb290O1xuICAgIGlmIChyb290LnR5cGUgPT09IExFQUYpIHJldHVybiBmKHosIHJvb3QudmFsdWUsIHJvb3Qua2V5KTtcbiAgICB2YXIgdG9WaXNpdCA9IFtyb290LmNoaWxkcmVuXTtcbiAgICB2YXIgY2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgd2hpbGUgKGNoaWxkcmVuID0gdG9WaXNpdC5wb3AoKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baSsrXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC50eXBlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IExFQUYpIHogPSBmKHosIGNoaWxkLnZhbHVlLCBjaGlsZC5rZXkpO2Vsc2UgdG9WaXNpdC5wdXNoKGNoaWxkLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gejtcbn1cbi8qKlxuICBWaXNpdCBldmVyeSBlbnRyeSBpbiB0aGUgbWFwLCBhZ2dyZWdhdGluZyBkYXRhLlxuXG4gIE9yZGVyIG9mIG5vZGVzIGlzIG5vdCBndWFyYW50ZWVkLlxuXG4gIEBwYXJhbSBmIEZ1bmN0aW9uIGludm9rZWQgd2l0aCB2YWx1ZSBhbmQga2V5XG4gIEBwYXJhbSBtYXAgSEFNVFxuKi9cbmZ1bmN0aW9uIGZvckVhY2goZiwgbWFwKSB7XG4gICAgcmV0dXJuIGZvbGQoZnVuY3Rpb24gKF8sIHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGYodmFsdWUsIGtleSwgbWFwKTtcbiAgICB9LCBudWxsLCBtYXApO1xufVxuLyogRXhwb3J0XG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGNsYXNzIEhBTVRNYXBJdGVyYXRvciB7XG4gICAgY29uc3RydWN0b3Iodikge1xuICAgICAgICB0aGlzW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy52ID0gdjtcbiAgICB9XG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnYpIHJldHVybiBET05FO1xuICAgICAgICB2YXIgdjAgPSB0aGlzLnY7XG4gICAgICAgIHRoaXMudiA9IGFwcGsodjAucmVzdCk7XG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIQU1UTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihlZGl0YWJsZSA9IDAsIGVkaXQgPSAwLCBjb25maWcgPSB7fSwgcm9vdCA9IGVtcHR5LCBzaXplID0gMCkge1xuICAgICAgICB0aGlzLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNFbXB0eSh0aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpc1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJpZXModGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2VkaXRhYmxlID0gZWRpdGFibGU7XG4gICAgICAgIHRoaXMuX2VkaXQgPSBlZGl0O1xuICAgICAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICAgICAgICBrZXlFcTogY29uZmlnICYmIGNvbmZpZy5rZXlFcSB8fCBkZWZLZXlDb21wYXJlLFxuICAgICAgICAgICAgaGFzaDogY29uZmlnICYmIGNvbmZpZy5oYXNoIHx8IGhhc2hcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgfVxuICAgIHNldFRyZWUobmV3Um9vdCwgbmV3U2l6ZSkge1xuICAgICAgICBpZiAodGhpcy5fZWRpdGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSBuZXdSb290O1xuICAgICAgICAgICAgdGhpcy5fc2l6ZSA9IG5ld1NpemU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3Um9vdCA9PT0gdGhpcy5fcm9vdCA/IHRoaXMgOiBuZXcgSEFNVE1hcCh0aGlzLl9lZGl0YWJsZSwgdGhpcy5fZWRpdCwgdGhpcy5fY29uZmlnLCBuZXdSb290LCBuZXdTaXplKTtcbiAgICB9XG4gICAgdHJ5R2V0SGFzaChhbHQsIGhhc2gsIGtleSkge1xuICAgICAgICByZXR1cm4gdHJ5R2V0SGFzaChhbHQsIGhhc2gsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIHRyeUdldChhbHQsIGtleSkge1xuICAgICAgICByZXR1cm4gdHJ5R2V0KGFsdCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgZ2V0SGFzaChoYXNoLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGdldEhhc2goaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgZ2V0KGtleSwgYWx0KSB7XG4gICAgICAgIHJldHVybiB0cnlHZXQoYWx0LCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBoYXNIYXNoKGhhc2gsIGtleSkge1xuICAgICAgICByZXR1cm4gaGFzSGFzaChoYXNoLCBrZXksIHRoaXMpO1xuICAgIH1cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiBoYXMoa2V5LCB0aGlzKTtcbiAgICB9XG4gICAgbW9kaWZ5SGFzaChoYXNoLCBrZXksIGYpIHtcbiAgICAgICAgcmV0dXJuIG1vZGlmeUhhc2goZiwgaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgbW9kaWZ5KGtleSwgZikge1xuICAgICAgICByZXR1cm4gbW9kaWZ5KGYsIGtleSwgdGhpcyk7XG4gICAgfVxuICAgIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gc2V0SGFzaChoYXNoLCBrZXksIHZhbHVlLCB0aGlzKTtcbiAgICB9XG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldChrZXksIHZhbHVlLCB0aGlzKTtcbiAgICB9XG4gICAgZGVsZXRlSGFzaChoYXNoLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUhhc2goaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgcmVtb3ZlSGFzaChoYXNoLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUhhc2goaGFzaCwga2V5LCB0aGlzKTtcbiAgICB9XG4gICAgcmVtb3ZlKGtleSkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlKGtleSwgdGhpcyk7XG4gICAgfVxuICAgIGJlZ2luTXV0YXRpb24oKSB7XG4gICAgICAgIHJldHVybiBiZWdpbk11dGF0aW9uKHRoaXMpO1xuICAgIH1cbiAgICBlbmRNdXRhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGVuZE11dGF0aW9uKHRoaXMpO1xuICAgIH1cbiAgICBtdXRhdGUoZikge1xuICAgICAgICByZXR1cm4gbXV0YXRlKGYsIHRoaXMpO1xuICAgIH1cbiAgICBlbnRyaWVzKCkge1xuICAgICAgICByZXR1cm4gZW50cmllcyh0aGlzKTtcbiAgICB9XG4gICAga2V5cygpIHtcbiAgICAgICAgcmV0dXJuIGtleXModGhpcyk7XG4gICAgfVxuICAgIHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcyh0aGlzKTtcbiAgICB9XG4gICAgZm9sZChmLCB6KSB7XG4gICAgICAgIHJldHVybiBmb2xkKGYsIHosIHRoaXMpO1xuICAgIH1cbiAgICBmb3JFYWNoKGYpIHtcbiAgICAgICAgcmV0dXJuIGZvckVhY2goZiwgdGhpcyk7XG4gICAgfVxufSJdfQ==