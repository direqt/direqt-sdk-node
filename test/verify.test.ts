import { expect } from 'chai';
import crypto from 'crypto';
import { Request } from 'express';
import sinon from 'sinon';

import { verifyBodySignature } from '../src/verify';

/**
 * Generate HTTP headers for signed public API requests.
 *
 * This method simulates the process used by Direqt when it invokes an external
 * webhook.
 *
 * @param signingSecret The shared signing secret between the Direqt service and
 * the recipient.
 * @param body The body of the request to be signed. This should be an object,
 * not a JSON.stringify'd string.
 */
export function generateRequestSignatureHeaders(
    signingSecret: string,
    body: object
) {
    const version = 'v0';
    const hmac = crypto.createHmac('sha256', signingSecret);
    const ts = Math.floor(Date.now() / 1000); // in seconds

    hmac.update(`${version}:${ts}:${JSON.stringify(body)}`);

    const signature = 'v0=' + hmac.digest('hex');

    const headers = {
        'X-Direqt-Signature': signature,
        'X-Direqt-Request-Timestamp': ts,
    };

    return headers;
}

function _makeSignedRequest(
    signingSecret: string,
    body: object
): Request & { rawBody: string } {
    const headers = generateRequestSignatureHeaders(signingSecret, body);

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const req: Request & { rawBody: string } = <any>{
        get: (header: string) => headers[header],
        rawBody: JSON.stringify(body),
    };

    return req;
}

describe('verify', () => {
    it('should fail with invalid signing secret', () => {
        const signingSecret = 'test-signing-secret';
        const body = { foo: 'bar' };

        const req = _makeSignedRequest('invalid-signing-secret', body);

        try {
            verifyBodySignature({ signingSecret, req });
            expect.fail('should have thrown');
        } catch (e) {
            expect(e.message).to.match(/signing verification/);
        }
    });

    it('should fail with expired timestamp', () => {
        const signingSecret = 'test-signing-secret';
        const body = { foo: 'bar' };

        // Generate a signature with a timestamp from 5 minutes ago
        const clock = sinon.useFakeTimers(Date.now() - 6 * 60 * 1000);
        const req = _makeSignedRequest(signingSecret, body);
        clock.restore();

        try {
            verifyBodySignature({ signingSecret, req });
            expect.fail('should have thrown');
        } catch (e) {
            expect(e.message).to.match(/outdated/);
        }
    });
});
