import { saveFile } from './save-file.js';

export const saveJsonFile = (dataDirectory, filename, content) =>
  saveFile(
    dataDirectory,
    filename.endsWith('.json') ? filename : `${filename}.json`,
    JSON.stringify(content, null, 2)
  );
