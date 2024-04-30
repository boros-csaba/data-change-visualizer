import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as cfo from "aws-cdk-lib/aws-cloudfront-origins";  
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

export class Website extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { 
      domainName: 'viralchartvideos.com' 
    });

    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate',
      'arn:aws:acm:us-east-1:276612475684:certificate/2cbba065-2d53-4e69-ab5b-06f039d045e6');

    const bucket = new s3.Bucket(this, 'ViralChartVideosWebsite', {
        bucketName: 'www.viralchartvideos.com',
        versioned: false,
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      const distribution = new cf.Distribution(this, 'ViralChartVideosWebsiteDistribution', {
        certificate: certificate,
        domainNames: ['viralchartvideos.com', 'www.viralchartvideos.com'],
        minimumProtocolVersion: cf.SecurityPolicyProtocol.TLS_V1_2_2021,
        defaultBehavior: {
          origin: new cfo.S3Origin(bucket),
          compress: true,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
        },
        defaultRootObject: 'index.html'
      });

      new route53.ARecord(this, 'ViralChartVideosWebsiteAliasRecord', {
        zone: zone,
        recordName: 'viralchartvideos.com',
        target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution))
      });

      new route53.ARecord(this, 'wwwViralChartVideosWebsiteAliasRecord', {
        zone: zone,
        recordName: 'www.viralchartvideos.com',
        target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution))
      });
  }
}