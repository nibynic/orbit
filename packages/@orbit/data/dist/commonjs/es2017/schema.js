"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _exception = require("./exception");

var _core = require("@orbit/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let Schema = class Schema {
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
    constructor(settings = {}) {
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
    get version() {
        return this._version;
    }
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
    upgrade(settings = {}) {
        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        this._applySettings(settings);
        this.emit('upgrade', this._version);
    }
    /**
     * Registers a complete set of settings
     *
     * @private
     * @param {Object} settings Settings passed into `constructor` or `upgrade`.
     */
    _applySettings(settings) {
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
    }
    /**
     * Generate an id for a given model type.
     *
     * @param {String} type Optional. Type of the model for which the ID is being generated.
     * @return {String} Generated model ID
     */
    generateId(type) {
        return _main2.default.uuid();
    }
    /**
     * A naive pluralization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} plural form of `word`
     */
    pluralize(word) {
        return word + 's';
    }
    /**
     * A naive singularization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} singular form of `word`
     */
    singularize(word) {
        if (word.lastIndexOf('s') === word.length - 1) {
            return word.substr(0, word.length - 1);
        } else {
            return word;
        }
    }
    initializeRecord(record) {
        if (record.id === undefined) {
            record.id = this.generateId(record.type);
        }
    }
    get models() {
        return this._models;
    }
    getModel(type) {
        let model = this.models[type];
        if (model) {
            return model;
        } else {
            throw new _exception.ModelNotFound(type);
        }
    }
    hasAttribute(type, attribute) {
        let model = this.getModel(type);
        if (model.attributes && model.attributes[attribute]) {
            return true;
        } else {
            return false;
        }
    }
    hasRelationship(type, relationship) {
        let model = this.getModel(type);
        if (model.relationships && model.relationships[relationship]) {
            return true;
        } else {
            return false;
        }
    }
};
Schema = __decorate([_core.evented], Schema);
exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtYS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJTY2hlbWEiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwidmVyc2lvbiIsInVuZGVmaW5lZCIsIm1vZGVscyIsIl9hcHBseVNldHRpbmdzIiwiX3ZlcnNpb24iLCJ1cGdyYWRlIiwiZW1pdCIsImdlbmVyYXRlSWQiLCJwbHVyYWxpemUiLCJzaW5ndWxhcml6ZSIsIl9tb2RlbHMiLCJ0eXBlIiwiT3JiaXQiLCJ1dWlkIiwid29yZCIsImxhc3RJbmRleE9mIiwic3Vic3RyIiwiaW5pdGlhbGl6ZVJlY29yZCIsInJlY29yZCIsImlkIiwiZ2V0TW9kZWwiLCJtb2RlbCIsIk1vZGVsTm90Rm91bmQiLCJoYXNBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVzIiwiaGFzUmVsYXRpb25zaGlwIiwicmVsYXRpb25zaGlwIiwicmVsYXRpb25zaGlwcyIsImV2ZW50ZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFWQSxJQUFJQSxhQUFhLGFBQVEsVUFBS0EsVUFBYixJQUEyQixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ2pGLFFBQUlDLElBQUlDLFVBQVVDLE1BQWxCO0FBQUEsUUFDSUMsSUFBSUgsSUFBSSxDQUFKLEdBQVFILE1BQVIsR0FBaUJFLFNBQVMsSUFBVCxHQUFnQkEsT0FBT0ssT0FBT0Msd0JBQVAsQ0FBZ0NSLE1BQWhDLEVBQXdDQyxHQUF4QyxDQUF2QixHQUFzRUMsSUFEL0Y7QUFBQSxRQUVJTyxDQUZKO0FBR0EsUUFBSSxP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ID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgeyBNb2RlbE5vdEZvdW5kIH0gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHsgZXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbi8qKlxuICogQSBgU2NoZW1hYCBkZWZpbmVzIHRoZSBtb2RlbHMgYWxsb3dlZCBpbiBhIHNvdXJjZSwgaW5jbHVkaW5nIHRoZWlyIGtleXMsXG4gKiBhdHRyaWJ1dGVzLCBhbmQgcmVsYXRpb25zaGlwcy4gQSBzaW5nbGUgc2NoZW1hIG1heSBiZSBzaGFyZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBzb3VyY2VzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBTY2hlbWFcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgU2NoZW1hID0gY2xhc3MgU2NoZW1hIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgU2NoZW1hLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSBPcHRpb25hbC4gQ29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgICAgT3B0aW9uYWwuIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byAxLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgIFtzZXR0aW5ncy5tb2RlbHNdICAgICAgICBPcHRpb25hbC4gU2NoZW1hcyBmb3IgaW5kaXZpZHVhbCBtb2RlbHMgc3VwcG9ydGVkIGJ5IHRoaXMgc2NoZW1hLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5nZW5lcmF0ZUlkXSAgICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSBJRHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLnBsdXJhbGl6ZV0gICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3Muc2luZ3VsYXJpemVdICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3MubW9kZWxzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLm1vZGVscyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBWZXJzaW9uXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBvZiBzY2hlbWEuXG4gICAgICovXG4gICAgZ2V0IHZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlcyBTY2hlbWEgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIEVtaXRzIHRoZSBgdXBncmFkZWAgZXZlbnQgdG8gY3VlIHNvdXJjZXMgdG8gdXBncmFkZSB0aGVpciBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSAgICAgICAgICBTZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbiArIDEuXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgW3NldHRpbmdzLm1vZGVsc10gICAgICBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnBsdXJhbGl6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnNpbmd1bGFyaXplXSBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cbiAgICAgKi9cbiAgICB1cGdyYWRlKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IHRoaXMuX3ZlcnNpb24gKyAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLmVtaXQoJ3VwZ3JhZGUnLCB0aGlzLl92ZXJzaW9uKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY29tcGxldGUgc2V0IG9mIHNldHRpbmdzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyBTZXR0aW5ncyBwYXNzZWQgaW50byBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cbiAgICAgKi9cbiAgICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICAvLyBWZXJzaW9uXG4gICAgICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xuICAgICAgICAvLyBBbGxvdyBvdmVycmlkZXNcbiAgICAgICAgaWYgKHNldHRpbmdzLmdlbmVyYXRlSWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVJZCA9IHNldHRpbmdzLmdlbmVyYXRlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnBsdXJhbGl6ZSkge1xuICAgICAgICAgICAgdGhpcy5wbHVyYWxpemUgPSBzZXR0aW5ncy5wbHVyYWxpemU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnNpbmd1bGFyaXplKSB7XG4gICAgICAgICAgICB0aGlzLnNpbmd1bGFyaXplID0gc2V0dGluZ3Muc2luZ3VsYXJpemU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVnaXN0ZXIgbW9kZWwgc2NoZW1hc1xuICAgICAgICBpZiAoc2V0dGluZ3MubW9kZWxzKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYW4gaWQgZm9yIGEgZ2l2ZW4gbW9kZWwgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIE9wdGlvbmFsLiBUeXBlIG9mIHRoZSBtb2RlbCBmb3Igd2hpY2ggdGhlIElEIGlzIGJlaW5nIGdlbmVyYXRlZC5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEdlbmVyYXRlZCBtb2RlbCBJRFxuICAgICAqL1xuICAgIGdlbmVyYXRlSWQodHlwZSkge1xuICAgICAgICByZXR1cm4gT3JiaXQudXVpZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIG5haXZlIHBsdXJhbGl6YXRpb24gbWV0aG9kLlxuICAgICAqXG4gICAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxuICAgICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gcGx1cmFsIGZvcm0gb2YgYHdvcmRgXG4gICAgICovXG4gICAgcGx1cmFsaXplKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQgKyAncyc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgbmFpdmUgc2luZ3VsYXJpemF0aW9uIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIE92ZXJyaWRlIHdpdGggYSBtb3JlIHJvYnVzdCBnZW5lcmFsIHB1cnBvc2UgaW5mbGVjdG9yIG9yIHByb3ZpZGUgYW5cbiAgICAgKiBpbmZsZWN0b3IgdGFpbG9yZWQgdG8gdGhlIHZvY2FidWxhcmx5IG9mIHlvdXIgYXBwbGljYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdvcmRcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHNpbmd1bGFyIGZvcm0gb2YgYHdvcmRgXG4gICAgICovXG4gICAgc2luZ3VsYXJpemUod29yZCkge1xuICAgICAgICBpZiAod29yZC5sYXN0SW5kZXhPZigncycpID09PSB3b3JkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiB3b3JkLnN1YnN0cigwLCB3b3JkLmxlbmd0aCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdGlhbGl6ZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHJlY29yZC5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZWNvcmQuaWQgPSB0aGlzLmdlbmVyYXRlSWQocmVjb3JkLnR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBtb2RlbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbHM7XG4gICAgfVxuICAgIGdldE1vZGVsKHR5cGUpIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHNbdHlwZV07XG4gICAgICAgIGlmIChtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1vZGVsTm90Rm91bmQodHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGFzQXR0cmlidXRlKHR5cGUsIGF0dHJpYnV0ZSkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICBpZiAobW9kZWwuYXR0cmlidXRlcyAmJiBtb2RlbC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhc1JlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgaWYgKG1vZGVsLnJlbGF0aW9uc2hpcHMgJiYgbW9kZWwucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5TY2hlbWEgPSBfX2RlY29yYXRlKFtldmVudGVkXSwgU2NoZW1hKTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtYTsiXX0=