// load dependencies
var Loader = require('./core/loader/loader.js');
Loader.loadDependencies();

// main
define.main(function (require) {

  var Configuration = require('core.config.Configuration').getConfiguration();

  // create file directories

  var fileDiectory = Configuration.File.LOCATION;
  var path = require('lib.Path');
  var fs = require('lib.FileSystem');

  fs.makeDirSync(path.join(fileDiectory, 'news'));
  fs.makeDirSync(path.join(fileDiectory, 'attachments'));

  var app = require('app.App');
  var dbDeploy = require('db.Deploy');

  dbDeploy(function () {

    var host = Configuration.Web.HOST;
    var port = Configuration.Web.PORT;

    app.listen(port, host, function () {
      console.log('App started at ' + (host || '') + ':' + port);
    });

  });

});
