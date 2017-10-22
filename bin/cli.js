#!/usr/bin/env node
// Copyright (c) 2017 Direqt Inc. All Rights Reserved.

var argv = require('minimist')(process.argv.slice(2));
var VERSION = require('../package.json').version;

function getApiRoot() {
    var apiRoot = argv['apiRoot'] || argv['a'];
    if (!apiRoot) {
        apiRoot = process.env.DIREQT_APIROOT;
    }
    if (!apiRoot) {
        apiRoot = 'https://api.direqt.io/api/v0';
    }
    return apiRoot;
}

function getApiKeyId() {
    var apiKeyId = argv['apiKeyId'] || argv['id'];
    if (!apiKeyId) {
        apiKeyId = process.env.DIREQT_APIKEY_ID;
    }
    if (!apiKeyId) {
        apiKeyId = '';
    }
    return apiKeyId;
}

function getApiKeySecret() {
    var apiKeySecret = argv['apiKeySecret'] || argv['secret'];
    if (!apiKeySecret) {
        apiKeySecret = process.env.DIREQT_APIKEY_SECRET;
    }
    if (!apiKeySecret) {
        apiKeySecret = '';
    }
    return apiKeySecret;
}

var apiRoot = getApiRoot();
var apiKeyId = getApiKeyId();
var apiKeySecret = getApiKeySecret();

if (argv._.length < 1) {
    console.log("direqt v" + VERSION + " - Command Line Interface to Direqt");
    console.log("usage: direqt <command> [args]");
    console.log("");
    console.log("Where <command> is one of:");
    console.log("  fetch            - get information about the current user.");
    console.log("");
    console.log("APIROOT:       '" + apiRoot + "'");
    console.log("APIKEY_ID:     " + (apiKeyId ? "'" + apiKeyId + "'" : "<not set>"));
    console.log("APIKEY_SECRET: " + (apiKeySecret ? "[redacted]" : "<not set>"));
    console.log("");
    process.exit(1);
}

var command = argv._[0];
switch (command) {
    case 'fetch':
        _fetchAd(function (err, result) {
            if (err) {
                console.log('Failed to fetch ad.');
                console.log(err);
                return -1;
            }
            console.log(result);
        });
        break;
    default:
        console.log("Unrecognized command '%s'", command);
}

function _fetchAd(callback) {
    callback({ err: "not implemented" });
}
