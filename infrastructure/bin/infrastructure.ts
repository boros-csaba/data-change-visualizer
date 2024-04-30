#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();
new InfrastructureStack(app, 'ViralChartVideos', {
  
  env: { 
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION 
  }

});