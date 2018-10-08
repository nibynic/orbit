"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _exception = require("./exception");

var _core = require("@orbit/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */

/**
 * A `Schema` defines the models allowed in a source, including their keys,
 * attributes, and relationships. A single schema may be shared across multiple
 * sources.
 *
 * @export
 * @class Schema
 * @implements {Evented}
 */
var Schema = function () {
    /**
     * Create a new Schema.
     *
     * @constructor
     * @param {SchemaSettings} [settings={}] Optional. Configuration settings.
     * @param {Integer}        [settings.version]       Optional. Schema version. Defaults to 1.
     * @param {Object}   [settings.models]        Optional. Schemas for individual models supported by this schema.
     * @param {Function} [settings.generateId]    Optional. Function used to generate IDs.
     * @param {Function} [settings.pluralize]     Optional. Function used to pluralize names.
     * @param {Function} [settings.singularize]   Optional. Function used to singularize names.
     */
    function Schema() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Schema);

        if (settings.version === undefined) {
            settings.version = 1;
        }
        if (settings.models === undefined) {
            settings.models = {};
        }
        this._applySettings(settings);
    }
    /**
     * Version
     * @return {Integer} Version of schema.
     */

    /**
     * Upgrades Schema to a new version with new settings.
     *
     * Emits the `upgrade` event to cue sources to upgrade their data.
     *
     * @param {SchemaSettings} [settings={}]          Settings.
     * @param {Integer}        [settings.version]     Optional. Schema version. Defaults to the current version + 1.
     * @param {Object}         [settings.models]      Schemas for individual models supported by this schema.
     * @param {Function}       [settings.pluralize]   Optional. Function used to pluralize names.
     * @param {Function}       [settings.singularize] Optional. Function used to singularize names.
     */
    Schema.prototype.upgrade = function upgrade() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        this._applySettings(settings);
        this.emit('upgrade', this._version);
    };
    /**
     * Registers a complete set of settings
     *
     * @private
     * @param {Object} settings Settings passed into `constructor` or `upgrade`.
     */

    Schema.prototype._applySettings = function _applySettings(settings) {
        // Version
        this._version = settings.version;
        // Allow overrides
        if (settings.generateId) {
            this.generateId = settings.generateId;
        }
        if (settings.pluralize) {
            this.pluralize = settings.pluralize;
        }
        if (settings.singularize) {
            this.singularize = settings.singularize;
        }
        // Register model schemas
        if (settings.models) {
            this._models = settings.models;
        }
    };
    /**
     * Generate an id for a given model type.
     *
     * @param {String} type Optional. Type of the model for which the ID is being generated.
     * @return {String} Generated model ID
     */

    Schema.prototype.generateId = function generateId(type) {
        return _main2.default.uuid();
    };
    /**
     * A naive pluralization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} plural form of `word`
     */

    Schema.prototype.pluralize = function pluralize(word) {
        return word + 's';
    };
    /**
     * A naive singularization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} singular form of `word`
     */

    Schema.prototype.singularize = function singularize(word) {
        if (word.lastIndexOf('s') === word.length - 1) {
            return word.substr(0, word.length - 1);
        } else {
            return word;
        }
    };

    Schema.prototype.initializeRecord = function initializeRecord(record) {
        if (record.id === undefined) {
            record.id = this.generateId(record.type);
        }
    };

    Schema.prototype.getModel = function getModel(type) {
        var model = this.models[type];
        if (model) {
            return model;
        } else {
            throw new _exception.ModelNotFound(type);
        }
    };

    Schema.prototype.hasAttribute = function hasAttribute(type, attribute) {
        var model = this.getModel(type);
        if (model.attributes && model.attributes[attribute]) {
            return true;
        } else {
            return false;
        }
    };

    Schema.prototype.hasRelationship = function hasRelationship(type, relationship) {
        var model = this.getModel(type);
        if (model.relationships && model.relationships[relationship]) {
            return true;
        } else {
            return false;
        }
    };

    _createClass(Schema, [{
        key: "version",
        get: function () {
            return this._version;
        }
    }, {
        key: "models",
        get: function () {
            return this._models;
        }
    }]);

    return Schema;
}();
Schema = __decorate([_core.evented], Schema);
exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtYS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsInNldHRpbmdzIiwiT3JiaXQiLCJ3b3JkIiwicmVjb3JkIiwibW9kZWwiLCJTY2hlbWEiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVkEsSUFBSUEsYUFBYSxhQUFRLFVBQVIsVUFBQSxJQUEyQixVQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBUixNQUFBO0FBQUEsUUFDSUMsSUFBSUYsSUFBQUEsQ0FBQUEsR0FBQUEsTUFBQUEsR0FBaUJHLFNBQUFBLElBQUFBLEdBQWdCQSxPQUFPQyxPQUFBQSx3QkFBQUEsQ0FBQUEsTUFBQUEsRUFBdkJELEdBQXVCQyxDQUF2QkQsR0FEekIsSUFBQTtBQUFBLFFBQUEsQ0FBQTtBQUdBLFFBQUksT0FBQSxPQUFBLEtBQUEsUUFBQSxJQUErQixPQUFPRSxRQUFQLFFBQUEsS0FBbkMsVUFBQSxFQUEyRUgsSUFBSUcsUUFBQUEsUUFBQUEsQ0FBQUEsVUFBQUEsRUFBQUEsTUFBQUEsRUFBQUEsR0FBQUEsRUFBL0UsSUFBK0VBLENBQUpILENBQTNFLEtBQW9JLEtBQUssSUFBSUksSUFBSUMsV0FBQUEsTUFBQUEsR0FBYixDQUFBLEVBQW9DRCxLQUFwQyxDQUFBLEVBQUEsR0FBQSxFQUFBO0FBQWlELFlBQUlFLElBQUlELFdBQVIsQ0FBUUEsQ0FBUixFQUF1QkwsSUFBSSxDQUFDRixJQUFBQSxDQUFBQSxHQUFRUSxFQUFSUixDQUFRUSxDQUFSUixHQUFlQSxJQUFBQSxDQUFBQSxHQUFRUSxFQUFBQSxNQUFBQSxFQUFBQSxHQUFBQSxFQUFSUixDQUFRUSxDQUFSUixHQUE0QlEsRUFBQUEsTUFBQUEsRUFBNUMsR0FB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QUEsYUFBQSxZQWdIYTtBQUNULG1CQUFPLEtBQVAsT0FBQTtBQUNIO0FBbEhELEtBQUEsQ0FBQTs7QUFBQSxXQUFBLE1BQUE7QUFBSixDQUFJLEVBQUo7QUE0SUFDLFNBQVNmLFdBQVcsQ0FBWEEsYUFBVyxDQUFYQSxFQUFUZSxNQUFTZixDQUFUZTtrQkFDQSxNIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IE1vZGVsTm90Rm91bmQgfSBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQgeyBldmVudGVkIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuLyoqXG4gKiBBIGBTY2hlbWFgIGRlZmluZXMgdGhlIG1vZGVscyBhbGxvd2VkIGluIGEgc291cmNlLCBpbmNsdWRpbmcgdGhlaXIga2V5cyxcbiAqIGF0dHJpYnV0ZXMsIGFuZCByZWxhdGlvbnNoaXBzLiBBIHNpbmdsZSBzY2hlbWEgbWF5IGJlIHNoYXJlZCBhY3Jvc3MgbXVsdGlwbGVcbiAqIHNvdXJjZXMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNjaGVtYVxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XG4gKi9cbmxldCBTY2hlbWEgPSBjbGFzcyBTY2hlbWEge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBTY2hlbWEuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1NjaGVtYVNldHRpbmdzfSBbc2V0dGluZ3M9e31dIE9wdGlvbmFsLiBDb25maWd1cmF0aW9uIHNldHRpbmdzLlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gICAgICAgIFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgICBPcHRpb25hbC4gU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIDEuXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICAgW3NldHRpbmdzLm1vZGVsc10gICAgICAgIE9wdGlvbmFsLiBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLmdlbmVyYXRlSWRdICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIElEcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3MucGx1cmFsaXplXSAgICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5zaW5ndWxhcml6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLnZlcnNpb24gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncy5tb2RlbHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MubW9kZWxzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFZlcnNpb25cbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG9mIHNjaGVtYS5cbiAgICAgKi9cbiAgICBnZXQgdmVyc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnNpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGVzIFNjaGVtYSB0byBhIG5ldyB2ZXJzaW9uIHdpdGggbmV3IHNldHRpbmdzLlxuICAgICAqXG4gICAgICogRW1pdHMgdGhlIGB1cGdyYWRlYCBldmVudCB0byBjdWUgc291cmNlcyB0byB1cGdyYWRlIHRoZWlyIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NjaGVtYVNldHRpbmdzfSBbc2V0dGluZ3M9e31dICAgICAgICAgIFNldHRpbmdzLlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gICAgICAgIFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgT3B0aW9uYWwuIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byB0aGUgY3VycmVudCB2ZXJzaW9uICsgMS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBbc2V0dGluZ3MubW9kZWxzXSAgICAgIFNjaGVtYXMgZm9yIGluZGl2aWR1YWwgbW9kZWxzIHN1cHBvcnRlZCBieSB0aGlzIHNjaGVtYS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBbc2V0dGluZ3MucGx1cmFsaXplXSAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBbc2V0dGluZ3Muc2luZ3VsYXJpemVdIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxuICAgICAqL1xuICAgIHVwZ3JhZGUoc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy52ZXJzaW9uID0gdGhpcy5fdmVyc2lvbiArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuZW1pdCgndXBncmFkZScsIHRoaXMuX3ZlcnNpb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBjb21wbGV0ZSBzZXQgb2Ygc2V0dGluZ3NcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIFNldHRpbmdzIHBhc3NlZCBpbnRvIGBjb25zdHJ1Y3RvcmAgb3IgYHVwZ3JhZGVgLlxuICAgICAqL1xuICAgIF9hcHBseVNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgICAgIC8vIFZlcnNpb25cbiAgICAgICAgdGhpcy5fdmVyc2lvbiA9IHNldHRpbmdzLnZlcnNpb247XG4gICAgICAgIC8vIEFsbG93IG92ZXJyaWRlc1xuICAgICAgICBpZiAoc2V0dGluZ3MuZ2VuZXJhdGVJZCkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUlkID0gc2V0dGluZ3MuZ2VuZXJhdGVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3MucGx1cmFsaXplKSB7XG4gICAgICAgICAgICB0aGlzLnBsdXJhbGl6ZSA9IHNldHRpbmdzLnBsdXJhbGl6ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3Muc2luZ3VsYXJpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc2luZ3VsYXJpemUgPSBzZXR0aW5ncy5zaW5ndWxhcml6ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZWdpc3RlciBtb2RlbCBzY2hlbWFzXG4gICAgICAgIGlmIChzZXR0aW5ncy5tb2RlbHMpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVscztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhbiBpZCBmb3IgYSBnaXZlbiBtb2RlbCB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgT3B0aW9uYWwuIFR5cGUgb2YgdGhlIG1vZGVsIGZvciB3aGljaCB0aGUgSUQgaXMgYmVpbmcgZ2VuZXJhdGVkLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gR2VuZXJhdGVkIG1vZGVsIElEXG4gICAgICovXG4gICAgZ2VuZXJhdGVJZCh0eXBlKSB7XG4gICAgICAgIHJldHVybiBPcmJpdC51dWlkKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgbmFpdmUgcGx1cmFsaXphdGlvbiBtZXRob2QuXG4gICAgICpcbiAgICAgKiBPdmVycmlkZSB3aXRoIGEgbW9yZSByb2J1c3QgZ2VuZXJhbCBwdXJwb3NlIGluZmxlY3RvciBvciBwcm92aWRlIGFuXG4gICAgICogaW5mbGVjdG9yIHRhaWxvcmVkIHRvIHRoZSB2b2NhYnVsYXJseSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB3b3JkXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBwbHVyYWwgZm9ybSBvZiBgd29yZGBcbiAgICAgKi9cbiAgICBwbHVyYWxpemUod29yZCkge1xuICAgICAgICByZXR1cm4gd29yZCArICdzJztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBuYWl2ZSBzaW5ndWxhcml6YXRpb24gbWV0aG9kLlxuICAgICAqXG4gICAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxuICAgICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gc2luZ3VsYXIgZm9ybSBvZiBgd29yZGBcbiAgICAgKi9cbiAgICBzaW5ndWxhcml6ZSh3b3JkKSB7XG4gICAgICAgIGlmICh3b3JkLmxhc3RJbmRleE9mKCdzJykgPT09IHdvcmQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmQuc3Vic3RyKDAsIHdvcmQubGVuZ3RoIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd29yZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbml0aWFsaXplUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBpZiAocmVjb3JkLmlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlY29yZC5pZCA9IHRoaXMuZ2VuZXJhdGVJZChyZWNvcmQudHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IG1vZGVscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVscztcbiAgICB9XG4gICAgZ2V0TW9kZWwodHlwZSkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVsc1t0eXBlXTtcbiAgICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTW9kZWxOb3RGb3VuZCh0eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoYXNBdHRyaWJ1dGUodHlwZSwgYXR0cmlidXRlKSB7XG4gICAgICAgIGxldCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgIGlmIChtb2RlbC5hdHRyaWJ1dGVzICYmIG1vZGVsLmF0dHJpYnV0ZXNbYXR0cmlidXRlXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGFzUmVsYXRpb25zaGlwKHR5cGUsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICBpZiAobW9kZWwucmVsYXRpb25zaGlwcyAmJiBtb2RlbC5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufTtcblNjaGVtYSA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBTY2hlbWEpO1xuZXhwb3J0IGRlZmF1bHQgU2NoZW1hOyJdfQ==