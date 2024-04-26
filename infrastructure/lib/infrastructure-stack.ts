import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'CreateStripeCheckoutSession', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda_functions/create_stripe_checkout_session/'),
      environment: {
        STRIPE_SECRET_KEY: ''
      }
    });

    lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });
  }
}
