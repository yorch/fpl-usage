import dayjs from 'dayjs';
import pMap from 'p-map';
import { getAccountInfo } from './get-account-info.js';
import { getData } from './get-data.js';
import { logger } from './logger.js';
import { buildStringDate } from './utils/build-string-date.js';

const commonAttrs = {
  amrFlag: 'Y',
  applicationPage: 'resDashBoard',
  channel: 'WEB',
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
    premiseNumber,
    projectedBillFlag: false,
    revCode,
    startDate:
      typeof startDate === 'string' ? startDate : buildStringDate(startDate),
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
    endDate: typeof endDate === 'string' ? endDate : buildStringDate(endDate),
    frequencyType: 'Daily',
    meterNo,
    monthlyFlag: false,
    premiseNumber,
    projectedBillFlag: false,
    revCode,
    startDate:
      typeof startDate === 'string' ? startDate : buildStringDate(startDate),
    status,
  });

const getMonthlyRequestBody =
  () => (accountType, premiseNumber, meterNo, revCode, status) => ({
    ...commonAttrs,
    accountType,
    meterNo,
    monthlyFlag: true,
    premiseNumber,
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

export const getHourlyUsageData = async (startDate) =>
  getUsageData(getHourlyRequestBody(startDate));

export const getDailyUsageData = async (startDate, endDate) =>
  getUsageData(getDailyRequestBody(startDate, endDate));

export const getMonthlyUsageData = async () =>
  getUsageData(getMonthlyRequestBody());

export const getHourlyUsageDataForRange = async (startDate, endDate) => {
  if (startDate > endDate) {
    throw new Error('Start date must be less or equal than end date');
  }

  const startDayJS = dayjs(startDate);
  const endDayJS = dayjs(endDate);

  const duration = endDayJS.diff(startDayJS, 'day');

  logger.info(
    { days: duration, startDate, endDate },
    `Will obtain hourly usage for ${duration} days, from ${startDayJS.format(
      'YYYY-MM-DD'
    )} to ${endDayJS.format('YYYY-MM-DD')}`
  );

  const resultArray = await pMap(
    [...Array(duration)],
    async (_, index) => {
      const date = startDayJS.add(index, 'day');
      const formattedDate = date.format('YYYY-MM-DD');
      const requestStartTime = Date.now();

      logger.info({ formattedDate }, 'Obtaining hourly usage');

      const { data } = await getHourlyUsageData(date);
      const requestDurationMs = Date.now() - requestStartTime;
      const usageData = data?.HourlyUsage?.data;

      if (!usageData) {
        logger.warn(
          { formattedDate, requestDurationMs },
          'Hourly usage could not be obtained'
        );
        return [];
      }

      logger.info(
        { formattedDate, records: usageData.length, requestDurationMs },
        'Successfully obtained hourly usage'
      );

      return usageData;
    },
    { concurrency: 3 }
  );

  return [].concat(...resultArray);
};
