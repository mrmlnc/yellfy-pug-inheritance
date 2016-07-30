'use strict';

import * as assert from 'assert';

import { getAllFiles, getFileContent } from './files';

describe('Files', function() {

  it('Files → getAllFiles', () => {
    return getAllFiles('./test/inheritance').then((files) => {
      assert.equal(files.length, 8);

      let status = false;
      files.forEach((file) => {
        if (file.indexOf('page-1.pug') !== -1) {
          status = true;
        }
      });

      assert.equal(status, true);
    });
  });

  it('Files → getFileContent', () => {
    return getFileContent('./test/parser.pug').then((content) => {
      assert.ok(content.indexOf('extends') !== -1);
    });
  });

});
