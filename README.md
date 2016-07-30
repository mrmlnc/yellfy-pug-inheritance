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
const { PugInheritance } = require('yellfy-pug-inheritance');
const pugInheritance = new PugInheritance('./path/to/pug/files');

pugInheritance.updateTree().then((tree) => {
  console.log(tree);
  // 'main.pug': [
  //   'a.pug',
  //   'dir/b.pug'
  // ],
  // 'a.pug': [],
  // 'dir/b.pug': []
});

// If the file has changed
pugInheritance.updateTree('./path/to/changed/file').then((tree) => {
  console.log(tree);
  // The code example above
});
```

## Supported options

### PugInheritance constructor

**dirname**

  * Type: `String`
  * Default: `none`

The path to the Pug files.

### `updateTree` function

**fileToUpdate**

  * Type: `String`
  * Default: `none`

The name of the file that was changed.

## Gulp example

WIP.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/yellfy-pug-inheritance/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
