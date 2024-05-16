import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class VideoSourceFiles extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const s3Bucket = new s3.Bucket(this, 'ViralChartVideoSourceFiles', {
            bucketName: 'viral-chart-video-source-files',
            versioned: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        s3Bucket.grantRead(new iam.AnyPrincipal());

        s3Bucket.addCorsRule({
            allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
            allowedOrigins: ['*'], // todo allow only the frontend domain
        });

        const createS3UploadPresignedUrlLambdaFunction = new lambda.Function(
            this,
            'CreateS3UploadPresignedUrl',
            {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'index.handler',
                code: lambda.Code.fromAsset(
                    'lambda_functions/create_s3_upload_presigned_url/'
                ),
                environment: {
                    BUCKET_NAME: s3Bucket.bucketName,
                    BUCKET_ARN: s3Bucket.bucketArn,
                },
            }
        );

        createS3UploadPresignedUrlLambdaFunction.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'], // todo allow only the frontend domain
                allowedMethods: [lambda.HttpMethod.POST],
            },
        });

        s3Bucket.grantPut(createS3UploadPresignedUrlLambdaFunction);
    }
}
