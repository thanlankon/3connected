var path = require('path');

var DependencyConfig = {
  Location: {
    ROOT: path.join(__dirname, '../../../server')
  },

  Dependency: {
    EXT: 'js',
    RULES: [
      'core/define/dependency-manager.js',
      'core/define/*',
      'config/**',
      'core/config/**',
      'core/model/**',
      'core/service/**',
      'core/util/**',
      'core/auth/**',
      'core/notification/**',
      'core/log/**',
      'core/define/definer/*',

      'config/**',
      'constant/**',
      'model/**',
      'service/**',
      'router/middleware/**',
      'router/api/**',
      'router/resource/**',

      'development/**',

      'db.js',
      'app.js',
    ]
  }
};

module.exports = DependencyConfig;
