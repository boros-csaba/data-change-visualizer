const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1
        }],
        client_reference_id: event.body,
        mode: 'payment',
        success_url: 'https://localhost/download.html?s={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://localhost/' // todo handle cancel
    });

    return session.url;
}