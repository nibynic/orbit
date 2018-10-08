var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */
import Orbit from './main';
import { ModelNotFound } from './exception';
import { evented } from '@orbit/core';
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
        return Orbit.uuid();
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
            throw new ModelNotFound(type);
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
Schema = __decorate([evented], Schema);
export default Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtYS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJPcmJpdCIsIk1vZGVsTm90Rm91bmQiLCJldmVudGVkIiwiU2NoZW1hIiwic2V0dGluZ3MiLCJ2ZXJzaW9uIiwidW5kZWZpbmVkIiwibW9kZWxzIiwiX2FwcGx5U2V0dGluZ3MiLCJ1cGdyYWRlIiwiX3ZlcnNpb24iLCJlbWl0IiwiZ2VuZXJhdGVJZCIsInBsdXJhbGl6ZSIsInNpbmd1bGFyaXplIiwiX21vZGVscyIsInR5cGUiLCJ1dWlkIiwid29yZCIsImxhc3RJbmRleE9mIiwic3Vic3RyIiwiaW5pdGlhbGl6ZVJlY29yZCIsInJlY29yZCIsImlkIiwiZ2V0TW9kZWwiLCJtb2RlbCIsImhhc0F0dHJpYnV0ZSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZXMiLCJoYXNSZWxhdGlvbnNoaXAiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGlvbnNoaXBzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFVQyxNQUFsQjtBQUFBLFFBQ0lDLElBQUlILElBQUksQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxTQUFTLElBQVQsR0FBZ0JBLE9BQU9LLE9BQU9DLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBRC9GO0FBQUEsUUFFSU8sQ0FGSjtBQUdBLFFBQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxRQUFR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RCxtQkFBTyxJQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8sS0FBUDtBQUNIO0FBQ0osS0ExSUQ7O0FBQUE7QUFBQTtBQUFBLHlCQXlCYztBQUNWLG1CQUFPLEtBQUtwQixRQUFaO0FBQ0g7QUEzQkQ7QUFBQTtBQUFBLHlCQWdIYTtBQUNULG1CQUFPLEtBQUtLLE9BQVo7QUFDSDtBQWxIRDs7QUFBQTtBQUFBLEdBQUo7QUE0SUFaLFNBQVNuQixXQUFXLENBQUNrQixPQUFELENBQVgsRUFBc0JDLE1BQXRCLENBQVQ7QUFDQSxlQUFlQSxNQUFmIiwiZmlsZSI6InNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgeyBNb2RlbE5vdEZvdW5kIH0gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHsgZXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbi8qKlxuICogQSBgU2NoZW1hYCBkZWZpbmVzIHRoZSBtb2RlbHMgYWxsb3dlZCBpbiBhIHNvdXJjZSwgaW5jbHVkaW5nIHRoZWlyIGtleXMsXG4gKiBhdHRyaWJ1dGVzLCBhbmQgcmVsYXRpb25zaGlwcy4gQSBzaW5nbGUgc2NoZW1hIG1heSBiZSBzaGFyZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBzb3VyY2VzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBTY2hlbWFcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgU2NoZW1hID0gY2xhc3MgU2NoZW1hIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgU2NoZW1hLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSBPcHRpb25hbC4gQ29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgICAgT3B0aW9uYWwuIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byAxLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgIFtzZXR0aW5ncy5tb2RlbHNdICAgICAgICBPcHRpb25hbC4gU2NoZW1hcyBmb3IgaW5kaXZpZHVhbCBtb2RlbHMgc3VwcG9ydGVkIGJ5IHRoaXMgc2NoZW1hLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5nZW5lcmF0ZUlkXSAgICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSBJRHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLnBsdXJhbGl6ZV0gICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3Muc2luZ3VsYXJpemVdICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3MubW9kZWxzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLm1vZGVscyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBWZXJzaW9uXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBvZiBzY2hlbWEuXG4gICAgICovXG4gICAgZ2V0IHZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlcyBTY2hlbWEgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIEVtaXRzIHRoZSBgdXBncmFkZWAgZXZlbnQgdG8gY3VlIHNvdXJjZXMgdG8gdXBncmFkZSB0aGVpciBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSAgICAgICAgICBTZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbiArIDEuXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgW3NldHRpbmdzLm1vZGVsc10gICAgICBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnBsdXJhbGl6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnNpbmd1bGFyaXplXSBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cbiAgICAgKi9cbiAgICB1cGdyYWRlKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IHRoaXMuX3ZlcnNpb24gKyAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLmVtaXQoJ3VwZ3JhZGUnLCB0aGlzLl92ZXJzaW9uKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY29tcGxldGUgc2V0IG9mIHNldHRpbmdzXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyBTZXR0aW5ncyBwYXNzZWQgaW50byBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cbiAgICAgKi9cbiAgICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICAvLyBWZXJzaW9uXG4gICAgICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xuICAgICAgICAvLyBBbGxvdyBvdmVycmlkZXNcbiAgICAgICAgaWYgKHNldHRpbmdzLmdlbmVyYXRlSWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVJZCA9IHNldHRpbmdzLmdlbmVyYXRlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnBsdXJhbGl6ZSkge1xuICAgICAgICAgICAgdGhpcy5wbHVyYWxpemUgPSBzZXR0aW5ncy5wbHVyYWxpemU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnNpbmd1bGFyaXplKSB7XG4gICAgICAgICAgICB0aGlzLnNpbmd1bGFyaXplID0gc2V0dGluZ3Muc2luZ3VsYXJpemU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVnaXN0ZXIgbW9kZWwgc2NoZW1hc1xuICAgICAgICBpZiAoc2V0dGluZ3MubW9kZWxzKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYW4gaWQgZm9yIGEgZ2l2ZW4gbW9kZWwgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIE9wdGlvbmFsLiBUeXBlIG9mIHRoZSBtb2RlbCBmb3Igd2hpY2ggdGhlIElEIGlzIGJlaW5nIGdlbmVyYXRlZC5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEdlbmVyYXRlZCBtb2RlbCBJRFxuICAgICAqL1xuICAgIGdlbmVyYXRlSWQodHlwZSkge1xuICAgICAgICByZXR1cm4gT3JiaXQudXVpZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIG5haXZlIHBsdXJhbGl6YXRpb24gbWV0aG9kLlxuICAgICAqXG4gICAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxuICAgICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gcGx1cmFsIGZvcm0gb2YgYHdvcmRgXG4gICAgICovXG4gICAgcGx1cmFsaXplKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQgKyAncyc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgbmFpdmUgc2luZ3VsYXJpemF0aW9uIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIE92ZXJyaWRlIHdpdGggYSBtb3JlIHJvYnVzdCBnZW5lcmFsIHB1cnBvc2UgaW5mbGVjdG9yIG9yIHByb3ZpZGUgYW5cbiAgICAgKiBpbmZsZWN0b3IgdGFpbG9yZWQgdG8gdGhlIHZvY2FidWxhcmx5IG9mIHlvdXIgYXBwbGljYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdvcmRcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHNpbmd1bGFyIGZvcm0gb2YgYHdvcmRgXG4gICAgICovXG4gICAgc2luZ3VsYXJpemUod29yZCkge1xuICAgICAgICBpZiAod29yZC5sYXN0SW5kZXhPZigncycpID09PSB3b3JkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiB3b3JkLnN1YnN0cigwLCB3b3JkLmxlbmd0aCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdGlhbGl6ZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHJlY29yZC5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZWNvcmQuaWQgPSB0aGlzLmdlbmVyYXRlSWQocmVjb3JkLnR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBtb2RlbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbHM7XG4gICAgfVxuICAgIGdldE1vZGVsKHR5cGUpIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHNbdHlwZV07XG4gICAgICAgIGlmIChtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1vZGVsTm90Rm91bmQodHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGFzQXR0cmlidXRlKHR5cGUsIGF0dHJpYnV0ZSkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICBpZiAobW9kZWwuYXR0cmlidXRlcyAmJiBtb2RlbC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhc1JlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgaWYgKG1vZGVsLnJlbGF0aW9uc2hpcHMgJiYgbW9kZWwucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5TY2hlbWEgPSBfX2RlY29yYXRlKFtldmVudGVkXSwgU2NoZW1hKTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtYTsiXX0=