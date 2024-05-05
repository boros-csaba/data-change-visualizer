import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class Payments extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const createStripeCheckoutSessionLambdaFunction = new nodejs.NodejsFunction(
            this,
            'CreateStripeCheckoutSession',
            {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'handler',
                entry: '../lambda_functions/create_stripe_checkout_session/index.js',
                environment: {
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
                    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || '',
                },
            }
        );

        createStripeCheckoutSessionLambdaFunction.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'], // todo allow only the frontend domain
                allowedMethods: [lambda.HttpMethod.POST],
            },
        });
    }
}
