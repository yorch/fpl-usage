/**
 *
 * @param {string} premiseNumber
 * @param {string} meterNo
 * @param {string} startDate     - Format MMDDYYYY
 * @returns
 */
export const getHourlyRequestBody = (premiseNumber, meterNo, startDate) => ({
  accountType: 'RESIDENTIAL',
  amrFlag: 'Y',
  applicationPage: 'resDashBoard',
  billComparisionFlag: false,
  channel: 'WEB',
  endDate: '',
  frequencyType: 'Hourly',
  //   lastBilledDate: '',
  meterNo,
  monthlyFlag: false,
  premiseNumber: `${premiseNumber}`,
  projectedBillFlag: false,
  revCode: '1',
  startDate,
  status: 2,
});

/**
 *
 * @param {string} premiseNumber
 * @param {string} meterNo
 * @param {string} startDate     - Format MMDDYYY
 * @param {string} endDate       - Format MMDDYYY
 * @returns
 */
export const getDailyRequestBody = (
  premiseNumber,
  meterNo,
  startDate,
  endDate
) => ({
  accountType: 'RESIDENTIAL',
  amrFlag: 'Y',
  applicationPage: 'resDashBoard',
  bbEnrollmentStatus: 'NOTENROLLED',
  channel: 'WEB',
  endDate,
  frequencyType: 'Daily',
  //   lastBilledDate: '',
  meterNo,
  monthlyFlag: false,
  premiseNumber: `${premiseNumber}`,
  projectedBillFlag: false,
  revCode: '1',
  startDate,
  status: 2,
});

export const getMonthlyRequestBody = (premiseNumber, meterNo) => ({
  accountType: 'RESIDENTIAL',
  amrFlag: 'Y',
  applicationPage: 'resDashBoard',
  bbEnrollmentStatus: 'NOTENROLLED',
  channel: 'WEB',
  //   lastBilledDate: '',
  meterNo,
  monthlyFlag: true,
  premiseNumber: `${premiseNumber}`,
  projectedBillFlag: true,
  recordCount: 48,
  revCode: '1',
  status: 2,
});
