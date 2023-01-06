import got from 'got';
import { getAuthInfo } from './get-auth-info.js';

const BASE_URL = 'https://www.fpl.com/';

const buildUrl = (endpoint) => {
  try {
    return new URL(endpoint, BASE_URL).href;
  } catch (error) {
    // TODO: Handle error
    return '';
  }
};

export const getData = async (endpoint, method = 'GET', jsonBody) => {
  const authInfo = await getAuthInfo();

  return got(buildUrl(endpoint), {
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
