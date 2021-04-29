import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';

convict.addFormats(convictFormatWithValidator);

export const config = convict({
  env: { format: String, env: 'ENV', default: 'prod' },
  systemName: { format: String, env: 'SYSTEM_NAME', default: 'admin-web' },
  logLevel: {
    format: String,
    env: 'LOG_LEVEL',
    default: 'info',
  },
  network: {
    hostedZoneName: {
      format: String,
      env: 'HOSTED_ZONE_NAME',
      default: null,
    },
  },
  paths: {
    packageDirectory: {
      format: String,
      env: 'PACKAGE_DIRECTORY',
      default: null,
    },
    tagsOutputFile: {
      format: String,
      env: 'TAGS_OUTPUT_FILE',
      default: null,
    },
  },
  stackNames: {
    core: {
      format: String,
      env: 'CORE_STACK',
      default: 'prod-admin-web-stack',
    },
  },
  stackParameters: {
    env: {
      account: {
        format: String,
        env: 'CDK_DEFAULT_ACCOUNT',
        default: '',
      },
      region: {
        format: String,
        env: 'CDK_DEFAULT_REGION',
        default: '',
      },
    },
  },
  web: {
    bucketName: {
      format: String,
      env: 'WEB_BUCKET_NAME',
      default: 'prod-admin-web-presspay',
    },
    domainName: {
      format: String,
      env: 'WEB_DOMAIN_NAME',
      default: 'prod-admin-web.presspay.com.au',
    },
  },
});

config.validate({ allowed: 'strict' });
