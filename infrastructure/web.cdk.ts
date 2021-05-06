import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as core from '@aws-cdk/core';

type WebConstructProps = {
  bucketName: string;
  domainName: string;
  hostedZone: route53.IHostedZone;
};

export default class WebConstruct extends core.Construct {
  constructor(scope: core.Construct, id: string, props: WebConstructProps) {
    super(scope, id);

    const { bucketName, domainName, hostedZone } = props;
    const stack = core.Stack.of(this);

    const s3Bucket = new s3.Bucket(this, 'WebBucket', {
      bucketName: `${bucketName}-${stack.stackId}`,
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: core.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'WebCertificate', {
      domainName,
      hostedZone,
      // Required to be in us-east-1 for cross-region certificates
      region: 'us-east-1',
    });

    const distribution = new cloudfront.Distribution(this, 'WebDistribution', {
      certificate,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(s3Bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
      domainNames: [domainName],
    });

    new route53.ARecord(this, 'WebDnsRecord', {
      recordName: domainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
    });

    new s3deploy.BucketDeployment(this, 'WebDeploy', {
      sources: [s3deploy.Source.asset('./src/web/build')],
      destinationBucket: s3Bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new core.CfnOutput(this, 'WebS3BucketArn', { value: s3Bucket.bucketArn });
    new core.CfnOutput(this, 'WebS3BucketName', { value: s3Bucket.bucketName });
    new core.CfnOutput(this, 'WebDistributionId', {
      value: distribution.distributionId,
    });
  }
}
