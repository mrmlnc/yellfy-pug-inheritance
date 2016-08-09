'use strict';

import * as assert from 'assert';
import { updateTree } from './inheritance';

describe('Basic functionality.', () => {

  it('Should return a tree of dependencies.', () => {
    return updateTree('./fixtures/pug').then((result) => {
      assert.equal(Object.keys(result.tree).length, 13);
      assert.equal(result.tree['fixtures/pug/page-1.pug'].length, 2);
      assert.equal(result.tree['fixtures/pug/parser.pug'].length, 14);
      assert.equal(result.tree['fixtures/pug/content/b.pug'].length, 1);
      assert.equal(result.tree['fixtures/pug/partials/footer.pug'], 0);
    });
  });

  it('Should work with the cache.', () => {
    return updateTree('./fixtures/pug', {
      treeCache: {
        'fixtures/pug/parser.pug': ['hello']
      }
    }).then((result) => {
      assert.equal(result.tree['fixtures/pug/parser.pug'], 'hello');
    });
  });

  it('Should re-read the changed file.', () => {
    return updateTree('./fixtures/pug', {
      changedFile: 'fixtures/pug/parser.pug',
      treeCache: {
        'fixtures/pug/parser.pug': ['hello']
      }
    }).then((result) => {
      assert.equal(result.tree['fixtures/pug/parser.pug'].length, 14);
    });
  });

  it('Working with Jade files.', () => {
    return updateTree('./fixtures/jade', { jade: true }).then((result) => {
      assert.equal(Object.keys(result.tree).length, 2);
    });
  });

});

describe('Check dependencies for single file.', () => {

  it('Should return a full list of dependencies for a single file.', () => {
    return updateTree('./fixtures/pug').then((result) => {
      const dependencies = result.getDependencies('fixtures/pug/page-1');

      assert.equal(dependencies.length, 9);
      assert.ok(dependencies.indexOf('fixtures/pug/content/c.pug') !== -1);
      assert.ok(dependencies.indexOf('fixtures/pug/page-1.pug') !== -1);
      assert.ok(dependencies.indexOf('fixtures/pug/content/a.pug') !== -1);
    });
  });

  it('Should return a full list of dependencies for a single file (with glob-pattern).', () => {
    return updateTree('./fixtures/pug').then((result) => {
      const dependencies = result.getDependencies('fixtures/pug/all.pug');

      assert.equal(dependencies.length, 14);
      assert.ok(dependencies.indexOf('fixtures/pug/all.pug') !== -1);
      assert.ok(dependencies.indexOf('fixtures/pug/partials/**/*.pug') !== -1);
      assert.ok(dependencies.indexOf('fixtures/pug/page-*.pug') !== -1);
    });
  });

});

describe('Check a file as is dependency.', () => {

  it('Should return true if the file depends on another file.', () => {
    return updateTree('./fixtures/pug').then((result) => {
      assert.ok(result.checkDependency('fixtures/pug/page-1', 'fixtures/pug/page-1'));
      assert.ok(result.checkDependency('fixtures/pug/page-1', 'fixtures/pug/content/b.pug'));
      assert.ok(result.checkDependency('fixtures/pug/all.pug', 'fixtures/pug/content/b.pug'));
    });
  });

});
