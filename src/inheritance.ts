'use strict';

import * as path from 'path';

import { getAllFiles, getFileContent } from './lib/files';
import { normalizePath, getFileDependencies } from './lib/paths';

export interface ITree {
  ['filename']: string[];
  getDependencies: (filename: string) => string[];
}

export default class PugInheritance {

  protected treeStorage: any = {};
  protected cacheStorage: any = {};

  constructor(public pagedir: string) { }

  /**
   * Clearing dependency tree and cache.
   */
  public reset() {
    this.treeStorage = {};
    this.cacheStorage = {};
  }

  /**
   * Get tree.
   *
   * @readonly
   */
  public get tree() {
    return this.treeStorage;
  }

  /**
   * Get cache.
   *
   * @readonly
   */
  public get cache() {
    return this.cacheStorage;
  }

  /**
   * Update dependency tree.
   *
   * @param {string} [fileToUpdate] The name of the file that was changed.
   * @returns {Promise<ITree>}
   */
  public updateTree(fileToUpdate?: string): Promise<ITree> {
    const filepaths: string[] = [];

    return getAllFiles(this.pagedir).then((files) => {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const filepath = normalizePath(files[i]);
        const cache = this.cacheStorage[filepath];

        filepaths.push(filepath);

        if (!cache || (fileToUpdate && filepath.indexOf(fileToUpdate) !== -1)) {
          promises[i] = getFileContent(filepath);
          continue;
        }

        promises[i] = cache;
      }

      return Promise.all(promises);
    }).then((files) => {
      for (let i = 0; i < files.length; i++) {
        const content = files[i];
        const filename = filepaths[i];

        // If file exists in the cache.
        if (Array.isArray(content)) {
          this.treeStorage[filename] = content;
          continue;
        }

        const context = path.dirname(filename);
        this.treeStorage[filename] = getFileDependencies(content).map((dependency) => {
          return normalizePath(path.join(context, dependency));
        });

        this.cacheStorage[filename] = this.treeStorage[filename];
      }

      this.treeStorage.getDependencies = this.getDependencies.bind(this);

      return this.treeStorage;
    });
  }

  /**
   * Dependencies of a file.
   *
   * @param {string} filename
   * @returns {string[]}
   */
  private getDependencies(filename: string): string[] {
    filename = normalizePath(filename);

    let dependencies: string[] = this.treeStorage[filename];

    this.treeStorage[filename].map((dependency) => {
      dependencies = dependencies.concat(this.treeStorage[dependency]);
    });

    return dependencies;
  }

}
