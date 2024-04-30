import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as cfo from "aws-cdk-lib/aws-cloudfront-origins";  

export class Website extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'ViralChartVideosWebsite', {
        bucketName: 'viral-chart-video-website', //todo, later should be same as domain name
        versioned: false,
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      new cf.Distribution(this, 'ViralChartVideosWebsiteDistribution', {
        defaultBehavior: {
          origin: new cfo.S3Origin(bucket),
          compress: true,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: cf.OriginRequestPolicy.CORS_S3_ORIGIN
        },
        defaultRootObject: 'index.html'
      });
  }
}