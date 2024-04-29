import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { Payments } from './payments';
import { VideoSourceFiles } from './video-source-files';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Payments(this, 'Payments');
    new VideoSourceFiles(this, 'VideoSourceFiles');
  }
}
