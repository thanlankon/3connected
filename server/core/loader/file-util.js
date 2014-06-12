var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');

module.exports = {
  scan: scan,
  filter: filter,

  getContent: getContent
};

function getContent() {
  return fs.readFileSync(path.join.apply(this, arguments), {
    encoding: 'utf8'
  });
}

function filter(files, rules, ext) {
  var sequence = [];

  for (var i = 0, len = rules.length; i < len; i++) {
    sequence = sequence.concat(rules[i]);
  }

  rules = sequence;

  if (typeof rules == 'string') {
    ext = rules;
    rules = null;
  }

  var filteredFiles = [],
    matchedFiles;

  if (ext) {
    files = minimatch.match(files, '*.' + ext, {
      matchBase: true
    });
  }

  if (!rules || !rules.length) {
    return files;
  }

  rules.forEach(function (rule) {
    matchedFiles = minimatch.match(files, rule, {});

    filteredFiles = filteredFiles.concat(matchedFiles);

    matchedFiles.forEach(function (file) {
      var index = files.indexOf(file);

      if (index > -1) {
        files.splice(index, 1);
      }
    });
  });

  return filteredFiles;
}

function scan(dir, root) {
  if (!root) {
    root = dir;
    dir = '';
  }

  var foundFiles = [];

  var fullPath = path.join(root, dir),
    filePath;
  var files = fs.readdirSync(fullPath);

  for (var i = 0, len = files.length; i < len; i++) {
    filePath = path.join(dir, files[i]);
    fullPath = path.join(root, filePath);

    if (fs.lstatSync(fullPath).isDirectory()) {
      foundFiles = foundFiles.concat(scan(filePath, root));
    } else {
      // normalize to /
      filePath = filePath.replace(/\\\\/g, '\\').replace(/\\/g, '/');
      foundFiles.push(filePath);
    }
  }

  return foundFiles;
}
