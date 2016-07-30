'use strict';

import * as fs from 'fs';

import * as readdir from 'recursive-readdir';

export function getAllFiles(dirpath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(dirpath, ['!*.pug'], (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

export function getFileContent(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, content) => {
      if (err) {
        reject(err);
      }

      resolve(content);
    });
  });
}
