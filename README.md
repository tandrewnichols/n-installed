[![Build Status](https://travis-ci.org/tandrewnichols/n-installed.png)](https://travis-ci.org/tandrewnichols/n-installed) [![downloads](http://img.shields.io/npm/dm/n-installed.svg)](https://npmjs.org/package/n-installed) [![npm](http://img.shields.io/npm/v/n-installed.svg)](https://npmjs.org/package/n-installed) [![Code Climate](https://codeclimate.com/github/tandrewnichols/n-installed/badges/gpa.svg)](https://codeclimate.com/github/tandrewnichols/n-installed) [![Test Coverage](https://codeclimate.com/github/tandrewnichols/n-installed/badges/coverage.svg)](https://codeclimate.com/github/tandrewnichols/n-installed) [![dependencies](https://david-dm.org/tandrewnichols/n-installed.png)](https://david-dm.org/tandrewnichols/n-installed)

# n-installed

Get a list of node binaries installed via n

## Installation

`npm install --save n-installed`

## Summary

`n-installed` exports a function that returns an object with a `node` property and an `io` property, where each is an array of binary version installed via [n](https://github.com/tj/n). For instance, on my machine, this function returns:

```js
{
  node: ['0.10.41', '0.12.9', '4.2.4', '5.4.0'],
  io: ['1.8.4', '2.5.0', '3.3.1'],
  all: ['0.10.41', '0.12.9', '1.8.4', '2.5.0', '3.3.1', '4.2.4', '5.4.0']
}
```

## Usage

`n-installed` has both synchronous and asynchronous modes. Just pass a callback for async.

```js
// Sync
var installed = require('n-installed');
var versions = installed();

// Async
installed(function(err, versions) {

});
```

This library uses the `N_PREFIX` environment variable to find binaries. If for some reason that would be unreliable in your environment, you can pass the location of the `n` install as the first parameter.

```js
// Sync
var versions = installed('other/path/to/n');

// Async
installed('other/path/to/n', function(err, versions) {

});
```

## Contributing

Please see [the contribution guidelines](CONTRIBUTING.md).
