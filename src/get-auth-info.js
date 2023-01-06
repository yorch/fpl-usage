import got from 'got';
import { base64 } from './base64.js';

const getLoginUrl = () =>
  `https://www.fpl.com/cs/customer/v1/registration/loginAndUseMigration?view=LoginMini&_=${Date.now()}`;

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

export const getAuthInfo = async (username, password) => {
  const { headers } = await got(getLoginUrl(), {
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

  return { cookiesArray, rawCookies, jwttoken, ltpatoken2 };
};
