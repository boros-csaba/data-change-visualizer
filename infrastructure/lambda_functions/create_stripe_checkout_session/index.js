const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {

    console.log('event', event);
    console.log('slen', process.env.STRIPE_SECRET_KEY.length);
    console.log('priceid', process.env.STRIPE_PRICE_ID);

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1
        }],
        clientReferenceId: event.body,
        mode: 'payment',
        success_url: 'https://localhost/success',
        cancel_url: 'https://localhost/cancel',
    });

    return session.url;
}