'use strict';

import * as assert from 'assert';
import { updateTree } from './inheritance';

describe('Tree', () => {

  it('Should return a tree of dependencies.', () => {
    return updateTree('./fixtures').then((result) => {
      assert.equal(Object.keys(result.tree).length, 9);
      assert.equal(result.tree['fixtures/parser.pug'].length, 4);
      assert.equal(result.tree['fixtures/page-1.pug'].length, 2);
    });
  });

  it('Should work with the cache.', () => {
    return updateTree('./fixtures', {
      treeCache: {
        'fixtures/parser.pug': ['hello']
      }
    }).then((result) => {
      assert.equal(result.tree['fixtures/parser.pug'], 'hello');
    });
  });

  it('Should re-read the changed file.', () => {
    return updateTree('./fixtures', {
      changedFile: 'fixtures/parser.pug',
      treeCache: {
        'fixtures/parser.pug': ['hello']
      }
    }).then((result) => {
      assert.equal(result.tree['fixtures/parser.pug'].length, 4);
    });
  });

});

describe('Methods', () => {

  it('Methods → getDependencies', () => {
    return updateTree('./fixtures').then((result) => {
      const dependencies = result.getDependencies('fixtures/page-1');

      assert.equal(dependencies.length, 5);
      assert.ok(result.checkDependency('fixtures/page-1', 'fixtures/partials/a.pug'));
      assert.ok(result.checkDependency('fixtures/page-1', 'fixtures/partials/b.pug'));
    });
  });

  it('Methods → checkDependency', () => {
    return updateTree('./fixtures').then((result) => {
      assert.ok(result.checkDependency('fixtures/page-1', 'fixtures/page-1'));
      assert.ok(result.checkDependency('fixtures/page-1', 'fixtures/partials/b.pug'));
    });
  });

});
