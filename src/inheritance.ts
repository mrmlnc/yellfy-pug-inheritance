'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as pify from 'pify';
import * as readdir from 'recursive-readdir';
import * as minimatch from 'minimatch';

const readdirPromise = pify(readdir);
const readFilePromise = pify(fs.readFile);

export interface ITreeStorage {
  [filename: string]: string[];
}

export interface IOptions {
  /**
   * The name of the file that has been changed since the last build tree.
   */
  changedFile?: string;
  /**
   * The previous tree of dependencies that will be used as cache.
   */
  treeCache?: ITreeStorage;
  /**
   * Working with Jade files.
   */
  jade?: boolean;
}

export interface IResult {
  /**
   * Returns the dependency tree for all files.
   */
  tree: ITreeStorage;
  /**
   * Returns an array of dependencies for specified file.
   */
  getDependencies: (filename: string) => string[];
  /**
   * Returns true if the specified file is in the dependencies of the specified file.
   */
  checkDependency: (filename: string, filenameToCheck: string) => boolean;
}

let treeStorage = {} as ITreeStorage;
let extension = '';

function normalizePath(filepath: string): string {
  if (path.extname(filepath) !== extension) {
    filepath += extension;
  }

  return filepath.replace(/\\/g, '/');
}

function getFileDependencies(content: string): string[] {
  const dependencies: string[] = [];

  content.split('\n').forEach((line) => {
    const keyword = /(?:^|:)\s*(?:include|extends)\s+(.*)/g.exec(line);

    if (keyword) {
      dependencies.push(keyword[1]);
    }
  });

  return dependencies;
}

function traverse(dependencies: string[]): string[] {
  const tree = Array.from(dependencies);
  const keys = Object.keys(treeStorage);
  let fullDependencies = tree;

  tree.forEach((dependency) => {
    keys.forEach((key) => {
      if (!minimatch(key, dependency)) {
        return;
      }
      if (fullDependencies.indexOf(key) === -1) {
        fullDependencies.push(key);
      }

      fullDependencies = fullDependencies.concat(traverse(treeStorage[key]));
    });
  });

  return Array.from(new Set(fullDependencies));
}

function getDependencies(filename: string): string[] {
  filename = normalizePath(filename);

  let dependencies: string[] = treeStorage[filename];

  dependencies = traverse(dependencies);
  dependencies.push(filename);

  return dependencies;
}

function checkDependency(filename: string, changedFile: string): boolean {
  filename = normalizePath(filename);
  changedFile = normalizePath(changedFile);

  return getDependencies(filename).indexOf(changedFile) !== -1;
}

export function updateTree(dir: string, options?: IOptions): Promise<IResult> {
  options = Object.assign({
    jade: false,
    changedFile: null,
    treeCache: {}
  }, options);

  if (!dir) {
    throw new Error('`dir` required');
  }
  if (options.treeCache) {
    treeStorage = Object.assign({}, options.treeCache);
  }

  // Set extension
  extension = (options.jade) ? '.jade' : '.pug';

  // Sync files and their dependencies
  const filenames = [];

  return readdirPromise(dir, [`!*${extension}`]).then((files) => {
    const promises = [];
    files.forEach((file, index) => {
      const filename = normalizePath(file);
      const cache = options.treeCache[filename];
      if (!cache || filename.indexOf(options.changedFile) !== -1) {
        promises[index] = readFilePromise(filename, 'utf8');
      } else {
        promises[index] = cache;
      }

      filenames.push(filename);
    });

    return Promise.all(promises);
  }).then((files) => {
    filenames.forEach((filename, index) => {
      const file = files[index];
      const context = path.dirname(filename);

      // If file exists in the cache.
      if (Array.isArray(file)) {
        treeStorage[filename] = file;
        return;
      }

      treeStorage[filename] = getFileDependencies(file).map((filepath) => {
        return normalizePath(path.join(context, filepath));
      });
    });

    return {
      tree: treeStorage,
      getDependencies,
      checkDependency
    };
  });
}
