const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {

    try {

        const session = await stripe.checkout.sessions.retrieve(
            event.body
        );

        if (session.payment_status === 'paid') {
            return {
                fileId: session.client_reference_id,
                payment_status: 'paid'
            }
        }

        return {
            payment_status: 'unpaid'
        };
        
    } catch (error) {
        return {
            payment_status: 'error'
        }
    }
    
}