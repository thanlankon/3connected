define('core.log.Logger', function (module, require) {

  var Configuration = require('core.config.Configuration').getConfiguration();
  var fileDiectory = Configuration.File.LOCATION;

  var Winston = require('lib.Winston');
  var Path = require('lib.Path');

  var logger = new(Winston.Logger)({
    transports: [
      new(Winston.transports.Console)(),
      new(Winston.transports.File)({
        filename: Path.join(fileDiectory, 'log', 'app.log')
      })
    ]
  });

  module.exports = logger;

});
