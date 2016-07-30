'use strict';

import * as assert from 'assert';

import { PugInheritance } from './inheritance';

describe('Module', function() {

  const pugInheritance = new PugInheritance('./test/inheritance');

  afterEach(() => {
    pugInheritance.reset();
  });

  it('Module → updateFullTree', () => {
    return pugInheritance.updateTree().then((tree) => {
      assert.equal(tree['test/inheritance/page-1.pug'].length, 2);
      assert.equal(tree['test/inheritance/page-2.pug'].length, 2);
      assert.equal(tree['test/inheritance/partials/b.pug'].length, 0);
    });
  });

  it('Module → updateFullTree (with fileToUpdate parameter)', () => {
    return pugInheritance.updateTree().then((tree) => {
      // Replace cache
      pugInheritance.cache['test/inheritance/page-1.pug'] = ['test-1'];
      pugInheritance.cache['test/inheritance/page-2.pug'] = ['test-2'];

      // Update file
      return pugInheritance.updateTree('test/inheritance/page-1.pug');
    }).then((tree) => {
      assert.equal(tree['test/inheritance/page-1.pug'].length, 2);
      assert.equal(tree['test/inheritance/page-2.pug'].length, 1);
    });
  });

  it('Module → getDependenciesForFile', () => {
    return pugInheritance.updateTree().then((tree) => {
      assert.equal(tree.getDependencies('test/inheritance/page-1').length, 4);
      assert.equal(tree.getDependencies('test/inheritance/page-2.pug').length, 3);
      assert.equal(tree.getDependencies('test/inheritance/partials/b.pug').length, 0);
    });
  });

  it('Module → cache', () => {
    return pugInheritance.updateTree().then(() => {
      assert.equal(pugInheritance.cache['test/inheritance/page-1.pug'].length, 2);
      assert.equal(pugInheritance.cache['test/inheritance/page-2.pug'].length, 2);
      assert.equal(pugInheritance.cache['test/inheritance/partials/b.pug'].length, 0);

      // Replace cache
      pugInheritance.cache['test/inheritance/page-1.pug'] = ['test'];

      // Update files
      return pugInheritance.updateTree();
    }).then(() => {
      assert.equal(pugInheritance.cache['test/inheritance/page-1.pug'].length, 1);

      // Drop cache and current tree
      pugInheritance.reset();

      // Update files
      return pugInheritance.updateTree();
    }).then((tree) => {
      assert.equal(pugInheritance.cache['test/inheritance/page-1.pug'].length, 2);
    });
  });

});
