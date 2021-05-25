import * as route53 from '@aws-cdk/aws-route53';
import { App, Stack, StackProps } from '@aws-cdk/core';
import WebConstruct from './web.cdk';
import { config } from './shared';

export default class CoreStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: config.get('network.hostedZoneName')!,
    });

    new WebConstruct(this, 'Web', {
      bucketName: config.get('web.bucketName'),
      domainName: config.get('web.domainName'),
      hostedZone,
    });
  }
}
