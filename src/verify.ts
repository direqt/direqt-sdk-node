import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import timingSafeCompare = require('tsscmp');

export interface VerifyRequestSignatureParams {
    signingSecret: string;
    requestSignature: string;
    requestTimestamp: number;
    body: string; // Full, raw body string.
}

export function verifyRequestSignature({
    signingSecret,
    requestSignature,
    requestTimestamp,
    body,
}: VerifyRequestSignatureParams): true {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

    if (requestTimestamp < fiveMinutesAgo) {
        throw new Error('Verified request signature is outdated.');
    }

    const hmac = crypto.createHmac('sha256', signingSecret);
    const [version, hash] = requestSignature.split('=');
    hmac.update(`${version}:${requestTimestamp}:${body}`);

    const computedHash = hmac.digest('hex');

    if (!timingSafeCompare(hash, computedHash)) {
        throw new Error('Verified request signing verification failed.');
    }

    return true;
}

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
export function verifyBodySignature({
    signingSecret,
    req,
}: {
    signingSecret: string;
    req: Request;
}): true {
    const requestTimestamp = req.get('X-Direqt-Request-Timestamp');
    const requestSignature = req.get('X-Direqt-Signature');

    if (!requestTimestamp || !requestSignature) {
        throw new Error(
            `Missing headers: X-Direqt-Request-Timestamp, X-Direqt-Signature`
        );
    }

    return verifyRequestSignature({
        signingSecret,
        requestSignature,
        requestTimestamp: parseInt(requestTimestamp, 10),
        body: req['rawBody'] as string,
    });
}

/**
 * Returns an Express middleware that verifies the signature of a webhook
 * invocation from Direqt.
 */
export function verifyMiddleware({
    signingSecret,
}: {
    signingSecret: string;
}): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
        try {
            verifyBodySignature({ signingSecret, req });
            next();
        } catch (error) {
            next(error);
        }
    };
}
