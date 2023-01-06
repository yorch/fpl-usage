import { getAccountInfo } from './get-account-info.js';
import { getData } from './get-data.js';

const commonAttrs = {
  amrFlag: 'Y',
  applicationPage: 'resDashBoard',
  channel: 'WEB',
  //   lastBilledDate: '',
};

/**
 *
 * @param {string} premiseNumber
 * @param {string} meterNo
 * @param {string} startDate     - Format MMDDYYYY
 * @returns
 */
const getHourlyRequestBody =
  (startDate) => (accountType, premiseNumber, meterNo, revCode, status) => ({
    ...commonAttrs,
    accountType,
    billComparisionFlag: false,
    endDate: '',
    frequencyType: 'Hourly',
    meterNo,
    monthlyFlag: false,
    premiseNumber: `${premiseNumber}`,
    projectedBillFlag: false,
    revCode,
    startDate,
    status,
  });

/**
 *
 * @param {string} premiseNumber
 * @param {string} meterNo
 * @param {string} startDate     - Format MMDDYYY
 * @param {string} endDate       - Format MMDDYYY
 * @returns
 */
const getDailyRequestBody =
  (startDate, endDate) =>
  (accountType, premiseNumber, meterNo, revCode, status) => ({
    ...commonAttrs,
    accountType,
    bbEnrollmentStatus: 'NOTENROLLED',
    endDate,
    frequencyType: 'Daily',
    meterNo,
    monthlyFlag: false,
    premiseNumber: `${premiseNumber}`,
    projectedBillFlag: false,
    revCode,
    startDate,
    status,
  });

const getMonthlyRequestBody =
  () => (accountType, premiseNumber, meterNo, revCode, status) => ({
    ...commonAttrs,
    accountType,
    meterNo,
    monthlyFlag: true,
    premiseNumber: `${premiseNumber}`,
    projectedBillFlag: true,
    // I think 48 months is the max data that FPL stores
    recordCount: 48,
    revCode,
    status,
  });

const getUsageData = async (getJsonBody) => {
  const {
    accountNumber,
    accountType,
    meterNo,
    premiseNumber,
    revCode,
    status,
  } = await getAccountInfo();

  return getData(
    `/dashboard-api/resources/account/${accountNumber}/energyService/${accountNumber}`,
    'POST',
    getJsonBody(accountType, premiseNumber, meterNo, revCode, status)
  );
};

export const getHourlyUsageData = (startDate) =>
  getUsageData(getHourlyRequestBody(startDate));

export const getDailyUsageData = (startDate, endDate) =>
  getUsageData(getDailyRequestBody(startDate, endDate));

export const getMonthlyUsageData = () => getUsageData(getMonthlyRequestBody());
