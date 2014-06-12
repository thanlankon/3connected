var path = require('path');
var fileUtil = require('./file-util.js');
var DependencyConfig = require('./dependency-config.js');

module.exports = {
  loadDependencies: loadDependencies
};

function loadDependencies() {
  var files = fileUtil.scan(DependencyConfig.Location.ROOT);

  var dependencyFiles = fileUtil.filter(files,
    DependencyConfig.Dependency.RULES, DependencyConfig.Dependency.EXT);

  for (var i = 0, len = dependencyFiles.length; i < len; i++) {
    require(
      path.join(DependencyConfig.Location.ROOT, dependencyFiles[i])
    );
  }
}
