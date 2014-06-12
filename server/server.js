// load dependencies
var Loader = require('./core/loader/loader.js');
Loader.loadDependencies();

// main
define.main(function (require) {

  var app = require('app.App');

  var dbDeploy = require('db.Deploy');

  dbDeploy(function () {

    var port = process.argv[2] || 80;

    app.listen(port);

    console.log('App started at port: ' + port);

  });

});
