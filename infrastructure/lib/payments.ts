import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Payments extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const createStripeCheckoutSessionLambdaFunction = new lambda.Function(
            this,
            'CreateStripeCheckoutSession',
            {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'index.handler',
                code: lambda.Code.fromAsset(
                    'lambda_functions/create_stripe_checkout_session/'
                ),
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

        const getStripeCheckoutSessionDataLambdaFunction = new lambda.Function(
            this,
            'GetStripeCheckoutSessionData',
            {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'index.handler',
                code: lambda.Code.fromAsset(
                    'lambda_functions/get_stripe_checkout_session_data/'
                ),
                environment: {
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
                    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || '',
                },
            }
        );

        getStripeCheckoutSessionDataLambdaFunction.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'], // todo allow only the frontend domain
                allowedMethods: [lambda.HttpMethod.POST],
            },
        });
    }
}
