/**
 * Example showing simple integration of Rich Card ad.
 *
 * This example program demonstrates:
 * - Initializing the Direqt SDK with API key, secret, and application ID;
 * - Fetch of an RBM-formatted Rich Card ad.
 *
 * Note that we are using a special demo-only configuration parameters that
 * will return test ads.
 */
var direqt = require('../../'); // use `require('direqt')` in your own code

// Direqt configuration block. Note that if you define environment variables
// for the configuration parameters, you can use the `direqt` reference
// directly from the require() statement (rather than using it like a
// constructor).
var config = {
  apiKey: direqt.DEMO_API_KEY,
  apiSecret: direqt.DEMO_API_SECRET,
};
direqt = direqt(config);

direqt.fetch(direqt.DEMO_PLACEMENT_ID)
  .then(ad => console.log(ad));
