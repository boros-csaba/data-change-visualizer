import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const createStripeCheckoutSessionLambdaFunction = new lambda.Function(this, 'CreateStripeCheckoutSession', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda_functions/create_stripe_checkout_session/'),
      environment: {
        STRIPE_SECRET_KEY: ''
      }
    });

    createStripeCheckoutSessionLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    const s3Bucket = new s3.Bucket(this, 'ViralChartVideoSourceFiles', {
      bucketName: 'viral-chart-video-source-files',
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const presignUrlRole = new iam.Role(this, 'PreSignedUrlLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        'AllowS3BucketObjectAccess': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['s3:PutObject'],
              resources: [s3Bucket.bucketArn + '/*']
            })
          ]
        })
      }
    });

    new lambda.Function(this, 'CreateS3UploadPresignedUrl', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda_functions/create_s3_upload_presigned_url/'),
      environment: {
        BUCKET_NAME: s3Bucket.bucketName,
        BUCKET_ARN: s3Bucket.bucketArn,
        PRESIGN_URL_ROLE_ARN: presignUrlRole.roleArn
      }
    });
  }
}
