import got from 'got';
import { config } from './config.js';
import { getAuthInfo } from './get-auth-info.js';
import { buildUrl } from './utils/build-url.js';

export const getData = async (endpoint, method = 'GET', jsonBody) => {
  const authInfo = await getAuthInfo();

  const url = buildUrl(config.baseUrl, endpoint);

  if (!url) {
    throw new Error('Could not obtained data as URL is not valid');
  }

  return got(url, {
    method,
    json: jsonBody,
    headers: {
      authority: 'www.fpl.com',
      cookie: authInfo.cookiesArray.join('; '),
      jwttoken: authInfo.jwttoken,
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    },
  }).json();
};
