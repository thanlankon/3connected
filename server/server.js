// load dependencies
var Loader = require('./core/loader/loader.js');
Loader.loadDependencies();

// main
define.main(function (require) {

  var Configuration = require('core.config.Configuration').getConfiguration();
  var Logger = require('core.log.Logger');
  // create file directories

  var http = require('lib.Http');
  var https = require('lib.Https');
  var path = require('lib.Path');
  var fs = require('lib.FileSystem');

  var fileDiectory = Configuration.File.LOCATION;

  fs.makeDirSync(path.join(fileDiectory, 'news'));
  fs.makeDirSync(path.join(fileDiectory, 'attachments'));
  fs.makeDirSync(path.join(fileDiectory, 'log'));

  var app = require('app.App');
  var dbDeploy = require('db.Deploy');

  var options = {
    key: fs.readFileSync(__dirname + '/cert/splink.com.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/cert/splink.com.cert', 'utf8')
  };

  dbDeploy(function () {

    var host = Configuration.Web.HOST;
    var port = Configuration.Web.PORT;
    var sport = Configuration.Web.SECURE_PORT;

    var enableSsl = true;

    http.createServer(app).listen(port, host);

    if (Configuration.Web.SSL) {
      https.createServer(options, app).listen(sport, host);
    }

    Logger.info('App started at ' + (host || '') + ':' + port);
    if (enableSsl) {
      Logger.info('App started at ' + (host || '') + ':' + sport);
    }

  });

});
