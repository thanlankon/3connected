var path = require('path');

var DependencyConfig = {
  Location: {
    ROOT: path.resolve('../server')
  },

  Dependency: {
    EXT: 'js',
    RULES: [
      'core/define/dependency-manager.js',
      'core/define/*',
      'config/**',
      'core/model/**',
      'core/service/**',
      'core/util/**',
      'core/auth/**',
      'core/notification/**',
      'core/define/definer/*',

      'config/**',
      'constant/**',
      'model/**',
      'service/**',
      'router/middleware/**',
      'router/api/**',
      'router/resource/**',

      'db-deploy.js',

      'app.js',
    ]
  }
};

module.exports = DependencyConfig;
