const Stripe = require('stripe');
const stripe = Stripe('');

exports.handler = async function (event) {

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price: 100,
            quantity: 1
            }],
            mode: 'payment',
            success_url: 'https://localhost/success',
            cancel_url: 'https://localhost/cancel',
    });

    return session.url;
}