import { config } from './config.js';
import { getData } from './get-data.js';
import { loadJsonFile } from './utils/load-json-file.js';
import { saveJsonFile } from './utils/save-json-file.js';

const CACHE_FILENAME = '_account';

export const getAccountInfo = async () => {
  const cachedAccountInfo = await loadJsonFile(
    config.dataDirectory,
    CACHE_FILENAME
  );

  if (cachedAccountInfo && cachedAccountInfo._expires > Date.now()) {
    return cachedAccountInfo;
  }

  const endpoint = `/cs/customer/v1/resources/header?_=${Date.now()}`;

  const { data } = await getData(endpoint);

  const accountInfo = {
    _created: Date.now(),
    _expires: Date.now() + config.auth.ttl_secs * 1000,
    data,
    accountNumber: data?.selectedAccount?.data?.accountNumber,
    accountType: data?.selectedAccount?.data?.accountType,
    meterNo: data?.selectedAccount?.data?.meterNo,
    premiseNumber: data?.selectedAccount?.data?.premiseNumber,
    revCode: data?.selectedAccount?.data?.revCode,
    status: data?.selectedAccount?.data?.status,
    statusName: data?.selectedAccount?.data?.statusName,
  };

  await saveJsonFile(config.dataDirectory, CACHE_FILENAME, accountInfo);

  return accountInfo;
};
