var fs = require('fs');
var async = require('async');
var chalk = require('chalk');

var _getBinaryDirs = function(path) {
  return {
    node: path + '/n/versions/node',
    io: path + '/n/versions/io'
  };
};

var binaries = process.env.N_PREFIX ? _getBinaryDirs(process.env.N_PREFIX) : {};

var _sync = function(dirs) {
  if (dirs.node && dirs.io) {
    var nodeVersions = fs.readdirSync(dirs.node);
    var ioVersions = fs.readdirSync(dirs.io);
    return nodeVersions.concat(ioVersions).sort();
  } else {
    console.log(
      chalk.red('Unable to locate installed binaries.\n'),
      'Please check that the environment variable  N_PREFIX is set correctly or pass in the location of your n directory'
    );
    return [];
  }
};

var _async = function(dirs, fn) {
  if (dirs.node && dirs.io) {
    async.parallel({
      node: function(next) {
        fs.readdir(dirs.node, next);
      },
      io: function(next) {
        fs.readdir(dirs.io, next);
      }
    }, fn);
  } else {
    console.log(
      chalk.red('Unable to locate installed binaries.\n'),
      'Please check that the environment variable  N_PREFIX is set correctly or pass in the location of your n directory'
    );
    fn(null, []);
  }
};

module.exports = function(prefix, fn) {
  if (typeof prefix === 'function') {
    fn = prefix;
    prefix = null;
  }

  var dirs = prefix ? _getBinaryDirs(prefix) : binaries;
  if (typeof fn === 'function') {
    return _async(dirs, fn);
  } else {
    return _sync(dirs);
  }
};
