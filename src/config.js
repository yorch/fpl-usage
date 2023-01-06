import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();

import env from 'env-var';

const nodeEnv = env.get('NODE_ENV').default('development').asString();

export const config = {
  auth: {
    username: env.get('AUTH_USERNAME').required().asString(),
    password: env.get('AUTH_PASSWORD').required().asString(),
    ttl_secs: env
      .get('AUTH_TTL_SECS')
      .default(60 * 3)
      .asInt(),
  },
  dataDirectory: env.get('DATA_DIR').default('data').asString(),
  nodeEnv,
  isProduction: nodeEnv === 'PRODUCTION',
};