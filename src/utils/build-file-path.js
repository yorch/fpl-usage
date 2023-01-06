import path from 'path';

export const buildFilePath = (dataDirectory, filename) =>
  path.join(process.cwd(), dataDirectory, filename);
