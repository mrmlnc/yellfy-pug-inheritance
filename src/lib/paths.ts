'use strict';

import * as path from 'path';

export function normalizePath(filepath: string): string {
  if (path.extname(filepath) !== '.pug') {
    filepath += '.pug';
  }

  return filepath.replace(/\\/g, '/');
}

export function getFileDependencies(content: string): string[] {
  const dependencies: string[] = [];

  content.split('\n').forEach((line) => {
    const keyword = /(?:^|:)\s*(?:include|extends)\s+(.*)/g.exec(line);

    if (keyword) {
      dependencies.push(keyword[1]);
    }
  });

  return dependencies;
}
