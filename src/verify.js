"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMiddleware = exports.verifyBodySignature = exports.verifyRequestSignature = void 0;
const crypto_1 = __importDefault(require("crypto"));
const timingSafeCompare = require("tsscmp");
function verifyRequestSignature({ signingSecret, requestSignature, requestTimestamp, body, }) {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (requestTimestamp < fiveMinutesAgo) {
        throw new Error('Verified request signature is outdated.');
    }
    const hmac = crypto_1.default.createHmac('sha256', signingSecret);
    const [version, hash] = requestSignature.split('=');
    hmac.update(`${version}:${requestTimestamp}:${body}`);
    const computedHash = hmac.digest('hex');
    if (!timingSafeCompare(hash, computedHash)) {
        throw new Error('Verified request signing verification failed.');
    }
    return true;
}
exports.verifyRequestSignature = verifyRequestSignature;
/**
 * Verify the request signature of a request from a Direqt service.
 *
 * This method is used to verify that a request came from a Direqt service that
 * shares a signing secret with the recipient. It requires that the request have
 * the appropriate headers containing the signature and timestamp.
 *
 * Requests with a timestamp older than 5 minutes are rejected.
 *
 * N.B. the raw body of the Request must be available as req.rawBody.
 */
function verifyBodySignature({ signingSecret, req, }) {
    const requestTimestamp = req.get('X-Direqt-Request-Timestamp');
    const requestSignature = req.get('X-Direqt-Signature');
    if (!requestTimestamp || !requestSignature) {
        throw new Error(`Missing headers: X-Direqt-Request-Timestamp, X-Direqt-Signature`);
    }
    return verifyRequestSignature({
        signingSecret,
        requestSignature,
        requestTimestamp: parseInt(requestTimestamp, 10),
        body: req['rawBody'],
    });
}
exports.verifyBodySignature = verifyBodySignature;
/**
 * Returns an Express middleware that verifies the signature of a webhook
 * invocation from Direqt.
 */
function verifyMiddleware({ signingSecret, }) {
    return (req, res, next) => {
        try {
            verifyBodySignature({ signingSecret, req });
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.verifyMiddleware = verifyMiddleware;
