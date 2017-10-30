/**
 * Direqt Ad-Insertion SDK.
 *
 * Provides interfaces for fetching ads at runtime.
 *
 */
module.exports = Direqt;

// Demo APIKEY values that return test ads
module.exports.DEMO_APIKEY_ID = 'demo-apikey-id';

var DEFAULT_APIROOT = 'https://api.direqt.io/api/v0';
var DEFAULT_APIKEY_ID = '';


/**
 * Create Direqt.
 *
 * The values used for API root and API key can be specified in any of the
 * following places:
 *  (1) Direqt constructor
 *  (3) DIREQT_APIKEY_ID environment variable.
 *
 * If values are not found in any of these places, defaults are used.
 *
 * @param {Object} options Configuration options.
 * @param {String=} options.apiRoot The URI of the api server
 * @param {String=} options.apiKeyId The api key id to use.
 * @param {String=} options.optionsPath Defaults to './direqt.json'
 *
 * @constructor
 */
function Direqt(options) {
    if (!(this instanceof Direqt)) {
        return new Direqt(options);
    }

    options = options || {};
    var apiRoot = options.apiRoot;
    var apiKeyId = options.apiKeyId;

    // If we weren't given all configurable parameters, look in direqt.json.

    apiRoot = apiRoot || process.env['DIREQT_APIROOT'] || DEFAULT_APIROOT;
    apiKeyId = apiKeyId || process.env['DIREQT_APIKEY_ID'] || DEFAULT_APIKEY_ID;


    /**
     * Fetch an ad for the given placement.
     *
     * @param {String} placementId The placement ID for this ad location
     * @param {String} userId
     * @param {Object} optional request context
     * @returns {Object}
     */
    /* jshint unused:vars */
    this.fetch = function (placementId, userId, context, options) {
        return { err: "Not Implemented" };
    };
}

/**
 * Factory for a singleton Direqt object.
 *
 * // verbose (normal) flow:
 * var direqt = require('direqt');
 * var options = { ... }
 * var app = direqt(options);   // create instance with optional options
 * app.fetch(...);              // call via instance
 *
 * // using singleton pattern
 * var direqt = require('direqt');
 * direqt.fetch();  // implicitly create singleton and call through it
 *
 */
var Singleton = (function () {
    var o;
    return {
        get: function () {
            if (!o) {
                o = new Direqt();
            }
            return o;
        }
    };
})();

/**
 * Calls `fetch` of singleton object.
 *
 * @return {Promise}
 */
Direqt.fetch = function () {
    var s = Singleton.get();
    return s.fetch.apply(s, arguments);
};