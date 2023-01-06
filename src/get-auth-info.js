import got from 'got';
import { config } from './config.js';
import { base64 } from './utils/base64.js';
import { loadJsonFile } from './utils/load-json-file.js';
import { saveJsonFile } from './utils/save-json-file.js';

const CACHE_FILENAME_PREFIX = '_auth';

const loadAuthInfo = (username) =>
  loadJsonFile(config.dataDirectory, `${CACHE_FILENAME_PREFIX}_${username}`);

const saveAuthInfo = (username, authInfo) =>
  saveJsonFile(
    config.dataDirectory,
    `${CACHE_FILENAME_PREFIX}_${username}`,
    authInfo
  );

// Logic obtained from: https://www.fpl.com/app/framework/dojo/dojo/dojo.js.uncompressed.js
const getAuthHeader = (username, password) => {
  const credentials = `${username}:${password}`;

  const bytes = [];
  for (let i = 0; i < credentials.length; ++i) {
    bytes.push(credentials.charCodeAt(i));
  }

  return {
    authorization: `Basic ${base64.encode(bytes)}`,
  };
};

export const getAuthInfo = async () => {
  const { username, password } = config.auth;

  const cachedAuthInfo = await loadAuthInfo(username);

  if (cachedAuthInfo && cachedAuthInfo._expires > Date.now()) {
    return cachedAuthInfo;
  }

  const url = `https://www.fpl.com/cs/customer/v1/registration/loginAndUseMigration?view=LoginMini&_=${Date.now()}`;

  const { headers } = await got(url, {
    headers: {
      ...getAuthHeader(username, password),
      cookie: 'localUser=',
      referer: 'https://www.fpl.com/home.html',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'x-client': 'jquery',
      'x-param-channel': 'web',
      'x-requested-with': 'XMLHttpRequest',
    },
  });

  const rawCookies = headers['set-cookie'];
  const cookiesArray = rawCookies.map((cookie) => cookie.split(';')[0]);

  const { jwttoken, ltpatoken2 } = headers;

  const authInfo = {
    _created: Date.now(),
    _username: username,
    _expires: Date.now() + config.auth.ttl_secs * 1000,
    cookiesArray,
    rawCookies,
    jwttoken,
    ltpatoken2,
  };

  await saveAuthInfo(username, authInfo);

  return authInfo;
};
