'use strict';

import * as assert from 'assert';

import { getFileContent } from './files';
import { normalizePath, getFileDependencies } from './paths';

describe('Paths', function() {

  it('Paths → normalizePath', () => {
    assert.equal(normalizePath('test\\test'), 'test/test.pug');
    assert.equal(normalizePath('test/test'), 'test/test.pug');
    assert.equal(normalizePath('test/test.pug'), 'test/test.pug');
  });

  it('Paths → getFileDependencies', () => {
    return getFileContent('./test/parser.pug').then((content) => {
      const dependencies = getFileDependencies(content);

      assert.equal(dependencies.length, 4);
      assert.equal(dependencies[0], 'default');
    });
  });

});
