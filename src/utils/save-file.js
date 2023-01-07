import fs from 'node:fs';
import { buildFilePath } from './build-file-path.js';

export const saveFile = (dataDirectory, filename, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(buildFilePath(dataDirectory, filename), content, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(null);
    });
  });
