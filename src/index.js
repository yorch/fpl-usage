import dayjs from 'dayjs';
import {
  getDailyUsageData,
  getHourlyUsageDataForRange,
  getMonthlyUsageData,
} from './get-usage-data.js';
import {
  saveDailyUsage,
  saveHourlyUsage,
  saveMonthlyUsage,
} from './json-db.js';

const { records: hourlyUsage } = await getHourlyUsageDataForRange(
  dayjs('2022-11-01'),
  dayjs()
);
await Promise.all(hourlyUsage.map((record) => saveHourlyUsage(record)));

const { records: dailyUsage } = await getDailyUsageData('01012023', '01052023');
await Promise.all(dailyUsage.map((record) => saveDailyUsage(record)));

const { records: monthlyUsage } = await getMonthlyUsageData();
await Promise.all(monthlyUsage.map((record) => saveMonthlyUsage(record)));
