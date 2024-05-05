import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');

export class Payments extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const lambdaDir = path.resolve(__dirname, '../lambda_functions/create_stripe_checkout_session');

        const createStripeCheckoutSessionLambdaFunction = new nodejs.NodejsFunction(
            this,
            'CreateStripeCheckoutSession',
            {
                projectRoot: lambdaDir,
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'index.handler',
                entry: path.join(lambdaDir, 'index.js'),
                depsLockFilePath: path.join(lambdaDir, 'package-lock.json'),
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
