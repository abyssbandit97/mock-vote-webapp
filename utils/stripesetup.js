function createStripeInstance() {
    const stripe = require('stripe')(process.env.STRIPE_SECRET);
    return stripe;
}

module.exports = createStripeInstance;
