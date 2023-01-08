import dayjs from 'dayjs';
import {
  getDailyUsageData,
  getHourlyUsageDataForRange,
  getMonthlyUsageData,
} from './get-usage-data.js';
import {
  saveDailyUsageRecord,
  saveHourlyUsageRecord,
  saveMonthlyUsageRecord,
} from './json-db.js';

const { records: hourlyUsage } = await getHourlyUsageDataForRange(
  dayjs('2022-11-01'),
  dayjs()
);
await Promise.all(hourlyUsage.map((record) => saveHourlyUsageRecord(record)));

const { records: dailyUsage } = await getDailyUsageData('01012023', '01052023');
await Promise.all(dailyUsage.map((record) => saveDailyUsageRecord(record)));

const { records: monthlyUsage } = await getMonthlyUsageData();
await Promise.all(monthlyUsage.map((record) => saveMonthlyUsageRecord(record)));
