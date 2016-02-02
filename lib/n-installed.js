var fs = require('fs');
var async = require('async');
var chalk = require('chalk');

var defaultObj = {
  node: [],
  io: [],
  all: []
};

var _getBinaryDirs = function(path) {
  return {
    node: path + '/n/versions/node',
    io: path + '/n/versions/io'
  };
};

var binaries = process.env.N_PREFIX ? _getBinaryDirs(process.env.N_PREFIX) : {};

var all = function(node, io) {
  return node.concat(io).sort();
};

var _sync = function(dirs) {
  if (dirs.node && dirs.io) {
    var nodeVersions = fs.readdirSync(dirs.node);
    var ioVersions = fs.readdirSync(dirs.io);
    return {
      node: nodeVersions,
      io: ioVersions,
      all: all(nodeVersions, ioVersions)
    };
  } else {
    console.log(
      chalk.red('Unable to locate installed binaries.\n'),
      'Please check that the environment variable  N_PREFIX is set correctly or pass in the location of your n directory'
    );
    return defaultObj;
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
    }, function(err, results) {
      fn(err, {
        node: results.node,
        io: results.io,
        all: all(results.node, results.io)
      });
    });
  } else {
    console.log(
      chalk.red('Unable to locate installed binaries.\n'),
      'Please check that the environment variable  N_PREFIX is set correctly or pass in the location of your n directory'
    );
    fn(null, defaultObj);
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
