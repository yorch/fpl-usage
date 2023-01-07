import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import lodash from 'lodash';
import { config } from './config.js';
import { createLogger } from './logger.js';
import { buildFilePath } from './utils/build-file-path.js';

const logger = createLogger('json-db');

const initJsonDb = async () => {
  const file = buildFilePath(config.dataDirectory, config.jsonDbFile);

  // Configure lowdb to write to JSONFile
  const adapter = new JSONFile(file);

  // Extend Low class with a new `chain` field
  class LowWithLodash extends Low {
    chain = lodash.chain(this).get('data');
  }

  const jsonDb = new LowWithLodash(adapter);

  // Read data from JSON file, this will set db.data content
  await jsonDb.read();

  const initialData = {
    hourlyUsage: { records: [] },
    dailyUsage: { records: [] },
    monthlyUsage: { records: [] },
  };

  // If db.json doesn't exist, db.data will be null
  // So we set an initial structure
  jsonDb.data ||= initialData;

  return jsonDb;
};

const jsonDb = await initJsonDb();

const saveUsageRecord = async (type, record) => {
  if (!jsonDb.data[type]) {
    throw new Error(`Usage type ${type} is not valid`);
  }

  const { _id } = record;

  // value() must be called to execute chain
  const existingRecord = jsonDb.chain
    .get([type, 'records'])
    .find({ _id })
    .value();

  if (existingRecord) {
    logger.debug({ id: _id }, `${type} record already exists`);
    return;
  }

  jsonDb.data[type].records.push(record);

  await jsonDb.write();

  logger.info({ id }, `Saved ${type} record`);
};

export const saveHourlyUsage = async (record) =>
  saveUsageRecord('hourlyUsage', record);

export const saveDailyUsage = async (record) =>
  saveUsageRecord('dailyUsage', record);

export const saveMonthlyUsage = async (record) =>
  saveUsageRecord('monthlyUsage', record);
