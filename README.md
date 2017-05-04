# Package deprecated

[![Greenkeeper badge](https://badges.greenkeeper.io/mrmlnc/yellfy-pug-inheritance.svg)](https://greenkeeper.io/)

## Please, use [emitty](https://github.com/mrmlnc/emitty). It's **easier** and more convenient.

---
---
---

# yellfy-pug-inheritance

> Determine the inheritance of Pug (ex. Jade) templates.

[![Travis Status](https://travis-ci.org/mrmlnc/yellfy-pug-inheritance.svg?branch=master)](https://travis-ci.org/mrmlnc/yellfy-pug-inheritance)

## Install

```shell
$ npm i -D yellfy-pug-inheritance
```

## Why?

Because existing solutions use redundant modules such as Pug parser and Glob.

## Usage

```js
const pugInheritance = require('yellfy-pug-inheritance');

pugInheritance.updateTree('./path/to/pug/files').then((inheritance) => {
  console.log(inheritance.tree);
  // 'main.pug': [
  //   'a.pug',
  //   'dir/b.pug'
  // ],
  // 'a.pug': [],
  // 'dir/b.pug': []
});
```

## API

### updateTree(dir, [options]) → result

#### Options

**changedFile**

  * Type: `String`
  * Default: `''`

The name of the file that has been changed since the last build tree.

**treeCache**

  * Type: `ITreeStorage` → `{ [filename: string]: string[] }`
  * Default: `{}`

The previous tree of dependencies that will be used as cache.

**jade**

  * Type: `Boolean`
  * Default: `false`

Working with Jade files.

#### Result

**tree**

  * Return: `ITreeStorage` → `{ [filename: string]: string[] }`

Returns the dependency tree for all files.

**getDependencies(filename)**

  * Return: `string[]`

Returns an array of dependencies for specified file.

**checkDependency(filename, filenameToCheck)**

  * Return: `boolean`

Returns true if the specified file is in the dependencies of the specified file.

## Gulp example

```js
// npm i gulpjs/gulp#4.0 gulp-if gulp-filter yellfy-pug-inheritance gulp-pug
const gulp = require('gulp');
const gulpif = require('gulp-if');
const filter = require('gulp-filter');
const pugInheritance = require('yellfy-pug-inheritance');
const pug = require('gulp-pug');

// Cache
let pugInheritanceCache = {};

// Root directory that contains your Pug files
const pugDirectory = 'app/templates';

// Watch task
gulp.task('watch', () => {
  global.watch = true;

  gulp.watch([`${pugDirectory}/**/*.pug`], gulp.series('templates'))
    .on('all', (event, filepath) => {
      global.changedTempalteFile = filepath.replace(/\\/g, '/');
    });
});

// Filter for files
function pugFilter(file, inheritance) {
  const filepath = `${pugDirectory}/${file.relative}`;
  if (inheritance.checkDependency(filepath, global.changedTempalteFile)) {
    console.log(`Compiling: ${filepath}`);
    return true;
  }

  return false;
}

// Templates task
gulp.task('templates', () => {
  return new Promise((resolve, reject) => {
    const changedFile = global.changedTempalteFile;
    const options = {
      changedFile,
      treeCache: pugInheritanceCache
    };

    // Update cache for all files or only for specified file
    pugInheritance.updateTree(pugDirectory, options).then((inheritance) => {
      // Save cache for secondary compilations
      pugInheritanceCache = inheritance.tree;

      return gulp.src(`${pugDirectory}/*.pug`)
        // We can use Cache only for Watch mode
        .pipe(gulpif(global.watch, filter((file) => pugFilter(file, inheritance))))
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'))
        .on('end', resolve)
        .on('error', reject);
    });
  });
});
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/yellfy-pug-inheritance/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
