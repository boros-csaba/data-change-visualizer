const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {

    const session = await stripe.checkout.sessions.retrieve(
        event.body
    );

    return session;
}