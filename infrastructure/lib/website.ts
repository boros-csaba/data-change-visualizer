import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class Website extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new s3.Bucket(this, 'ViralChartVideosWebsite', {
        bucketName: 'viral-chart-video-source-files', //todo, later should be same as domain name
        versioned: false,
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
  }
}