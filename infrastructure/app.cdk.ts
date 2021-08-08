import { App, Tags } from '@aws-cdk/core';
import 'source-map-support/register';
import CoreStack from './core.cdk';
import loadTags from './load-tags';
import { config } from './shared';

const app = new App();

loadTags(config.get('paths.tagsOutputFile')!).forEach(([key, value]) => Tags.of(app).add(key, value));

new CoreStack(app, config.get('stackNames.core'), config.get('stackParameters'));
