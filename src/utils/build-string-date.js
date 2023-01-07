import dayjs from 'dayjs';

export const buildStringDate = (date) => dayjs(date).format('MMDDYYYY');
