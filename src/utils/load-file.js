import fs from 'fs';
import { buildFilePath } from './build-file-path.js';

export const loadFile = (directory, filename) =>
  new Promise((resolve, reject) => {
    const filePath = buildFilePath(directory, filename);
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    } else {
      resolve(undefined);
    }
  });
