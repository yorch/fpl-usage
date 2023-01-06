import { loadFile } from './load-file.js';

export const loadJsonFile = async (directory, filename) => {
  const content = await loadFile(
    directory,
    filename.endsWith('.json') ? filename : `${filename}.json`
  );

  try {
    return JSON.parse(content);
  } catch (error) {
    return;
  }
};
